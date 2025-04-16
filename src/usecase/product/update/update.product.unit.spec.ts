import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";
import { InputUpdateProductDto } from "./update.product.usecase.dto";

const productData = ProductFactory.create(
    "a",
    "soda",
    3.99,
);

const product = new Product(productData.id, productData.name, productData.price);


let input: InputUpdateProductDto;

const MockRepository = () => {
    return {

        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    };
}

describe("Unit test for update product use case", () => {
    
    beforeEach(() => {
        input = {
            id: product.id,
            name: "new soda",
            price: 10.99
        };
    })
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output = await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    })

    it ("should throw an error when name is missing", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        input.name = "";
        await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
            "name is required"
        );
    });

    it ("should throw an error when price is invalid", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        input.price = -10;

        await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
            "price needs to be bigger than 0"
        );
    });
})