  const ytdl = require("ytdl-core");
  const EventEmitter = require('events');
  const {joinVoiceChannel,getVoiceConnection,createAudioPlayer,createAudioResource,AudioPlayerStatus, VoiceConnection} = require("@discordjs/voice");
  const embedGenerator = require("../utils/embedGenerator")
  class player extends EventEmitter {
    constructor(queue,message) {
      super();
      this.message = message;
      this.queue = queue;
      this.player;
      this.connection;
      this.stream;
      this.resource;
      this.selectorFlag = true;
    }

  start(){
    if(this.selectorFlag){
      this.execute();
      this.addListeners();
    }
    else if(!this.selectorFlag){
      this.execute()
    }
  }

  addListeners() {
    this.addListener('LOADING_DONE', () => {
      this.player.on(AudioPlayerStatus.Idle, () => {
        if (this.queue.songs.length >= 1 && this.queue.status !== 'stopped') {
          this.queue.status = 'pending';
          this.queue.current = null;
          return this.start()
        } else if (this.queue.songs.length == 0 && this.queue.status !== 'stopped') {
          this.queue.status = 'pending';
          this.emit('QUEUE_ENDED');
          this.emit('PLAYBACK_STOPPED')
        } else {
          this.emit('PLAYBACK_STOPPED')
        }
      })
      if (this.selectorFlag) {
        this.connection.on('stateChange', (oldState, newState) => {
          if (newState.status == 'disconnected') {
            this.connection.destroy;
            this.player.stop();
            this.queue.isPlaying = false;
            this.emit('DISCONNECTED');
          }
        })
      }
        this.player.on('error', (queue, err) => {
          let embed = embedGenerator.run('warnings.error_05')
          console.log('[ERROR 403] Unfortunately unpossible to be fixed from our side!');
          console.log(err);
          this.message.channel.send({
            embeds: [embed]
          })
        })
      //IF SOMETHING WENT WRONG IT NEEDED TO BE FIXED
      this.selectorFlag = false;
    })
  }

  async execute() {
    try {
      this.getQueue();
      this.emit('INFO', '[INFO] [PL] start function activated!');
      if (this.queue.status !== 'playing' && this.queue.status !== 'paused') {
        this.createConnection().then(async (status) => {
          if (status == 'ready') {
            await this.emit('INFO', '[INFO] [PL] audioPlayer constructor activated!');
            await this.createPlayer();
            await this.createStream(this.queue.songs[0].url);
            await this.createResource();
            await this.play();
            await this.pushConnectionAndPlayerToQueue();
            await this.queueSongsChanger();
            await this.emit('LOADING_DONE');
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
          this.connection = connection;
          resolve(connection.state.status)
        };
        console.log(this.selectorFlag);
        if(this.selectorFlag){
        connection.on('stateChange', (oldState, newState) => { //double ready status problem!!!
          if (newState.status == 'ready') {
            this.connection = connection, resolve(newState.status);
            this.emit('CONNECTED')
          }
        })
      }
    })
      return await promise;
    } catch (err) {
      this.emit('ERROR', '[ERROR] [P] createConnection function error')
    }
  }

  async createPlayer() {
    this.emit('INFO', '[INFO] [PL] createPlayer function activated!');
    try {
      const player = createAudioPlayer();
      this.player = player;
    } catch (err) {
      this.emit('ERROR', '[ERROR] [P] createPlayer function error')
    }

  }

  async createStream(source){
    this.emit('INFO', '[INFO] [PL] createStream function activated!');
    try{
      const stream = ytdl(source, {filter: 'audioonly',highWaterMark: 1024 * 1024 * 10});
      this.stream = stream;
    }catch(err){this.emit('ERROR','[ERROR] [P] createStream function error')}
  }

  async createResource(){
    this.emit('INFO', '[INFO] [PL] createResource function activated!');
    try{
      const resource = createAudioResource(this.stream);
      this.resource = resource;
    }catch(err){this.emit('ERROR','[ERROR] [P] createResource function error')}
  }

  async pushConnectionAndPlayerToQueue(){
    this.emit('INFO', '[INFO] [PL] pushConnectionAndPlayerToQueue function activated!');
    this.queue.connection = this.connection;
    this.queue.player = this.player;
  }

  async play(){
    this.emit('INFO', '[INFO] [PL] play function activated!');
    try{
      this.queue.isPlaying = true;//WHAT THE HECH HERE
      this.queue.current = this.queue.songs[0];
      console.log(this.queue.songs[0]);
      this.player.play(this.resource);
      this.connection.subscribe(this.player);
      this.queue.status = 'playing';
      this.emit('PLAYBACK_STARTED',this.queue);
    }catch(err){this.emit('ERROR','[ERROR] [P] play function error');console.log(err)}
  }

  getQueue(){
    this.queue = this.message.client.queue.get(this.message.guild.id);;
  }
  setQueue(){
    this.message.client.queue.set(this.message.guild.id, this.queue);
  }
  queueSongsChanger(){
    this.getQueue();
    if (this.queue.songs[0].loop === false) {
      if (this.queue.config.loop === true) {
        let buffer = this.queue.songs[0];
        this.queue.songs.splice(0, 1);
        this.queue.songs.push(buffer);
      } else {
        this.queue.songs.splice(0, 1)
      }
    }
    console.log(this.queue.current);
  }
  }
  exports.player = player;

