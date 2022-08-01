const play = require('play-dl');
const stop = require('../commands/music/stop')
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

  async startPlayback(params) {
    if (params?.voiceChannel) this.guild.voiceChannel = params.voiceChannel;
    if (params?.textChannel) this.guild.textChannel = params.textChannel;
    if (!this.queue.current) this.guild.queueManager.setNextCurrentSong();
    this.emit("PLAYBACK_STARTING", this.queue);
    this.queue.status = 'loading';
    await this.createConnection()
    if (!this.queue?.current?.url) return 0;
    if (!this.player) await this.createPlayer();
    await this.createStream(this.queue?.current?.url, params?.seek);
    await this.createResource();
    await this.play();
    await this.createIdleHandler();
    this.guild.queueManager.clearStates();
    this.createVoiceStateHandler();
  }

  async createIdleHandler() {
    if (this.player.listeners(AudioPlayerStatus.Idle).length !== 0) this.player.removeAllListeners(AudioPlayerStatus.Idle);
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.queue.status = 'pending';
      if (this.queue.isSeek == true) return 0;
      if (this.queue.isSkipped == true || this.queue.isStopped == true) { this.emit('PLAYBACK_STOPPED'); return 0 };
      if (this.queue.songs.length == 0 && this.queue.isStopped !== true && this.queue.loop !== true && this.queue.current.loop !== true) {
        this.emit('QUEUE_ENDED', this.queue);
        this.emit('PLAYBACK_STOPPED', this.queue);
        stop.run({ guild: this.guild })
      } else if ((this.queue.songs.length > 0 && this.guild.params?.autoContinue == true) || this.queue.loop == true || this.queue.current.loop == true) {
        this.guild.queueManager.setNextCurrentSong();
        this.startPlayback()
      }
      else if (this.guild.params?.autoContinue == false) {
        this.guild.queueManager.setNextCurrentSong();
        this.emit('PLAYBACK_STOPPED');
      }
      else { this.emit('PLAYBACK_STOPPED', this.queue); }
    })
  }

  async createVoiceStateHandler() {
    if (this.client.listeners('voiceStateUpdate').length !== 0) this.client.removeAllListeners('voiceStateUpdate');
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      if (oldState.member.user.id == this.client.user.id) {
        if (newState.channelId == null) {
          if (this.queue.disconnectReason == "inactivity") this.emit('INACTIVITY_DISCONNECTED');
          else this.emit('DISCONNECTED')
          this.connection.destroy();
          stop.run({ guild: this.guild })
        }
        else {
          this.guild.voiceChannel = newState;
        }
      }
    })
  }

  async createConnection() {
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

  async createPlayer() {
    const player = createAudioPlayer();
    this.player = player;
    this.player.seekPoint = 0;
    this.emit('PLAYER_CREATED', this.queue);
  }

  async createStream(source, seek) {
    const stream = await play.stream(source, { seek: seek || null });
    this.stream = stream;
    this.emit('STREAM_CREATED', this.queue);
  }

  async createResource() {
    const resource = createAudioResource(this.stream.stream, { inlineVolume: true, inputType: this.stream.type });
    resource.volume.setVolume(this.guild.params.volume / 100);
    this.resource = resource;
    this.emit('RESOURCE_CREATED', this.queue);
  }

  async play() {
    this.player.play(this.resource);
    this.connection.subscribe(this.player);
    this.queue.status = 'playing';
    this.emit('PLAYBACK_STARTED', this.queue);
    this.queue.current.startTime = new Date().getTime()
  }

  connect(voiceChannel, guild) {
    this.guild.voiceChannel = voiceChannel;
    this.guild = guild;
    this.createConnection();
    return { executionResult: true }
  }

}
exports.PlayerManager = PlayerManager;

