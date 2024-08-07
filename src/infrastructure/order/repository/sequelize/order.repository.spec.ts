import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import Product from "../../../../domain/product/entity/product";
import OrderRepository from "./order.repository";
import Customer from "../../../../domain/customer/entity/customer";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "123123", "City 1");

        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id},
            include: ["items"],   
        });

        expect(orderModel?.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "123123", "City 1");

        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const newOrderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            3
        );

        order.changeItems([newOrderItem]);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id},
            include: ["items"],   
        });

        expect(orderModel?.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });    
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "123123", "City 1");

        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne(
            { where: { id: "123"},
              include: [{model: OrderItemModel}],
            }
        ,);
        const foundOrder = await orderRepository.find("123");

        expect(orderModel?.toJSON()).toStrictEqual({
            id: foundOrder.id,
            customer_id: foundOrder.customerId,
            total: foundOrder.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });    
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "123123", "City 1");
        const customer2 = new Customer("132", "Customer 2");
        const address2 = new Address("Street 2", 3, "111", "City 2");

        customer1.changeAddress(address1);
        customer2.changeAddress(address2);
        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("132", "Product 2", 20);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );
        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            2
        );
        const order1 = new Order("123", "123", [orderItem1]);
        const order2 = new Order("132", "132", [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();
        const orders = [order1, order2];

        expect(orders).toEqual(foundOrders);

    });
});