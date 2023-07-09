import { MemoryDatastore } from "../data-store";
import { IGenericDB, IsearchItem, IItemMonitor } from "./generic";


export class ItemMonitorMemory implements IGenericDB<IItemMonitor>{

    private memory: MemoryDatastore

    constructor(storage:MemoryDatastore){
        this.memory = storage;
    }

    async getAll(): Promise<IItemMonitor[]> {
        return Promise.resolve(this.memory.getStore())
    }

    async findOne(custom: IsearchItem): Promise<IItemMonitor> {
        //throw new Error("Method not implemented.");
        const {keycustom, valuecustom} = custom;

        if (keycustom!=='uuid'){
            throw new Error(`Find attribute didn't correct ${custom}`);
        }

        const items = this.memory.getStore();
        const OK = items.find((item)=>{
            return (item.uuid == valuecustom)
        })
        
        if (OK){
            return Promise.resolve(OK);
        }
        throw new Error(`Not found ${custom.valuecustom}`);
    }

    async findByName(name:string): Promise<IItemMonitor> {
        
        const items = this.memory.getStore();
        
        const OK = items.find((item)=>{
            return (item.appname == name)
        })
        
        if (OK){
            return Promise.resolve(OK);
        }
        throw new Error(`Not found ${name}`);
    }

    async deleteOne(custom: IsearchItem): Promise<boolean> {
        
        const ok = await this.findOne(custom);
        if (ok){
            const {valuecustom} = custom;
            let items = this.memory.getStore();
            items = items.filter((item)=>{
                return item.uuid !== valuecustom
            });
            this.memory.replace(items);
            return Promise.resolve(true);
        }
        throw new Error(`Not found ${custom.valuecustom}`);

    }
    
    async saveOne(item: IItemMonitor): Promise<IItemMonitor> {
        //throw new Error("Method not implemented.");
        this.memory.getStore().push(item);
        return Promise.resolve(item);
    }

    async updateOne(id: string, item: IItemMonitor): Promise<IItemMonitor> {
        const ok = await this.findOne({keycustom:'uuid',valuecustom:id});
        if (ok){

            const items = this.memory.getStore();
            const postIndex = items.findIndex((item)=>{
                return item.uuid==id
            })
            item.modify = new Date();
            items[postIndex] = item;
            this.memory.replace(items);
            return Promise.resolve(items[postIndex]);
        }
        throw new Error(`Not found ${id}`);
    }

    deleteAll(): Promise<void> {
        return Promise.resolve(this.memory.replace([]));
    }
}