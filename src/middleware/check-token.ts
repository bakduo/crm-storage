import {Response, NextFunction} from 'express';

import { CustomRequestPayload } from "./interfaces";
import { ERRORS_APP, appconfig, loggerApp, tokenResponse } from '../configure/configure-app';
import { ETokenInvalid, errorGenericType } from '../services-layer/util/error';

export const checkToken = async (req:CustomRequestPayload, res:Response, next:NextFunction) => {
    req.payload = {
        profile: {}
    };
    
    if (appconfig.service.enable_service_token){
        try {

            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    
                const token = req.headers.authorization.split(' ')[1];
    
                const response = await fetch(appconfig.service.auth.server, {
                    method: 'GET',
                    headers:  new Headers({
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    })
                });
    
                const userResponse = await response.json() as tokenResponse;
    
                if (userResponse.profile){
                    if (userResponse.profile.roles.includes('user')){
                        req.payload.profile = userResponse.profile;
                        return next();
                    }
                }
            }
            return res.status(401).json({ message: 'Operation failed, required authorization' });
        } catch (error) {
            const err = error as errorGenericType;
            loggerApp.error(`Exception on checkToken into jwt.verify: ${err.message}`);
            return next(new ETokenInvalid(`Token Invalid user ${err.message}`,ERRORS_APP.ETokenInvalid.code,ERRORS_APP.ETokenInvalid.HttpStatusCode));
        }
    }else{
        req.payload.profile = {
            id:'fake',
            roles:[]
        }
        return next();
    }
}