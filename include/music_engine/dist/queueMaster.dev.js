"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("../music_engine/objects/queue"),
    queue_ = _require.queue_;

var _require2 = require("../music_engine/objects/song"),
    song_ = _require2.song_;

var Youtube = require("simple-youtube-api");

var config = require("../../config.json");

var youtube = new Youtube(config.YOUTUBE_API_KEY);

var EventEmitter = require('events');

var queueMaster =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(queueMaster, _EventEmitter);

  function queueMaster(client, message) {
    var _this;

    _classCallCheck(this, queueMaster);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(queueMaster).call(this));
    _this.client = client;
    _this.message = message;
    _this.queue = new queue_();
    return _this;
  }

  _createClass(queueMaster, [{
    key: "getQueue",
    value: function getQueue() {
      if (this.client.queue) {
        return this.client.queue.get(this.message.guild.id);
      }
    }
  }, {
    key: "createQueue",
    value: function createQueue() {
      return regeneratorRuntime.async(function createQueue$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.emit('INFO', '[INFO] [QM] createQueue function activated!');

              if (!(this.getQueue() != null)) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return regeneratorRuntime.awrap(this.getQueue());

            case 4:
              return _context.abrupt("return", _context.sent);

            case 7:
              this.queue.guild = this.message.guild;
              this.queue.channel = this.message.channel;
              this.queue.voiceChannel = this.message.member.voice.channel;
              this.message.client.queue.set(this.message.guild.id, this.queue);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "clearQueue",
    value: function clearQueue() {
      return regeneratorRuntime.async(function clearQueue$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.emit('INFO', '[INFO] [QM] clearQueue function activated!');

              if (this.getQueue() !== null) {
                this.client.queue.songs = null;
                this.client.queue.current = null;
                this.client.queue.player = null;
                this.client.queue.connection = null;
                this.message.client.queue.set(this.message.guild.id, this.queue);
              }

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "addSong",
    value: function addSong(song) {
      return regeneratorRuntime.async(function addSong$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.emit('INFO', '[INFO] [QM] addSong function activated!');

              if (!(this.getQueue() != undefined)) {
                _context3.next = 8;
                break;
              }

              this.queue = this.getQueue();
              this.queue.songs.push(song);
              this.message.client.queue.set(this.message.guild.id, this.queue);
              this.emit('SONG_LOADING_DONE');
              _context3.next = 11;
              break;

            case 8:
              _context3.next = 10;
              return regeneratorRuntime.awrap(this.createQueue());

            case 10:
              this.addSong(song);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "addSongs",
    value: function addSongs(song_arr) {
      var index;
      return regeneratorRuntime.async(function addSongs$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              this.emit('INFO', '[INFO] [QM] addSongs function activated!');
              index = 0;

            case 2:
              if (!(index < song_arr.length)) {
                _context4.next = 8;
                break;
              }

              _context4.next = 5;
              return regeneratorRuntime.awrap(this.addSong(song_arr[index]));

            case 5:
              index++;
              _context4.next = 2;
              break;

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "resolveAuto",
    value: function resolveAuto(query) {
      var videoPattern, playlistPattern;
      return regeneratorRuntime.async(function resolveAuto$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] selector activated!");
              videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
              playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

              if (playlistPattern.test(query)) {
                this.resolveYouTubePlayist(query);
                this.emit('INFO', "[INFO] [QM] selector playlist activated!");
              } else if (videoPattern.test(query)) {
                this.resolveYouTubeSong(query);
                this.emit('INFO', "[INFO] [QM] selector song activated!");
              } else {
                this.resolveYoutubeSongByName(query);
                this.emit('INFO', "[INFO] [QM] selector song by title activated!");
              }

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "resolvePlaylist",
    value: function resolvePlaylist(query) {
      var playlistPattern;
      return regeneratorRuntime.async(function resolvePlaylist$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] playllist selector activated!");
              playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

              if (playlistPattern.test(query)) {
                this.resolveYouTubePlayist(query);
                this.emit('INFO', "[INFO] [QM] selector playlist activated!");
              } else {
                this.resolveYouTubePlayistByName(query);
                this.emit('INFO', "[INFO] [QM] selector playlist by title activated!");
              }

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "resolveYouTubePlayist",
    value: function resolveYouTubePlayist(query) {
      var playlist, videosObj, i, video, song;
      return regeneratorRuntime.async(function resolveYouTubePlayist$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] playlist resolved method activated!");
              _context7.prev = 1;
              _context7.next = 4;
              return regeneratorRuntime.awrap(youtube.getPlaylist(query));

            case 4:
              playlist = _context7.sent;
              _context7.next = 7;
              return regeneratorRuntime.awrap(playlist.getVideos());

            case 7:
              videosObj = _context7.sent;
              i = 0;

            case 9:
              if (!(i < videosObj.length)) {
                _context7.next = 21;
                break;
              }

              _context7.next = 12;
              return regeneratorRuntime.awrap(videosObj[i].fetch());

            case 12:
              video = _context7.sent;
              _context7.next = 15;
              return regeneratorRuntime.awrap(this.songConstructor(video));

            case 15:
              song = _context7.sent;
              _context7.next = 18;
              return regeneratorRuntime.awrap(this.addSong(song));

            case 18:
              i++;
              _context7.next = 9;
              break;

            case 21:
              this.emit('PLAYLIST_LOADING_DONE', playlist, this.message.author.username);
              _context7.next = 28;
              break;

            case 24:
              _context7.prev = 24;
              _context7.t0 = _context7["catch"](1);
              this.emit('ERROR', "[ERROR] [QM] playlist resolved method error!");
              console.log(_context7.t0);

            case 28:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this, [[1, 24]]);
    }
  }, {
    key: "resolveYouTubeSong",
    value: function resolveYouTubeSong(query) {
      var video, song;
      return regeneratorRuntime.async(function resolveYouTubeSong$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] song resolved method activated!");
              _context8.prev = 1;
              _context8.next = 4;
              return regeneratorRuntime.awrap(youtube.getVideo(query));

            case 4:
              video = _context8.sent;
              _context8.next = 7;
              return regeneratorRuntime.awrap(this.songConstructor(video));

            case 7:
              song = _context8.sent;
              _context8.next = 10;
              return regeneratorRuntime.awrap(this.addSong(song));

            case 10:
              _context8.next = 16;
              break;

            case 12:
              _context8.prev = 12;
              _context8.t0 = _context8["catch"](1);
              this.emit('ERROR', "[ERROR] [QM] song resolved method error!");
              console.log(_context8.t0);

            case 16:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this, [[1, 12]]);
    }
  }, {
    key: "resolveYoutubeSongByName",
    value: function resolveYoutubeSongByName(name) {
      var element, query;
      return regeneratorRuntime.async(function resolveYoutubeSongByName$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] song by title resolved method activated!");
              _context9.prev = 1;
              _context9.next = 4;
              return regeneratorRuntime.awrap(youtube.searchVideos(name, 1));

            case 4:
              element = _context9.sent;
              element = element[0];
              query = "https://www.youtube.com/watch?v=".concat(element.raw.id.videoId);
              _context9.next = 9;
              return regeneratorRuntime.awrap(this.resolveYouTubeSong(query));

            case 9:
              _context9.next = 15;
              break;

            case 11:
              _context9.prev = 11;
              _context9.t0 = _context9["catch"](1);
              this.emit('ERROR', "[ERROR] [QM] song by title resolved method error!");
              console.log(_context9.t0);

            case 15:
            case "end":
              return _context9.stop();
          }
        }
      }, null, this, [[1, 11]]);
    }
  }, {
    key: "resolveYouTubePlayistByName",
    value: function resolveYouTubePlayistByName(name) {
      var results, playlist;
      return regeneratorRuntime.async(function resolveYouTubePlayistByName$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] playlist by title resolved method activated!");
              _context10.prev = 1;
              _context10.next = 4;
              return regeneratorRuntime.awrap(youtube.searchPlaylists(name, 1, {
                part: 'snippet'
              }));

            case 4:
              results = _context10.sent;
              playlist = results[0];
              this.resolvePlaylist(playlist.url);
              _context10.next = 13;
              break;

            case 9:
              _context10.prev = 9;
              _context10.t0 = _context10["catch"](1);
              this.emit('ERROR', "[ERROR] [QM] playlist by title resolved method error!");
              console.log(_context10.t0);

            case 13:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this, [[1, 9]]);
    }
  }, {
    key: "songConstructor",
    value: function songConstructor(video) {
      var song, hours, minutes, seconds;
      return regeneratorRuntime.async(function songConstructor$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              this.emit('INFO', "[INFO] [QM] song constructor activated!");
              _context11.prev = 1;
              song = new song_();
              song.url = "https://www.youtube.com/watch?v=".concat(video.raw.id);
              song.title = video.raw.snippet.title;
              song.thumbnail = video.thumbnails.high.url;
              song.author = this.message.author.username;

              if (video.duration.seconds == 0 && video.duration.minutes == 0 && video.duration.hours == 0) {
                song.duration = 'Live Stream';
                song.onAir = true;
              } else {
                if (video.duration.hours < 10) {
                  hours = "0".concat(video.duration.hours);
                } else {
                  hours = video.duration.hours;
                }

                if (video.duration.minutes < 10) {
                  minutes = "0".concat(video.duration.minutes);
                } else {
                  minutes = video.duration.minutes;
                }

                if (video.duration.seconds < 10) {
                  seconds = "0".concat(video.duration.seconds);
                } else {
                  seconds = video.duration.seconds;
                }

                song.duration = "".concat(hours, ":").concat(minutes, ":").concat(seconds);
              }

              song.durationObj = video.duration;
              return _context11.abrupt("return", song);

            case 12:
              _context11.prev = 12;
              _context11.t0 = _context11["catch"](1);
              this.emit('ERROR', "[ERROR] [QM] song constructor method error!");
              console.log(_context11.t0);

            case 16:
            case "end":
              return _context11.stop();
          }
        }
      }, null, this, [[1, 12]]);
    }
  }]);

  return queueMaster;
}(EventEmitter);

exports.queueMaster = queueMaster;