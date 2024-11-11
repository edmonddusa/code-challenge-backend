import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Repository} from "typeorm";
import {BasketItem} from "./BasketItem.js";
import {manager} from "../data-source.js";
import {BigNumber} from "bignumber.js";
import {OrderItem} from "./OrderItem.js";


/**
 * Represents a product in the system.
 *
 * The Product class is an entity model representing the products table in the database.
 */
@Entity("products", { schema: "public" })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("varchar", { length: 255, unique: true })
    name: string;

    @Column("decimal", { precision: 12, scale: 2 })
    vat_rate: string;

    @Column("decimal", { precision: 12, scale: 2 })
    price_unit: string;

    @OneToMany(() => BasketItem, (basketItem) => basketItem.product)
    basketItems: Promise<BasketItem[]>;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: Promise<OrderItem[]>;

    get vat(): BigNumber {
        return new BigNumber(this.vat_rate);
    }

    get price(): BigNumber {
        return new BigNumber(this.price_unit);
    }

    get total_price(): BigNumber {
        return this.price.plus(this.vat.multipliedBy(this.price));
    }

    /**
     * Retrieves a product by its unique identifier.
     *
     * @param {string} id - The unique identifier of the product to be retrieved.
     * @return {Promise<Product | null>} A promise that resolves to the product if found, otherwise null.
     */
    public static async getById(id: string): Promise<Product | null> {
        const repository: Repository<Product> = manager.getDataSource().getRepository(Product);

        return repository.findOne({ where: { id } });
    }

    /**
     * Persists the given product entity to the database.
     *
     * @param {Product} product - The product entity to be saved.
     * @return {Promise<Product>} A promise that resolves to the saved product entity.
     */
    public static async save(product: Product): Promise<Product> {
        const repository: Repository<Product> = manager.getDataSource().getRepository(Product);

        return repository.save(product);
    }
}
