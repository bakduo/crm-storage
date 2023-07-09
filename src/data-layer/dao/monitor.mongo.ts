import { IGenericDB, IItemMonitor, IsearchItem } from "./generic";
import { MongoDatastore } from '../data-store/mongo';
import { Model } from "mongoose";
import { appconfig } from "../../configure";
import { ItemMonitorSchema } from "../schemas";

//Valid for patch object:any = {}
interface IKeyValue {
    [key:string]:string | number;
}

export class ItemMonitorMongo implements IGenericDB<IItemMonitor>{

    private model: Model<IItemMonitor>;

    constructor(){

        try {

            const connectionDB = MongoDatastore.getInstance(
                appconfig.db.config.mongo.url,
                appconfig.db.config.mongo.user,
                appconfig.db.config.mongo.password,
                appconfig.db.config.mongo.dbname,
                appconfig.db.config.mongo.secure).getConnection();
            
            this.model = connectionDB.model<IItemMonitor>('IItemMonitor',ItemMonitorSchema);

        } catch (error:unknown) {
            //loggerApp.error(`Exception on constructor into MongoDB: ${err.message}`);
            throw new Error(`Error to Generated IItemMonitorMongo ${error}`);
        }

    }

    async getAll(): Promise<IItemMonitor[]> {
        const allItems = await this.model.find();
        if (allItems){
            return allItems.map((item)=> {
                const {uuid,appname,type_event,created,modify,deleted,timestamp} = item;
                return {uuid,appname,type_event,created,modify,deleted,timestamp};
            });
        }

        throw new Error(`Exception on getAll into MongoDB`);
    }

    async findOne(custom: IsearchItem): Promise<IItemMonitor> {

        const {keycustom, valuecustom} = custom;

        if (keycustom!=='uuid'){
            throw new Error(`Find attribute didn't correct ${custom}`);
        }

        const queryObj:IKeyValue = {};

        queryObj[keycustom] = valuecustom;

        const item = await this.model.findOne(queryObj);
        if (item){
            const {uuid,appname,type_event,created,modify,deleted,timestamp} = item;

            return {uuid,appname,type_event,created,modify,deleted,timestamp};
        }

        throw new Error(`Not found into MongoDB`);
    }

    async deleteOne(custom: IsearchItem): Promise<boolean> {

        const ok = await this.findOne(custom);

        if (ok){

            const {keycustom, valuecustom} = custom;

            const queryObj:IKeyValue = {};

            queryObj[keycustom] = valuecustom;
        
            const item = await this.model.deleteOne(queryObj);

            if (item){

                if (item.deletedCount>0){
                    return true
                }
            }
        }
        
        throw new Error(`Not found into MongoDB`);
    }

    async saveOne(item: IItemMonitor): Promise<IItemMonitor> {
        
        try {

            //FIXIT post future modif
            // const mItem = {
            //     ...item
            // }

            const newItem:IItemMonitor = await this.model.create(item);
            if (newItem){
               
               const {uuid,appname,type_event,created,modify,deleted,timestamp} = newItem;

               return {uuid,appname,type_event,created,modify,deleted,timestamp};

            }    
            
            throw new Error(`Exception on create into MongoDB`);

        } catch (error:unknown) {
            //loggerApp.error(`Exception on saveOne into MongoDB: ${err.message}`);
            throw new Error(`Exception on saveOne into MongoDB ${error}`);
        }
    }

    async updateOne(id: string, item: IItemMonitor): Promise<IItemMonitor> {

        //https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
        
        item.modify = new Date();

        const updateItem = await this.model.findOneAndUpdate({uuid:id},item,{ returnOriginal: false });
            
        if (updateItem){
            const {uuid,appname,type_event,created,modify,deleted,timestamp} = updateItem;

            return {uuid,appname,type_event,created,modify,deleted,timestamp};
        }

        throw new Error(`Not found into MongoDB`);
    }

    async deleteAll(): Promise<void> {
        await this.model.deleteMany();
    }

}