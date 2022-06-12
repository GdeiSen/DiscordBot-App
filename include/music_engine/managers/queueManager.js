const EventEmitter = require('events');
const embedManager = require("./embedManager.js")
const { PlayerManager } = require("./playerManager");
const { QueryResolver } = require("./queryResolver");
const { Queue } = require("../objects/queue");
class QueueManager extends EventEmitter {

  constructor(client, queue, guild) {
    super();
    this.client = client;
    this.queue = queue;
    this.guild = guild;
    this.status = 'pending';
    this.buffer = [];
  }

  skip() {
    try {
      if (this.queue.current && ((this.queue.config.loop == true && this.queue.songs.length == 0) || this.queue.current.loop == true)) return 0;
      else if (this.queue.config.loop == true) {
        let buffer = this.queue.current;
        this.queue.current = this.queue.songs[0];
        this.queue.songs.splice(0, 1);
        this.queue.songs.push(buffer)
      }
      else {
        this.queue.current = this.queue.songs[0];
        this.queue.songs.splice(0, 1);
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] queueSongsChanger function error'); return 0 }
  }

  async clearQueue() {
    try {
      this.queue = QueueManager.getQueue(this.client, this.guild)
      if (this.queue == null) return 0;
      this.queue.songs = [];
      this.queue.current = null;
      this.queue.config.loop = false;
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] clearQueue function error!"); console.log(err); }
  }

  static createQueue(client, guild) {
    let queue = QueueManager.getQueue(client, guild);
    if (!queue) { queue = new Queue(); client.queue.set(guild.id, queue) }
    queue.guild = guild;
    queue.playerManager ??= new PlayerManager(client, queue, guild);
    queue.queryResolver ??= new QueryResolver();
    queue.queueManager ??= new QueueManager(client, queue, guild);
    queue.embedManager ??= embedManager;
    return queue;
  }

  static getQueue(client, guild) {
    return client.queue.get(guild.id);
  }

  async addSongToBuffer(song, option) {
    try {
      this.buffer.push(song);
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] getYTSongUrl function error!");
    }
  }

  async pushBufferToQueue(buffer, option) {
    try {
      this.queue.songs = this.queue.songs.concat(buffer);
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] pushBufferToQueue function error!");
    }
  }

  async pushSongToQueue(song) {
    try {
      this.queue.songs.push(song);
    } catch (error) { }
  }

  async pushSongsToQueue(songs) {
    try {
      this.queue.songs = this.queue.songs.concat(songs);
    } catch (error) { console.log(error)}
  }


}
exports.QueueManager = QueueManager;