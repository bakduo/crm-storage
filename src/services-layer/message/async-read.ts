import { appconfig, loggerApp } from "../../configure";
import { DaoFactory } from "../../data-layer";
import { MonitorAPI } from "../api";
import { MQservice } from "./mq";

export class ControlMessageMonitor {

    private static instance: ControlMessageMonitor;

    public static getInstance(): ControlMessageMonitor {
        
            if (!ControlMessageMonitor.instance) {
                ControlMessageMonitor.instance = new ControlMessageMonitor();
            }
    
            return ControlMessageMonitor.instance;
    }


    runUserQueue = async (mqs:MQservice) => {

        const dao = new DaoFactory().getDatabase(appconfig.db.type);
        
        const appmonitor = MonitorAPI.getInstance(dao);

        await mqs.recieveMessage((msg:any)=>{

            const payload = JSON.parse(msg.content.toString());

            loggerApp.debug("[x] runUserQueue Received '%s'",payload);
            
            appmonitor.save({appname:payload.appname,type_event:payload.type_event});
        });

    }


}