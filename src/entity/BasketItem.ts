import {Entity, Column, ManyToOne, Repository, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {User} from "./User.js";
import {Product} from "./Product.js";
import {manager} from "../data-source.js";

@Entity("basket_items", { schema: "public" })
export class BasketItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", {length: 255})
    userId: string;

    @Column("uuid")
    productId: string;

    @Column("timestamp with time zone", { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column("integer")
    count: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "userId"})
    public user: User

    @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade:false, onDelete: "CASCADE" })
    @JoinColumn({ name: "productId"})
    public product: Product

    /**
     * Creates a new BasketItem instance and initializes it with the provided user and product.
     *
     * @param {User} user - The user associated with the basket item.
     * @param {Product} product - The product associated with the basket item.
     * @return {BasketItem} The newly created BasketItem instance.
     */
    public static create(user: User, product: Product): BasketItem {
        const item = new BasketItem();

        item.userId = user.id;
        item.count = 1;
        item.productId = product.id;
        item.createdAt = new Date();
        item.product = product;
        item.user = user;

        return item;
    }

    /**
     * Clears all basket items for the specified user.
     *
     * @param {User} user - The user whose basket items should be cleared.
     * @return {Promise<User>} A promise that resolves to the updated user with an empty basket.
     */
    public static async clearForUser(user: User): Promise<User> {
        const repository: Repository<BasketItem> = manager.getDataSource().getRepository(BasketItem);

        await repository.delete({ userId: user.id });
        user.basketItems = [];

        return user;
    }
}