import * as chai from 'chai';

import supertest from "supertest";

import { app } from '../src/app';

import { faker } from '@faker-js/faker';
import { DaoFactory } from '../src/data-layer/factory/provider';
import { appconfig } from '../src/configure/configure-app';

const requestTest = supertest(app);

const expect = chai.expect;


describe('Test controller monitor UNIT',async () => {

    before(async function(){

        console.log("###############BEGIN TEST Controller#################");

        //streamFile1 = new Uint8Array(fs.readFileSync(`${filePath}/sample.json`));
    });

    after(async () => {
        console.log("###############AFTER TEST Controller#################");
        const dao = new DaoFactory().getDatabase(appconfig.db.type);
        await dao.deleteAll();
    });

    describe('Operations commons for monitor crm storage', () => {

        it('debería retornar una lista de los eventos', async () => {

            const response = await requestTest.get('/api/list').send();

            expect(response.status).to.eql(200);

            const responseEvents = response.body;

            expect(responseEvents.items).to.be.an('array');

        });


        it('Debería agregar un evento de storage', async () => {

            const tokenUser = faker.string.alphanumeric(100);

            const evento = {
                appname: faker.music.songName(),
                type_event: faker.commerce.productAdjective(),
                user: faker.internet.email(),
            }

            const response = await requestTest.post('/api/save').set('Authorization',`Bearer ${tokenUser}`).send(evento);
            expect(response.status).to.eql(201);
            const responseEvent = response.body;
            expect(responseEvent.event).to.be.a('object');
            expect(responseEvent.event).to.include.keys('name');
            expect(responseEvent.event).to.include.keys('type_event');
            expect(responseEvent.event.name).to.be.a('string');
            expect(responseEvent.event.type_event).to.be.a('string');
        });

        it('Debería buscar un evento de storage', async () => {

            const tokenUser = faker.string.alphanumeric(100);

            const responseListado = await requestTest.get('/api/list').send();

            expect(responseListado.status).to.eql(200);

            const responseEvents = responseListado.body;

            const item = responseEvents.items[0];

            const response = await requestTest.get(`/api/findById/${item.uuid}`).set('Authorization',`Bearer ${tokenUser}`).send();
            expect(response.status).to.eql(200);
            const responseEvent = response.body;
            expect(responseEvent.event).to.be.a('object');
            expect(responseEvent.event).to.include.keys('appname');
            expect(responseEvent.event).to.include.keys('type_event');
            expect(responseEvent.event.appname).to.be.a('string');
            expect(responseEvent.event.type_event).to.be.a('string');
            expect(responseEvent.event.appname).eql(item.appname);
            expect(responseEvent.event.type_event).eql(item.type_event);

        });

        it('Debería eliminar un evento de storage', async () => {

            const tokenUser = faker.string.alphanumeric(100);

            const responseListado = await requestTest.get('/api/list').send();

            expect(responseListado.status).to.eql(200);

            const responseEvents = responseListado.body;

            const item = responseEvents.items[0];

            const response = await requestTest.delete(`/api/delete/${item.uuid}`).set('Authorization',`Bearer ${tokenUser}`).send();
            expect(response.status).to.eql(200);
            const responseEvent = response.body;
            expect(responseEvent.event).to.be.a('object');
            expect(responseEvent.event).to.include.keys('appname');
            expect(responseEvent.event).to.include.keys('type_event');
            expect(responseEvent.event.appname).to.be.a('string');
            expect(responseEvent.event.type_event).to.be.a('string');
            expect(responseEvent.event.appname).eql(item.appname);
            expect(responseEvent.event.type_event).eql(item.type_event);

        });


        it('Debería update un evento de storage', async () => {

            const tokenUser = faker.string.alphanumeric(100);

            const responseListado = await requestTest.get('/api/list').send();

            expect(responseListado.status).to.eql(200);

            const responseEvents = responseListado.body;

            const item = responseEvents.items[0];

            item.appname = "storageapi";
            item.type_event = "add_file";
            item.modify = new Date();

            const response = await requestTest.put(`/api/update/${item.uuid}`).set('Authorization',`Bearer ${tokenUser}`).send(item);
            expect(response.status).to.eql(201);
            const responseEvent = response.body;
            expect(responseEvent.event).to.be.a('object');
            expect(responseEvent.event).to.include.keys('appname');
            expect(responseEvent.event).to.include.keys('type_event');
            expect(responseEvent.event.appname).to.be.a('string');
            expect(responseEvent.event.type_event).to.be.a('string');
            expect(responseEvent.event.appname).eql("storageapi");
            expect(responseEvent.event.type_event).eql("add_file");

        });



    });
});