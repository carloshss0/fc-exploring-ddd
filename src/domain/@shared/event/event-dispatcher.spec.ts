import Address from "../../customer/value-object/address";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import Customer from "../../customer/entity/customer";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log-handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log1-handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log2-handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";

describe("Domain events tests", () =>{

    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    })

    it("should unregister all events", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    })

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent(
            {
                name: "Product 1",
                description: "Product 1 description",
                price: 10.0,

            }
        );
        // When the notify is executed, it will SendWhenProductIsCreatedHandler.handle() should be invoked
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();


    })

    it("Customer Created Event", () => {
        const spyEventHandler1 = jest.spyOn(EnviaConsoleLog1Handler.prototype, "handle");
        const spyEventHandler2 = jest.spyOn(EnviaConsoleLog2Handler.prototype, "handle");

        const customer = new Customer("c0", "Joao Silva");
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    })

    it("Customer Address Change Event", () => {
        const spyEventHandler = jest.spyOn(EnviaConsoleLogHandler.prototype, "handle");
        const customer = new Customer("c0", "Joao Silva");
        const address = new Address("Rua 1", 1, "000X", "MockCity");
        customer.changeAddress(address);

        expect(spyEventHandler).toHaveBeenCalled();
    })
});