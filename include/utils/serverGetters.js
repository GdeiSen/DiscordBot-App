class ServerGetterManagaer {
    constructor(client) {
        this.client = client
    }

    async getServerQueueData(id) {
        const promise = new Promise(async (resolve, reject) => {
            let queue = this.client.queue.get(id)
            let object;
            let pushDelay;
            let array = [];
            let index = 0;
            if (queue) {
                queue.songs.forEach(song => {
                    clearTimeout(pushDelay);
                    index++;
                    object = {
                        Id: index,
                        Song: song,
                    }
                    array.push(object);
                    pushDelay = setTimeout(() => { resolve(array) }, 1000);
                });
            } else { resolve(null) }
        })
        return promise;
    }

    async getCurrentPlayback(id) {
        const promise = new Promise(async (resolve, reject) => {
            let queue = this.client.queue.get(id)
            let object;
            if (queue && queue.current) {
                object = {
                    ServerId: id,
                    Song: queue.current,
                    QueueLoop: queue.config.loop,
                    SongLoop: queue.current.loop,
                    Volume: queue.config.volume,
                }
                resolve(object)
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
                    if (serverId && guild.id !== serverId) return 0;//WARNING HERE
                    await guild.members.fetch().then(async (list) => {
                        await list.forEach(async (user) => {
                            clearTimeout(pushDelay);
                            let object = {
                                UserName: user.user.username,
                                UserId: user.user.id,
                                UserServerId: user.guild.id,
                            }
                            array.push(object);
                            pushDelay = setTimeout(() => { resolve(array) }, 1000);
                        })
                    })
                })
            } catch (error) { console.log('🟥 Data Base Update Error!', error) }
        })
        return promise
    }

    async getServers() {
        const promise = new Promise((resolve, reject) => {
            try {
                let array = [];
                let pushDelay;
                this.client.guilds.cache.forEach(async element => {
                    clearTimeout(pushDelay);
                    let object = {
                        ServerName: element.name,
                        ServerId: element.id,
                        MemberCount: element.memberCount
                    }
                    array.push(object);
                    pushDelay = setTimeout(() => { resolve(array) }, 1000);
                })

            } catch (error) { console.log('🟥 Data Base Update Error!', error) }
        })
        return promise
    }


}
exports.ServerGetterManagaer = ServerGetterManagaer;