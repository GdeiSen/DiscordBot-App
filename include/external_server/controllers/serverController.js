const { ServerGetterManager } = require("../../utils/serverGetters");
let serverGetterManager;
let client
exports.ServerController = class ServerController {

    constructor(client) {
        client = client;
        serverGetterManager = new ServerGetterManager(client);
    }

    updateClientState(_client){
        client = _client;
    }   

    async togglePauseFunc(request, responce) {
        try {
            let queue = client.queue.get(request.serverId)
            queue.playerManager.togglePause();
        } catch (err) { console.log(err) }
    }

    async skipSongFunction(request, responce) {
        try {
            let queue = client.queue.get(request.serverId)
            queue.playerManager.skip();
        } catch (err) { console.log(err) }
    }

    async removeSongFunction(request, responce) {
        try {
            let queue = client.queue.get(request.serverId);
            queue.playerManager.remove(songIndex);
        } catch (err) { console.log(err) }
    }

    async getServerQueueData(request, responce) {
        try {
            responce.send(await serverGetterManager.getServerQueueData(request.serverId))
        } catch (err) { console.log(err) }
    }

    async getServerUsers(request, responce) {
        try {
            responce.send(await serverGetterManager.getServerUsers(request.serverId))
        } catch (err) { console.log(err) }
    }

    async getServers(request, responce) {
        try {
            responce.send(await serverGetterManager.getServers());
        } catch (err) { console.log(err) }
    }

    async getServer(request, responce) {
        try {
            responce.send(await serverGetterManager.getServer(request.serverId))
        } catch (err) { console.log(err) }
    }

    async getCurrentPlayback(request, responce) {
        try {
            responce.send(await serverGetterManager.getCurrentPlayback(request.serverId))
        } catch (err) { console.log(err) }
    }
}
