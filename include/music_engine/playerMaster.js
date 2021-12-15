const play = require('play-dl')
const EventEmitter = require('events');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require("@discordjs/voice");
const embedGenerator = require("../utils/embedGenerator");
class player extends EventEmitter {

  constructor(message) {
    super();
    this.message = message;
    this.client;
    this.queue;
    this.selectorFlag = true;
    this.getQueue();
    this.queue.status = 'pending';
    this.getClient();
  }

  start() {
    try {
      if (this.selectorFlag) {
        this.execute();
        this.on('LOADING_DONE', () => { this.addListeners() })
      }
      else if (!this.selectorFlag) {
        this.execute()
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] start function error'); console.log(err) }
  }

  addListeners() {
    try {
      this.queue.player.on(AudioPlayerStatus.Idle, () => {
        if (this.queue.songs.length >= 1 && this.queue.status !== 'stopped') {
          this.queue.status = 'pending';
          if (this.queue.current) this.queue.previous = this.queue.current
          return this.execute()
        } else if (this.queue.songs.length == 0 && this.queue.status !== 'stopped' && this.queue.config.loop !== true && this.queue.current.loop !== true) {
          this.queue.status = 'pending';
          this.emit('QUEUE_ENDED');
          this.emit('PLAYBACK_STOPPED')
        } else if ((this.queue.config.loop == true || this.queue.current.loop == true) && this.queue.status !== 'stopped') {
          this.queue.status = 'pending';
          if (this.queue.current) this.queue.previous = this.queue.current;
          return this.execute()
        }
        else this.emit('PLAYBACK_STOPPED')
      })
      if (this.selectorFlag) {
        this.queue.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
          } catch (error) {
            this.queue.connection.destroy();
            this.queue.playerMaster.stop();
            this.queue.status = 'stopped';
            this.selectorFlag = true;
            this.emit('DISCONNECTED');
          }
        });
      }
      this.queue.player.on('error', (queue, err) => {
        this.queue.songs.unshift(this.queue.current);
        let embed = embedGenerator.run('warnings.error_05')
        console.log('[ERROR 403] Unfortunately unpossible to be fixed from our side!', err);
        this.message.channel.send({
          embeds: [embed]
        })
      })
      this.selectorFlag = false;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] addListeners function error'); console.log(err) }
  }

  async execute() {
    try {
      this.emit('INFO', '[INFO] [PL] start function activated!');
      if (this.queue.status == 'pending' || this.queue.status == 'stopped') {
        this.createConnection().then(async (status) => {
          if (status == 'ready') {
            this.emit('INFO', '[INFO] [PL] audioPlayer constructor activated!');
            this.queueSongsChanger();
            await this.createPlayer();
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
  //=========================================================================================== CREATORS
  //======================================= CONNECTION
  async createConnection() {
    this.emit('INFO', '[INFO] [PL] createConnection function activated!');
    try {
      this.emit('[INFO] [PL] createConnection function activated!')
      const connection = await joinVoiceChannel({
        channelId: this.message.member.voice.channel.id,
        guildId: this.message.guild.id,
        adapterCreator: this.message.guild.voiceAdapterCreator
      });
      let promise = new Promise((resolve, reject) => {
        if (connection.state.status == 'ready') {
          this.queue.connection = connection;
          resolve(connection.state.status)
        };
        if (this.selectorFlag) {
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
  //======================================= PLAYER
  async createPlayer() {
    this.emit('INFO', '[INFO] [PL] createPlayer function activated!');
    try {
      const player = createAudioPlayer();
      this.queue.player = player;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createPlayer function error'); console.log(err) }
  }
  //======================================= STREAM
  async createStream(source) {
    this.emit('INFO', '[INFO] [PL] createStream function activated!');
    try {
      //const stream = ytdl(source, { filter: 'audioonly', highWaterMark: 1024 * 1024 * 10 });
      const stream = await play.stream(source)
      this.queue.stream = stream;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createStream function error'); console.log(err) }
  }
  //======================================= RESOURCE
  async createResource() {
    this.emit('INFO', '[INFO] [PL] createResource function activated!');
    try {
      const resource = createAudioResource(this.queue.stream.stream, { inlineVolume: true, inputType: this.queue.stream.type });
      resource.volume.setVolume(this.queue.config.volume / 100);
      this.queue.resource = resource;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] createResource function error'); console.log(err) }
  }
  //=========================================================================================== FUNCTIONS
  //======================================= PRIVATE PLAY FUNC
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
  //======================================= PRIVATE QUEUE MANAGMENT FUNC
  queueSongsChanger() {
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
  //======================================= PRIVATE GET QUEUE
  getQueue() {
    this.queue = this.message.client.queue.get(this.message.guild.id);
  }
  //======================================= PRIVATE GETCLIENT QUEUE
  getClient() {
    this.client = this.message.client;
  }
  //=========================================================================================== GLOBAL PLAYER FUNCTIONS
  pause() {
    try {
      if (this.queue.status == 'paused') {
        return false
      } else {
        this.queue.status = 'paused';
        this.queue.player.pause();
        this.queue.current.pauseTime = new Date().getTime();
        return true;
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] pause function error'); console.log(err) }
  }

  togglePause() {
    try {
      if (this.queue.status == 'paused') { this.resume(); return true }
      else { this.pause(); return false }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] togglePause function error'); console.log(err) }
  }

  resume() {
    try {
      if (this.queue.status == 'playing') {
        return false
      } else {
        this.queue.status = 'playing';
        this.queue.player.unpause();
        this.queue.current.resumeTime = new Date().getTime();
        if (!this.queue.current.totalPausedTime) this.queue.current.totalPausedTime = 0;
        this.queue.current.totalPausedTime += this.queue.current.resumeTime - this.queue.current.pauseTime;
        return true;
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] resume function error'); console.log(err) }
  }

  stop() {
    try {
      this.queue.queueMaster.clearQueue();
      this.queue.status = 'stopped';
      this.queue.player.stop();
      this.client.dataBaseEngine.updateCurrentPlaybackData();
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] stop function error'); console.log(err) }
  }

  skip() {
    try {
      this.queue.status = 'pending';
      this.queue.player.stop();
      this.client.dataBaseEngine.updateCurrentPlaybackData();
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skip function error'); console.log(err) }
  }

  queueLoop(option) {
    try {
      if (option == true) this.queue.config.loop = true;
      if (option == false) this.queue.config.loop = false;
      this.client.dataBaseEngine.updateCurrentPlaybackData();
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] queueLoop function error'); console.log(err) }
  }

  toggleQueueLoop() {
    try {
      if (this.queue.config.loop) { this.queue.config.loop = false; return false }
      else { this.queue.config.loop = true; return true }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] toggleQueueLoop function error'); console.log(err) }
  }

  toggleSongLoop() {
    try {
      if (this.queue.current.loop) { this.queue.current.loop = false; return false }
      else { this.queue.current.loop = true; return true }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] toggleSongLoop function error'); console.log(err) }
  }

  songLoop(option) {
    try {
      if (option == true) this.queue.current.loop = true;
      if (option == false) this.queue.current.loop = false;
      this.client.dataBaseEngine.updateCurrentPlaybackData();
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] songLoop function error'); console.log(err) }
  }

  skipTo(args) {
    try {
      if (args > this.queue.songs.length) return false
      else if (args == 1 || args == 0) { this.skip(); return true }
      if (this.queue.config.loop == true) {
        for (let i = 0; i < args - 1; i++) {
          this.queue.songs.push(this.queue.songs.shift());
        }
      } else { this.queue.songs = this.queue.songs.slice(args - 1); }
      this.queue.status = 'pending';
      this.queue.player.stop();
      return true;
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] skipTo function error'); console.log(err) }
    this.client.dataBaseEngine.updateCurrentPlaybackData();
  }

}
exports.player = player;

