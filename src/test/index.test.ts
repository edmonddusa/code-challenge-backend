import request from "supertest";
import {describe, it, expect, beforeAll, afterAll} from "vitest";
import {AUTH_HEADER, getServer} from "../index.js";
import {KanplaContext} from "../kanpla-service.js";
import {manager} from "../data-source.js";

beforeAll(async () => {
    // Initialize the database connection and server
    await manager.create();
    server = await getServer(3001);
});

afterAll(async () => {
    // kill the database connection and server
    await manager.destroy();
    server.close();
});

let server: any;

describe('Express Endpoints - Custom Headers', () => {
    it('POST /product/8a88aee8-dbab-46a3-b334-c82b0d751540 should be ok', async () => {

        const response = await request(server)
            .post("/product/8a88aee8-dbab-46a3-b334-c82b0d751540")
            .set(AUTH_HEADER, KanplaContext.token);

        expect(response.status).toBe(200);
        expect(response.body.row.name).toBe("Burger")
    });

    it('POST /product/11111111-1111-1111-1111-111111111111 no such product', async () => {

        const response = await request(server)
            .post("/product/11111111-1111-1111-1111-111111111111")
            .set(AUTH_HEADER, KanplaContext.token);

        expect(response.status).toBe(404);
        expect(response.body.message).toContain("not found");
    });

    it('POST /product/8a88aee8-dbab-46a3-b334-c82b0d751540 no auth header', async () => {

        const response = await request(server)
            .post("/product/8a88aee8-dbab-46a3-b334-c82b0d751540");

        expect(response.status).toBe(401);
        expect(response.body.message).toContain("Unauthorized");
    });

    it('POST /product/orderAndPay should be ok',  { timeout: 30000 }, async () => {
        const response1 = await request(server)
            .post("/product/8a88aee8-dbab-46a3-b334-c82b0d751540")
            .set(AUTH_HEADER, KanplaContext.token);

        expect(response1.status).toBe(200);
        expect(response1.body.row.name).toBe("Burger")

        const response2 = await request(server)
            .post("/orderAndPay")
            .set(AUTH_HEADER, KanplaContext.token);

        expect(response2.status).toBe(200);
        expect(response2.body.message).toContain("successfully")
    });
});