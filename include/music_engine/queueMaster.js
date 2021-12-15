const { queue_ } = require("../music_engine/objects/queue")
const { song_ } = require("../music_engine/objects/song")
const Youtube = require("simple-youtube-api");
const play = require('play-dl');
const config = require("../../config.json");
const youtube = new Youtube(config.YOUTUBE_API_KEY);
const EventEmitter = require('events');
const { resolve } = require("path");
class queueMaster extends EventEmitter {

  constructor(client, message) {
    super();
    this.client = client;
    this.message = message;
    this.queue = new queue_;
    this.status = 'pending';
    this.buffer = [];
  }
  //======================================================================================== QUEUE FUNCTIONS
  getQueue() {
    if (this.client.queue) {
      return this.client.queue.get(this.message.guild.id);
    }
  }

  async createQueue() {
    try {
      this.emit('INFO', '[INFO] [QM] createQueue function activated!')
      if (this.getQueue() != null) return await this.getQueue();
      else {
        this.queue.guild = this.message.guild;
        this.queue.channel = this.message.channel;
        this.queue.voiceChannel = this.message.member.voice.channel;
        this.message.client.queue.set(this.message.guild.id, this.queue);
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] clearQueue function error!"); console.log(err); }
  }

  async clearQueue() {
    try {
      this.emit('INFO', '[INFO] [QM] clearQueue function activated!')
      if (this.getQueue() !== null) {
        this.queue.songs = [];
        this.queue.current = [];
        this.queue.config.loop = false;
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] clearQueue function error!"); console.log(err); }
  }
  //======================================================================================== AUTO BLOCK
  //==================================== RESOLVE MODE SELECTOR
  async resolveAllAuto(query) {
    try {
      this.buffer = [];
      this.emit('INFO', "[INFO] [QM] selector activated!")
      const youtubeVideoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
      const spotifySongPattern = /^((https:)?\/\/)?open.spotify.com\/(track)\//;
      const spotifyAlbumPattern = /^((https:)?\/\/)?open.spotify.com\/(album)\//;
      const spotifyPlaylistPattern = /^((https:)?\/\/)?open.spotify.com\/(playlist)\//;
      const youtubePlaylistPattern = /^.*(list=)([^#\&\?]*).*/gi;
      if (youtubePlaylistPattern.test(query)) {
        this.youTubePlayistByLink(query);
        this.emit('INFO', "[INFO] [QM] selector youtube playlist activated!")
      } else if (youtubeVideoPattern.test(query)) {
        this.youTubeSongByLink(query);
        this.emit('INFO', "[INFO] [QM] selector youtube song activated!")
      } else if (spotifySongPattern.test(query)) {
        this.spotifySongBylink(query);
        this.emit('INFO', "[INFO] [QM] selector spotify song activated!")
      } else if (spotifyAlbumPattern.test(query)) {
        this.spotifyAlbumByLink(query);
        this.emit('INFO', "[INFO] [QM] selector spotify album activated!")
      } else if (spotifyPlaylistPattern.test(query)) {
        this.spotifyPlaylistByLink(query);
        this.emit('INFO', "[INFO] [QM] selector spotify playlist activated!")
      } else{
        this.youtubeSongByTitle(query);
        this.emit('INFO', "[INFO] [QM] selector song by title activated!")
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] resolveAuto function error!"); console.log(err); }
  }
  //======================================================================================== PLAYLIST BLOCK
  //==================================== RESOLVE MODE SELECTOR
  async resolvePlaylistAuto(query) {
    try {
      this.buffer = [];
      this.emit('INFO', "[INFO] [QM] playllist selector activated!")
      const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
      if (playlistPattern.test(query)) {
        this.youTubePlayistByLink(query);
        this.emit('INFO', "[INFO] [QM] selector playlist activated!")
      } else {
        this.youTubePlayistByTitle(query);
        this.emit('INFO', "[INFO] [QM] selector playlist by title activated!")
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] playlist resolved method error!"); console.log(err); }
  }
  //==================================== BY TITLE RESOLVER
  async youTubePlayistByTitle(title) {
    this.emit('INFO', "[INFO] [QM] playlist by title resolved method activated!")
    try {
      const results = await youtube.searchPlaylists(title, 1, { part: 'snippet' });
      let playlist = results[0];
      this.youTubePlayistByLink(playlist.url);
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] playlist by title resolved method error!"); console.log(err); }
  }
  //==================================== BY LINK RESOLVER
  async spotifyPlaylistByink(query){
    play.spotify()
  }
  async spotifyAlbumByink(query){
    play.spotify()
  }
  async youTubePlayistByLink(link) {
    this.emit('INFO', "[INFO] [QM] playlist resolved method activated!")
    try {
      const playlist = await youtube.getPlaylist(link);
      const videosObj = await playlist.getVideos();
      for (let i = 0; i < videosObj.length; i++) {
        const video = await videosObj[i].fetch();
        let song = await this.songConstructor(video);
        await this.addSongToBuffer(song, 'playlist_song');//To not fill the queue if an error occurs
      }
      this.pushBufferToQueue(this.buffer, 'playlist_song');
      console.log(this.buffer);
      this.emit('PLAYLIST_LOADING_DONE', playlist, this.message.author.username);
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] youtube playlist resolved method error!"); console.log(err); }
  }
  //======================================================================================== SONG BLOCK
  //==================================== BY LINK RESOLVER
  async spotifySongBylink(query){
    let sp_data = await play.spotify(query);
    this.youtubeSongByTitle(`${sp_data.name} ${sp_data.artists[0].name}`);
  }
  
  async youTubeSongByLink(query) {
    this.emit('INFO', "[INFO] [QM] song resolved method activated!")
    try {
      const video = await youtube.getVideo(query);
      let song = await this.songConstructor(video);
      await this.addSong(song);
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] song resolved method error!"); console.log(err); }
  }
  //==================================== BY TITLE RESOLVER
  async youtubeSongByTitle(name) {
    this.emit('INFO', "[INFO] [QM] song by title resolved method activated!")
    try {
      let element = await youtube.searchVideos(name, 1);
      element = element[0];
      let query = `https://www.youtube.com/watch?v=${element.raw.id.videoId}`
      await this.youTubeSongByLink(query);
    } catch (err) { this.emit('ERROR', `[ERROR] [QM] song by title resolved method error!`); console.log(err); }
  }
  //======================================================================================== ADD FUNCTIONS
  //==================================== STANDART ADD FUNCTIONS
  async addSong(song, option) {
    try {
      this.emit('INFO', '[INFO] [QM] addSong function activated!')
      if (this.getQueue() != undefined) {
        this.queue = this.getQueue();
        this.queue.songs.push(song);
        if (!option || option !== 'playlist_song') this.emit('SONG_LOADING_DONE');
      } else {
        await this.createQueue();
        this.addSong(song, option);
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] addSong function error!"); console.log(err); }
  }

  async addSongs(song_arr) {
    try {
      this.emit('INFO', '[INFO] [QM] addSongs function activated!')
      for (let index = 0; index < song_arr.length; index++) {
        await this.addSong(song_arr[index])
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] addSongs function error!"); console.log(err); }
  }
  //==================================== BUFFER MECHANIC ADD FUNCTIONS
  async addSongToBuffer(song, option) {
    try {
      this.emit('INFO', '[INFO] [QM] addSongToBufer function activated!')
      if (this.getQueue() != undefined) {
        this.buffer.push(song);
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] addSong function error!"); console.log(err); }
  }

  async pushBufferToQueue(buffer, option) {
    try {
      this.emit('INFO', '[INFO] [QM] pushBufferToQueue function activated!')
      if (this.getQueue() != undefined) {
        this.queue = this.getQueue();
        this.queue.songs = this.queue.songs.concat(buffer);
        if (!option || option !== 'playlist_song') this.emit('SONG_LOADING_DONE');
        resolve();
      } else {
        await this.createQueue();
        this.pushBufferToQueue(buffer, option);
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] addSong function error!"); console.log(err); }
  }

  async addSongsToBuffer(song_arr) {
    try {
      this.emit('INFO', '[INFO] [QM] addSongs function activated!')
      for (let index = 0; index < song_arr.length; index++) {
        await this.addSongToBuffer(song_arr[index])
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] addSongs function error!"); console.log(err); }
  }
  //======================================================================================== CONSTRUCT FUNCTION
  async songConstructor(video) {
    this.emit('INFO', "[INFO] [QM] song constructor activated!")
    try {
      let song = new song_;
      song.url = `https://www.youtube.com/watch?v=${video.raw.id}`;
      song.title = video.raw.snippet.title;
      song.thumbnail = video.thumbnails.high.url;
      song.author = this.message.author.username;
      if (video.duration.seconds == 0 && video.duration.minutes == 0 && video.duration.hours == 0) {
        song.duration = 'Live Stream';
        song.onAir = true
      }
      else {//TRASH
        let hours;
        let minutes;
        let seconds;
        if (video.duration.hours < 10) { hours = `0${video.duration.hours}` } else { hours = video.duration.hours }
        if (video.duration.minutes < 10) { minutes = `0${video.duration.minutes}` } else { minutes = video.duration.minutes }
        if (video.duration.seconds < 10) { seconds = `0${video.duration.seconds}` } else { seconds = video.duration.seconds }
        song.duration = `${hours}:${minutes}:${seconds}`;
      }
      song.durationObj = video.duration;
      return song;
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] song constructor method error!"); console.log(err); }
  }
}
exports.queueMaster = queueMaster;