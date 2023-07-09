export interface IsearchItem {
    [keycustom:string]:string | number,
    valuecustom:string | number
}

export interface IGenericDB<T> {

    getAll():Promise<T[]>
  
    findOne(custom:IsearchItem):Promise<T>;
    
    deleteOne(custom:IsearchItem):Promise<boolean>;
    
    saveOne(item:T):Promise<T>;
    
    updateOne(id:string,item:T):Promise<T>;

    deleteAll():Promise<void>;

}

export interface IItemMonitor {
    appname:string;
    type_event:string;
    created:Date;
    modify:Date;
    deleted:boolean;
    user?: string;
    uuid:string;
    _id?:string;
    timestamp:number;
}