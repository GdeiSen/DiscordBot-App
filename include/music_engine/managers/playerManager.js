const play = require('play-dl')
const EventEmitter = require('events');
const config = require('../../../config.json')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require("@discordjs/voice");
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
  }

  async startPlayback(voiceChannel, textChannel) {
    clearTimeout(this.stayTimer);
    if (voiceChannel) this.voiceChannel = voiceChannel;
    if (textChannel) this.textChannel = textChannel;
    try {
      if (this.queue.status !== 'pending' && this.queue.status !== 'stopped') return 0;
      this.queue.status = 'loading';
      this.#createConnection().then(async (status) => {
        if (status == 'ready') {
          this.queue.queueManager.skip();
          if (!this.player) await this.#createPlayer();
          await this.#createStream(this.queue.current.url);
          await this.#createResource();
          await this.#play();
          await this.#createIdleHandler();
          this.#createVoiceStateHandler();
        }
      })
    } catch (error) {
      this.emit('ERROR');
      console.log(error)
    }
  }

  async setStayTimer() {
    if (this.queue.status == 'playing') return 0;
    switch (config.STAY_PERMISSION) {
      case 'always': break;
      case 'long': this.stayTimer = setTimeout(() => { this.connection.disconnect() }, 60000); break;
      case 'default': this.stayTimer = setTimeout(() => { this.connection.disconnect() }, 10000); break;
      case 'short': this.stayTimer = setTimeout(() => { this.connection.disconnect() }, 5000); break;
      case 'none': this.queue.connection.disconnect(); break;
      default: break;
    }
  }

  async #createIdleHandler() {
    if (this.player.listeners(AudioPlayerStatus.Idle).length !== 0) this.player.removeAllListeners(AudioPlayerStatus.Idle);
    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.queue.songs?.length == 0 && this.queue.status !== 'stopped' && this.queue.config?.loop !== true && this.queue?.current?.loop !== true) {
        this.queue.status = 'pending';
        this.emit('QUEUE_ENDED', this.queue);
        this.setStayTimer()
        this.stop();
        if (this.textChannel?.activeCollector) this.textChannel.activeCollector.stop();
      } else if ((this.queue.songs?.length >= 1 && this.queue.status !== 'stopped') || (this.queue.config?.loop == true || this.queue.current?.loop == true)) {
        this.queue.status = 'pending';
        this.startPlayback()
      }
      else this.emit('PLAYBACK_STOPPED', this.queue);
      this.setStayTimer()
      if (this.textChannel?.activeCollector) this.textChannel.activeCollector.stop();
    })
  }

  async #createVoiceStateHandler() {
    if (this.client.listeners('voiceStateUpdate').length !== 0) this.client.removeAllListeners('voiceStateUpdate');
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      if (oldState.member.user.id == this.client.user.id) {
        if (newState.channelId == null) {
          try {
            this.connection.destroy();
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
        adapterCreator: this.guild.voiceAdapterCreator
      });
      let promise = new Promise((resolve, reject) => {
        if (connection.state.status == 'ready') {
          this.connection = connection;
          resolve(connection.state.status)
        };
        connection.on('stateChange', (oldState, newState) => {
          if (newState.status == 'ready') {
            this.connection = connection, resolve(newState.status);
            this.emit('CONNECTION_CREATED', this.queue);
            this.connection.removeAllListeners('stateChange')
          }
        })
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
      const stream = await play.stream(source)
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
        this.emit('PLAYER_COMMAND', { commandName: 'pause', executionResult: false, currentState: this.queue.status, error: 'already_paused' });
        return false
      } else {
        this.queue.status = 'paused';
        this.player.pause();
        this.queue.current.pauseTime = new Date().getTime();
        this.emit('PLAYER_COMMAND', { commandName: 'pause', executionResult: true, currentState: this.queue.status });
        return true;
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] pause function error'); console.log(err); return 0 }
  }

  togglePause() {
    try {
      if (this.queue.status == 'paused') { this.resume(); return true }
      else { this.pause(); return false }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] togglePause function error'); console.log(err); return 0 }
  }

  resume() {
    try {
      if (this.queue.status == 'playing') {
        this.emit('PLAYER_COMMAND', { commandName: 'resume', executionResult: false, currentState: this.queue.status, error: 'already_playing' });
        return false
      } else {
        this.queue.status = 'playing';
        this.player.unpause();
        this.queue.current.resumeTime = new Date().getTime();
        if (!this.queue.current.totalPausedTime) this.queue.current.totalPausedTime = 0;
        this.queue.current.totalPausedTime += this.queue.current.resumeTime - this.queue.current.pauseTime;
        this.emit('PLAYER_COMMAND', { commandName: 'resume', executionResult: true, currentState: this.queue.status });
        return true;
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] resume function error'); return 0 }
  }

  stop() {
    try {
      this.queue.queueManager.clearQueue();
      this.queue.status = 'stopped';
      this.player.stop();
      if (this.queue.activeSongCollector) this.queue.activeSongCollector.stop();
      this.emit('PLAYER_COMMAND', { commandName: 'stop', executionResult: true });
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] stop function error'); return 0 }
  }

  skip() {
    try {
      if (this.queue.status == 'paused') this.resume();
      this.queue.status = 'pending';
      this.player.stop();
      this.emit('PLAYER_COMMAND', { commandName: 'skip', executionResult: true, currentState: this.queue.status });
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skip function error'); console.log(err); return 0 }
  }

  setVolume(args) {
    try {
      if (!args || isNaN(args) || (Number(args) > 100 || Number(args) < 0)) { this.emit('PLAYER_COMMAND', { commandName: 'setVolume', executionResult: false, currentState: this.queue.config.volume, error: 'incorrect_args' }); return false }
      else {
        this.queue.config.volume = args;
        this.queue.playerManager.resource.volume.setVolume(args / 100);
      }
      this.emit('PLAYER_COMMAND', { commandName: 'setVolume', executionResult: true, currentState: this.queue.config.volume });
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skipTo function error'); console.log(err) }
  }

  queueLoop(option) {
    try {
      if (!option || (option !== true && option !== false)) { this.emit('PLAYER_COMMAND', { commandName: 'queueLoop', executionResult: false, currentState: this.queue.config.loop, error: 'incorrect_args' }) }
      if (option == true) { this.queue.config.loop = true; this.emit('PLAYER_COMMAND', { commandName: 'queueLoop', executionResult: true, currentState: this.queue.config.loop }) }
      if (option == false) { this.queue.config.loop = false; this.emit('PLAYER_COMMAND', { commandName: 'queueLoop', executionResult: true, currentState: this.queue.config.loop }) }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] queueLoop function error'); return 0 }
  }

  connect(voiceChannel, guild) {
    try {
      this.voiceChannel = voiceChannel;
      this.guild = guild;
      this.#createConnection();
      this.emit('PLAYER_COMMAND', { commandName: 'connect', executionResult: true })
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] connect function error'); return 0 }
  }

  toggleQueueLoop() {
    try {
      if (this.queue.config.loop) { this.queue.config.loop = false; this.emit('PLAYER_COMMAND', this.emit('PLAYER_COMMAND', { commandName: 'toggleSongLoop', executionResult: true, currentState: this.queue.config.loop })); return false }
      else { this.queue.config.loop = true; this.emit('PLAYER_COMMAND', this.emit('PLAYER_COMMAND', { commandName: 'toggleSongLoop', executionResult: true, currentState: this.queue.config.loop })); return true }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] toggleQueueLoop function error'); return 0 }
  }

  toggleSongLoop() {
    try {
      if (this.queue.current.loop) { this.queue.current.loop = false; this.emit('PLAYER_COMMAND', { commandName: 'toggleSongLoop', executionResult: true, currentState: this.queue.current.loop }); return false }
      else { this.queue.current.loop = true; this.queue.config.loop = false; this.emit('PLAYER_COMMAND', { commandName: 'toggleSongLoop', executionResult: true, currentState: this.queue.current.loop }); return true }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] toggleSongLoop function error'); return 0 }
  }

  songLoop(option) {
    try {
      if (option == undefined) { this.emit('PLAYER_COMMAND', { commandName: 'songLoop', executionResult: false, currentState: this.queue.current.loop, error: 'no_args' }); return 0 }
      if (option == true) { this.queue.current.loop = true; this.emit('PLAYER_COMMAND', { commandName: 'songLoop', executionResult: true, currentState: this.queue.current.loop }); }
      if (option == false) { this.queue.current.loop = false; this.emit('PLAYER_COMMAND', { commandName: 'songLoop', executionResult: true, currentState: this.queue.current.loop }); }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] songLoop function error'); return 0 }
  }

  shuffle() {
    try {
      let songs = this.queue.songs;
      for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
      this.emit('PLAYER_COMMAND', { commandName: 'shuffle', executionResult: true });
      this.queue.songs = songs;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] shuffle function error'); return 0 }
  }

  disconnect() {
    try {
      if (this.connection) { this.connection.disconnect(); this.emit('PLAYER_COMMAND', { commandName: 'disconnect', executionResult: true }); }
      else { this.emit('PLAYER_COMMAND', { commandName: 'disconnect', executionResult: false, error: 'no_connection' }); }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] disconnect function error'); return 0 }
  }

  skipTo(args) {
    try {
      if (!args) this.emit('PLAYER_COMMAND', { commandName: 'skipTo', executionResult: false, error: 'no_args' });
      if (args > this.queue.songs.length) { this.emit('PLAYER_COMMAND', { commandName: 'skipTo', executionResult: false, error: 'overrunning' }); return false }
      else if (args == 1 || args <= 0) { this.skip(); return true }
      if (this.queue.config.loop == true) {
        for (let i = 0; i < args - 1; i++) {
          this.queue.songs.push(this.queue.songs.shift());
        }
      } else { this.queue.songs = this.queue.songs.slice(args - 1); }
      this.queue.status = 'pending';
      this.player.stop();
      this.emit('PLAYER_COMMAND', { commandName: 'skipTo', executionResult: true })
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skipTo function error'); console.log(err) }
  }

  seek(args) {
    this.player.play(this.resource, { seek: args });
    console.log(args);
    this.connection.subscribe(this.player);
  }

  remove(args) {
    if (!isArray(args)) {
      const song = this.queue.songs.splice(args, 1);
      this.emit('PLAYER_COMMAND', 'remove', song);
      return song
    }
    if (args > this.queue.songs.length || args[0] == 0) { this.emit('PLAYER_COMMAND', { commandName: 'remove', executionResult: false, error: 'overrunning' }); return false; }
    else if (!args || isNaN(args[0])) { this.emit('PLAYER_COMMAND', { commandName: 'remove', executionResult: false, error: 'incorrect_args' }); return false }
    else { const song = this.queue.songs.splice(args - 1, 1); this.emit('PLAYER_COMMAND', { commandName: 'remove', executionResult: true, removedSong: song }); return true }
  }

}
exports.PlayerManager = PlayerManager;

