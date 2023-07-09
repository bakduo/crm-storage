import { IGenericDB, IItemMonitor } from "../../data-layer";

import { v4 as uuidv4 } from 'uuid';
import { EMonitorAPI, errorGenericType } from "../util/error";
import { ERRORS_APP, loggerApp } from "../../configure";

export interface IMonitorItem {
    appname:string;
    type_event:string;
}

export class MonitorAPI {
    
    private dao:IGenericDB<IItemMonitor>
   
    private static instance: MonitorAPI;

    constructor(_dao:IGenericDB<IItemMonitor>){
        this.dao = _dao;
    }


    public static getInstance(_dao:IGenericDB<IItemMonitor>): MonitorAPI {
        
            if (!MonitorAPI.instance) {
                MonitorAPI.instance = new MonitorAPI(_dao);
            }
    
            return MonitorAPI.instance;
    }

    save = async (event:IMonitorItem):Promise<IMonitorItem> => {

        const item = {
                appname:event.appname,
                uuid: uuidv4(),
                type_event:event.type_event,
                created: new Date(),
                modify: new Date(),
                deleted:false,
                user:'',
                timestamp: Date.now()
            };

        try {

            const itemSave = await this.dao.saveOne(item);

            return {
                appname: itemSave.appname,
                type_event:itemSave.type_event
            }
            
        }catch (error) {
            const err = error as errorGenericType;
                    
            loggerApp.error(`Exception find event to db: ${err.message}`);

            throw new EMonitorAPI(`Message: ${err.message}`,ERRORS_APP.EAPISaveRecord.code,ERRORS_APP.EAPISaveRecord.HttpStatusCode);
        }

    }

    findOne = async(uuid:string):Promise<IMonitorItem> => {

        try {

            const item = await this.dao.findOne({keycustom:'uuid',valuecustom:uuid});

            if (item){
                if (!item.deleted){
                    const data = {
                        appname: item.appname,
                        type_event:item.type_event
                    }
                    return data;
                }
            }

            throw Error('Not found');
            
        } catch (error) {
            const err = error as errorGenericType;
                    
            loggerApp.error(`Exception API find record: ${err.message}`);

            throw new EMonitorAPI(`Message: ${err.message}`,ERRORS_APP.EAPIFindRecord.code,ERRORS_APP.EAPIFindRecord.HttpStatusCode);
        }
    }
}
