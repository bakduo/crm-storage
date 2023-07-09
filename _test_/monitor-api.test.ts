import * as chai from 'chai';
import { faker } from '@faker-js/faker';
import { DaoFactory } from '../src/data-layer/factory/provider';
import { appconfig } from '../src/configure/configure-app';
import { IMonitorItem, MonitorAPI } from '../src/services-layer/api';
import { errorGenericType } from '../src/services-layer/util/error';

const expect = chai.expect;

describe('Test Monitor API UNIT',async () => {

    let appmonitor: MonitorAPI;

    before(async function(){
        console.log("###############BEGIN TEST Controller#################");
        //streamFile1 = new Uint8Array(fs.readFileSync(`${filePath}/sample.json`));
        const dao = new DaoFactory().getDatabase(appconfig.db.type);
        appmonitor = MonitorAPI.getInstance(dao);
    });

    after(async () => {
        console.log("###############AFTER TEST Controller#################");
        const dao = new DaoFactory().getDatabase(appconfig.db.type);
        await dao.deleteAll();
    });

    describe('Operations commons for monitor api ', () => {

        it('Debería agregar un evento de storage usando monitor api', async () => {

            const evento = {
                appname: faker.music.songName(),
                type_event: faker.commerce.productAdjective()
            }

            const item:IMonitorItem= await appmonitor.save(evento);
        
            expect(item.appname).eql(evento.appname);
            expect(item.type_event).eql(evento.type_event);
        });


        it('Debería fallar al buscar un registro en la api', async () => {

            try {
                const item:IMonitorItem= await appmonitor.findOne('noexiste');    
            } catch (error:unknown) {
                const err = error as errorGenericType;
                expect(err.message).to.contain("Not found");
            }
        });

    });
});