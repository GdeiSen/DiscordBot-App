const { QueueManager } = require("./managers/queueManager.js");
const { PlayerManager } = require("./managers/playerManager");
const { QueryResolver } = require("./managers/queryResolver");
const { Queue } = require("./objects/queue");
const EventEmitter = require("events");
const embedManager = require("./managers/embedManager.js")
class MusicPlayer extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
  }
  async createListeners(queue) {
    queue.queryResolver.on("ERROR", () => { embedManager.sendNotFoundEmbed(queue.playerManager.textChannel); this.emit('ERROR') });
    queue.queryResolver.on("SP_PLAYLIST_RESOLVE_START", () => {
      embedManager.sendPlaylistLoadingEmbed(queue.playerManager.textChannel);
    });
    queue.queryResolver.on("SP_PLAYLIST_RESOLVED", (playlist) => {
      embedManager.sendPlaylistAddedEmbed(playlist, queue.playerManager.textChannel);
      this.emit('SP_PLAYLIST_RESOLVED', queue);
    });
    queue.queryResolver.on("YT_PLAYLIST_RESOLVED", (playlist) => {
      this.emit('YT_PLAYLIST_RESOLVED', queue);
      embedManager.sendPlaylistAddedEmbed(playlist, queue.playerManager.textChannel);
    });
    queue.queryResolver.on("YT_VIDEO_RESOLVED", (song) => {
      this.emit('YT_VIDEO_RESOLVED', queue);
      embedManager.sendSongAddedEmbed(song, queue.playerManager.textChannel);
    });
    queue.queryResolver.on("SP_TRACK_RESOLVED", (song) => {
      this.emit('SP_TRACK_RESOLVED', queue);
      embedManager.sendSongAddedEmbed(song, queue.playerManager.textChannel);
    });
    queue.playerManager.on("QUEUE_ENDED", (queue) => {
      this.emit('QUEUE_ENDED', queue);
      embedManager.sendPlaybackStoppedEmbed(queue.playerManager.textChannel);
    });
    queue.playerManager.on("PLAYBACK_STARTED", (queue) => {
      this.emit('PLAYBACK_STARTED', queue);
      embedManager.sendSongEmbed(queue, queue.playerManager.textChannel); this.emit('PLAYBACK_CHANGE', queue);
    });
    queue.playerManager.on("PLAYBACK_STOPPED", (queue) => {
      this.emit('PLAYBACK_STOPPED', queue);

    });
    queue.playerManager.on("ERROR", (err) => { queue.playerManager.stop(); queue.playerManager.textChannel.send(err) });
  }


  async play(message, args, options) {
    let queue = this.createQueue(this.client, message.guild);
    queue.playerManager.textChannel = message.channel;
    if (queue.playerManager.listeners("PLAYBACK_STARTED").length == 0) { this.createListeners(queue) };
    if (options?.searchType == 'playlist') queue.queueManager.pushSongsToQueue(await queue.queryResolver.search(args, message, { searchType: 'playlist' }));
    else queue.queueManager.pushSongsToQueue(await queue.queryResolver.search(args, message));
    console.log(queue.status);
    if (queue.status !== "playing") queue.playerManager.startPlayback(message.member.voice.channel);
  }

  createQueue(client, guild) {
    let queue = this.getQueue(guild);
    if (!queue) { queue = new Queue(); this.client.queue.set(guild.id, queue) }
    if (!queue.guild) queue.guild = guild;
    if (!queue?.playerManager) { queue.playerManager = new PlayerManager(client, queue, guild); }
    if (!queue?.queueManager) queue.queueManager = new QueueManager(client, queue, guild);
    if (!queue?.queryResolver) queue.queryResolver = new QueryResolver();
    if (!queue?.embedManager) queue.embedManager = embedManager;
    return queue;
  }

  async addSong(queue, query) {
    queue.queueManager.pushSongsToQueue(
      await queue.queryResolver.search(query, message)
    );
    embeds.sendSongAddedEmbed(queue.songs, message);
  }

  getQueue(guild) {
    return this.client.queue.get(guild.id);
  }
}
exports.MusicPlayer = MusicPlayer;
