import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import UpdateCustomerUseCase from "./update.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

describe("Test create customer use case", () => {
    
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

    it("should find a customer", async () => {
    
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);

        const customer = new Customer("123", "John");
        const address = new Address("Street 1", 123, "zip", "mockcity");
        customer.changeAddress(address);

        
        await customerRepository.create(customer);

        const input = {
            id: "123",
            name: "John Doe",
            address: {
                street: "Street 2",
                number: 1234,
                zip: "zip2",
                city: "mockcity 2"
            }
        }

        const result = await usecase.execute(input)

        // const output = {
        //     id: "123",
        //     name: "John",
        //     address: {
        //         street: "Street 1",
        //         number: 123,
        //         zip: "zip",
        //         city: "mockcity",
        //     }
        // }
        
        expect(result.name).toEqual(input.name);
        expect(result.address.street).toEqual(input.address.street);
        expect(result.address.number).toEqual(input.address.number);
        expect(result.address.zip).toEqual(input.address.zip);
        expect(result.address.city).toEqual(input.address.city);

    })

});