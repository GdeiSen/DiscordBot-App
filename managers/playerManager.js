const play = require('play-dl')
const EventEmitter = require('events');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { clearTimeout } = require('timers');
class PlayerManager extends EventEmitter {
  constructor(client, guild) {
    super();
    this.client = client;
    this.queue = guild.queue;
    this.guild = guild;
  }

  async startPlayback(voiceChannel, textChannel) {
    if (voiceChannel) this.guild.voiceChannel = voiceChannel;
    if (textChannel) this.guild.textChannel = textChannel;
    try {
      if (!this.queue.current) this.guild.queueManager.setNextCurrentSong();
      this.emit("PLAYBACK_STARTING", this.queue);
      this.queue.status = 'loading';
      await this.#createConnection()
      if (!this.queue?.current?.url) return 0;
      if (!this.player) await this.#createPlayer();
      await this.#createStream(this.queue?.current?.url);
      await this.#createResource();
      await this.#play();
      await this.#createIdleHandler();
      this.guild.queueManager.clearStates();
      this.#createVoiceStateHandler();
    } catch (error) {
      this.emit('ERROR');
      console.log(error)
    }
  }

  async #createIdleHandler() {
    if (this.player.listeners(AudioPlayerStatus.Idle).length !== 0) this.player.removeAllListeners(AudioPlayerStatus.Idle);
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.queue.status = 'pending';
      if (this.queue.isSkipped == true || this.queue.isStopped == true) return 0;
      if (this.queue.songs.length == 0 && this.queue.isStopped !== true) {
        this.emit('QUEUE_ENDED', this.queue);
        this.emit('PLAYBACK_STOPPED', this.queue);
        this.stop();
      } else if (this.queue.songs.length > 0 && this.guild.params?.autoContinue == true) {
        this.guild.queueManager.setNextCurrentSong();
        this.startPlayback()
      }
      else if (this.guild.params?.autoContinue == false) {
        this.guild.queueManager.setNextCurrentSong();
        this.emit('PLAYBACK_STOPPED');
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
            this.guild?.textChannel?.activeCollector?.stop();
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
    const connection = await joinVoiceChannel({
      channelId: this.guild?.voiceChannel.id,
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
  }

  async #createPlayer() {
    const player = createAudioPlayer();
    this.player = player;
    this.emit('PLAYER_CREATED', this.queue);
  }

  async #createStream(source) {
    const stream = await play.stream(source);
    this.stream = stream;
    this.emit('STREAM_CREATED', this.queue);
  }

  async #createResource() {
    const resource = createAudioResource(this.stream.stream, { inlineVolume: true, inputType: this.stream.type });
    resource.volume.setVolume(this.guild.params.volume / 100);
    this.resource = resource;
    this.emit('RESOURCE_CREATED', this.queue);
  }

  async #play() {
    this.player.play(this.resource);
    this.connection.subscribe(this.player);
    this.queue.status = 'playing';
    this.emit('PLAYBACK_STARTED', this.queue);
    this.queue.current.startTime = new Date().getTime()
  }

  pause() {
    if (this.queue.status == 'paused') {
      return { executionResult: false, currentState: this.queue.status, error: 'already_paused' }
    } else {
      this.queue.status = 'paused';
      this.player.pause();
      this.queue.current.pauseTime = new Date().getTime();
      return { executionResult: true, currentState: this.queue.status };
    }
  }

  togglePause() {
    if (this.queue.status == 'paused') { this.resume(); return { executionResult: true, currentState: this.queue.status } }
    else { this.pause(); return { executionResult: true, currentState: this.queue.status } }
  }

  resume() {
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
  }

  stop() {
    this.guild.queueManager.clearQueue();
    this.player.stop();
    this.queue.isStopped = true;
    this.emit('PLAYBACK_STOPPED')
    return { executionResult: true };
  }

  setVolume(args) {
    if (!args || isNaN(args) || (Number(args) > 100 || Number(args) < 0)) { return { executionResult: false, currentState: this.guild.params.volume, error: 'incorrect_args' } }
    else {
      this.guild.params.volume = args;
      this.guild.playerManager.resource.volume.setVolume(args / 100);
    }
    return { executionResult: true, currentState: this.guild.params.volume };
  }

  queueLoop(option) {
    if (!option || (option !== true && option !== false)) { return { executionResult: false, currentState: this.queue.loop, error: 'incorrect_args' } }
    if (option == true) { this.queue.loop = true; return { executionResult: true, currentState: this.queue.loop } }
    if (option == false) { this.queue.loop = false; return { executionResult: true, currentState: this.queue.loop } }
  }

  connect(voiceChannel, guild) {
    this.guild.voiceChannel = voiceChannel;
    this.guild = guild;
    this.#createConnection();
    return { executionResult: true }
  }

  toggleQueueLoop() {
    if (this.queue.loop) { this.queue.loop = false; return { executionResult: true, currentState: this.queue.loop }; }
    else { this.queue.loop = true; return { executionResult: true, currentState: this.queue.loop } }
  }

  toggleSongLoop() {
    if (this.queue.current.loop) { this.queue.current.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
    else { this.queue.current.loop = true; this.queue.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
  }

  songLoop(option) {
    if (option == undefined) { return { executionResult: false, currentState: this.queue.current.loop, error: 'no_args' } }
    if (option == true) { this.queue.current.loop = true; return { executionResult: true, currentState: this.queue.current.loop } }
    if (option == false) { this.queue.current.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
  }

  disconnect() {
    if (this.connection) { this.connection.disconnect(); return { executionResult: true } }
    else return { executionResult: false, error: 'no_connection' }
  }

  setStayTimeout() {
    this.queue.stayTimeout = setTimeout(() => {
      this.queue.disconnectReason = "inactivity"
      this.disconnect();
    }, this.guild.params.stayTimeout);
  }

  clearStayTimeout() {
    clearTimeout(this.queue?.stayTimeout);
  }

  setPlaybackTimeout() {
    this.queue.playbackTimeout = setTimeout(() => {
      if (this.queue.status == "playing") this.guild.queueManager.skip();
      this.emit("PLAYBACK_MAX_LIMIT");
    }, this.guild.params.maxPlaybackDuration);
  }

  clearPlaybackTimeout() {
    clearTimeout(this.queue?.playbackTimeout);
  }

}
exports.PlayerManager = PlayerManager;

