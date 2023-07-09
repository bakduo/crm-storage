import {Request, Response, NextFunction} from 'express';

export interface IErrorMiddleware extends TypeError {
    getHttpCode():number;
    getCode():number;
    getDetail():number;
}

export type errorTypeMiddleware = IErrorMiddleware;

export interface IPayload {
     profile?:unknown
}

export interface IProfileUser {
    id:string,
    roles:string[],
}

export interface IPayloadEvent extends Request {
    appname:string,
    type_event:string,
    user?:string;
}

export interface CustomRequestPayload extends Request {
    payload?: IPayload,
}

