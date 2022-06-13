const play = require('play-dl')
const EventEmitter = require('events');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
const { clearTimeout } = require('timers');
const { isArray } = require('lodash');
class PlayerManager extends EventEmitter {
  constructor(client, queue, guild) {
    super();
    this.stayTimer;
    this.voiceChannel = null;
    this.textChannel = null;
    this.client = client;
    this.queue = queue;
    this.guild = guild;
    this.params = client.guildParams.get(guild.id);
  }

  async startPlayback(voiceChannel, textChannel) {
    if (voiceChannel) this.voiceChannel = voiceChannel;
    if (textChannel) this.textChannel = textChannel;
    try {
      if (this.queue.status !== 'pending' && this.queue.status !== 'stopped') return 0;
      this.emit("PLAYBACK_STARTING", this.queue);
      this.queue.status = 'loading';
      await this.#createConnection()
      this.queue.queueManager.skip();
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
      if (this.queue.songs?.length == 0 && this.queue.status !== 'stopped' && this.queue.config?.loop !== true && this.queue?.current?.loop !== true) {
        this.emit('QUEUE_ENDED', this.queue);
        this.emit('PLAYBACK_STOPPED', this.queue);
        this.stop();
      } else if ((this.queue.songs?.length >= 1 && this.queue.status !== 'stopped') || (this.queue.config?.loop == true || this.queue.current?.loop == true)) {
        this.queue.status = 'pending';
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
            this.emit('DISCONNECTED', this.queue);
            this.connection.destroy();
            this?.textChannel?.activeCollector?.stop();
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
        channelId: this.voiceChannel.id,
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
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createConnection function error'); console.log(err); return 0 }
  }

  async #createPlayer() {
    try {
      const player = createAudioPlayer();
      this.player = player;
      this.emit('PLAYER_CREATED', this.queue);
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createPlayer function error'); console.log(err); return 0 }
  }

  async #createStream(source) {
    try {
      const stream = await play.stream(source);
      this.stream = stream;
      this.emit('STREAM_CREATED', this.queue);
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createStream function error'); console.log(err); return 0 }
  }

  async #createResource() {
    try {
      const resource = createAudioResource(this.stream.stream, { inlineVolume: true, inputType: this.stream.type });
      resource.volume.setVolume(this.queue.config.volume / 100);
      this.resource = resource;
      this.emit('RESOURCE_CREATED', this.queue);
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createResource function error'); console.log(err); return 0 }
  }

  async #play() {
    try {
      this.queue.current.startTime = new Date().getTime()
      this.player.play(this.resource);
      this.connection.subscribe(this.player);
      this.queue.status = 'playing';
      this.emit('PLAYBACK_STARTED', this.queue);
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] play function error'); console.log(err); return 0 }
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
      this.queue.status = 'stopped';
      this.player.stop();
      return { executionResult: true };
    } catch (err) { return 0 }
  }

  skip() {
    try {
      if (this.queue.status == 'paused') this.resume();
      this.queue.status = 'pending';
      this.player.stop();
      return { executionResult: true, currentState: this.queue.status };
    } catch (err) { return 0 }
  }

  prev() {
    try {
      if (this.queue.queueManager.prev() == false) return 0;
      if (this.queue.status == 'paused') this.resume();
      this.queue.status = 'pending';
      this.player.stop();
      return { executionResult: true, currentState: this.queue.status };
    } catch (err) { return 0 }
  }

  setVolume(args) {
    try {
      if (!args || isNaN(args) || (Number(args) > 100 || Number(args) < 0)) { return { executionResult: false, currentState: this.queue.config.volume, error: 'incorrect_args' } }
      else {
        this.queue.config.volume = args;
        this.queue.playerManager.resource.volume.setVolume(args / 100);
      }
      return { executionResult: true, currentState: this.queue.config.volume };
    } catch (err) { return 0 }
  }

  queueLoop(option) {
    try {
      if (!option || (option !== true && option !== false)) { return { executionResult: false, currentState: this.queue.config.loop, error: 'incorrect_args' } }
      if (option == true) { this.queue.config.loop = true; return { executionResult: true, currentState: this.queue.config.loop } }
      if (option == false) { this.queue.config.loop = false; return { executionResult: true, currentState: this.queue.config.loop } }
    } catch (err) { return 0 }
  }

  connect(voiceChannel, guild) {
    try {
      this.voiceChannel = voiceChannel;
      this.guild = guild;
      this.#createConnection();
      return { executionResult: true }
    } catch (err) { return 0 }
  }

  toggleQueueLoop() {
    try {
      if (this.queue.config.loop) { this.queue.config.loop = false; return { executionResult: true, currentState: this.queue.config.loop }; }
      else { this.queue.config.loop = true; return { executionResult: true, currentState: this.queue.config.loop } }
    } catch (err) { return 0 }
  }

  toggleSongLoop() {
    try {
      if (this.queue.current.loop) { this.queue.current.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
      else { this.queue.current.loop = true; this.queue.config.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
    } catch (err) { return 0 }
  }

  songLoop(option) {
    try {
      if (option == undefined) { return { executionResult: false, currentState: this.queue.current.loop, error: 'no_args' } }
      if (option == true) { this.queue.current.loop = true; return { executionResult: true, currentState: this.queue.current.loop } }
      if (option == false) { this.queue.current.loop = false; return { executionResult: true, currentState: this.queue.current.loop } }
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

  disconnect() {
    try {
      if (this.connection) { this.connection.disconnect(); return { executionResult: true } }
      else return { executionResult: false, error: 'no_connection' }
    } catch (err) { return 0 }
  }

  skipTo(args) {
    try {
      if (!args) return { executionResult: false, error: 'no_args' };
      if (args > this.queue.songs.length) { return { executionResult: false, error: 'overrunning' } }
      else if (args == 1 || args <= 0) { this.skip(); return { executionResult: true } }
      if (this.queue.config.loop == true) {
        for (let i = 0; i < args - 1; i++) {
          this.queue.songs.push(this.queue.songs.shift());
        }
      } else { this.queue.songs = this.queue.songs.slice(args - 1); }
      this.queue.status = 'pending';
      this.player.stop();
      return { executionResult: true }
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

}
exports.PlayerManager = PlayerManager;

