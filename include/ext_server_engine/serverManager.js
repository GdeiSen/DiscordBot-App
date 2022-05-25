const EventEmitter = require('events');
const { ServerGetterManagaer } = require('../utils/serverGetters.js');
const express = require('express');
const http = require('http');
const { ConnectionManager } = require("../../../RabbitMQConnectionUtil/index")
class ExtServerEngine extends EventEmitter {

    constructor(client) {
        super();
        this.client = client;
        this.status = 'offline';
        this.serverGetterManager = new ServerGetterManagaer(client);
        this.app = express();
        this.app.use
        this.server = http.createServer(this.app);
        this.processingQueue = new Map;
    }

    async connect() {
        this.connectionManager = new ConnectionManager({
            durable: false,
            consumeOn: "app_queue",
            dispatchTo: "app_gateway_queue",
            showInfoTable: true,
            name: "GATEWAY"
        })
        this.connectionManager.connect();
    }

    async createRouter() {
        this.connectionManager.addRoute('serverQueue', async (request, responce) => { responce.send(await this.serverGetterManager.getServerQueueData(request.serverId)) })
        this.connectionManager.addRoute('currentPlayback', async (request, responce) => { responce.send(await this.serverGetterManager.getCurrentPlayback(request.serverId)) })
        this.connectionManager.addRoute('userList', async (request, responce) => { responce.send(await this.serverGetterManager.getServerUsers(request.serverId)) })
        this.connectionManager.addRoute('serverList', async (request, responce) => { responce.send(await this.serverGetterManager.getServers(request.serverId)) })
        this.connectionManager.addRoute('server', async (request, responce) => { responce.send(await this.serverGetterManager.getServer(request.serverId)); })
        this.connectionManager.addRoute('skipSongFunction', async (request, responce) => { this.skipSongFunction(request.serverId); responce.send(true) })
        this.connectionManager.addRoute('removeSongFunction', async (request, responce) => { this.removeSongFunction(request.serverId, request.songIndex); responce.send(true) })
        this.connectionManager.addRoute('disconnectFunction', async (request, responce) => { this.disconnectFunction(request.serverId); responce.send(true) })
        this.connectionManager.addRoute('togglePauseSongFunction', (request, responce) => { this.togglePauseFunc(request.serverId); responce.send(true) })
        this.connectionManager.addRoute('testFunction', async (request, responce) => { responce.send(true) })
    }

    async togglePauseFunc(serverId) {
        try {
            let queue = this.client.queue.get(serverId)
            queue.playerManager.togglePause();
        } catch (err) { }
    }

    async skipSongFunction(serverId) {
        try {
            let queue = this.client.queue.get(serverId)
            queue.playerManager.skip();
        } catch (err) { }
    }

    async removeSongFunction(serverId, songIndex) {
        try {
            let queue = this.client.queue.get(serverId, songIndex);
            queue.playerManager.remove(songIndex);
        } catch (err) { }
    }

    async disconnectFunction(serverId) {
        try {
            let queue = this.client.queue.get(serverId);
            queue.playerManager.disconnect();
        } catch (err) { }
    }

}
exports.ExtServerEngine = ExtServerEngine;