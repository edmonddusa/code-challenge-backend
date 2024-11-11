import "reflect-metadata";
import dotenv from "dotenv";
import {Product} from "./entity/Product.js";

dotenv.config();

function getValidEnv(input: string | undefined): string {
    if (input === undefined) {
        throw new Error(`Missing ${input} environment variable`);
    }
    return input;
}

interface KanplaBackend {
    token: string;
    server: string;
    products_feed: string;
    orders_feed: string;
    payments_feed: string;
}

export const KanplaContext: KanplaBackend = {
    token: getValidEnv(process.env.BACKEND_TOKEN),
    server: getValidEnv(process.env.BACKEND_SERVER),
    products_feed: `https://${getValidEnv(process.env.BACKEND_SERVER)}/products/`,
    orders_feed: `https://${getValidEnv(process.env.BACKEND_SERVER)}/orders/`,
    payments_feed: `https://${getValidEnv(process.env.BACKEND_SERVER)}/payments/`,
}

export async function getProducts(token: string): Promise<Product[]> {
    const response = await fetch(
        KanplaContext.products_feed,
        {
            headers: {
                "X-Auth-User": token,
            },
        }
    );

    return (await response.json()) as Product[];
}

export async function triggerOrder(token: string, amount: number): Promise<{ orderId: string }> {
    const response = await fetch(
        KanplaContext.orders_feed,
        {
            method: "POST",
            headers: {"X-Auth-User": token, "Content-Type": "application/json"},
            body: JSON.stringify({total: amount}),
        }
    );

    const payload = (await response.json()) as { id: string };

    return { orderId: payload.id };
}

export async function triggerPayment(token: string, orderId: string, amount: number): Promise<{
    id: string;
    amount: number;
    user_id: string;
    created_at: string;
    status: string;
    type: string;
    order_id: string;
}> {
    const createPaymentResponse = await fetch(
        KanplaContext.payments_feed,
        {
            method: "POST",
            headers: {"X-Auth-User": token, "Content-Type": "application/json"},
            body: JSON.stringify({order_id: orderId, amount: amount}),
        }
    );

    return (await createPaymentResponse.json()) as {
        id: string;
        amount: number;
        user_id: string;
        created_at: string;
        status: string;
        type: string;
        order_id: string;
    };
}


export async function getOrder(token: string, orderId: string): Promise<any> {
    const response = await fetch(
        KanplaContext.orders_feed + orderId,
        {
            method: "PATCH",
            headers: {"X-Auth-User": token, "Content-Type": "application/json"},
            body: JSON.stringify({status: "completed"}),
        }
    );

    return await response.json();
}