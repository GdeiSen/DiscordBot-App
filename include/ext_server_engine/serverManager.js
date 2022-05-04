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
    }

    async createConnect() {
        

        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) { throw error0; }
            connection.createChannel(function (error1, channel) {
                if (error1) { throw error1; }
                channel.assertQueue('rpc_queue', { durable: false });
                channel.prefetch(1);
                console.log('⬜️ Awaiting RPC requests');
                channel.consume('rpc_queue', function reply(msg) {
                    let content = JSON.parse(msg.content);
                    MessageEmitter.emit(msg.properties.correlationId, msg);
                    RequestEmitter.emit(content.request, {content: content, correlationId: msg.properties.correlationId});
                    ResolveEmitter.once(msg.properties.correlationId, (respond) => {
                        channel.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(respond)), {
                            correlationId: msg.properties.correlationId
                        });
                        console.log("Respond Was Sended!");
                    })

                    console.log("Request Was Catched!", content);
                    channel.ack(msg);
                });
            });
        });


        RequestEmitter.on('serverQueue', async (request)=>{
            let respond = {};
            respond.content = await this.serverGetterManager.getServerQueueData(request.content.serverId);
            respond.content == undefined ? respond.status = "500" : respond.status = "200"
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('currentPlayback', async (request)=>{
            let respond = {};
            respond.content = await this.serverGetterManager.getCurrentPlayback(request.content.serverId);
            respond.content == undefined ? respond.status = "500" : respond.status = "200"
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('serverUsers', async (request)=>{
            let respond = {};
            respond.content = await this.serverGetterManager.getServerUsers(request.content.serverId);
            respond.content == undefined ? respond.status = "500" : respond.status = "200"
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('servers', async (request)=>{
            let respond = {};
            respond.content = await this.serverGetterManager.getServers(request.content.serverId);
            respond.content == undefined ? respond.status = "500" : respond.status = "200"
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('skipSongFunction', async (request)=>{
            let respond = {};
            respond.status = "200"
            this.skipSongFunction(request.content.serverId);
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('removeSongFunction', async (request)=>{
            let respond = {};
            respond.status = "200"
            this.removeSongFunction(request.content.serverId, request.content.songIndex);
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('disconnectFunction', async (request)=>{
            let respond = {};
            respond.status = "200"
            this.disconnectFunction(request.content.serverId);
            ResolveEmitter.emit(request.correlationId, respond)
        })

        RequestEmitter.on('addSongFunction', (request)=>{
            
        })

        RequestEmitter.on('togglePauseSongFunction', (request)=>{
            let respond = {};
            respond.status = "200"
            this.togglePauseFunc(request.content.serverId);
            ResolveEmitter.emit(request.correlationId, respond)
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