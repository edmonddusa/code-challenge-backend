import "reflect-metadata";
import dotenv from "dotenv";
import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "./entity/User.js";
import {Product} from "./entity/Product.js";
import {BasketItem} from "./entity/BasketItem.js";
import {Order} from "./entity/Order.js";
import {OrderItem} from "./entity/OrderItem.js";

dotenv.config();

function getValidEnv(input: string | undefined): string {
    if (input === undefined) {
        throw new Error(`Missing ${input} environment variable`);
    }
    return input;
}

/**
 * Manages the lifecycle and configuration of the data source.
 * Handles creation, initialization, and destruction of the data source,
 * ensuring a single instance is managed at a time.
 */
class DataSourceManager {
    private dataSource: DataSource | null = null;

    /**
     * Initializes and configures a PostgreSQL datasource. If an existing datasource
     * is present, it will be destroyed before creating a new one.
     *
     * @return {Promise<void>} A promise that resolves when the datasource is initialized.
     */
    public async create(): Promise<void> {
        if (this.dataSource) {
            await this.dataSource.destroy();
        }
        const options: DataSourceOptions = {
            type: "postgres",
            host: getValidEnv(process.env.POSTGRES_HOST),
            port: parseInt(getValidEnv(process.env.POSTGRES_PORT), 10),
            username: getValidEnv(process.env.POSTGRES_USER),
            password: getValidEnv(process.env.POSTGRES_PASSWORD),
            database: getValidEnv(process.env.POSTGRES_DB),
            synchronize: true,
            logging: false,
            entities: [Product, User, Order, OrderItem, BasketItem],
            migrations: [],
            subscribers: [],
        };

        this.dataSource = new DataSource(options);

        console.log("PostgreSQL datasource has been created");

        await this.dataSource.initialize().then(async () => {
            console.log("PostgreSQL datasource has been initialized");
        });
    }

    /**
     * Destroys the current data source if it exists and logs a message after the data source has been destroyed.
     *
     * @return {Promise<void>} A promise that resolves once the data source has been destroyed and set to null.
     */
    public async destroy(): Promise<void> {
        if (this.dataSource) {
            await this.dataSource.destroy().then(async () => {
                console.log("PostgreSQL datasource has been destroyed");
            });
        }
        this.dataSource = null;
    }

    /**
     * Retrieves the current data source.
     *
     * @return {Object} The data source if it has been initialized.
     * @throws {Error} If the data source is not initialized.
     */
    public getDataSource(): DataSource {
        if (!this.dataSource) {
            throw new Error('DataSource is not initialized');
        }
        return this.dataSource;
    }
}

export const manager = new DataSourceManager();