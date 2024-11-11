import {Entity, Column, PrimaryColumn, OneToMany, Repository} from "typeorm";
import {BasketItem} from "./BasketItem.js";
import {manager} from "../data-source.js";
import {BigNumber} from "bignumber.js";

/**
 * Represents a user in the application.
 *
 * @class
 * @decorator @Entity
 *
 * @property {string} id - Unique identifier for the user.
 * Annotated with @PrimaryColumn and has a maximum length of 255 characters.
 *
 * @property {Date} createdAt - Timestamp of when the user was created.
 * Annotated with @Column, cannot be null, and defaults to the current timestamp.
 *
 * @property {Date} lastSeen - Timestamp of when the user was last seen.
 * Annotated with @Column, cannot be null, and defaults to the current timestamp.
 *
 * @property {BasketItem[]} basketItems - List of basket items associated with the user.
 * Annotated with @OneToMany and is eager-loaded.
 */
@Entity("users", { schema: "public" })
export class User {

    @PrimaryColumn("varchar", { length: 255, unique: true })
    id: string;

    @Column("timestamp with time zone", { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column("timestamp with time zone", { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    lastSeen: Date;

    @OneToMany(() => BasketItem, (basketItem) => basketItem.user, {
        eager: true,
        cascade: ['insert', 'update'],
        orphanedRowAction: 'delete'
    })
    basketItems: BasketItem[]

    /**
     * Calculates the total value of the items in the basket.
     * It multiplies the count of each item by its total price and sums up these values.
     *
     * @return {BigNumber} The total value of all the items in the basket.
     */
    get basket_value(): BigNumber {
        return this.basketItems.reduce((acc, item) => acc.plus(new BigNumber(item.count).multipliedBy(item.product.total_price)),
            new BigNumber(0))
    }

    /**
     * Finds a user by their ID.
     *
     * @param {string} id - The unique identifier of the user to be found.
     * @return {Promise<User | null>} A promise that resolves to the user if found, or null if not found.
     */
    public static async findById(id: string): Promise<User | null> {
        const repository: Repository<User> = manager.getDataSource().getRepository(User);

        return await repository.findOne({ where: { id } });
    }

    /**
     * Creates a new user if one with the given ID does not already exist.
     * If a user with the provided ID exists, updates the last seen timestamp and returns the existing user.
     *
     * @param {string} id - The ID of the user to create or check for existence.
     * @return {Promise<User>} The newly created or existing user with the updated information.
     */
    public static async createIfNotExists(id: string): Promise<User> {
        const repository: Repository<User> = manager.getDataSource().getRepository(User);

        // Check if user with the given id already exists
        const existingUser = await User.findById(id);

        if (existingUser) {
            existingUser.lastSeen = new Date();

            return existingUser;
        }

        // Create new user
        const user = new User();

        user.id = id;
        user.basketItems = [];

        return await repository.save(user);
    }

    /**
     * Clears the basket items of a given user.
     *
     * @param {User} user - The user whose basket items should be cleared.
     * @return {Promise<User>} - A promise that resolves to the updated user with an empty basket.
     */
    public static async clearBasket(user: User): Promise<User> {
        user.basketItems = [];

        return await User.save(user);
    }

    /**
     * Saves the provided user to the database.
     *
     * @param {User} user - The user instance to be saved.
     * @return {Promise<User>} A promise that resolves with the saved user instance.
     */
    public static async save(user: User): Promise<User> {
        const repository: Repository<User> = manager.getDataSource().getRepository(User);

        return await repository.save(user);
    }
}

