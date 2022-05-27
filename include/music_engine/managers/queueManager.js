const EventEmitter = require('events');
class QueueManager extends EventEmitter {

  constructor(client, queue, guild) {
    super();
    this.client = client;
    this.queue = queue;
    this.guild = guild;
    this.status = 'pending';
    this.buffer = [];
  }

  queueSongsChanger() {
    try {
      if (this.queue.current && ((this.queue.config.loop == true && this.queue.songs.length == 0) || this.queue.current.loop == true)) {
        return 0;
      }
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
      this.queue = this.client.musicPlayer.getQueue(this.guild);
      if (this.queue == null) return 0;
      this.queue.songs = [];
      this.queue.current = null;
      this.queue.config.loop = false;
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] clearQueue function error!"); console.log(err); }
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
      if(!songs && songs?.length == 0) return 0;
      this.queue.songs = this.queue.songs.concat(songs);
    } catch (error) { console.log(error)}
  }


}
exports.QueueManager = QueueManager;