import {app, sequelize} from '../express';
import request from 'supertest';

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Pepsi",
                price: 17.69,
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Pepsi");
        expect(response.body.price).toBe(17.69);

    });

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Pepsi",
            });

        expect(response.status).toBe(500);
    });

    it("should list all products", async () => {
        const response1 = await request(app)
            .post("/product")
            .send({
                name: "PS5",
                price: 2000.99 
            });

        
        const response2 = await request(app)
            .post("/product")
            .send({
                name: "God of War Ragnarok",
                price: 157.99   
            });
        
        const listResponse = await request(app).get("/product").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const product1 = listResponse.body.products[0];
        expect(product1.name).toBe("PS5");
        expect(product1.price).toBe(2000.99);

        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("God of War Ragnarok");
        expect(product2.price).toBe(157.99);

    })
});