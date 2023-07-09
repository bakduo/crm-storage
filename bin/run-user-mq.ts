
import {appconfig, loggerApp} from '../src/configure/configure-app';

import {ControlMessageMonitor, MQservice} from '../src/services-layer/message';

const crm = ControlMessageMonitor.getInstance();

const mqs = MQservice.getInstance(appconfig.message.apps.user.queuename,appconfig.message.apps.user.exchname,appconfig.message.apps.user.routerkey);

const run = async () =>{

    await mqs.connect(appconfig.message.server,appconfig.message.port,appconfig.message.apps.user.vhost,appconfig.message.username,appconfig.message.password);

    await mqs.getChannel();
    
    await mqs.configureChannelForConsume();
    
    await crm.runUserQueue(mqs);
};

run();


process.on('SIGINT', function() {

    const mq = MQservice.getInstance(appconfig.message.apps.user.queuename,appconfig.message.apps.user.exchname,appconfig.message.apps.user.routerkey);

    mq.closeChannel()
    .then(()=>{
        mq.closeConnection()
        .then(()=>{
            process.exit(0);
        })
        .catch((error)=>{
            loggerApp.error(`Error al cerrar conexión de mq..${error}`);
            process.exit(1);
        })
    })
    .catch((error)=>{
        loggerApp.error(`Error al cerrar canal de mq..${error}`);
        process.exit(1);
    });

    console.log(`Exit process.`);

    process.exit(0);

});