import Notification from "../notification/notification";

export default abstract class Entity {
    protected _id: string;
    public notification: Notification;

    constructor(id: string) {
        this.notification = new Notification();
        this._id = id;
    }

    get id(): string {
        return this._id;
    }
}