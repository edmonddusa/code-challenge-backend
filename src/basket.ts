import retry from "async-retry";
import {Product} from "./entity/Product.js";
import {User} from "./entity/User.js";
import {BasketItem} from "./entity/BasketItem.js";
import {Order, Status} from "./entity/Order.js";
import {triggerOrder, triggerPayment} from "./kanpla-service.js";

type BasketResult = {
    row: {
        id: number;
        name: string;
        count: number;
        price: number;
    };
    total: number;
};

/**
 * Adds a product to the user's basket and updates user related information.
 *
 * @param {User} user - The user whose basket is being updated.
 * @param {Product} product - The product to add to the basket.
 * @return {Promise<BasketResult>} The resulting basket details and total value after the product is added.
 */
export async function addToBasket(
    user: User,
    product: Product
): Promise<BasketResult> {
    // update basket
    let basketItem = addProductToBasket(user, product);

    // Update user info
    user.lastSeen = new Date();

    // save user and basket
    await User.save(user);

    return {
        row: {
            id: user.basketItems.indexOf(basketItem),
            name: product.name,
            count: basketItem.count,
            price: product.price.toNumber()
        },
        total: user.basket_value.toNumber(),
    };
}

/**
 * Places an order for the user, clears their basket, triggers the order,
 * and handles the payment process with retries.
 *
 * @param {string} token - Authentication token for the user.
 * @param {User} user - The user placing the order.
 * @return {Promise<void>} - A promise that resolves when the order and payment process is complete.
 */
export async function orderAndPay(token:string, user: User): Promise<void> {
    // create order for user
    let order = await createOrderForUser(user);

    // clear basket for user
    await BasketItem.clearForUser(user);

    let orderId = await retry(
        async () => {
            return (await triggerOrder(token, order.price.toNumber())).orderId
        },
        {
            retries: 10, onRetry: (error, attempt) => {
                console.log(`Retrying order for user ${user.id}... Attempt ${attempt}`);
                console.log(error);
            }
        }
    );

    // update order with received orderId and set ordered
    await Order.updateOrderId(order, orderId);
    await Order.updateStatus(order, Status.Ordered);

    // do payment retrying 10 times before giving up
    let paymentResult= await retry(
        async () => {
            return await triggerPayment(token, orderId, order.price.toNumber());
        },
        {
            retries: 10, onRetry: (error, attempt) => {
                console.log(`Retrying payment for user ${user.id}... Attempt ${attempt}`);
                console.log(error);
            }
        }
    );

    // react to payment
    if (paymentResult.status !== "completed") {
        await Order.updateStatus(order, Status.Failed);

        throw new Error("Payment failed");
    }

    await Order.updateStatus(order, Status.Paid);
}

/**
 * Adds a product to the user's basket. If the product is already in the basket,
 * it increments the count of that product. Otherwise, it creates a new basket item.
 *
 * @param {User} user - The user whose basket the product is being added to.
 * @param {Product} product - The product to be added to the basket.
 * @return {BasketItem} The updated or newly created basket item.
 */
function addProductToBasket(user: User, product: Product): BasketItem {
    let basketItem = user.basketItems.find(item => item.productId === product.id);

    if (basketItem) {
        basketItem.user = user;
        basketItem.count++;
    } else {
        basketItem = BasketItem.create(user, product);

        user.basketItems.push(basketItem);
    }

    return basketItem;
}

/**
 * Creates a new order for the specified user.
 *
 * @param {User} user - The user for whom the order is being created.
 * @return {Promise<Order>} A promise that resolves to the newly created order.
 */
async function createOrderForUser(user: User): Promise<Order> {
    return await Order.save(Order.create(user));
}
