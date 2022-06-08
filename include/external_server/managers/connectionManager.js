const EventEmitter = require('events');
const express = require('express');
const http = require('http');
const { ConnectionManager } = require("../../../../RabbitMQConnectionUtil/index")
const { ServerController } = require("../controllers/serverController");
const { StatService } = require('../services/statService');
class ExtServerEngine extends EventEmitter {

    constructor(client) {
        super();
        this.serverController = new ServerController(client);
        this.client = client;
        this.status = 'offline';
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
            showLogs: false,
            name: "GATEWAY"
        })
        this.connectionManager.connect();
        this.createPlaybackListener();
        this.statService = new StatService(this.connectionManager);
    }

    createPlaybackListener() {
        this.client.musicPlayer.on('PLAYBACK_CHANGE', (queue) => {
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
        this.client.musicPlayer.on('SP_PLAYLIST_RESOLVED', (queue) => {
            this.statService.increaseStatsCount(queue.guild.id, "SPPlaylistCount");
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
        this.client.musicPlayer.on('YT_PLAYLIST_RESOLVED', (queue) => {
            this.statService.increaseStatsCount(queue.guild.id, "YTPlaylistCount")
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
        this.client.musicPlayer.on('YT_VIDEO_RESOLVED', (queue) => {
            this.statService.increaseStatsCount(queue.guild.id, "YTSongCount");
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
        this.client.musicPlayer.on('SP_TRACK_RESOLVED', (queue) => {
            this.statService.increaseStatsCount(queue.guild.id, "SPSongCount");
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
        this.client.musicPlayer.on('QUEUE_ENDED', (queue) => {
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
        this.client.musicPlayer.on('PLAYBACK_STARTED', (queue) => {
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id });
            this.statService.increaseStatsCount(queue.guild.id, "playbackCount");
        })
        this.client.musicPlayer.on('PLAYBACK_STOPPED', (queue) => {
            this.connectionManager.post({ name: "playbackChange", serverId: queue.guild.id })
        })
    }

    async createRouter() {
        this.connectionManager.InputRequestEmitter.on('request', () => { this.serverController.updateClientState(this.client) })
        this.connectionManager.addRoute('serverQueue', this.serverController.getServerQueueData)
        this.connectionManager.addRoute('currentPlayback', this.serverController.getCurrentPlayback)
        this.connectionManager.addRoute('userList', this.serverController.getServerUsers)
        this.connectionManager.addRoute('serverList', this.serverController.getServers)
        this.connectionManager.addRoute('server', this.serverController.getServer)
        this.connectionManager.addRoute('skipSongFunction', this.serverController.skipSongFunction)
        this.connectionManager.addRoute('removeSongFunction', this.serverController.removeSongFunction)
        this.connectionManager.addRoute('disconnectFunction', this.serverController.disconnectFunction)
        this.connectionManager.addRoute('togglePauseSongFunction', this.serverController.togglePauseFunc)
        this.connectionManager.addRoute('status', (request, responce) => { responce.send('connected') });
    }

}
exports.ExtServerEngine = ExtServerEngine;