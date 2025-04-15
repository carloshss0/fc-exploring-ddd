import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDto } from "./update.customer.dto";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
    "John",
    new Address("Street", 123, 'zip', "mock city")
);

let input: InputUpdateCustomerDto;

const MockRepository = () => {
    return {

        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
}

describe("Unit test for update customer use case", () => {
    
    beforeEach(() => {
        input = {
            id: customer.id,
            name: "John Updated",
            address: {
                street: "Street updated",
                number: 14,
                zip: "new zip",
                city: "new city",
            },
        };
    })
    it("should update a customer", async () => {
        const customerRepository = MockRepository();
        const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

        const output = await customerUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    })

    it ("should throw an error when name is missing", async () => {
        const customerRepository= MockRepository();
        const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

        input.name = "";
        await expect(customerUpdateUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });

    it ("should throw an error when street is missing", async () => {
        const customerRepository= MockRepository();
        const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);
        console.log(input)
        input.address.street = "";
        console.log(input)
        await expect(customerUpdateUseCase.execute(input)).rejects.toThrow(
            "Street is required"
        );
    });
})