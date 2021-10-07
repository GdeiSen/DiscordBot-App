const { queue_ } = require("./queue")
class queueMaster {
    constructor(client, message) {
        this.client = client;
        this.message = message;
        this.queue = new queue_;
    }
    getQueue() {
        return this.client.queue.get(this.message.guild.id);
    }
    async createQueue() {
        if (this.getQueue() != null) return await getQueue();
        else {
            this.queue.guild = this.message.guild;
            this.queue.channel = this.message.channel;
            this.message.client.queue.set(this.message.guild.id, this.queue);
        }
    }
    async deleteQueue() {
        if (this.getQueue() != null) this.client.queue.delete(this.message.guild.id);
    }
    async addSong(song) {
        if (this.getQueue() != undefined) {
            this.queue = this.getQueue();
            this.queue.songs.push(song);
            this.message.client.queue.set(this.message.guild.id, this.queue);
        } else {
            console.log("[WARNING] Queue auto create! \n(Init a queue create function!)");
            await this.createQueue();
            this.addSong(song);
        }
    }
    async addSongs(song_arr) {
        for (let index = 0; index < song_arr.length; index++) {
            await this.addSong(song_arr[index])
        }
    }
}
exports.queueMaster = queueMaster;