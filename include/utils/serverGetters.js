class ServerGetterManagaer {
    constructor(client) {
        this.client = client
    }

    async getServerQueueData(id) {
        const promise = new Promise(async (resolve, reject) => {
            let queue = this.client.queue.get(id)
            if (queue) {
                resolve(queue.songs)
            } else { resolve(null) }
        })
        return promise;
    }

    async getCurrentPlayback(id) {
        console.log(id);
        const promise = new Promise(async (resolve, reject) => {
            let queue = this.client.queue.get(id)
            if (queue && queue.current) {
                resolve(queue.current)
            } else if (!queue) {
                resolve(null);
            }
        })
        return promise;
    }

    async getServerUsers(serverId) {
        const promise = new Promise((resolve, reject) => {
            try {
                let array = [];
                let pushDelay;
                this.client.guilds.cache.forEach(async guild => {
                    if (serverId && guild.id == serverId) {  //WARNING HERE
                        await guild.members.fetch().then(async (list) => {
                            await list.forEach(async (user) => {
                                clearTimeout(pushDelay);
                                array.push(user);
                                pushDelay = setTimeout(() => { resolve(array) }, 1000);
                            })
                        })
                    }
                })
            } catch (error) { console.log('🟥 Data Base Update Error!', error); resolve(null) }
        })
        return promise
    }

    async getServers() {
        const promise = new Promise((resolve, reject) => {
            try {
                let array = [];
                let pushDelay;
                this.client.guilds.cache.forEach(async guild => {
                    clearTimeout(pushDelay);
                    array.push(guild);
                    pushDelay = setTimeout(() => { resolve(array) }, 1000);
                })

            } catch (error) { console.log('🟥 Data Base Update Error!', error); resolve(null) }
        })
        return promise
    }

    async getServer(serverId) {
        const promise = new Promise((resolve, reject) => {
            try {
                this.client.guilds.cache.forEach(async guild => {
                    if (guild.id == serverId) {resolve(guild)}
                })

            } catch (error) { console.log('🟥 Data Base Update Error!', error); resolve(null) }
        })
        return promise
    }


}
exports.ServerGetterManagaer = ServerGetterManagaer;