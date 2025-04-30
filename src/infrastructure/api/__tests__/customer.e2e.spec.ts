import {app, sequelize} from '../express';
import request from 'supertest';

describe("E2E test for customer", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street 1",
                    number: 12,
                    city: "Mock City",
                    zip: "001"
                },    
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John");
        expect(response.body.address.street).toBe("Street 1");
        expect(response.body.address.number).toBe(12);
        expect(response.body.address.city).toBe("Mock City");
        expect(response.body.address.zip).toBe("001");

    });

    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
            });

        expect(response.status).toBe(500);
    });

    it("should list all customers", async () => {
        const response1 = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street 1",
                    number: 12,
                    city: "Mock City",
                    zip: "001"
                },    
            });

        
        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Carl",
                address: {
                    street: "Street 2",
                    number: 123,
                    city: "Fake City",
                    zip: "002"
                },    
            });
        
        const listResponse = await request(app).get("/customer").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);

        const customer1 = listResponse.body.customers[0];
        expect(customer1.name).toBe("John");
        expect(customer1.address.street).toBe("Street 1");
        expect(customer1.address.number).toBe(12);
        expect(customer1.address.city).toBe("Mock City");
        expect(customer1.address.zip).toBe("001");

        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Carl");
        expect(customer2.address.street).toBe("Street 2");
        expect(customer2.address.number).toBe(123);
        expect(customer2.address.city).toBe("Fake City");
        expect(customer2.address.zip).toBe("002");

        const listResponseXML = await request(app)
        .get("/customer")
        .set("Accept", "application/xml")
        .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<customers>`);
        expect(listResponseXML.text).toContain(`<customer>`);
        expect(listResponseXML.text).toContain(`<name>John</name>`);
        expect(listResponseXML.text).toContain(`<address>`);
        expect(listResponseXML.text).toContain(`<street>Street 1</street>`);
        expect(listResponseXML.text).toContain(`<city>Mock City</city>`);
        expect(listResponseXML.text).toContain(`<number>12</number>`);
        expect(listResponseXML.text).toContain(`<zip>001</zip>`);
    })
});