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

  async skip() {
    if (this.queue.status == 'paused') this.guild.playerManager.player.resume();
    if (this.queue.songs == 0) return { executionResult: false, currentState: this.queue.status, error: 'no_songs' };
    this.setNextCurrentSong();
    this.queue.status = 'pending';
    this.queue.isSkipped = true;
    await this.guild.playerManager.player.stop();
    this.guild.playerManager.startPlayback();
    return { executionResult: true, currentState: this.queue.status };
  }

  prev() {
    let prevSong = this.queue.prevSongs[0];
    if (this.queue?.current?.loop == true) return { executionResult: false, currentState: this.queue.status, error: 'loop_activated' };
    if (!prevSong) return { executionResult: false, currentState: this.queue.status, error: 'no_prev_song' };
    if (this.queue.status == 'paused') this.guild.playerManager.player.resume();
    this.queue.songs.unshift(this.queue.current);
    this.queue.songs.unshift(prevSong);
    this.queue.prevSongs.splice(0, 1);
    this.setNextCurrentSong({ addSongToPrevQueue: false });
    this.queue.status = 'pending';
    this.queue.isSkipped = true;
    this.guild.playerManager.player.stop();
    this.guild.playerManager.startPlayback();
    return { executionResult: true, currentState: this.queue.status };
  }

  skipTo(args) {
    if (!args) return { executionResult: false, error: 'no_args' };
    if (args > this.queue.songs.length) { return { executionResult: false, error: 'overrunning' } }
    else if (args == 1 || args <= 0) { this.skip(); return { executionResult: true } }
    if (this.queue.loop == true) {
      for (let i = 0; i < args - 1; i++) {
        this.queue.songs.push(this.queue.songs.shift());
      }
    } else { this.queue.songs = this.queue.songs.slice(args - 1); }
    this.setNextCurrentSong();
    this.queue.status = 'pending';
    this.queue.isSkipped = true;
    this.guild.playerManager.player.stop();
    this.guild.playerManager.startPlayback();
    return { executionResult: true }
  }

  shuffle() {
    let songs = this.queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    this.queue.songs = songs;
    return { executionResult: true };
  }

  remove(args) {
    args = Number(args);
    if (args > this.queue.songs.length) { return { executionResult: false, error: 'overrunning' } }
    else if (!args) { return { executionResult: false, error: 'incorrect_args' } }
    else if (typeof args == "number") { let song = this.queue.songs.splice(args - 1, 1); return { executionResult: true, removedSong: song } }
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