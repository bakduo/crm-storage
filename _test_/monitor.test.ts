import * as chai from 'chai';

import { faker } from '@faker-js/faker';

import { MemoryDatastore } from '../src/data-layer/data-store/memory';

import { ItemMonitorMemory } from '../src/data-layer/dao';

import {errorGenericType} from '../src/services-layer/util/error';

const expect = chai.expect;

const memory = new MemoryDatastore();

const dao = new ItemMonitorMemory(memory);

describe('Test MemoryDAO MonitorItem UNIT',async () => {

    before(async function(){

        console.log("###############BEGIN TEST MemoryDAO MonitorItem#################");

        await Promise.all([dao.saveOne({
            uuid: faker.database.mongodbObjectId(),
            appname: faker.music.songName(),
            type_event: faker.commerce.productAdjective(),
            created: new Date(),
            modify: new Date(),
            deleted: false,
            user: faker.internet.email(),
            timestamp: Date.now()
        }),
        dao.saveOne({
            uuid: faker.database.mongodbObjectId(),
            appname: faker.music.songName(),
            type_event: faker.commerce.productAdjective(),
            created: new Date(),
            modify: new Date(),
            deleted: false,
            user: faker.internet.email(),
            timestamp: Date.now()
        }),
        dao.saveOne({
            uuid: faker.database.mongodbObjectId(),
            appname: faker.music.songName(),
            type_event: faker.commerce.productAdjective(),
            created: new Date(),
            modify: new Date(),
            deleted: false,
            user: faker.internet.email(),
            timestamp: Date.now()
        }),
        dao.saveOne({
            uuid: faker.database.mongodbObjectId(),
            appname: faker.music.songName(),
            type_event: faker.commerce.productAdjective(),
            created: new Date(),
            modify: new Date(),
            deleted: false,
            user: faker.internet.email(),
            timestamp: Date.now()
        })]);

    });

    after(async () => {
        console.log("###############AFTER TEST MemoryDAO MonitorItem#################");
        await dao.deleteAll();
    });

    describe('Operaciones sobre MemoryDAO MonitorItem', async () => {

        it('Debería agregar un evento de app', async () => {

            const item= await dao.saveOne({
                uuid: faker.database.mongodbObjectId(),
                appname: faker.music.songName(),
                type_event: faker.commerce.productAdjective(),
                created: new Date(),
                modify: new Date(),
                deleted: false,
                user: faker.internet.email(),
                timestamp: Date.now()
            })
            expect(item).to.be.an('object');
            expect(item).to.have.property('uuid');
            expect(item).to.have.property('appname');
            expect(item.deleted).to.equal(false);
        });

        it('Debería listar todo', async () => {

            const listaUser = await dao.getAll();
            expect(listaUser).to.be.an('array');
            expect(listaUser).to.length(5);
        });
        
        it('Debería eliminar un evento', async () => {

            const listaUser = await dao.getAll();
            const ok = await dao.deleteOne({keycustom:'uuid',valuecustom:listaUser[2].uuid});
            expect(ok).to.be.an('boolean');
            expect(ok).to.equal(true);
        });

        it('Debería buscar un evento', async () => {

            const listaUser = await dao.getAll();

            const app = await dao.findOne({keycustom:'uuid',valuecustom:listaUser[3].uuid});
            expect(app).to.be.an('object');
            expect(app).to.have.property('appname');
            expect(app.appname).to.equal(listaUser[3].appname);
        });

        it('Debería actualizar un evento', async () => {

            const listaUser = await dao.getAll();
            
            await dao.updateOne(listaUser[3].uuid,{
                uuid: listaUser[3].uuid,
                appname: faker.music.songName(),
                type_event: faker.commerce.productAdjective(),
                created: new Date(),
                modify: new Date(),
                deleted: true,
                user: faker.internet.email(),
                timestamp: Date.now()
            });
    
            const app = await dao.findOne({keycustom:'uuid',valuecustom:listaUser[3].uuid});
            expect(app).to.be.an('object');
            expect(app).to.have.property('appname');
            expect(app.deleted).to.equal(true);
        });

        it('Debería saltar exception por update que no existe', async () => {

            try {
                await dao.updateOne('no existe',{
                    uuid: 'no existe',
                    appname: faker.music.songName(),
                    type_event: faker.commerce.productAdjective(),
                    created: new Date(),
                    modify: new Date(),
                    deleted: true,
                    user: faker.internet.email(),
                    timestamp: Date.now()
                });    
            } catch (error:unknown) {
                const err = error as errorGenericType;
                expect(err.message).to.contain("Not found");
            }
            
        });

        it('Debería saltar exception por delete que no cumple patron de busqueda', async () => {

            try {
                await dao.deleteOne({keycustom:'email',valuecustom:'no existe'});
            } catch (error:unknown) {
                const err = error as errorGenericType;
                expect(err.message).to.contain("Find attribute didn't correct");
            }
            
        });

        it('Debería saltar exception por find que cumple patron de busqueda', async () => {

            try {
                await dao.findOne({keycustom:'email',valuecustom:'no existe'});
            } catch (error:unknown) {
                const err = error as errorGenericType;
                expect(err.message).to.contain("Find attribute didn't correct");
            }
            
        });
        

    });


});
