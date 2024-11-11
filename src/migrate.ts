import retry from "async-retry";
import {getProducts} from "./kanpla-service.js";
import {Product} from "./entity/Product.js";
import {KanplaContext} from "./kanpla-service.js"

export async function migrateProducts() {
    console.log("Migrating products...");

    let products = await retry(
        async () => {
            return await getProducts(KanplaContext.token);
        },
        {
            retries: 10, onRetry: (error) => {
                console.log("Retrying products migration");
                console.log(error);
            }
        }
    );

    for (const item of products) {
        const product = new Product();

        product.id = item.id;
        product.name = item.name;
        product.vat_rate = item.vat_rate;
        product.price_unit = item.price_unit;

        await Product.save(product);

        console.log(`Migrated product ${item.name}`);
    }

    console.log("Product migration completed");
}