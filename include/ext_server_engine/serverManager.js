const EventEmitter = require('events');
const MessageEmitter = new EventEmitter;
const ResolveEmitter = new EventEmitter;
const RequestEmitter = new EventEmitter;
const config = require('../../config.json')
const { ServerGetterManagaer } = require('../utils/serverGetters.js');
const amqp = require('amqplib/callback_api');
const express = require('express');
const http = require('http');

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

    async createConnect() {
        const self = this;
        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) { throw error0; }
            connection.createChannel(function (error1, channel) {
                self.channel = channel;
                if (error1) { throw error1; }
                channel.assertQueue('rpc_queue', { durable: false });
                channel.prefetch(1);
                console.log('⬜️ Awaiting RPC requests');
                channel.consume('rpc_queue', function reply(msg) {
                    let parsedContent = JSON.parse(msg.content);
                    msg.content = parsedContent;
                    MessageEmitter.emit('message', msg);
                    if(msg.properties.type == 'request') RequestEmitter.emit(msg.content.request, msg);
                    channel.ack(msg);
                });
                self.createProcessingQueueResolver();
            });
        });

        RequestEmitter.on('serverQueue', async (request) => {
            let respond = {
                content: await this.serverGetterManager.getServerQueueData(request.content.serverId),
                contentType: 'serverQueue'
            };
            ResolveEmitter.emit('resolved', request, respond)
        })

        RequestEmitter.on('currentPlayback', async (request) => {
            let respond = {
                content: await this.serverGetterManager.getCurrentPlayback(request.content.serverId),
                contentType: 'currentPlayback'
            };
            ResolveEmitter.emit('resolved', request, respond)
        })

        RequestEmitter.on('serverUsers', async (request) => {
            let respond = {
                content: await this.serverGetterManager.getServerUsers(request.content.serverId),
                contentType: 'serverUsers'
            };
            respond.content = await this.serverGetterManager.getServerUsers(request.content.serverId);
            ResolveEmitter.emit('resolved', request, respond)
        })

        RequestEmitter.on('servers', async (request) => {
            let respond = {
                content: await this.serverGetterManager.getServers(),
                contentType: 'servers'
            };
            respond.content = await this.serverGetterManager.getServers(request.content.serverId);
            ResolveEmitter.emit('resolved', request, respond)
        })

        RequestEmitter.on('skipSongFunction', async (request) => {
            let respond = {
                status: '200',
                contentType: 'skipSongFunction'
            };
            this.skipSongFunction(request.content.serverId);
            if (!request.correlationId) return 0;
            ResolveEmitter.emit('resolved', request, respond)
        })

        RequestEmitter.on('removeSongFunction', async (request) => {
            let respond = {
                status: '200',
                contentType: 'removeSongFunction'
            };
            this.removeSongFunction(request.content.serverId, request.content.songIndex);
            if (!request.correlationId) return 0;
            ResolveEmitter.emit('resolved', request, respond)
        })

        RequestEmitter.on('disconnectFunction', async (request) => {
            let respond = {
                status: '200',
                contentType: 'disconnectFunction'
            };
            this.disconnectFunction(request.content.serverId);
            if (!request.correlationId) return 0;
            ResolveEmitter.emit('resolved', request, respond)
        })

        // RequestEmitter.on('addSongFunction', (request) => {

        // })

        RequestEmitter.on('togglePauseSongFunction', (request) => {
            let respond = {
                status: '200',
                contentType: 'togglePauseSongFunction'
            };
            this.togglePauseFunc(request.content.serverId);
            if (!request.correlationId) return 0;
            respond.contentType = 'servers';
            ResolveEmitter.emit('resolved', request, respond)
        })
    }

    createProcessingQueueResolver() {
        MessageEmitter.on('message', (msg) => {
            this.processingQueue.set(msg.properties.correlationId, msg);
            console.log(`[ ${this.processingQueue.size} ]<----(${msg.content.request} request)----=`);
        })
        ResolveEmitter.on('resolved', (request, respond) => {
            let queueElement = this.processingQueue.get(request.properties.correlationId);
            if (!queueElement) console.log('Unidentified Request Was Resolved!');
            if (!request.properties.replyTo) console.log('Unable To Get Recipient!');
            this.processingQueue.delete(request.properties.correlationId);
            console.log(`[ ${this.processingQueue.size} ]=----(responce)---->`);
            this.channel.sendToQueue(request.properties.replyTo,
                Buffer.from(JSON.stringify(respond)), {
                correlationId: request.properties.correlationId
            });
        })
    }

    async togglePauseFunc(serverId) {
        let queue = this.client.queue.get(serverId)
        queue.playerMaster.togglePause();
    }

    async skipSongFunction(serverId) {
        let queue = this.client.queue.get(serverId)
        queue.playerMaster.skip();
    }

    async removeSongFunction(serverId, songIndex) {
        let queue = this.client.queue.get(serverId, songIndex);
        queue.playerMaster.remove(data.songIndex);
    }

    async disconnectFunction(serverId) {
        let queue = this.client.queue.get(serverId);
        queue.playerMaster.disconnect();
    }

    // async addSongFunction(serverId) {
    //     let queue = this.client.queue.get(serverId);
    //     queue.playerMaster.disconnect();
    // }

}
exports.ExtServerEngine = ExtServerEngine;