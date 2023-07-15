import { app } from '../src/app';
import {appconfig, loggerApp} from '../src/configure/configure-app';

const puerto = appconfig.port || 8081;

const server = app.listen(puerto, async () => {
    loggerApp.debug(`servidor escuchando en http://localhost:${puerto}`);
});

server.on('error', error => {
    loggerApp.debug(`Error server:${error.message}`);
    process.exit(1);
});

process.on('SIGINT', function() {
    loggerApp.debug(`Exit program`);
    process.exit(0);

});