import EventDispatcher from "../@shared/event-dispatcher";
import EnviaConsoleLogHandler from "./handler/envia-console-log-handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1-handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2-handler";

export const eventDispatcher = new EventDispatcher();

eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog1Handler());
eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog2Handler());
eventDispatcher.register("CustomerChangeAddressEvent", new EnviaConsoleLogHandler());