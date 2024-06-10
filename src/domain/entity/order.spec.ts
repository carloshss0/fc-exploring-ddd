import Order from "./order"
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    })

    it("should throw error when customerId is empty", () => {

        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("customerId is required");
    });

    it("should throw error when order does not have any item", () => {

        expect(() => {
            let order = new Order("123", "132", []);
        }).toThrowError("at least one item is required");
    });

    it("should calculate total", () => {
        const item1 = new OrderItem("123", "Item 1", 10, "p1", 2);
        const order = new Order("o1", "c1", [item1]);

        let total = order.total();

        expect(total).toBe(20);

        const item2 = new OrderItem("132", "Item 2", 5, "p2", 2);
        const order2 = new Order("o2", "c1", [item1, item2]);
        total = order2.total();
        expect(total).toBe(30);

    });

    it("should throw error if the item quantity is less or equal 0", () => {
        expect(() => {
            const item1 = new OrderItem("123", "Item 1", 10, "p1", 0);
            const order = new Order("o1", "c1", [item1]);
        }).toThrowError("Quantity must be greater than 0");

    });


})