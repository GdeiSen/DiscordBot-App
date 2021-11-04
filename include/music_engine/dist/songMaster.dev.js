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

var _require = require("./objects/song"),
    song_ = _require.song_;

var Youtube = require("simple-youtube-api");

var config = require("../../config.json");

var youtube = new Youtube(config.YOUTUBE_API_KEY);

var _require2 = require("./queueMaster.js"),
    queueMaster = _require2.queueMaster;

var EventEmitter = require('events');

var songMaster =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(songMaster, _EventEmitter);

  function songMaster(client, message) {
    var _this;

    _classCallCheck(this, songMaster);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(songMaster).call(this));
    _this.client = client;
    _this.message = message;
    _this.serverQueueConstruct = new queueMaster(client, message);
    _this.QueueMaster = new queueMaster(_this.client, _this.message);
    _this.queue = _this.QueueMaster.getQueue();
    return _this;
  }

  _createClass(songMaster, [{
    key: "addSongs",
    value: function addSongs(query) {
      var videoPattern, playlistPattern;
      return regeneratorRuntime.async(function addSongs$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.emit('INFO', "[INFO] [SM] selector activated!");
              videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
              playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

              if (playlistPattern.test(query)) {
                this.resolveYouTubePlayist(query);
                this.emit('INFO', "[INFO] [SM] selector [playlist] activated!");
              } else if (videoPattern.test(query)) {
                this.resolveYouTubeSong(query);
                this.emit('INFO', "[INFO] [SM] selector [song] activated!");
              } else {
                this.resolveYoutubeSongByName(query);
                this.emit('INFO', "[INFO] [SM] selector [song by title] activated!");
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "resolveYouTubePlayist",
    value: function resolveYouTubePlayist(query) {
      var playlist, videosObj, i, video, song;
      return regeneratorRuntime.async(function resolveYouTubePlayist$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.emit('INFO', "[INFO] [SM] playlist resolved method activated!");
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(youtube.getPlaylist(query));

            case 4:
              playlist = _context2.sent;
              _context2.next = 7;
              return regeneratorRuntime.awrap(playlist.getVideos());

            case 7:
              videosObj = _context2.sent;
              i = 0;

            case 9:
              if (!(i < videosObj.length)) {
                _context2.next = 21;
                break;
              }

              _context2.next = 12;
              return regeneratorRuntime.awrap(videosObj[i].fetch());

            case 12:
              video = _context2.sent;
              _context2.next = 15;
              return regeneratorRuntime.awrap(this.songConstructor(video));

            case 15:
              song = _context2.sent;
              _context2.next = 18;
              return regeneratorRuntime.awrap(this.QueueMaster.addSong(song));

            case 18:
              i++;
              _context2.next = 9;
              break;

            case 21:
              this.emit('PLAYLIST_LOADING_DONE');
              _context2.next = 27;
              break;

            case 24:
              _context2.prev = 24;
              _context2.t0 = _context2["catch"](1);
              this.emit('ERROR', "[ERROR] [SM] playlist resolved method error!");

            case 27:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[1, 24]]);
    }
  }, {
    key: "resolveYouTubeSong",
    value: function resolveYouTubeSong(query) {
      var video, song;
      return regeneratorRuntime.async(function resolveYouTubeSong$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.emit('INFO', "[INFO] [SM] song resolved method activated!");
              _context3.prev = 1;
              _context3.next = 4;
              return regeneratorRuntime.awrap(youtube.getVideo(query));

            case 4:
              video = _context3.sent;
              _context3.next = 7;
              return regeneratorRuntime.awrap(this.songConstructor(video));

            case 7:
              song = _context3.sent;
              _context3.next = 10;
              return regeneratorRuntime.awrap(this.QueueMaster.addSong(song));

            case 10:
              this.emit('SONG_LOADING_DONE');
              _context3.next = 17;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](1);
              this.emit('ERROR', "[ERROR] [SM] song resolved method error!");
              console.log(_context3.t0);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[1, 13]]);
    }
  }, {
    key: "resolveYoutubeSongByName",
    value: function resolveYoutubeSongByName(name) {
      var element, query;
      return regeneratorRuntime.async(function resolveYoutubeSongByName$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              this.emit('INFO', "[INFO] [SM] song by title resolved method activated!");
              _context4.prev = 1;
              _context4.next = 4;
              return regeneratorRuntime.awrap(youtube.searchVideos(name, 1));

            case 4:
              element = _context4.sent;
              element = element[0];
              query = "https://www.youtube.com/watch?v=".concat(element.raw.id.videoId);
              _context4.next = 9;
              return regeneratorRuntime.awrap(this.resolveYouTubeSong(query));

            case 9:
              _context4.next = 15;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](1);
              this.emit('ERROR', "[ERROR] [SM] song by title resolved method error!");
              console.log(_context4.t0);

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[1, 11]]);
    }
  }, {
    key: "songConstructor",
    value: function songConstructor(video) {
      var song, hours, minutes, seconds;
      return regeneratorRuntime.async(function songConstructor$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              this.emit('INFO', "[INFO] [SM] song constructor activated!");
              _context5.prev = 1;
              song = new song_();
              song.url = "https://www.youtube.com/watch?v=".concat(video.raw.id);
              song.title = video.raw.snippet.title;
              song.thumbnail = video.thumbnails.high.url;
              song.author = this.message.author.username;

              if (video.duration.seconds == 0 && video.duration.minutes == 0 && video.duration.hours == 0) {
                song.duration = 'Live Stream';
                song.onAir = true;
              } else {
                if (current > 3600) {
                  date.setSeconds(current);
                  timeString = date.toISOString().substr(11, 8);
                } else if (current <= 3600) {
                  date.setSeconds(current);
                  timeString = date.toISOString().substr(14, 5);
                }

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
              return _context5.abrupt("return", song);

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](1);
              this.emit('ERROR', "[ERROR] [SM] song constructor method error!");

            case 15:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[1, 12]]);
    }
  }]);

  return songMaster;
}(EventEmitter);

exports.songMaster = songMaster;