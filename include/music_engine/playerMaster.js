  const ytdl = require("ytdl-core");
  const EventEmitter = require('events');
  const {joinVoiceChannel,getVoiceConnection,createAudioPlayer,createAudioResource,AudioPlayerStatus, VoiceConnection} = require("@discordjs/voice");
  const embedGenerator = require("../utils/embedGenerator");
const { timeStamp } = require("console");
  class player extends EventEmitter {
    constructor(message) {
      super();
      this.message = message;
      this.client;
      this.queue;
      this.selectorFlag = true;
      this.getQueue();
      this.getClient();
    }

  start(){
    if(this.selectorFlag){
      this.execute();
      this.on('LOADING_DONE', ()=>{this.addListeners()})
    }
    else if(!this.selectorFlag){
      this.execute()
    }
  }

  addListeners() {
      this.queue.player.on(AudioPlayerStatus.Idle, () => {
        if (this.queue.songs.length >= 1 && this.queue.status !== 'stopped') {
          this.queue.status = 'pending';
          if(this.queue.current) this.queue.previous = this.queue.current
          return this.execute()
        } else if (this.queue.songs.length == 0 && this.queue.status !== 'stopped' && this.queue.config.loop !== true && this.queue.current.loop !== true) {
          this.queue.status = 'pending';
          this.emit('QUEUE_ENDED');
          this.emit('PLAYBACK_STOPPED')
        } else if ((this.queue.config.loop == true || this.queue.current.loop == true) && this.queue.status !== 'stopped'){
          this.queue.status = 'pending';
          if(this.queue.current) this.queue.previous = this.queue.current;
          return this.execute()
        }
          else this.emit('PLAYBACK_STOPPED')
      })
      if (this.selectorFlag) {
        this.queue.connection.on('stateChange', (oldState, newState) => {
          if (newState.status == 'disconnected') {
            this.queue.connection.destroy;
            this.queue.player.stop();
            this.queue.isPlaying = false;
            this.emit('DISCONNECTED');
          }
        })
      }
        this.queue.player.on('error', (queue, err) => {
          this.queue.songs.unshift(this.queue.current);
          let embed = embedGenerator.run('warnings.error_05')
          console.log('[ERROR 403] Unfortunately unpossible to be fixed from our side!');
          console.log(err);
          this.message.channel.send({
            embeds: [embed]
          })
        })
      this.selectorFlag = false;
  }

  async execute() {
    try {
      this.getQueue();
      this.emit('INFO', '[INFO] [PL] start function activated!');
      if (this.queue.status !== 'playing' && this.queue.status !== 'paused') {
        this.createConnection().then(async (status) => {
          if (status == 'ready') {
            this.emit('INFO', '[INFO] [PL] audioPlayer constructor activated!');
            this.queueSongsChanger();
            await this.createPlayer();
            await this.createStream(this.queue.current.url);
            await this.createResource();
            await this.play();
            this.setQueue();
            this.emit('LOADING_DONE');
          }
        })
      } else {
        this.setQueue();
        this.emit('SONG_ADDED', this.queue.songs[this.queue.songs.length - 1])
      }
    } catch (error) {
      this.emit('ERROR');
      console.log(error)
    }
  }

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
        if(this.selectorFlag){
        connection.on('stateChange', (oldState, newState) => { 
          if (newState.status == 'ready') {
            this.queue.connection = connection, resolve(newState.status);
            this.emit('CONNECTED')
          }
        })
      }
    })
      return await promise;
    } catch (err) {this.emit('ERROR', '[ERROR] [P] createConnection function error');console.log(err)}
  }

  async createPlayer() {
    this.emit('INFO', '[INFO] [PL] createPlayer function activated!');
    try {
      const player = createAudioPlayer();
      this.queue.player = player;
    } catch (err) {this.emit('ERROR', '[ERROR] [P] createPlayer function error');console.log(err)}
    this.setQueue();
  }

  async createStream(source){
    this.emit('INFO', '[INFO] [PL] createStream function activated!');
    try{
      const stream = ytdl(source, {filter: 'audioonly',highWaterMark: 1024 * 1024 * 10});
      this.queue.stream = stream;
    }catch(err){this.emit('ERROR','[ERROR] [P] createStream function error');console.log(err)}
  }

  async createResource(){
    this.emit('INFO', '[INFO] [PL] createResource function activated!');
    try{
      const resource = createAudioResource(this.queue.stream,{inlineVolume: true});
      resource.volume.setVolume(this.queue.config.volume/100);
      this.queue.resource = resource;
    }catch(err){this.emit('ERROR','[ERROR] [P] createResource function error');console.log(err)}
  }

  async play(){
    this.emit('INFO', '[INFO] [PL] play function activated!');
    try{
      //this.queue.current = this.queue.songs[0];
      this.queue.current.startTime = new Date().getTime()
      this.queue.player.play(this.queue.resource);
      this.queue.connection.subscribe(this.queue.player);
      this.queue.status = 'playing';
      this.setQueue();
      this.emit('PLAYBACK_STARTED',this.queue);
    }catch(err){this.emit('ERROR','[ERROR] [P] play function error');console.log(err)}
  }

  getQueue(){
    this.queue = this.message.client.queue.get(this.message.guild.id);
  }

  getClient(){
    this.client = this.message.client;
  }

  setQueue(){
    this.message.client.queue.set(this.message.guild.id, this.queue);
  }

  queueSongsChanger(){
    this.getQueue();
    if(this.queue.current && ((this.queue.config.loop == true && this.queue.songs.length == 0) || this.queue.current.loop == true)){
      return 0;
    }
    else if(this.queue.config.loop == true){
      let buffer = this.queue.current;
      this.queue.current = this.queue.songs[0];
      this.queue.songs.splice(0, 1);
      this.queue.songs.push(buffer)
    }
    else {
      this.queue.current = this.queue.songs[0];
      this.queue.songs.splice(0, 1);
    }
    this.setQueue();
    }
    
  pause() {
    this.getQueue();
    if (this.queue.status == 'paused') {
      return false
    } else {
      this.queue.status = 'paused';
      this.queue.player.pause();
      this.queue.current.pauseTime = new Date().getTime();
      this.setQueue();
      return true;
    }
  }

  togglePause(){
    this.getQueue();
    if(this.queue.status == 'paused') {this.resume(); this.setQueue(); return true}
    else {this.pause(); return false}
  }

  resume() {
    this.getQueue();
    if (this.queue.status == 'playing') {
      return false
    } else {
      this.queue.status = 'playing';
      this.queue.player.unpause();
      this.queue.current.resumeTime = new Date().getTime();
      if(!this.queue.current.totalPausedTime) this.queue.current.totalPausedTime = 0;
      this.queue.current.totalPausedTime += this.queue.current.resumeTime - this.queue.current.pauseTime;
      this.setQueue();
      return true;
    }
  }

  stop(){
    this.getQueue();
    this.queue.queueMaster.clearQueue();
    this.queue.status = 'stopped';
    this.queue.player.stop();
    this.setQueue();
    return true;
  }

  skip(){
    this.getQueue();
    this.queue.status = 'pending';
    this.queue.player.stop();
    this.setQueue();
    return true;
  }

  queueLoop(option){
    this.getQueue();
    if(option == true) this.queue.config.loop = true;
    if(option == false) this.queue.config.loop = false;
    this.setQueue();
  }

  toggleQueueLoop(){
    this.getQueue();
    if(this.queue.config.loop) {this.queue.config.loop = false; this.setQueue(); return false}
    else {this.queue.config.loop = true; this.setQueue(); return true}
  }

  toggleSongLoop(){
    this.getQueue();
    if(this.queue.current.loop) {this.queue.current.loop = false; this.setQueue(); return false}
    else {this.queue.current.loop = true; this.setQueue(); return true}
  }

  songLoop(option){
    this.getQueue();
    if(option == true) this.queue.current.loop = true;
    if(option == false) this.queue.current.loop = false;
    this.setQueue();
  }

  skipTo(args){
    this.getQueue();
    if (args > this.queue.songs.length) return false
    else if (args == 1 || args == 0) {this.skip(); return true}
    if (this.queue.config.loop == true) {
      for (let i = 0; i < args - 2; i++) {
        this.queue.songs.push(this.queue.songs.shift());
      }
    } else {this.queue.songs = this.queue.songs.slice(args - 2);}
    this.queue.status = 'pending';
    this.queue.player.stop();
    this.setQueue();
    return true;
  }
  }
  exports.player = player;

