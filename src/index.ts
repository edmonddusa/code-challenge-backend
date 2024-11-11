import "reflect-metadata";
import express from "express";
import {manager} from "./data-source.js";
import {addToBasket,orderAndPay} from "./basket.js";
import {decodeSubFromHeaders} from "./jwt.js"
import {User} from "./entity/User.js";
import {Product} from "./entity/Product.js";

export const AUTH_HEADER = "X-Auth-User";

export async function getServer(port: number)  {
    const app = express();

    console.log("Starting express server...");

    app.post("/product/:id", async (req, res) => {
        const productId = req.params.id;

        if (productId === undefined) {
            res.status(400).json({message: "Product id is missing"});
        } else {
            const userId = decodeSubFromHeaders(req.get(AUTH_HEADER));

            if (userId === undefined) {
                res.status(401).json({message: "Unauthorized"});
            } else {
                const user: User = await User.createIfNotExists(userId);
                const product: Product | null = await Product.getById(productId);

                if (product === null) {
                    res.status(404).json({message: "Product not found"});

                    return;
                } else {
                    try {
                        const result = await addToBasket(user, product);

                        res.status(200).json(result);
                    } catch (error) {
                        if (error instanceof Error) {
                            res.status(500).json({message: error.message});
                        } else {
                            res.status(500).json({message: error});
                        }
                    }
                }
            }
        }
    });

    app.post("/orderAndPay", async (req, res) => {
        const token = req.get(AUTH_HEADER);
        const userId = decodeSubFromHeaders(token);

        if (userId === undefined) {
            res.status(401).json({message: "Unauthorized"});
        } else {
            const user = await User.findById(userId);

            if (user === null) {
                res.status(404).json({message: "No such user found"});

                return;
            } else {
                if(user.basketItems.length === 0) {
                    res.status(400).json({message: "Basket is empty"});
                } else {
                    try {
                        await orderAndPay(token!, user);

                        res.status(200).json({message: "Order placed successfully"});
                    } catch (error) {
                        if (error instanceof Error) {
                            res.status(500).json({message: error.message});
                        } else {
                            res.status(500).json({message: error});
                        }
                    }
                }
            }
        }
    });

    return app.listen(port, () => {
        console.log(`Express server is running on port ${port}`);
    });
}

async function bootUp() {
    await manager.create();
    return await getServer(3000);
}

await bootUp().catch(error => {
    console.error('Failed to start server:', error);
});





