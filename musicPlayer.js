const { QueueManager } = require("./managers/queueManager.js");
const EventEmitter = require("events");
const embedManager = require("./managers/embedManager.js")
class MusicPlayer extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
  }

  async createListeners(queue) {
    queue.queryResolver.on("ERROR", () => {
      embedManager.sendNotFoundEmbed(queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id)); this.emit('ERROR')
    });
    queue.queryResolver.on("SP_PLAYLIST_RESOLVE_START", () => {
      embedManager.sendPlaylistLoadingEmbed(queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.queryResolver.on("SP_PLAYLIST_RESOLVED", (playlist) => {
      embedManager.sendPlaylistAddedEmbed(playlist, queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
      this.emit('SP_PLAYLIST_RESOLVED', queue);
    });
    queue.queryResolver.on("PLAYLIST_MAX_LIMIT", () => {
      embedManager.sendPlaylistLimitEmbed(queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.playerManager.on("PLAYBACK_MAX_LIMIT", () => {
      this.emit('QUEUE_ENDED', queue);
      embedManager.sendPlaybackLimitEmbed(queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.queueManager.on("QUEUE_MAX_LIMIT", () => {
      embedManager.sendQueueLimitEmbed(queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.queryResolver.on("YT_PLAYLIST_RESOLVED", (playlist) => {
      this.emit('YT_PLAYLIST_RESOLVED', queue);
      embedManager.sendPlaylistAddedEmbed(playlist, queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.queryResolver.on("YT_VIDEO_RESOLVED", (song) => {
      this.emit('YT_VIDEO_RESOLVED', queue);
      embedManager.sendSongAddedEmbed(song, queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.queryResolver.on("SP_TRACK_RESOLVED", (song) => {
      this.emit('SP_TRACK_RESOLVED', queue);
      embedManager.sendSongAddedEmbed(song, queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.playerManager.on("QUEUE_ENDED", (queue) => {
      this.emit('QUEUE_ENDED', queue);
      embedManager.sendPlaybackStoppedEmbed(queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id));
    });
    queue.playerManager.on("PLAYBACK_STARTED", (queue) => {
      this.emit('PLAYBACK_STARTED', queue);
      embedManager.sendSongEmbed(queue, queue.playerManager.textChannel, this.client.guildParams.get(queue.guild.id)); this.emit('PLAYBACK_CHANGE', queue);
      queue.playerManager.setPlaybackTimeout();
    });
    queue.playerManager.on("PLAYBACK_STARTING", (queue) => {
      queue.playerManager.clearPlaybackTimeout();
      queue.playerManager.clearStayTimeout();
      queue.playerManager?.textChannel?.activeSongEmbed?.delete().catch(() => { })
      queue.playerManager?.textChannel?.activeNowPlayingEmbed?.delete().catch(() => { });
    });
    queue.playerManager.on("PLAYBACK_STOPPED", (queue) => {
      this.emit('PLAYBACK_STOPPED', queue);
      queue.playerManager.setStayTimeout();
      queue.playerManager?.textChannel?.activeSongEmbed?.delete().catch(() => { });
      queue.playerManager?.textChannel?.activeQueueEmbed?.delete().catch(() => { });
      queue.playerManager?.textChannel?.activeNowPlayingEmbed?.delete().catch(() => { });
    });
    queue.playerManager.on("DISCONNECTED", (queue) => {
      queue.playerManager?.textChannel?.activeSongEmbed?.delete().catch(() => { });
      queue.playerManager?.textChannel?.activeQueueEmbed?.delete().catch(() => { });
      queue.playerManager?.textChannel?.activeNowPlayingEmbed?.delete().catch(() => { });
      embedManager.sendDisconnectedEmbed(queue.playerManager?.textChannel, this.client.guildParams.get(queue.guild.id));
    });
  }

  async play(message, args) {
    let queue = QueueManager.getQueue(this.client, message.guild);
    if (!queue) {
      queue = QueueManager.createQueue(this.client, message.guild);
      this.createListeners(queue);
    }
    queue.playerManager.textChannel = message.channel;
    queue.queueManager.pushSongsToQueue(await queue.queryResolver.search(args, message));
    if (queue.status == "pending") queue.playerManager.startPlayback(message.member.voice.channel);
  }

  async playlist(message, args) {
    let queue = QueueManager.getQueue(this.client, message.guild);
    if (!queue) {
      queue = QueueManager.createQueue(this.client, message.guild, message.channel);
      this.createListeners(queue);
    }
    queue.playerManager.textChannel = message.channel;
    queue.queueManager.pushSongsToQueue(await queue.queryResolver.search(args, message, { searchType: 'playlist' }));
    if (queue.status == "pending") queue.playerManager.startPlayback(message.member.voice.channel);
  }

  async addSong(queue, query) {
    queue.queueManager.pushSongsToQueue(await queue.queryResolver.search(query, message));
  }

  async addPlaylist(queue, query) {
    queue.queueManager.pushSongsToQueue(await queue.queryResolver.search(query, message, { searchType: 'playlist' }));
  }
}
exports.MusicPlayer = MusicPlayer;
