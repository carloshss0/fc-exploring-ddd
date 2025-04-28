import Entity from '../../@shared/entity/entity.abstract';
import NotificationError from '../../@shared/notification/notification.error';
import CustomerChangeAddressEvent from '../event/customer-change-address.event';
import CustomerCreatedEvent from '../event/customer-created.event';
import { eventDispatcher } from '../event/event-config';
import Address from '../value-object/address';


export default class Customer extends Entity {

    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super(id);
        // this._id = id;
        this._name = name;
        this.validate();
        this.apply(new CustomerCreatedEvent({
            id: this._name,
            name: this._name
        }));

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    };

    get rewardPoints(): number {
        return this._rewardPoints;
    }


    validate() {
        if(this._name.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Name is required"
            });  
        }
        if(this.id.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Id is required"
            });   
        }
    }

    changeName(name: string) {
        this._name = name
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    changeAddress(address: Address) {
        this._address = address;
        this.apply(new CustomerChangeAddressEvent({
            id: this.id,
            name: this._name,
            address: this._address
        }));
    }

    activate() {
        if(this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true
    }

    isActive(): boolean {
        return this._active;
    }

    deactivate() {
        this._active = false
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    setAddress(address: Address) {
        this._address = address;
    }

    private apply(event: any) {
        eventDispatcher.notify(event);
    }
    

}