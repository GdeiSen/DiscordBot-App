const EventEmitter = require('events');
const emitter = new EventEmitter;
const config = require('../../config.json')
const { ServerGetterManagaer } = require('../utils/serverGetters.js');
const ws = require('ws');

class ExtServerEngine extends EventEmitter {
    constructor(client) {
        super();
        this.wss;
        this.client = client;
        this.queue;
        this.status = 'offline';
        this.serverGetterManager = new ServerGetterManagaer(client);
    }
    async createConnect() {
        try {
            this.wss = new ws.Server({
                port: config.SERVER_PORT,
            }, () => { console.log(`⬜ Server Connection Is Enable Port - ${config.SERVER_PORT}`) })
            this.wss.on('connection', function connection(ws) {
                ws.on('message', async function (message) {
                    message = JSON.parse(message)
                    emitter.emit('message', message);
                })
            })

            emitter.on('message', (message) => {
                this.status = 'online'
                this.functionSelector(message);
            })
        } catch (error) { console.log('🟥 Server Connection Error', error); this.status = 'offline'; this.emit('CHANGE') }
    }

    async functionSelector(message) {
        let request = message.request;
        let data = message.data;
        switch (request.name) {
            case 'getCurrentPlayback': this.broadcastData(message); break;
            case 'getServerQueue': this.broadcastData(message); break;
            case 'getServerUsers': this.broadcastData(message); break;
            case 'getServers': this.broadcastData(message); break;

            case 'togglePauseSongFunction': this.togglePauseFunc(data); break;
            case 'skipSongFunction': this.skipSongFunction(data); break;
            case 'removeSongFunction': this.removeSongFunction(data); break;
            case 'disconnectFunction': this.disconnectFunction(data); break;
            case 'addSongFunction': this.addSongFunction(data); break;
            default: break;
        }
    }

    async broadcastData(message) {
        let request = message.request.name;
        let data = message.data;
        let object = {requestMessage: message};
        if (request == 'getServerQueue' && data.serverId) {
            object.data = await this.serverGetterManager.getServerQueueData(data.serverId.replace(/\s/g, '')) 
            object.type = 'serverQueue';
            this.sendData(object);
        }
        else if (request == 'getCurrentPlayback' && data.serverId) {
            object.data = await this.serverGetterManager.getCurrentPlayback(data.serverId.replace(/\s/g, ''));
            object.type = 'currentPlayback';
            this.sendData(object);
        }
        else if (request == 'getServerUsers' && data.serverId) {
            object.data = await this.serverGetterManager.getServerUsers(data.serverId.replace(/\s/g, ''));
            object.type = 'serverUsers';
            this.sendData(object);
        }
        else if (request == 'getServers') {
            object.data = await this.serverGetterManager.getServers();
            object.type = 'servers';
            this.sendData(object);
        }
    }

    async togglePauseFunc(data) {
        let queue = this.client.queue.get(data.serverId.replace(/\s/g, ''))
        queue.playerMaster.togglePause();
    }

    async skipSongFunction(data) {
        let queue = this.client.queue.get(data.serverId.replace(/\s/g, ''))
        queue.playerMaster.skip();
    }

    async removeSongFunction(data) {
        let queue = this.client.queue.get(data.serverId.replace(/\s/g, ''));
        queue.playerMaster.remove(data.songIndex);
    }

    async disconnectFunction(data) {
        let queue = this.client.queue.get(data.serverId.replace(/\s/g, ''));
        queue.playerMaster.disconnect();
    }

    async addSongFunction(data) {
        let queue = this.client.queue.get(data.serverId.replace(/\s/g, ''));
        queue.playerMaster.disconnect();
    }

    async sendData(message) {
        this.wss.clients.forEach(async client => {
            client.send(JSON.stringify(message));
        })
    }

}
exports.ExtServerEngine = ExtServerEngine;