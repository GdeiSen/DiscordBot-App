const { queue_ } = require("../music_engine/objects/queue")
const play = require('play-dl');
const config = require('../../config.json')
const EventEmitter = require('events');
class queueMaster extends EventEmitter {

  constructor(client, message) {
    super();
    this.client = client;
    this.message = message;
    this.fileSystemManager = client.fileSystemManager;
    this.queue = new queue_;
    this.status = 'pending';
    this.buffer = [];
    play.setToken({ youtube: { cookie: 'YSC=3sLnJ5VVdxw; VISITOR_INFO1_LIVE=wPyzU5qPOmU; HSID=A4tVSjJSV3FA_Q7MH; SSID=APqQia2ikcfwUgFQD; APISID=0M4OR2RVlN7BtA3L/AaUjIGTC2zeaGyRiD; SAPISID=SYKRUYNz26JN-SSF/AAKP_8ukEM-rw25Je; __Secure-1PAPISID=SYKRUYNz26JN-SSF/AAKP_8ukEM-rw25Je; __Secure-3PAPISID=SYKRUYNz26JN-SSF/AAKP_8ukEM-rw25Je; LOGIN_INFO=AFmmF2swRAIgKuoFsle0PioQhM7OxcpwDCT_WPZV0wPv_NGmGyK289QCIE2mrYk0xx1Gabs1yo2UKcC-dmOIViExHuEpB4kyVkRx:QUQ3MjNmeHNMNHdwVnNNQTNfMEZRYzJiRGNzUFZUazNxZTJWVWdmWWR1QzR0eXZ5eHpGczBRd0F1TE0tdVcxdjFMck9MR3ZtOG9RS09rV0Q1TWJ4anZSM1VhdW9NYnhSSlV2UUJBZ19RVlB3X3VhREs3OGRWM2JXVWlFMFlWWnZYU1U5TEhoWVRRY0gzYWRqRjdLY2ZFTXVySjhueTlkZXdR; wide=1; SID=FQj4xdXqr5YDaCEJyn2ayleC3CxxcDthCFxMCGpRwVkS8RvVCT64QrWnzBaQobG9W1v3fA.; __Secure-1PSID=FQj4xdXqr5YDaCEJyn2ayleC3CxxcDthCFxMCGpRwVkS8RvVnERZ1Cc_5W9dcnrhlRfHhQ.; __Secure-3PSID=FQj4xdXqr5YDaCEJyn2ayleC3CxxcDthCFxMCGpRwVkS8RvVz6pZQGte6iWJzXUs1Wryqw.; PREF=f6=40000080&tz=Europe.Moscow&f5=30000; SIDCC=AJi4QfGuNE21n2QwbG-0WzMzKF4h0QHkL7RNXUcUmivnRbfSjl-lZZq2ZjUybfKtqS1ln6Q9rQ; __Secure-3PSIDCC=AJi4QfG9Z9SiS6iwTL_DZMr1rT-7vYYf5-2HzJFogEs8zy2OSsm7vRQ7Xk45Uz-VEJC1fYVtTA' } })
    play.setToken({
      spotify: {
        client_id: config.SPOTIFY_CLIENT_ID,
        client_secret: config.SPOTIFY_CLIENT_SECRET,
        token_type: config.SPOTIFY_TOKEN_TYPE,
        access_token: config.SPOTIFY_ACCES_TOKEN,
        refresh_token: config.SPOTIFY_REFRESH_TOKEN,
        market: config.SPOTIFY_MARKET,
        expires_in: config.SPOTIFY_EXPIRES_IN,
        expiry: config.SPOTIFY_EXPIRY,
        redirect_url: config.SPOTIFY_REDIRECT_URL
      }
    })
  }
  async execute(args, options) {//More correct way to execute queueMaster
    if (play.is_expired()) {
      await play.refreshToken();
    }
    if (options === 'resolvePlaylistAuto') {
      this.resolvePlaylistAuto(args);
    }
    else if (options === 'resolveAllAuto') {
      this.resolveAllAuto(args);
    }

  }

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

