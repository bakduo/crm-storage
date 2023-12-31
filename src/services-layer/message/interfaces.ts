export interface IMessageAsync {
    sendMessage(body:unknown):boolean,
    recieveMessage(callback:Function):Promise<unknown>,
}

export interface IMessageUser {
    user:string,
    date:number,
    type:string,
}

export interface IMessageApp {
    app:string,
    date:number,
    type:string,
}