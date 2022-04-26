const EventEmitter = require('events');
const emitter = new EventEmitter;
const config = require('../../config.json')
const { ServerGetterManagaer } = require('../utils/serverGetters.js');

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

class ExtServerEngine extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.queue;
        this.status = 'offline';
        this.serverGetterManager = new ServerGetterManagaer(client);
        this.app = express();
        this.server = http.createServer(this.app);
    }

    async createConnect() {
        this.io = new Server(this.server);
        this.io.on("connection", (socket) => {
            this.socket = socket;
            this.status = 'online';
            console.log(`⬜ Server Connection Is Enable. Port - [${config.SERVER_PORT}] With Id -[${socket.id}]`)
            socket.on('request', (message) => {
                this.emit('request', message);
            })
            socket.on('disconnect', () => {
                console.log('🟥 Server Socket Connection Error');
                this.status = 'offline';
            })
        });
        this.server.listen(config.SERVER_PORT);
        this.on('request', (message) => this.requestResolver(message))

        this.app.get('/currentPlayback/:dispatchId/:serverId', (req, res) => {
            this.broadcastCurrentPlayback(req.params.dispatchId, req.params.serverId);
        });
        this.app.get('/serverQueue/:dispatchId/:serverId', (req, res) => {
            this.broadcastCurrentPlayback(req.params.dispatchId, req.params.serverId);
        });
        this.app.get('/serverUsers/:dispatchId/:serverId', (req, res) => {
            this.broadcastCurrentPlayback(req.params.dispatchId, req.params.serverId);
        });
        this.app.get('/servers/:dispatchId/:serverId', (req, res) => {
            this.broadcastCurrentPlayback(req.params.dispatchId, req.params.serverId);
        });
        this.app.get('/currentPlayback/:dispatchId/:serverId', (req, res) => {
            this.broadcastCurrentPlayback(req.params.dispatchId, req.params.serverId);
        });
    }

    async requestResolver(request) {
        let args = request?.args;
        let dispatchId = request?.dispatchId;
        switch (request.path) {
            case 'currentPlayback': this.broadcastCurrentPlayback(dispatchId, args.serverId); break;
            case 'serverQueue': this.broadcastServerQueue(dispatchId, args.serverId); break;
            case 'serverUsers': this.broadcastServerUsers(dispatchId, args.serverId); break;
            case 'servers': this.broadcastServerList(dispatchId); break;
            case 'togglePauseSongFunction': this.togglePauseFunc(args.serverId); break;
            case 'skipSongFunction': this.skipSongFunction(args.serverId); break;
            case 'removeSongFunction': this.removeSongFunction(args.serverId); break;
            case 'disconnectFunction': this.disconnectFunction(args.serverId); break;
            case 'addSongFunction': this.addSongFunction(args.serverId); break;
            default: break;
        }
    }

    async broadcastServerQueue(dispatchId, serverId) {
        let message = {
            type: 'respond',
            data: await this.serverGetterManager.getServerQueueData(serverId),
            dataType: 'serverQueue',
            dispatchId: dispatchId
        }
        this.sendData(message);
    }

    async broadcastCurrentPlayback(dispatchId, serverId) {
        let message = {
            type: 'respond',
            data: await this.serverGetterManager.getCurrentPlayback(serverId),
            dataType: 'currentPlayback',
            dispatchId: dispatchId
        }
        this.sendData(message);
    }

    async broadcastServerUsers(dispatchId, serverId) {
        let message = {
            type: 'respond',
            data: await this.serverGetterManager.getServerUsers(serverId),
            dataType: 'serverUsers',
            dispatchId: dispatchId
        }
        this.sendData(message);
    }

    async broadcastServerList(dispatchId) {
        let message = {
            type: 'respond',
            data: await this.serverGetterManager.getServers(),
            dataType: 'servers',
            dispatchId: dispatchId
        }
        this.sendData(message);
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
        this.socket.emit(message.type, message);
    }

    async getData(message) {
        message.type = 'request';
        this.socket.emit('request', message);
    }

}
exports.ExtServerEngine = ExtServerEngine;