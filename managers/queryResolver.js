const play = require("play-dl");
const config = require("../config.json");
const EventEmitter = require("events");
class QueryResolver extends EventEmitter {
  constructor() {
    super();
    this.status = "pending";
    this.buffer = [];
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

  async search(query, message, options) {
    this.buffer = [];
    let type;
    this.message = message;
    if (play.is_expired()) {
      await play.refreshToken();
    }
    let promise = new Promise(async (resolve, reject) => {
      if (options?.searchType == 'playlist') type = 'yt_playlist';
      else type = await play.validate(query);
      switch (type) {
        case "yt_video":
          this.emit("YT_VIDEO_RESOLVE_START");
          resolve(await this.YT_VideoSolver(query));
          break;
        case "yt_playlist":
          this.emit("YT_PLAYLIST_RESOLVE_START");
          resolve(await this.YT_PlaylistSolver(query));
          break;
        case "sp_track":
          this.emit("SP_TRACK_RESOLVE_START");
          resolve(await this.SP_TrackSolver(query));
          break;
        case "sp_playlist":
          this.emit("SP_PLAYLIST_RESOLVE_START");
          resolve(await this.SP_PlaylistSolver(query));
          break;
        case "sp_album":
          this.emit("SP_PLAYLIST_RESOLVE_START");
          resolve(await this.SP_PlaylistSolver(query));
          break;
        case "search":
          this.emit("YT_VIDEO_RESOLVE_START");
          resolve(await this.Search_VideoSolver(query));
          break;
        default:
          break;
      }
    });
    return await promise;
  }

  async Search_VideoSolver(query, options) {
    let buffer = []
    let yt_video;
    let limit = 1
    if (options?.limit) limit = options.limit
    let promise = new Promise(async (resolve, reject) => {
      try {
        yt_video = await play.search(query, {
          source: { youtube: "video" },
          limit: limit,
        });
        buffer.push(this.songConstructor(yt_video[0]));
        this.emit("YT_VIDEO_RESOLVED", yt_video[0]);
        resolve(buffer);
      } catch (error) {
        this.emit("ERROR", "YT_VIDEO_NOT_FOUND");
        console.log(error);
        return 0;
      }
    });
    return promise;
  }

  async YT_VideoSolver(query) {
    let buffer = []
    let yt_video;
    let promise = new Promise(async (resolve, reject) => {
      try {
        yt_video = await play.search(query, {
          source: { youtube: "video" },
          limit: 1,
        });
        buffer.push(this.songConstructor(yt_video[0]));
        this.emit("YT_VIDEO_RESOLVED", yt_video[0]);
        resolve(buffer);
      } catch (error) {
        this.emit("ERROR", "YT_VIDEO_NOT_FOUND");
        return 0;
      }
    });
    return promise;
  }

  async YT_PlaylistSolver(query) {
    let buffer = []
    let yt_playlist;
    let queryUrl;
    try {
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
        await yt_playlist.videos.map((yt_video) => {
          yt_video = this.songConstructor(yt_video);
        });
        buffer = yt_playlist.videos.slice();
        this.emit("YT_PLAYLIST_RESOLVED", yt_playlist);
        resolve(buffer);
      });
      return promise;
    } catch (error) {
      this.emit("ERROR", "YT_PLAYLIST_NOT_FOUND");
      console.log(error);
      return 0;
    }
  }

  async SP_TrackSolver(query) {
    let buffer = []
    let yt_video;
    let sp_track;
    let promise = new Promise(async (resolve, reject) => {
      try {
        sp_track = await play.spotify(query);
        yt_video = await play.search(
          `${sp_track.name} ${sp_track.artists[0].name}`,
          { source: { youtube: "video" }, limit: 1 }
        );
        buffer.push(this.songConstructor(yt_video[0]));
        this.emit("SP_TRACK_RESOLVED", yt_video[0]);
        resolve(buffer);
      } catch (error) {
        console.log(error);
        this.emit("ERROR", "SP_TRACK_NOT_FOUND");
        return 0;
      }
    });
    return await promise;
  }

  async SP_PlaylistSolver(query) {
    let buffer = []
    let yt_video;
    let sp_track;
    let sp_playlist;
    let promise = new Promise(async (resolve, reject) => {
      try {
        sp_playlist = await play.spotify(query);
        await sp_playlist.fetch();
        for (let index = 0; index < sp_playlist.tracksCount; index++) {
          sp_track = await sp_playlist.page(1)[index];
          yt_video = await play.search(
            `${sp_track.name} ${sp_track.artists[0].name}`,
            { source: { youtube: "video" }, limit: 1 }
          );
          if (!yt_video) {
            this.emit("ERROR", "SP_TRACK_NOT_FOUND", sp_track);
          }
          else buffer.push(this.songConstructor(yt_video[0]));
          if (index == sp_playlist.tracksCount - 1) {
            this.emit("SP_PLAYLIST_RESOLVED", sp_playlist);
            resolve(buffer);
          }
        }
      } catch (error) {
        this.emit("ERROR", "SP_PLAYLIST_NOT_FOUND");
        console.log(error);
        return 0;
      }
    });
    return await promise;
  }

  songConstructor(video) {
    if (!video) return 0;
    try {
      let song = video;
      song["author"] = this.message.author.username;
      song["thumbnail"] = song.thumbnails[0].url;
      return song;
    } catch (error) {
      this.emit("ERROR");
      console.log(error);
      return 0;
    }
  }
}
exports.QueryResolver = QueryResolver;
