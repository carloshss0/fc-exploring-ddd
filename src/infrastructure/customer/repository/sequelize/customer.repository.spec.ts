import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";

describe("Customer repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address("Street 1", 1, "123456", "MockCity")
        const customer = new Customer("1", "John");
        customer.setAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1"}})
        expect(customerModel?.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address("Street 1", 1, "123456", "MockCity")
        const customer = new Customer("1", "John");
        customer.setAddress(address);
        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer)
        const customerModel = await CustomerModel.findOne({ where: { id: "1"}});

        expect(customerModel?.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address("Street 1", 1, "123456", "MockCity")
        const customer = new Customer("1", "John");
        customer.setAddress(address);
        await customerRepository.create(customer);
        const foundCustomer = await customerRepository.find(customer.id);

        
        expect(customer).toStrictEqual(foundCustomer);
    });

    it("should throw an error when customer is not found", async () =>{
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("456CBSD");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all customer", async () => {
        const customerRepository = new CustomerRepository();
        const address1 = new Address("Street 1", 1, "123456", "MockCity")
        const customer1 = new Customer("1", "John");
        customer1.setAddress(address1);
        customer1.addRewardPoints(10);
        customer1.activate();

        const address2 = new Address("Street 2", 14, "123454", "MockCity")
        const customer2 = new Customer("2", "Maria");
        customer2.setAddress(address2);
        customer2.addRewardPoints(5);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();


        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);


    })

});