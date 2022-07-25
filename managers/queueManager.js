const EventEmitter = require('events');
class QueueManager extends EventEmitter {

  constructor(client, guild) {
    super();
    this.client = client;
    this.queue = guild.queue;
    this.guild = guild;
    this.status = 'pending';
    this.buffer = [];
  }

  setNextCurrentSong(params) {
    if (this.queue.current && this.queue.current.loop == true) return 0;
    else if (this.queue.loop == true) {
      let buffer = this.queue.current;
      if (params?.addSongToPrevQueue !== false) this.addSongToPrevQueue(buffer);
      this.queue.songs.push(buffer);
      this.queue.current = this.queue.songs[0];
      this.queue.songs.splice(0, 1);
    }
    else {
      if (params?.addSongToPrevQueue !== false) this.addSongToPrevQueue(this.queue.current);
      this.queue.current = this.queue.songs[0];
      this.queue.songs.splice(0, 1);
    }
  }

  clearQueue() {
    this.queue = this.guild.queue;
    if (this.queue == null) return 0;
    this.queue.songs = [];
    this.queue.current = null;
    this.queue.loop = false;
    this.queue.disconnectReason = "";
    this.queue.status = "pending";
  }

  clearStates() {
    this.queue.isSkipped = false;
    this.queue.isStopped = false;
    this.queue.isDestroyed = false;
  }

  static createQueue(guild, textChannel) {
    let queue = guild?.queue;
    if (queue) return queue;
    queue = {
      loop: false,
      status: "pending",
      isSkipped: false,
      isStopped: false,
      isDestroyed: false,
      disconnectReason: "",
      songs: [],
      prevSongs: [],
      current: null,
      guild: guild,
      textChannel: textChannel,
      voiceChannel: null,
    };
    guild.queue = queue;
    this.queue = queue;
    return queue;
  }

  static getQueue(client, guild) {
    return guild.queue;
  }

  addSongToPrevQueue(song) {
    try {
      this.queue.prevSongs.unshift(song);
      delete this.queue.prevSongs[this.guild.params?.maxPrevQueueSize || 4];
    } catch (err) { }
  }

  async pushSongsToQueue(songs) {
    let limit_reached = false;
    const promise = new Promise((resolve, reject) => {
      if (this.guild.params.maxQueueSize <= this.queue.songs?.length) {
        limit_reached = true;
        if (this.guild.params.strictLimits == true) reject("QUEUE_STRICT_LIMIT");
      }
      this.queue.songs = this.queue.songs.concat(songs);
      this.queue.songs.splice(this.guild.params.maxQueueSize, this.queue.songs.length);
      resolve({ songs: songs, limit_reached: limit_reached })
    })
    return await promise;
  }

}
exports.QueueManager = QueueManager;