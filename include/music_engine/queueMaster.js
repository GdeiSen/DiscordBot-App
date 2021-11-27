const { queue_ } = require("../music_engine/objects/queue")
const { song_ } = require("../music_engine/objects/song")
const Youtube = require("simple-youtube-api");
const config = require("../../config.json");
const youtube = new Youtube(config.YOUTUBE_API_KEY);
const EventEmitter = require('events');
const { threadId } = require("worker_threads");
class queueMaster extends EventEmitter{
    constructor(client, message) {
        super();
        this.client = client;
        this.message = message;
        this.queue = new queue_;
        this.status = 'pending';
    }
    getQueue() {
        if(this.client.queue){
            return this.client.queue.get(this.message.guild.id);
        }
    }
    async createQueue() {
        this.emit('INFO','[INFO] [QM] createQueue function activated!')
        if (this.getQueue() != null) return await this.getQueue();
        else {
            this.queue.guild = this.message.guild;
            this.queue.channel = this.message.channel;
            this.queue.voiceChannel = this.message.member.voice.channel;
            this.message.client.queue.set(this.message.guild.id, this.queue);
        }
    }
    async clearQueue() {
        this.emit('INFO','[INFO] [QM] clearQueue function activated!')
        if (this.getQueue() !== null){ 
            this.queue.songs = [];
            this.queue.current = [];
            this.queue.config.loop = false;
            this.message.client.queue.set(this.message.guild.id, this.queue);
        }
    }
    async addSong(song,option) {
        this.emit('INFO','[INFO] [QM] addSong function activated!')
        if (this.getQueue() != undefined) {
            this.queue = this.getQueue();
            this.queue.songs.push(song);
            this.message.client.queue.set(this.message.guild.id, this.queue);
            if(!option || option !== 'playlist_song') this.emit('SONG_LOADING_DONE');
        } else {
            await this.createQueue();
            this.addSong(song);
        }
    }
    async addSongs(song_arr) {
        this.emit('INFO','[INFO] [QM] addSongs function activated!')
        for (let index = 0; index < song_arr.length; index++) {
            await this.addSong(song_arr[index])
        }
    }
    
    async resolveAuto(query) {
        this.emit('INFO', "[INFO] [QM] selector activated!")
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        if (playlistPattern.test(query)) {
          this.resolveYouTubePlayist(query);
          this.emit('INFO', "[INFO] [QM] selector playlist activated!")
        } else if (videoPattern.test(query)) {
          this.resolveYouTubeSong(query);
          this.emit('INFO', "[INFO] [QM] selector song activated!")
        } else {
          this.resolveYoutubeSongByName(query);
          this.emit('INFO', "[INFO] [QM] selector song by title activated!")
        }
      }

    async resolvePlaylist(query) {
        this.emit('INFO', "[INFO] [QM] playllist selector activated!")
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        if (playlistPattern.test(query)) {
          this.resolveYouTubePlayist(query);
          this.emit('INFO', "[INFO] [QM] selector playlist activated!")
        } else {
          this.resolveYouTubePlayistByName(query);
          this.emit('INFO', "[INFO] [QM] selector playlist by title activated!")
        }
      }


    async resolveYouTubePlayist(query) {
        this.emit('INFO', "[INFO] [QM] playlist resolved method activated!")
        try {
          const playlist = await youtube.getPlaylist(query);
          const videosObj = await playlist.getVideos();
          for (let i = 0; i < videosObj.length; i++) {
            const video = await videosObj[i].fetch();
            let song = await this.songConstructor(video);
            await this.addSong(song,'playlist_song');
          }
          this.emit('PLAYLIST_LOADING_DONE',playlist, this.message.author.username);
        } catch (err) {
          this.emit('ERROR', "[ERROR] [QM] playlist resolved method error!");
          console.log(err);
        }
      }

    async resolveYouTubeSong(query) {
        this.emit('INFO', "[INFO] [QM] song resolved method activated!")
        try {
          const video = await youtube.getVideo(query);
          let song = await this.songConstructor(video);
          await this.addSong(song);
        } catch (err) {
          this.emit('ERROR', "[ERROR] [QM] song resolved method error!");
          console.log(err);
        }
      }

    async resolveYoutubeSongByName(name) {
        this.emit('INFO', "[INFO] [QM] song by title resolved method activated!")
        try{
        let element = await youtube.searchVideos(name, 1);
        element = element[0];
        let query = `https://www.youtube.com/watch?v=${element.raw.id.videoId}`
        await this.resolveYouTubeSong(query);
        } catch (err) {
          this.emit('ERROR', `[ERROR] [QM] song by title resolved method error!`);
          console.log(err);
        }
      }

    async resolveYouTubePlayistByName(name) {
        this.emit('INFO', "[INFO] [QM] playlist by title resolved method activated!")
        try {
          const results = await youtube.searchPlaylists(name, 1, { part: 'snippet'});
          let playlist = results[0];
          this.resolvePlaylist(playlist.url);
        } catch (err) {
          this.emit('ERROR', "[ERROR] [QM] playlist by title resolved method error!");
          console.log(err);
        }
      }

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
            song.onAir = true}
          else{
            let hours;
            let minutes;
            let seconds;
            if(video.duration.hours < 10){hours = `0${video.duration.hours}`}else{hours = video.duration.hours}
            if(video.duration.minutes < 10){minutes = `0${video.duration.minutes}`}else{minutes = video.duration.minutes}
            if(video.duration.seconds < 10){seconds = `0${video.duration.seconds}`}else{seconds = video.duration.seconds}
            song.duration = `${hours}:${minutes}:${seconds}`;
          }
          song.durationObj = video.duration;
          return song;
        } catch (err) {
          this.emit('ERROR', "[ERROR] [QM] song constructor method error!");
          console.log(err);
        }
      }
}
exports.queueMaster = queueMaster;