import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Repository} from "typeorm";
import {BigNumber} from "bignumber.js";
import {OrderItem} from "./OrderItem.js";
import {User} from "./User.js";
import {BasketItem} from "./BasketItem.js";
import {v4 as uuidv4} from "uuid";
import {manager} from "../data-source.js";


@Entity("orders", { schema: "public" })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("decimal", { precision: 12, scale: 2, nullable: false })
    amount: string;

    @Column("varchar", { length: 255, nullable: false})
    userId: string;

    @Column("timestamp with time zone", { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column("varchar", { length: 255, nullable: false })
    status: string;

    @Column("varchar", { length: 255 })
    type: string;

    @Column("varchar", { length: 255, unique: true, nullable: false})
    orderId: string;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, {
        cascade: true,
        eager: true
    })
    orderItems: OrderItem[];

    get price(): BigNumber {
        return new BigNumber(this.amount);
    }

    /**
     * Creates a new order for the provided user.
     *
     * @param {User} user - The user for whom the order is being created. The user should have a populated basket with items.
     * @return {Order} The newly created order with all necessary fields and associated order items.
     */
    public static create(user: User): Order {
        const order = new Order();

        order.id = uuidv4();
        order.amount = user.basket_value.toString();
        order.userId = user.id;
        order.createdAt = new Date();
        order.status = Status.Pending;
        order.type = "Order";
        order.orderItems = [];
        order.orderId = uuidv4();

        user.basketItems.forEach((item: BasketItem) => {
            const row = new OrderItem();

            row.orderId = order.id;
            row.productId = item.productId;
            row.amount = item.product.total_price.toString();
            row.count = item.count;
            row.createdAt = new Date();

            row.order = order;
            row.product = item.product;

            order.orderItems.push(row);
        })

        return order;
    }

    /**
     * Updates the orderId of the provided Order instance and saves the change to the repository.
     *
     * @param {Order} order - The order instance which needs the orderId to be updated.
     * @param {string} orderId - The new orderId to be set on the order instance.
     * @return {Promise<void>} - A promise that resolves when the orderId has been updated in the repository.
     */
    public static async updateOrderId(order: Order, orderId: string): Promise<void> {
        const repository: Repository<Order> = manager.getDataSource().getRepository(Order);

        order.orderId = orderId;

        await repository.update(order.id, { orderId });
    }

    /**
     * Updates the status of an order in the repository.
     *
     * @param {Order} order - The order object to be updated.
     * @param {string} status - The new status to be assigned to the order.
     * @return {Promise<void>} A promise that resolves when the status update is complete.
     */
    public static async updateStatus(order: Order, status: string): Promise<void> {
        const repository: Repository<Order> = manager.getDataSource().getRepository(Order);

        order.status = status;

        await repository.update(order.id, { status });
    }

    /**
     * Saves the given order entity to the database using the repository.
     *
     * @param {Order} order - The order entity to be saved.
     * @return {Promise<Order>} A promise that resolves to the saved order entity.
     */
    public static async save(order: Order): Promise<Order> {
        const repository: Repository<Order> = manager.getDataSource().getRepository(Order);

        return await repository.save(order);
    }
}

export enum Status {
    Pending = "Pending",
    Ordered = "Ordered",
    Paid = "Paid",
    Failed = "Failed"
}