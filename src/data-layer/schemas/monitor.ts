import { Schema } from 'mongoose';
import { IItemMonitor } from '../dao';

export const ItemMonitorSchema = new Schema<IItemMonitor>({
    appname: {
        type: String,
        required: true,
        default: '',
      },
    type_event:{
        type: String,
        required: true,
        default: '',
      },
    created: {
        type: Date,
        required: false,
        default: Date.now(),
    },
    uuid: {
        type: String,
        required: true,
      },
    modify: {
        type: Date,
        required: false,
        default: Date.now(),
      },  
    deleted:{
        type: Boolean,
        required: true,
        default:false,
    },
    user:{
        type: String,
        required: false,
        default:'',
    },
    timestamp: {
        type: Number,
        required: true,
        default: Math.floor(Date.now() / 1000),
      },
  });