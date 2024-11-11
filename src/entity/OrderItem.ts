import {Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {Product} from "./Product.js";
import {Order} from "./Order.js";

/**
 * Represents an item in an order.
 */
@Entity("order_items", { schema: "public" })
export class OrderItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column("uuid")
    orderId: string;

    @Column("uuid")
    productId: string;

    @Column("decimal", { precision: 12, scale: 2 })
    amount: string;

    @Column("timestamp with time zone", { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column("integer")
    count: number;

    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: "orderId" })
    public order: Order

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: "productId" })
    public product: Product
}