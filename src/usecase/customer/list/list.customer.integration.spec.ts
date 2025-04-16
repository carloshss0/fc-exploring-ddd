import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "./list.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

describe("Test list customers use case", () => {
    
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list the customers", async () => {
    
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);

        const customer1 = new Customer("123", "John");
        const address1 = new Address("Street 1", 123, "zip", "mockcity");
        customer1.changeAddress(address1);

        
        await customerRepository.create(customer1);

        const customer2 = new Customer("133", "Mark");
        const address2 = new Address("Street 2", 11, "zip 2", "fake city");
        customer2.changeAddress(address2);

        await customerRepository.create(customer2);


        const input = {}

        const result = await usecase.execute(input)

        expect(result.customers.length).toBe(2);
        
        expect(result.customers[0].id).toBe(customer1.id);
        expect(result.customers[0].name).toBe(customer1.name);
        expect(result.customers[0].address.street).toBe(customer1.address.street);
        expect(result.customers[0].address.number).toBe(customer1.address.number);
        expect(result.customers[0].address.zip).toBe(customer1.address.zip);
        expect(result.customers[0].address.city).toBe(customer1.address.city);


        expect(result.customers[1].id).toBe(customer2.id);
        expect(result.customers[1].name).toBe(customer2.name);
        expect(result.customers[1].address.street).toBe(customer2.address.street);
        expect(result.customers[1].address.number).toBe(customer2.address.number);
        expect(result.customers[1].address.zip).toBe(customer2.address.zip);
        expect(result.customers[1].address.city).toBe(customer2.address.city);
        
    });

});