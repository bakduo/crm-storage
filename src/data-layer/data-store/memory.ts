
import { IItemMonitor } from "../dao";
import { DatastoreCustom } from "./interfaces";

export class MemoryDatastore implements DatastoreCustom{

    private items:IItemMonitor[];

    constructor(){
        this.items = [];
    }

    create(): boolean {
        //throw new Error("Method not implemented.");
        return true;
    }

    getStore():IItemMonitor[]{
        return this.items;
    }

    replace(items:IItemMonitor[]){
        this.items = items;
    }
}