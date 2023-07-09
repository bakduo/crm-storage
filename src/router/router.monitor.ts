import express from 'express';
import { DaoFactory } from '../data-layer/factory/provider';
import { appconfig } from '../configure/configure-app';
import { ControllerMonitorApi } from '../services-layer/controller/monitor';
import { checkToken } from '../middleware/check-token';

const dao = new DaoFactory().getDatabase(appconfig.db.type);

const controller = new ControllerMonitorApi(dao);

export const routerMonitor = express.Router();

routerMonitor.get('/list',checkToken,controller.getAll);
routerMonitor.post('/save',checkToken,controller.save);
routerMonitor.get('/findById/:uuid',checkToken,controller.find);
routerMonitor.delete('/delete/:uuid',checkToken,controller.delete);
routerMonitor.put('/update/:uuid',checkToken,controller.update);