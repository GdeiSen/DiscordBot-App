const ws = require('ws');
const EventEmitter = require('events');
const emitter = new EventEmitter;
class ServerEngine extends EventEmitter {
    constructor(client) {
        super();
        this.wss;
        this.client = client;
    }
    createConnect() {
        try {
            this.wss = new ws.Server({
                port: 5000,
            }, () => { console.log(`⬜ Server Connection Is Enable Port - 5000`); this.status = 'online' })
            this.wss.on('connection', function connection(ws) {
                ws.on('message', async function (message) {
                    message = JSON.parse(message)
                    switch (message.event) {
                        case 'getinfo':
                            emitter.emit('broadcastServerInfo', message.id)
                            break;
                        case 'connection':
                            emitter.emit('broadcastServerData')
                            break;
                    }
                })
            })
            setTimeout(() => {
                if (this.wss.listenerCount() == 0) { this.status = 'offline', this.emit('CHANGE') }
            }, 1000);
            emitter.on('broadcastServerData', () => {
                this.broadcastData('servers');
            })
            emitter.on('broadcastServerInfo', async (id) => {
                this.broadcastData('users', id);
            })
        } catch (error) { console.log('🟥 Server Connection Error', error); this.status = 'offline'; this.emit('CHANGE') }
    }
    async broadcastData(mode, id) {
        let object;
        if (mode == 'servers' && !id) this.wss.clients.forEach(async client => { 
            object={data:await this.client.dataBaseEngine.getData(this.client.dataBaseEngine.Server),type:'serversData'}
            client.send(JSON.stringify(object)) 
        })
        else if (mode == 'users' && id) this.wss.clients.forEach(async client => { 
            object={data:await this.client.dataBaseEngine.getData(this.client.dataBaseEngine.User, id),type:'serversInfoData'}
            client.send(JSON.stringify(object)) 
        })
        this.status = 'online';

    }
}

exports.ServerEngine = ServerEngine;