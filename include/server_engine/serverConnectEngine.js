const ws = require('ws');
const EventEmitter = require('events');
const emitter = new EventEmitter;
const config = require('../../config.json')
const {ServerGetterManagaer} = require('./serverGetters.js')
class ServerEngine extends EventEmitter {
    constructor(client) {
        super();
        this.wss;
        this.client = client;
        this.queue;
        this.serverGetterManager = new ServerGetterManagaer(client);
    }
    createConnect() {
        try {
            this.wss = new ws.Server({
                port: config.SERVER_PORT,
            }, () => { console.log(`⬜ Server Connection Is Enable Port - ${config.SERVER_PORT}`); this.status = 'online' })
            this.wss.on('connection', function connection(ws) {
                ws.on('message', async function (message) {
                    message = JSON.parse(message)
                    switch (message.event) {
                        case 'getServerInfo':
                            emitter.emit('BROADCAST_DATA', 'broadcastServerInfo', message.id)
                            break;
                        case 'getServerList':
                            emitter.emit('BROADCAST_DATA', 'broadcastServerData')
                            break;
                        case 'getCurrentPlayback':
                            emitter.emit('BROADCAST_DATA', 'broadcastCurrentPlayback', message.id)
                            break;
                        case 'getServerQueueFromDB':
                            emitter.emit('BROADCAST_DATA', 'broadcastDBServerQueue', message.id)
                            break;
                        case 'getServerQueueFromSR':
                            emitter.emit('BROADCAST_DATA', 'broadcastSRServerQueue', message.id)
                            break;
                    }
                })
            })
            emitter.on('BROADCAST_DATA', (data_type, id) => {
                switch (data_type) {
                    case 'broadcastServerData':
                        this.broadcastData('getServerList');
                        break;
                    case 'broadcastServerInfo':
                        this.broadcastData('getUserList', id);
                        break;
                    case 'broadcastCurrentPlayback':
                        this.broadcastData('getCurrentPlayback', id);
                        break;
                    case 'broadcastDBServerQueue':
                        this.broadcastData('getServerQueueFromDB', id);//WORKING BUT NOT OPTIMIZED METHOD! [be carefull with big data requests!]
                        break;
                    case 'broadcastSRServerQueue':
                        this.broadcastData('getServerQueueFromSR', id);//WORKING AND OPTIMIZED [be carefull with cpu and ram load!]
                        break;

                    default:
                        break;
                }
            })
        } catch (error) { console.log('🟥 Server Connection Error', error); this.status = 'offline'; this.emit('CHANGE') }
    }
    async broadcastData(mode, id) {
        let object;
        if (mode == 'getServerList' && !id) this.wss.clients.forEach(async client => {
            object = { data: await this.client.dataBaseEngine.getData(this.client.dataBaseEngine.Server, mode), type: 'serversData' }
            client.send(JSON.stringify(object))
        })
        else if (mode == 'getUserList' && id) this.wss.clients.forEach(async client => {
            object = { data: await this.client.dataBaseEngine.getData(this.client.dataBaseEngine.User, mode, id), type: 'serversInfoData' }
            client.send(JSON.stringify(object))
        })
        else if (mode == 'getCurrentPlayback' && id) this.wss.clients.forEach(async client => {
            object = { data: await this.client.dataBaseEngine.getData(this.client.dataBaseEngine.CurrentPlayback, mode, id), type: 'currentPlayback' }
            client.send(JSON.stringify(object))
        })
        else if (mode == 'getServerQueueFromDB' && id) this.wss.clients.forEach(async client => {
            object = { data: await this.client.dataBaseEngine.getData(this.client.dataBaseEngine.ServerQueue, mode, id), type: 'serverQueue' }
            client.send(JSON.stringify(object));
        })
        else if (mode == 'getServerQueueFromSR' && id) this.wss.clients.forEach(async client => {
            object = { data: await this.serverGetterManager.getServerQueueData(id.replace( /\s/g, '')), type: 'serverQueue' }
            client.send(JSON.stringify(object))
        })
        this.status = 'online';
    }

}
exports.ServerEngine = ServerEngine;