  async resolveAllAuto(query) {
    try {
      this.buffer = [];
      //if (this.status !== 'pending') { this.emit('ERROR', "[ERROR] [QM] resolveAllAuto already busy!"); return 0 }
      this.status = 'loading';
      this.emit('INFO', "[INFO] [QM] resolveAllAuto function activated!")
      const youtubeVideoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
      const spotifySongPattern = /^((https:)?\/\/)?open.spotify.com\/(track)\//;
      const spotifyAlbumPattern = /^((https:)?\/\/)?open.spotify.com\/(album)\//;
      const spotifyPlaylistPattern = /^((https:)?\/\/)?open.spotify.com\/(playlist)\//;
      const youtubePlaylistPattern = /^.*(list=)([^#\&\?]*).*/gi;
      if (youtubePlaylistPattern.test(query)) {
        this.YTPlaylistByLinkMethod(query);
        this.emit('INFO', "[INFO] [QM] selector youtube playlist activated!")
      } else if (youtubeVideoPattern.test(query)) {
        this.YTSongByLinkMethod(query);
        this.emit('INFO', "[INFO] [QM] selector youtube song activated!")
      } else if (spotifySongPattern.test(query)) {
        this.SPSongByLinkMethod(query);
        this.emit('INFO', "[INFO] [QM] selector spotify song activated!")
      } else if (spotifyAlbumPattern.test(query)) {
        this.SPPlaylistByLinkMethod(query);
        this.emit('INFO', "[INFO] [QM] selector spotify album activated!")
      } else if (spotifyPlaylistPattern.test(query)) {
        this.SPPlaylistByLinkMethod(query);
        this.emit('INFO', "[INFO] [QM] selector spotify playlist activated!")
      } else {
        this.YTSongByTitleMethod(query);
        this.emit('INFO', "[INFO] [QM] selector song by title activated!")
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] resolveAuto function error!"); console.log(err); }
  }

  async resolvePlaylistAuto(query) {
    if (this.status !== 'pending') { this.emit('ERROR', "[ERROR] [QM] resolveAllAuto already busy!"); return 0 }
    this.status = 'loading';
    try {
      this.buffer = [];
      this.emit('INFO', "[INFO] [QM] resolvePlaylistAuto function activated!")
      const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
      if (playlistPattern.test(query)) {
        this.YTPlaylistByLinkMethod(query);
      } else {
        this.YTPlaylistByTitleMethod(query);
      }
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] playlist resolved method error!"); console.log(err); }
  }

  async YTPlaylistByLinkMethod(link) {
    try {
      let playlistObject = await this.getYTPlayist(link);
      let playlistVideos = playlistObject.videos;
      let playlist = playlistObject.playlist;
      this.queue.songs = this.queue.songs.concat(playlistVideos);
      this.emit('PLAYLIST_LOADING_DONE', playlist, this.message.author.username);
      this.status = "pending";
    } catch (error) { this.status = "pending"; return 0 }
  }

  async YTPlaylistByTitleMethod(title) {
    try {
      let link = await this.getYTPlayistUrl(title);
      let playlistObject = await this.getYTPlayist(link);
      let playlistVideos = playlistObject.videos;
      let playlist = playlistObject.playlist;
      this.queue.songs = this.queue.songs.concat(playlistVideos);
      this.emit('PLAYLIST_LOADING_DONE', playlist, this.message.author.username);
      this.status = "pending";
    } catch (error) { this.status = "pending"; return 0 }
  }

  async YTSongByLinkMethod(link) {
    try {
      let song = await this.getYTSong(link);
      this.queue.songs.push(await song);
      this.emit('SONG_LOADING_DONE');
      this.status = "pending";
    } catch (error) { this.status = "pending"; return 0 }
  }

  async YTSongByTitleMethod(title) {
    try {
      let link = await this.getYTSongUrl(title);
      let song = await this.getYTSong(link);
      this.queue.songs.push(song);
      this.emit('SONG_LOADING_DONE');
      this.status = "pending";
    } catch (error) { this.status = "pending"; return 0 }
  }

  async SPSongByLinkMethod(SPlink) {
    try {
      let SPsong = await this.getSPSong(SPlink);
      let YTlink = await this.getYTSongUrl(`${SPsong.name} ${SPsong.artists[0].name}`);
      let YTsong = await this.getYTSong(YTlink);
      this.queue.songs.push(YTsong);
      this.emit('SONG_LOADING_DONE');
      this.status = "pending";
    } catch (error) { this.status = "pending"; return 0 }
  }

  async SPPlaylistByLinkMethod(link) {
    try {
      let SPplaylistObject = await this.getSPPlaylist(link);
      let SPsongs = SPplaylistObject.songs;
      let SPplaylist = SPplaylistObject.playlist;
      let length = SPsongs.length;
      for (let index = 0; index < length; index++) {
        let YTlink = await this.getYTSongUrl(`${SPsongs[index]?.name} ${SPsongs[index]?.artists[0]?.name}`);
        let YTsong = await this.getYTSong(YTlink);
        if (YTsong) this.queue.songs.push(YTsong);
        if (index === (length - 1)) {
          this.emit('PLAYLIST_LOADING_DONE', SPplaylist, this.message.author.username);
          this.status = "pending";
        }
      }
    } catch (error) { this.status = "pending"; return 0 }
  }

  async getSPSong(link) {
    let promise = new Promise(async (resolve, reject) => {
      try {
        this.emit('INFO', "[INFO] [QM] getSPSong function activated!")
        let title = await play.spotify(link);
        if (title) resolve(title);
      } catch (error) {
        this.emit('ERROR', "[ERROR] [QM] getSPSong function error!");
        reject(error);
      }
    })
    return promise;
  }

  async getSPPlaylist(link) {
    let promise = new Promise(async (resolve, reject) => {
      try {
        this.emit('INFO', "[INFO] [QM] getSPPlaylist function activated!")
        let playlist = await play.spotify(link);
        await playlist.fetch();
        playlist.page(1);
        for (let index = 0; index < playlist.tracksCount; index++) {
          this.addSongToBuffer(playlist.page(1)[index])
          if (index == playlist.tracksCount - 1) {
            resolve({ songs: this.buffer, playlist: playlist });
          }
        }
      } catch (error) {
        this.emit('ERROR', "[ERROR] [QM] getSPPlaylist function error!");
        reject(error);
      }
    })
    return promise;
  }

  async getYTPlayistUrl(title) {
    let promise = new Promise(async (resolve, reject) => {
      this.emit('INFO', "[INFO] [QM] getYTPlayistUrl function activated!")
      try {
        const results = await play.search(title, { source: { youtube: "playlist" }, limit: 1 })
        this.fileSystemManager.setValue('requests', 'NUMBER OF YOUTUBE PLAYLIST SEARCH REQUESTS');
        let playlist = results[0];
        resolve(playlist.url);
      } catch (error) {
        this.emit('ERROR', "[ERROR] [QM] getYTPlayistUrl function error!");
        reject(error);
      }
    })
    return promise;
  }

  async getYTPlayist(link) {
    let promise = new Promise(async (resolve, reject) => {
      this.emit('INFO', "[INFO] [QM] getYTPlayist function activated!")
      try {
        let song;
        const playlist = await play.playlist_info(link, { source: { youtube: "playlist" } })
        this.fileSystemManager.setValue('requests', 'NUMBER OF YOUTUBE PLAYLIST GET REQUESTS');
        for (let index = 0; index < playlist.videos.length; index++) {
          song = await this.songConstructor(playlist.videos[index]);
          await this.addSongToBuffer(song, 'playlist_song');
          if (index == playlist.videos.length - 1) {
            resolve({ videos: this.buffer, playlist: playlist });
          }
        }
      } catch (error) {
        this.emit('ERROR', "[ERROR] [QM] getYTPlayist function error!");
        reject(error);
      }
    })
    return promise;
  }

  async getYTSong(query) {
    let promise = new Promise(async (resolve, reject) => {
      this.emit('INFO', "[INFO] [QM] getYTSong function activated!")
      try {
        const video = await play.search(query, { source: { youtube: "video" }, limit: 1 });
        this.fileSystemManager.setValue('requests', 'NUMBER OF YOUTUBE SONG GET REQUESTS');
        let song = await this.songConstructor(video[0]);
        resolve(song);
      } catch (error) {
        this.emit('ERROR', "[ERROR] [QM] getYTSong function error!");
        reject(error);
      }
    })
    return promise;
  }

  async getYTSongUrl(name, option) {
    let promise = new Promise(async (resolve, reject) => {
      this.emit('INFO', "[INFO] [QM] getYTSongUrl function activated!")
      try {
        let element = await play.search(name, { source: { youtube: "video" }, limit: 1 })
        this.fileSystemManager.setValue('requests', 'NUMBER OF YOUTUBE SONG SEARCH REQUESTS');
        element = element[0];
        resolve(element.url);
      } catch (error) {
        this.emit('ERROR', "[ERROR] [QM] getYTSongUrl function error!");
        reject(error);
      }
    })
    return promise;
  }

  async addSongToBuffer(song, option) {
    try {
      this.emit('INFO', '[INFO] [QM] addSongToBuffer function activated!')
      if (!this.getQueue()) return 0;
      if (!song) return 0;
      this.buffer.push(song);
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] getYTSongUrl function error!");
    }
  }

  async pushBufferToQueue(buffer, option) {
    try {
      this.emit('INFO', '[INFO] [QM] pushBufferToQueue function activated!')
      if (!this.getQueue()) { await this.createQueue(); this.pushBufferToQueue(buffer, option); }
      this.queue = this.getQueue();
      this.queue.songs = this.queue.songs.concat(buffer);
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] pushBufferToQueue function error!");
    }
  }

  async songConstructor(video) {
    this.emit('INFO', "[INFO] [QM] songConstructor function activated!")
    try {
      let song = video;
      song['author'] = this.message.author.username;
      song['thumbnail'] = song.thumbnails[0].url;
      return song;
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] songConstructor function error!");
    }
  }
}
exports.queueMaster = queueMaster;