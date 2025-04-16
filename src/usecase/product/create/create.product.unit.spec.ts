import CreateProductUseCase from "./create.product.usecase";

const input = {
    name: "soda",
    price: 5.77,
}


const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test create product use case", () => {
    it("should create a product", async() => {
        const productRepository= MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const output = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it ("should throw an error when name is missing", async () => {
        const productRepository= MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        input.name = "";
        await expect(createProductUseCase.execute(input)).rejects.toThrow(
            "name is required"
        );
    });

    it ("should throw an error when price is invalid", async () => {
        const productRepository= MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);
        input.name = "soda"
        input.price = -1;
        await expect(createProductUseCase.execute(input)).rejects.toThrow(
            "price needs to be bigger than 0"
        );
    });
});