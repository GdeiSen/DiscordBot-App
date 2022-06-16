const EventEmitter = require('events');
const embedManager = require("./embedManager.js")
const { PlayerManager } = require("./playerManager");
const { QueryResolver } = require("./queryResolver");
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
      if (this.queue.status == 'paused') this.queue.playerManager.player.resume();
      this.setNextCurrentSong();
      this.queue.status = 'pending';
      this.queue.stopReason = 'skipped';
      this.queue.playerManager.player.stop();
      this.queue.playerManager.startPlayback();
      return { executionResult: true, currentState: this.queue.status };
    } catch (err) { console.log(err); return 0 }
  }

  prev() {
    try {
      let prevSong = this.queue.prevSongs[0];
      if (this.queue?.current?.loop == true) return { executionResult: false, currentState: this.queue.status, error: 'loop_activated' };
      if (!prevSong) return { executionResult: false, currentState: this.queue.status, error: 'no_prev_song' };
      if (this.queue.status == 'paused') this.queue.playerManager.player.resume();
      this.queue.songs.unshift(this.queue.current);
      this.queue.songs.unshift(prevSong);
      this.queue.prevSongs.splice(0, 1);
      this.setNextCurrentSong({ addSongToPrevQueue: false });
      this.queue.status = 'pending';
      this.queue.stopReason = 'skipped';
      this.queue.playerManager.player.stop();
      this.queue.playerManager.startPlayback();
      return { executionResult: true, currentState: this.queue.status };
    } catch (err) { return 0 }
  }

  skipTo(args) {
    try {
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
      this.queue.stopReason = 'skipped';
      this.queue.playerManager.player.stop();
      this.queue.playerManager.startPlayback();
      return { executionResult: true }
    } catch (err) { return 0 }
  }

  shuffle() {
    try {
      let songs = this.queue.songs;
      for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
      this.queue.songs = songs;
      return { executionResult: true };
    } catch (err) { return 0 }
  }

  remove(args) {
    if (!isArray(args)) {
      const song = this.queue.songs.splice(args, 1);
      return { executionResult: true, song: song };
    }
    if (args > this.queue.songs.length || args[0] == 0) { return { executionResult: false, error: 'overrunning' } }
    else if (!args || isNaN(args[0])) { return { executionResult: false, error: 'incorrect_args' } }
    else { const song = this.queue.songs.splice(args - 1, 1); return { executionResult: true, removedSong: song } }
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

  async clearQueue() {
    try {
      this.queue = this.client.queue.get(this.guild.id);
      if (this.queue == null) return 0;
      this.queue.songs = [];
      this.queue.current = null;
      this.queue.loop = false;
      this.queue.stopReason = "";
      this.queue.status = "pending";
    } catch (err) { console.log(err); }
  }

  static createQueue(client, guild, textChannel) {
    let params = client.guildParams.get(guild.id) || {};
    let queue = client.queue.get(guild.id);
    if (queue) return queue;
    queue = {
      loop: false,
      status: "pending",
      songs: [],
      prevSongs: [],
      current: null,
      guild: guild,
      textChannel: textChannel,
      voiceChannel: null,
      embedManager: embedManager,
    };
    queue.playerManager = new PlayerManager(client, queue, guild);
    queue.queryResolver = new QueryResolver();
    queue.queueManager = new QueueManager(client, queue, guild);
    client.queue.set(guild.id, queue)
    return queue;
  }

  static getQueue(client, guild) {
    return client.queue.get(guild.id);
  }

  addSongToPrevQueue(song) {
    try {
      let params = this.client.guildParams.get(this.guild.id) || {};
      this.queue.prevSongs.unshift(song);
      delete this.queue.prevSongs[params?.prevQueueLength || 4];
    } catch (err) { }
  }

  async pushSongsToQueue(songs) {
    try {
      let params = this.client.guildParams.get(this.guild.id) || {};
      if (params.maxQueueSize < this.queue.songs?.length) { this.emit("QUEUE_MAX_LIMIT"); return 0 }
      this.queue.songs = this.queue.songs.concat(songs);
    } catch (error) { console.log(error) }
  }


}
exports.QueueManager = QueueManager;