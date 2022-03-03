const play = require('play-dl')
const config = require("../../config.json");
const EventEmitter = require('events');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require("@discordjs/voice");
const { clearTimeout } = require('timers');
const { isArray } = require('lodash');
class player extends EventEmitter {

  constructor(message) {
    super();
    this.message = message;
    this.channelId = message.member.voice.channel.id;
    this.client = this.message.client;
    this.queue = this.message.client.queue.get(this.message.guild.id);
    this.queue.status = 'pending';
    this.stayTimer;
    this.status = 'pending';
  }

  async start() {
    this.#execute();
    this.on('LOADING_DONE', () => {
      this.#addListeners();
      this.status = 'active';
    })
    this.removeAllListeners('PLAYBACK_STOPPED');
    this.on('PLAYBACK_STOPPED', () => {
      //this.setStayTimer();
      this.status = 'pending';
    })
  }

  async #addListeners() {
    if (this.queue.player.listeners(AudioPlayerStatus.Idle).length == 0) this.#addAudioPlayerStatusListener();
    if (this.client.listeners('voiceStateUpdate').length == 0) this.#addVoiceStateListener();
  }

  async #addAudioPlayerStatusListener() {
    this.queue.player.on(AudioPlayerStatus.Idle, () => {
      if (this.queue.songs.length >= 1 && this.queue.status !== 'stopped') {
        this.queue.status = 'pending';
        if (this.queue.current) this.queue.previous = this.queue.current
        return this.#execute()
      } else if (this.queue.songs.length == 0 && this.queue.status !== 'stopped' && this.queue.config.loop !== true && this.queue.current.loop !== true) {
        this.queue.status = 'pending';
        this.emit('QUEUE_ENDED');
        this.emit('PLAYBACK_STOPPED');
        this.queue.playerMaster.stop();
      } else if ((this.queue.config.loop == true || this.queue.current.loop == true) && this.queue.status !== 'stopped') {
        this.queue.status = 'pending';
        if (this.queue.current) this.queue.previous = this.queue.current;
        return this.#execute()
      }
      else this.emit('PLAYBACK_STOPPED');
    })
  }

  async #addVoiceStateListener() {
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      if (oldState.member.user.id == this.client.user.id) {
        if (newState.channelId == null) {
          try {
            this.queue.connection.destroy();
            this.queue.playerMaster.stop();
            this.queue.status = 'stopped';
            this.channelId = null;
            this.emit('PLAYBACK_STOPPED');
          } catch (error) { console.log(error) };
        }
        else {
          this.channelId = newState.channelId;
        }
      }
    })
  }

  async #execute() {
    clearTimeout(this.stayTimer);
    try {
      this.emit('INFO', '[INFO] [PL] start function activated!');
      if (this.queue.status == 'pending' || this.queue.status == 'stopped') {
        this.queue.status = 'loading';
        this.createConnection().then(async (status) => {
          if (status == 'ready') {
            this.client.fileSystemManager.setValue('requests', 'NUMBER OF TOTAL PLAYBACKS');
            this.emit('INFO', '[INFO] [PL] audioPlayer constructor activated!');
            this.#queueSongsChanger();
            if (!this.queue.player) await this.createPlayer();
            await this.createStream(this.queue.current.url);
            await this.createResource();
            await this.play();
            this.emit('LOADING_DONE');
          }
        })
      } else {
        this.emit('SONG_ADDED', this.queue.songs[this.queue.songs.length - 1])
      }
    } catch (error) {
      this.emit('ERROR');
      console.log(error)
    }
  }

  async setStayTimer() {
    if (this.queue.status == 'playing') return 0;
    switch (config.STAY_PERMISSION) {
      case 'always': break;
      case 'long': this.stayTimer = setTimeout(() => { this.queue.connection.disconnect() }, 60000); break;
      case 'default': this.stayTimer = setTimeout(() => { this.queue.connection.disconnect() }, 10000); break;
      case 'short': this.stayTimer = setTimeout(() => { this.queue.connection.disconnect() }, 5000); break;
      case 'none': this.queue.connection.disconnect(); break;
      default: break;
    }
  }

  async createConnection() {
    this.emit('INFO', '[INFO] [PL] createConnection function activated!');
    if (!this.channelId) this.channelId = this.message.member.voice.channel.id;
    try {
      this.emit('[INFO] [PL] createConnection function activated!')
      const connection = await joinVoiceChannel({
        channelId: this.channelId,
        guildId: this.message.guild.id,
        adapterCreator: this.message.guild.voiceAdapterCreator
      });
      let promise = new Promise((resolve, reject) => {
        if (connection.state.status == 'ready') {
          this.queue.connection = connection;
          resolve(connection.state.status)
        };
        if (this.queue.connection?.listeners('stateChange').length == 0 || !this.queue.connection) {
          connection.on('stateChange', (oldState, newState) => {
            if (newState.status == 'ready') {
              this.queue.connection = connection, resolve(newState.status);
              this.emit('CONNECTED');
            }
          })
        }
      })
      return await promise;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createConnection function error'); console.log(err) }
  }

  async createPlayer() {
    this.emit('INFO', '[INFO] [PL] createPlayer function activated!');
    try {
      const player = createAudioPlayer();
      this.queue.player = player;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createPlayer function error'); console.log(err) }
  }

  async createStream(source) {
    this.emit('INFO', '[INFO] [PL] createStream function activated!');
    try {
      const stream = await play.stream(source)
      this.queue.stream = stream;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createStream function error'); console.log(err) }
  }

  async createResource() {
    this.emit('INFO', '[INFO] [PL] createResource function activated!');
    try {
      const resource = createAudioResource(this.queue.stream.stream, { inlineVolume: true, inputType: this.queue.stream.type });
      resource.volume.setVolume(this.queue.config.volume / 100);
      this.queue.resource = resource;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createResource function error'); console.log(err) }
  }

  async play() {
    this.emit('INFO', '[INFO] [PL] play function activated!');
    try {
      this.queue.current.startTime = new Date().getTime()
      this.queue.player.play(this.queue.resource);
      this.queue.connection.subscribe(this.queue.player);
      this.queue.status = 'playing';
      this.emit('PLAYBACK_STARTED', this.queue);
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] play function error'); console.log(err) }
  }

  #queueSongsChanger() {
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
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] queueSongsChanger function error'); console.log(err) }
  }

  pause() {
    try {
      if (this.queue.status == 'paused') {
        this.emit('PLAYER_COMMAND', 'pause', false, 'is_paused');
        return false
      } else {
        this.queue.status = 'paused';
        this.queue.player.pause();
        this.queue.current.pauseTime = new Date().getTime();
        this.emit('PLAYER_COMMAND', 'pause', true);
        return true;
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] pause function error'); console.log(err) }
  }

  togglePause() {
    try {
      if (this.queue.status == 'paused') { this.resume(); this.emit('PLAYER_COMMAND', 'resume', true); return true }
      else { this.pause(); this.emit('PLAYER_COMMAND', 'pause', true); return false }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] togglePause function error'); console.log(err) }
  }

  resume() {
    try {
      if (this.queue.status == 'playing') {
        this.emit('PLAYER_COMMAND', 'resume', false, 'is_playing');
        return false
      } else {
        this.queue.status = 'playing';
        this.queue.player.unpause();
        this.queue.current.resumeTime = new Date().getTime();
        if (!this.queue.current.totalPausedTime) this.queue.current.totalPausedTime = 0;
        this.queue.current.totalPausedTime += this.queue.current.resumeTime - this.queue.current.pauseTime;
        this.emit('PLAYER_COMMAND', 'resume', true);
        return true;
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] resume function error'); console.log(err) }
  }

  stop() {
    try {
      this.queue.queueMaster.clearQueue();
      this.queue.status = 'stopped';
      this.queue.player.stop();
      //this.client.dataBaseEngine.updateCurrentPlaybackData();
      this.emit('PLAYER_COMMAND', 'stop', true);
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] stop function error'); console.log(err) }
  }

  skip() {
    try {
      if (this.queue.status == 'paused') this.resume();
      this.queue.status = 'pending';
      this.queue.player.stop();
      this.emit('PLAYER_COMMAND', 'skip', true);
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skip function error'); console.log(err) }
  }

  queueLoop(option) {
    try {
      if (!option) { this.emit('PLAYER_COMMAND', 'queueLoop', this.queue.config.loop, 'no_args'); return 0 }
      if (option !== "true" && option !== "false") { this.emit('PLAYER_COMMAND', 'queueLoop', false, 'incorrect_args'); return 0 }
      if (option == "true") { this.queue.config.loop = true; this.emit('PLAYER_COMMAND', 'queueLoop', true); }
      if (option == "false") { this.queue.config.loop = false; this.emit('PLAYER_COMMAND', 'queueLoop', false); }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] queueLoop function error'); console.log(err) }
  }

  toggleQueueLoop() {
    try {
      if (this.queue.config.loop) { this.queue.config.loop = false; this.emit('PLAYER_COMMAND', 'toggleQueueLoop', false); return false }
      else { this.queue.config.loop = true; this.emit('PLAYER_COMMAND', 'toggleQueueLoop', true); return true }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] toggleQueueLoop function error'); console.log(err) }
  }

  toggleSongLoop() {
    try {
      if (this.queue.current.loop) { this.queue.current.loop = false; this.queue.config.loop = false; this.emit('PLAYER_COMMAND', 'toggleSongLoop', false); return false }
      else { this.queue.current.loop = true; this.queue.config.loop = false; this.emit('PLAYER_COMMAND', 'toggleSongLoop', true); return true }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] toggleSongLoop function error'); console.log(err) }
  }

  songLoop(option) {
    try {
      //if (option && option !== "true" && option !== "false") { this.emit('PLAYER_COMMAND', 'queueLoop', false, 'incorrect_args'); return 0 }
      if (!option) { this.emit('PLAYER_COMMAND', 'songLoop', this.queue.current.loop, 'no_args'); return 0 }
      if (option == "true") { this.queue.current.loop = true; this.emit('PLAYER_COMMAND', 'songLoop', true); }
      if (option == "false") { this.queue.current.loop = false; this.emit('PLAYER_COMMAND', 'songLoop', false); }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] songLoop function error'); console.log(err) }
  }

  skipTo(args) {
    try {
      if (!args) this.emit('PLAYER_COMMAND', 'skipTo', this.queue.current.loop, 'no_args');
      if (args > this.queue.songs.length) { this.emit('PLAYER_COMMAND', 'skipTo', this.queue.current.loop, 'overrunning'); return false }
      else if (args == 1 || args <= 0) { this.skip(); return true }
      if (this.queue.config.loop == true) {
        for (let i = 0; i < args - 1; i++) {
          this.queue.songs.push(this.queue.songs.shift());
        }
      } else { this.queue.songs = this.queue.songs.slice(args - 1); }
      this.queue.status = 'pending';
      this.queue.player.stop();
      this.emit('PLAYER_COMMAND', 'skipTo', true)
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skipTo function error'); console.log(err) }
  }

  remove(args) {
    if (!isArray(args)) {
      const song = this.queue.songs.splice(args, 1);
      this.emit('PLAYER_COMMAND', 'remove', song);
      return song
    }
    if (args > this.queue.songs.length || args[0] == 0) { this.emit('PLAYER_COMMAND', 'remove', false, 'overrunning'); return false; }
    else if (!args || isNaN(args[0])) { this.emit('PLAYER_COMMAND', 'remove', false, 'incorrect_args'); return false }
    else { const song = this.queue.songs.splice(args - 1, 1); this.emit('PLAYER_COMMAND', 'remove', song); return song }
  }

}
exports.player = player;

