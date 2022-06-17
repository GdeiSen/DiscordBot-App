const play = require('play-dl')
const EventEmitter = require('events');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { clearTimeout } = require('timers');
const { isArray } = require('lodash');
class PlayerManager extends EventEmitter {
  constructor(client, queue, guild) {
    super();
    this.client = client;
    this.queue = queue;
    this.guild = guild;
  }

  async startPlayback(voiceChannel, textChannel) {
    if (voiceChannel) this.queue.voiceChannel = voiceChannel;
    if (textChannel) this.queue.textChannel = textChannel;
    try {
      if (!this.queue.current) this.queue.queueManager.setNextCurrentSong();
      this.emit("PLAYBACK_STARTING", this.queue);
      this.queue.status = 'loading';
      await this.#createConnection()
      if (!this.queue?.current?.url) return 0;
      if (!this.player) await this.#createPlayer();
      await this.#createStream(this.queue?.current?.url);
      await this.#createResource();
      await this.#play();
      await this.#createIdleHandler();
      this.#createVoiceStateHandler();
    } catch (error) {
      this.emit('ERROR');
      console.log(error)
    }
  }

  async #createIdleHandler() {
    if (this.player.listeners(AudioPlayerStatus.Idle).length !== 0) this.player.removeAllListeners(AudioPlayerStatus.Idle);
    this.player.on(AudioPlayerStatus.Idle, () => {
      let params = this.client.guildParams.get(this.guild.id);
      if (this.queue.stopReason == "skipped" || this.queue.stopReason == 'stopped') return 0;
      if (this.queue.songs.length == 0 && this.queue.stopReason !== 'stopped') {
        this.emit('QUEUE_ENDED', this.queue);
        this.emit('PLAYBACK_STOPPED', this.queue);
        this.stop();
      } else if (this.queue.songs.length > 0 && params?.autoPlay == true) {
        this.queue.status = 'pending';
        this.queue.queueManager.setNextCurrentSong();
        this.startPlayback()
      }
      else { this.emit('PLAYBACK_STOPPED', this.queue); this.stop(); }
    })
  }

  async #createVoiceStateHandler() {
    if (this.client.listeners('voiceStateUpdate').length !== 0) this.client.removeAllListeners('voiceStateUpdate');
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      if (oldState.member.user.id == this.client.user.id) {
        if (newState.channelId == null) {
          try {
            if (this.queue.disconnectReason == "inactivity") this.emit('INACTIVITY_DISCONNECTED');
            else this.emit('DISCONNECTED')
            this.connection.destroy();
            this.queue?.textChannel?.activeCollector?.stop();
            this.stop();
          } catch (error) { console.log(error) };
        }
        else {
          this.channelId = newState.channelId;
        }
      }
    })
  }

  async #createConnection() {
    try {
      const connection = await joinVoiceChannel({
        channelId: this.queue?.voiceChannel.id,
        guildId: this.guild.id,
        adapterCreator: this.guild.voiceAdapterCreator,
      });
      let promise = new Promise((resolve, reject) => {
        if (connection.state.status == 'ready') {
          this.connection = connection;
          resolve(connection.state.status)
        };
        connection.on("stateChange", (oldState, newState) => {
          if (newState.status == "ready") {
            this.connection = connection;
            resolve(true);
            this.emit('CONNECTION_CREATED', this.queue);
            connection.removeAllListeners("stateChange");
          }
        });
      })
      return await promise;
    } catch (err) { console.log(err); return 0 }
  }

  async #createPlayer() {
    try {
      const player = createAudioPlayer();
      this.player = player;
      this.emit('PLAYER_CREATED', this.queue);
    } catch (err) { console.log(err); return 0 }
  }

  async #createStream(source) {
    try {
      const stream = await play.stream(source);
      this.stream = stream;
      this.emit('STREAM_CREATED', this.queue);
    } catch (err) { console.log(err); return 0 }
  }

  async #createResource() {
    try {
      let params = this.client.guildParams.get(this.guild.id);
      const resource = createAudioResource(this.stream.stream, { inlineVolume: true, inputType: this.stream.type });
      resource.volume.setVolume(params.volume / 100);
      this.resource = resource;
      this.emit('RESOURCE_CREATED', this.queue);
    } catch (err) { console.log(err); return 0 }
  }

  async #play() {
    try {
      this.queue.current.startTime = new Date().getTime()
      this.player.play(this.resource);
      this.connection.subscribe(this.player);
      this.queue.status = 'playing';
      this.emit('PLAYBACK_STARTED', this.queue);
    } catch (err) { console.log(err); return 0 }
  }

  pause() {
    try {
      if (this.queue.status == 'paused') {
        return { executionResult: false, currentState: this.queue.status, error: 'already_paused' }
      } else {
        this.queue.status = 'paused';
        this.player.pause();
        this.queue.current.pauseTime = new Date().getTime();
        return { executionResult: true, currentState: this.queue.status };
      }
    } catch (err) { return 0 }
  }

  togglePause() {
    try {
      if (this.queue.status == 'paused') { this.resume(); return { executionResult: true, currentState: this.queue.status } }
      else { this.pause(); return { executionResult: true, currentState: this.queue.status } }
    } catch (err) { return 0 }
  }

  resume() {
    try {
      if (this.queue.status == 'playing') {
        return { executionResult: false, currentState: this.queue.status, error: 'already_playing' }
      } else {
        this.queue.status = 'playing';
        this.player.unpause();
        this.queue.current.resumeTime = new Date().getTime();
        if (!this.queue.current.totalPausedTime) this.queue.current.totalPausedTime = 0;
        this.queue.current.totalPausedTime += this.queue.current.resumeTime - this.queue.current.pauseTime;
        return { executionResult: true, currentState: this.queue.status };
      }
    } catch (err) { return 0 }
  }

  stop() {
    try {
      this.queue.queueManager.clearQueue();
      this.queue.status = 'pending';
      this.queue.stopReason = "stopped";
      this.player.stop();
      return { executionResult: true };
    } catch (err) { return 0 }
  }

  setVolume(args) {
    try {
      let params = this.client.guildParams.get(this.guild.id);
      if (!args || isNaN(args) || (Number(args) > 100 || Number(args) < 0)) { return { executionResult: false, currentState: params.volume, error: 'incorrect_args' } }
      else {
        params.volume = args;
        this.queue.playerManager.resource.volume.setVolume(args / 100);
      }
      this.client.guildParams.set(this.guild.id, params);
      return { executionResult: true, currentState: params.volume };
    } catch (err) { return 0 }
  }

  queueLoop(option) {
    try {
      if (!option || (option !== true && option !== false)) { return { executionResult: false, currentState: this.queue.loop, error: 'incorrect_args' } }
      if (option == true) { this.queue.loop = true; return { executionResult: true, currentState: this.queue.loop } }
      if (option == false) { this.queue.loop = false; return { executionResult: true, currentState: this.queue.loop } }
    } catch (err) { return 0 }
  }

  connect(voiceChannel, guild) {
    try {
      this.queue.voiceChannel = voiceChannel;
      this.guild = guild;
      this.#createConnection();
      return { executionResult: true }
    } catch (err) { return 0 }
  }

  toggleQueueLoop() {
    try {
      if (this.queue.loop) { this.queue.loop = false; return { executionResult: true, currentState: this.queue.loop }; }
      else { this.queue.loop = true; return { executionResult: true, currentState: this.queue.loop } }
    } catch (err) { return 0 }
  }

  toggleSongLoop() {
    try {
      if (this.queue.current.loop) { this.queue.current.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
      else { this.queue.current.loop = true; this.queue.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
    } catch (err) { return 0 }
  }

  songLoop(option) {
    try {
      if (option == undefined) { return { executionResult: false, currentState: this.queue.current.loop, error: 'no_args' } }
      if (option == true) { this.queue.current.loop = true; return { executionResult: true, currentState: this.queue.current.loop } }
      if (option == false) { this.queue.current.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
    } catch (err) { return 0 }
  }

  disconnect() {
    try {
      if (this.connection) { this.connection.disconnect(); return { executionResult: true } }
      else return { executionResult: false, error: 'no_connection' }
    } catch (err) { return 0 }
  }

  setStayTimeout() {
    let params = this.client.guildParams.get(this.guild.id);
    try {
      this.queue.stayTimeout = setTimeout(() => {
        this.queue.disconnectReason = "inactivity"
        this.disconnect();
      }, params.stayTimeout);
    } catch (err) { return 0 }
  }

  clearStayTimeout() {
    clearTimeout(this.queue?.stayTimeout);
  }

  setPlaybackTimeout() {
    let params = this.client.guildParams.get(this.guild.id);
    try {
      this.queue.playbackTimeout = setTimeout(() => {
        if (this.queue.status == "playing") this.queue.queueManager.skip();
        this.emit("PLAYBACK_MAX_LIMIT");
      }, params.maxPlaybackDuration);
    } catch (err) { return 0 }
  }

  clearPlaybackTimeout() {
    clearTimeout(this.queue?.playbackTimeout);
  }

}
exports.PlayerManager = PlayerManager;

