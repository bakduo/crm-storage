import { IGenericDB, IItemMonitor } from "../../data-layer/dao/generic";

import {Request, Response, NextFunction} from 'express';
import { CustomRequestPayload, IPayload, IPayloadEvent, IProfileUser } from "../../middleware/interfaces";
import { v4 as uuidv4 } from 'uuid';
import { EController, errorGenericType } from "../util/error";
import { ERRORS_APP, loggerApp } from "../../configure/configure-app";


export class ControllerMonitorApi {

    private dao:IGenericDB<IItemMonitor>

    constructor(_dao:IGenericDB<IItemMonitor>){
        this.dao = _dao;
    }

    getAll = async (req:Request, res:Response, next:NextFunction)=>{
        const items =await this.dao.getAll();
        return res.status(200).json({message:'List events',status:true,items});
    }

    find = async (req:Request, res:Response, next:NextFunction)=>{

        try{
            if (req.params.uuid){
                const item = await this.dao.findOne({keycustom:'uuid',valuecustom:req.params.uuid});
                if (item){
                    if (!item.deleted){
                        const data = {
                            appname: item.appname,
                            type_event:item.type_event
                        }
                        return res.status(200).json({message:'Content found',status:true,event:data});
                    }
                }
            }
        }catch (error) {
            const err = error as errorGenericType;
                    
            loggerApp.error(`Exception find event to db: ${err.message}`);
                    
            return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundEvent.code,ERRORS_APP.ENotFoundEvent.HttpStatusCode)); 
        }

        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }

    delete = async (req:Request, res:Response, next:NextFunction)=>{
        if (req.params.uuid){
            try{
                const item = await this.dao.findOne({keycustom:'uuid',valuecustom:req.params.uuid});
                if (item){
                    item.deleted = true;
                    await this.dao.updateOne(req.params.uuid,item);
                    const data = {
                        appname: item.appname,
                        type_event:item.type_event
                    }
                    return res.status(200).json({message:'Delete OK',status:true,event:data});
                }
            }catch (error) {
                const err = error as errorGenericType;
                        
                loggerApp.error(`Exception delete item to db: ${err.message}`);
                        
                return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundEvent.code,ERRORS_APP.ENotFoundEvent.HttpStatusCode)); 
            }
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }

    save = async (req:CustomRequestPayload, res:Response, next:NextFunction)=>{

        const {profile} = req.payload as IPayload;

        const {id} = profile as IProfileUser;

        const {appname,type_event,user} = req.body as IPayloadEvent;

        const item = {
                appname,
                uuid: uuidv4(),
                type_event,
                created: new Date(),
                modify: new Date(),
                deleted:false,
                user:user || '',
                timestamp: Date.now()
            };

        try {
            const itemSave = await this.dao.saveOne(item);

            const remoteValue = {
                name:itemSave.appname,
                type_event:itemSave.type_event
            };

            return res.status(201).json({message:'Save data OK',status:true,event:remoteValue});

        } catch (error) {
            const err = error as errorGenericType;
            loggerApp.error(`Exception save item to db: ${err.message}`);         
            return next(new EController(`Message: ${err.message}`,ERRORS_APP.ESaveEventError.code,ERRORS_APP.ESaveEventError.HttpStatusCode)); 
        }
    }

    update = async (req:CustomRequestPayload, res:Response, next:NextFunction)=>{
        if (req.params.uuid){
            try{

                //const {profile} = req.payload as IPayload;

                const {appname,type_event,user} = req.body as IPayloadEvent;

                //const {id} = profile as IProfileUser;

                const item = await this.dao.findOne({keycustom:'uuid',valuecustom:req.params.uuid});

                if (item){

                    const itemUpdate = {
                        appname:appname,
                        uuid: item.uuid,
                        type_event: type_event,
                        created: item.created,
                        modify: new Date(),
                        deleted:item.deleted,
                        user:item.user || user,
                        timestamp: Date.now()
                    };
                    
                    const itemDone = await this.dao.updateOne(req.params.uuid,itemUpdate);

                    const data = {
                        appname: itemDone.appname,
                        type_event: itemDone.type_event
                    };

                    return res.status(201).json({message:'Content updated',status:true,event:data});
                }
            }catch (error) {
                const err = error as errorGenericType;    
                loggerApp.error(`Exception update item to db: ${err.message}`);
                return next(new EController(`Message: ${err.message}`,ERRORS_APP.ENotFoundEvent.code,ERRORS_APP.ENotFoundEvent.HttpStatusCode));
            }
        }
        return res.status(404).json({message:'Not Found',status:false,file:{}});
    }

}