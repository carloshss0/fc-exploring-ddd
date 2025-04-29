import Product from "./product";


describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            const product = new Product("", "Product 1", 100);
        }).toThrowError("product: Id is required");
    });

    it("should throw error when name is empty", () => {

        expect(() => {
            const product = new Product("123", "", 100);
        }).toThrowError("product: Name is required");
    });

    it("should throw error when price is lower than 0", () => {

        expect(() => {
            const product = new Product("123", "product", -1);
        }).toThrowError("product: Price must be bigger than 0");
    });

    it("should change name", () => {
        const product = new Product("123", "Product 1", 100);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    });

    it("should change price", () => {
        const product = new Product("123", "Product 1", 100);
        product.changePrice(200);
        expect(product.price).toBe(200);
    });

    
});