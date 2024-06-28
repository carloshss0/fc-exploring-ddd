import CustomerChangeAddressEvent from '../event/customer/customer-change-address.event';
import CustomerCreatedEvent from '../event/customer/customer-created.event';
import { eventDispatcher } from '../event/customer/event-config';
import Address from './address';


export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
        this.apply(new CustomerCreatedEvent({
            id: this._name,
            name: this._name
        }));
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get id(): string {
        return this._id;
    }

    validate() {
        if(this._name.length === 0) {
            throw new Error("Name is required")
        }
        if(this._id.length === 0) {
         throw new Error("Id is required")   
        }
    }

    changeName(name: string) {
        this._name = name
        this.validate();;
    }

    changeAddress(address: Address) {
        this._address = address;
        this.apply(new CustomerChangeAddressEvent({
            id: this._id,
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