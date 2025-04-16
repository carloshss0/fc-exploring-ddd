import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const product1Data = ProductFactory.create(
    "a",
    "soda",
    7.99
)

const product2Data = ProductFactory.create(
    "a",
    "pepsi",
    3.99
)

const product1 = new Product(product1Data.id, product1Data.name, product1Data.price);
const product2 = new Product(product2Data.id, product2Data.name, product2Data.price);

const MockRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    }
};


describe("Unit test for list products use case", () => {
    it("Should list the products", async () => {
        const repository = MockRepository();
        const useCase = new ListProductUseCase(repository);
        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);
        
        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].price).toBe(product1.price);

        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);
    });
});