const play = require("play-dl");
const config = require("../config.json");
const EventEmitter = require("events");
class QueryResolver extends EventEmitter {
  constructor(client, guild) {
    super();
    this.status = "pending";
    this.client = client;
    this.guild = guild;
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
        redirect_url: config.SPOTIFY_REDIRECT_URL,
      },
    });
  }

  async search(query, options) {
    let type;
    if (play.is_expired()) {
      await play.refreshToken();
    }
    let promise = new Promise(async (resolve, reject) => {
      try {
        if (options?.searchType == 'playlist') type = 'yt_playlist';
        else type = await play.validate(query);
        switch (type) {
          case "yt_video":
            this.emit("YT_VIDEO_RESOLVE_START");
            resolve(await this.YT_VideoSolver(query, options));
            this.emit("YT_VIDEO_RESOLVED");
            break;
          case "yt_playlist":
            this.emit("YT_PLAYLIST_RESOLVE_START");
            resolve(await this.YT_PlaylistSolver(query, options));
            this.emit("YT_PLAYLIST_RESOLVED");
            break;
          case "sp_track":
            this.emit("SP_TRACK_RESOLVE_START");
            resolve(await this.SP_TrackSolver(query, options));
            this.emit("SP_TRACK_RESOLVED");
            break;
          case "sp_playlist":
            this.emit("SP_PLAYLIST_RESOLVE_START");
            resolve(await this.SP_PlaylistSolver(query, options));
            this.emit("SP_PLAYLIST_RESOLVED");
            break;
          case "sp_album":
            this.emit("SP_PLAYLIST_RESOLVE_START");
            resolve(await this.SP_PlaylistSolver(query, options));
            this.emit("SP_PLAYLIST_RESOLVED");
            break;
          case "search":
            this.emit("YT_VIDEO_RESOLVE_START");
            resolve(await this.Search_VideoSolver(query, options));
            this.emit("YT_VIDEO_RESOLVED");
            break;
          default:
            break;
        }
      } catch (error) { reject(error); this.emit('ERROR', error) }
    });
    return await promise;
  }

  async searchVideos(query, options) {
    let yt_videos;
    let promise = new Promise(async (resolve, reject) => {
      yt_videos = await play.search(query, {
        source: { youtube: "video" },
        limit: options?.limit || 1,
      });
      if (yt_videos.length == 0) reject("YT_VIDEO_NOT_FOUND");
      resolve({ yt_videos });
    });
    return promise;
  }

  async Search_VideoSolver(query, options) {
    let yt_videos;
    if (options?.limit) limit = options.limit
    let promise = new Promise(async (resolve, reject) => {
      yt_videos = await play.search(query, {
        source: { youtube: "video" },
        limit: options?.limit || 1,
      });
      if (!yt_videos[0]) reject('VIDEO_NOT_FOUND')
      resolve({ yt_videos: this.songConstructor(yt_videos, options) });
    });
    return promise;
  }

  async YT_VideoSolver(query, options) {
    let yt_videos;
    let promise = new Promise(async (resolve, reject) => {
      yt_videos = await play.search(query, {
        source: { youtube: "video" },
        limit: options?.limit || 1,
      });
      if (!yt_videos) reject("YT_VIDEO_NOT_FOUND");
      resolve({ yt_videos: this.songConstructor(yt_videos, options) });
    });
    return promise;
  }

  async YT_PlaylistSolver(query, options) {
    let not_resolved = [];
    let limit_reached = false;
    let yt_playlist;
    let queryUrl;
    let params = this.guild.params;
    if (play.validate(query) !== 'yt_playlist') {
      queryUrl = await play.search(query, {
        source: { youtube: "playlist" },
        limit: 1,
      }); queryUrl = queryUrl[0].url
    }
    else queryUrl = query;
    let promise = new Promise(async (resolve, reject) => {
      yt_playlist = await play.playlist_info(queryUrl, {
        source: { youtube: "playlist" },
      });
      if (!yt_playlist) reject('YT_PLAYLIST_NOT_FOUND')
      if (yt_playlist?.videoCount == 0) reject('NO_YT_PLAYLIST_TRACKS')
      if (yt_playlist.videoCount > params.maxPlaylistSize) {
        limit_reached = true;
        if (params.strictLimits == true) reject('STRICT_PLAYLIST_SIZE_MAXIMUM')
      }
      yt_playlist.videos = this.songConstructor(yt_playlist.videos, options)
      yt_playlist.videos.splice(params.maxPlaylistSize, yt_playlist.videos.length)
      resolve({ yt_playlist, not_resolved, limit_reached });
    });
    return promise;
  }

  async SP_TrackSolver(query, options) {
    let yt_videos;
    let sp_track;
    let promise = new Promise(async (resolve, reject) => {
      sp_track = await play.spotify(query);
      if (!sp_track) resolve('SP_TRACK_NOT_FOUND')
      yt_videos = await play.search(
        `${sp_track?.name} ${sp_track?.artists[0]?.name}`,
        { source: { youtube: "video" }, limit: 1 }
      );
      if (!yt_videos) reject('SP_TRACK_NOT_FOUND')
      resolve({ sp_tracks: this.songConstructor(yt_videos, options) });
    });
    return await promise;
  }

  async SP_PlaylistSolver(query, options) {
    let not_resolved = [];
    let limit_reached = false;
    let yt_video;
    let sp_track;
    let sp_playlist;
    let params = this.guild.params;
    let promise = new Promise(async (resolve, reject) => {
      sp_playlist = await play.spotify(query);
      if (!sp_playlist) reject('SP_PLAYLIST_NOT_FOUND')
      if (sp_playlist.tracksCount == 0) reject('NO_SP_PLAYLIST_TRACKS')
      sp_playlist.videos = [];
      await sp_playlist.fetch();
      if (sp_playlist.tracksCount > params.maxPlaylistSize) limit_reached = true;
      if (sp_playlist.tracksCount > params.maxPlaylistSize && params.strictLimits == true) reject('STRICT_PLAYLIST_SIZE_MAXIMUM')
      for (let index = 0; index < sp_playlist.tracksCount; index++) {
        sp_track = await sp_playlist.page(1)[index];
        yt_video = await play.search(
          `${sp_track.name} ${sp_track.artists[0].name}`,
          { source: { youtube: "video" }, limit: 1 }
        );
        if (!yt_video) { not_resolved.push(sp_playlist.page(1)[index]) }
        else sp_playlist.videos.push(yt_video);
        if (index > params.maxPlaylistSize || index == sp_playlist.tracksCount - 1) {
          sp_playlist.videos = this.songConstructor(sp_playlist.videos, options)
          resolve({ sp_playlist, not_resolved, limit_reached });
        }
      }
    });
    return await promise;
  }

  songConstructor(videos, options) {
    videos.map((video) => {
      video.author = options?.author,
        video.thumbnail = video.thumbnails[0];
    })
    return videos;
  }
}
exports.QueryResolver = QueryResolver;
