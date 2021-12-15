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
            if (queue) {
                queue.songs.forEach(song => {
                    clearTimeout(pushDelay);
                    object = {
                        Songname: song.title,
                        SongUrl: song.url
                    }
                    array.push(object);
                    pushDelay = setTimeout(() => { resolve(array) }, 1000);
                });
            }else{resolve(null)}
        })
        return promise;
    }
}
exports.ServerGetterManagaer = ServerGetterManagaer;