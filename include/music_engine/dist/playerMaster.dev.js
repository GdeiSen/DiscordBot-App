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

var ytdl = require("ytdl-core");

var EventEmitter = require('events');

var _require = require("@discordjs/voice"),
    joinVoiceChannel = _require.joinVoiceChannel,
    getVoiceConnection = _require.getVoiceConnection,
    createAudioPlayer = _require.createAudioPlayer,
    createAudioResource = _require.createAudioResource,
    AudioPlayerStatus = _require.AudioPlayerStatus,
    VoiceConnection = _require.VoiceConnection;

var embedGenerator = require("../utils/embedGenerator");

var player =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(player, _EventEmitter);

  function player(queue, message) {
    var _this;

    _classCallCheck(this, player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(player).call(this));
    _this.message = message;
    _this.queue = queue;
    _this.player;
    _this.connection;
    _this.stream;
    _this.resource;
    _this.selectorFlag = true;
    return _this;
  }

  _createClass(player, [{
    key: "start",
    value: function start() {
      if (this.selectorFlag) {
        this.execute();
        this.addListeners();
      } else if (!this.selectorFlag) {
        this.execute();
      }
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this2 = this;

      this.addListener('LOADING_DONE', function () {
        _this2.player.on(AudioPlayerStatus.Idle, function () {
          if (_this2.queue.songs.length >= 1 && _this2.queue.status !== 'stopped') {
            _this2.queue.status = 'pending';
            _this2.queue.current = null;
            return _this2.start();
          } else if (_this2.queue.songs.length == 0 && _this2.queue.status !== 'stopped') {
            _this2.queue.status = 'pending';

            _this2.emit('QUEUE_ENDED');

            _this2.emit('PLAYBACK_STOPPED');
          } else {
            _this2.emit('PLAYBACK_STOPPED');
          }
        });

        if (_this2.selectorFlag) {
          _this2.connection.on('stateChange', function (oldState, newState) {
            if (newState.status == 'disconnected') {
              _this2.connection.destroy;

              _this2.player.stop();

              _this2.queue.isPlaying = false;

              _this2.emit('DISCONNECTED');
            }
          });
        }

        _this2.player.on('error', function (queue, err) {
          var embed = embedGenerator.run('warnings.error_05');
          console.log('[ERROR 403] Unfortunately unpossible to be fixed from our side!');
          console.log(err);

          _this2.message.channel.send({
            embeds: [embed]
          });
        }); //IF SOMETHING WENT WRONG IT NEEDED TO BE FIXED


        _this2.selectorFlag = false;
      });
    }
  }, {
    key: "execute",
    value: function execute() {
      var _this3 = this;

      return regeneratorRuntime.async(function execute$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              try {
                this.getQueue();
                this.emit('INFO', '[INFO] [PL] start function activated!');

                if (this.queue.status !== 'playing' && this.queue.status !== 'paused') {
                  this.createConnection().then(function _callee(status) {
                    return regeneratorRuntime.async(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!(status == 'ready')) {
                              _context.next = 17;
                              break;
                            }

                            _context.next = 3;
                            return regeneratorRuntime.awrap(_this3.emit('INFO', '[INFO] [PL] audioPlayer constructor activated!'));

                          case 3:
                            _context.next = 5;
                            return regeneratorRuntime.awrap(_this3.createPlayer());

                          case 5:
                            _context.next = 7;
                            return regeneratorRuntime.awrap(_this3.createStream(_this3.queue.songs[0].url));

                          case 7:
                            _context.next = 9;
                            return regeneratorRuntime.awrap(_this3.createResource());

                          case 9:
                            _context.next = 11;
                            return regeneratorRuntime.awrap(_this3.play());

                          case 11:
                            _context.next = 13;
                            return regeneratorRuntime.awrap(_this3.pushConnectionAndPlayerToQueue());

                          case 13:
                            _context.next = 15;
                            return regeneratorRuntime.awrap(_this3.queueSongsChanger());

                          case 15:
                            _context.next = 17;
                            return regeneratorRuntime.awrap(_this3.emit('LOADING_DONE'));

                          case 17:
                          case "end":
                            return _context.stop();
                        }
                      }
                    });
                  });
                } else {
                  this.emit('SONG_ADDED', this.queue.songs[this.queue.songs.length - 1]);
                }
              } catch (error) {
                this.emit('ERROR');
                console.log(error);
              }

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createConnection",
    value: function createConnection() {
      var _this4 = this;

      var connection, promise;
      return regeneratorRuntime.async(function createConnection$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.emit('INFO', '[INFO] [PL] createConnection function activated!');
              _context3.prev = 1;
              this.emit('[INFO] [PL] createConnection function activated!');
              _context3.next = 5;
              return regeneratorRuntime.awrap(joinVoiceChannel({
                channelId: this.message.member.voice.channel.id,
                guildId: this.message.guild.id,
                adapterCreator: this.message.guild.voiceAdapterCreator
              }));

            case 5:
              connection = _context3.sent;
              promise = new Promise(function (resolve, reject) {
                if (connection.state.status == 'ready') {
                  _this4.connection = connection;
                  resolve(connection.state.status);
                }

                ;
                console.log(_this4.selectorFlag);

                if (_this4.selectorFlag) {
                  connection.on('stateChange', function (oldState, newState) {
                    //double ready status problem!!!
                    if (newState.status == 'ready') {
                      _this4.connection = connection, resolve(newState.status);

                      _this4.emit('CONNECTED');
                    }
                  });
                }
              });
              _context3.next = 9;
              return regeneratorRuntime.awrap(promise);

            case 9:
              return _context3.abrupt("return", _context3.sent);

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3["catch"](1);
              this.emit('ERROR', '[ERROR] [P] createConnection function error');

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[1, 12]]);
    }
  }, {
    key: "createPlayer",
    value: function createPlayer() {
      var _player;

      return regeneratorRuntime.async(function createPlayer$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              this.emit('INFO', '[INFO] [PL] createPlayer function activated!');

              try {
                _player = createAudioPlayer();
                this.player = _player;
              } catch (err) {
                this.emit('ERROR', '[ERROR] [P] createPlayer function error');
              }

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createStream",
    value: function createStream(source) {
      var stream;
      return regeneratorRuntime.async(function createStream$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              this.emit('INFO', '[INFO] [PL] createStream function activated!');

              try {
                stream = ytdl(source, {
                  filter: 'audioonly',
                  highWaterMark: 1024 * 1024 * 10
                });
                this.stream = stream;
              } catch (err) {
                this.emit('ERROR', '[ERROR] [P] createStream function error');
              }

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createResource",
    value: function createResource() {
      var resource;
      return regeneratorRuntime.async(function createResource$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this.emit('INFO', '[INFO] [PL] createResource function activated!');

              try {
                resource = createAudioResource(this.stream);
                this.resource = resource;
              } catch (err) {
                this.emit('ERROR', '[ERROR] [P] createResource function error');
              }

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "pushConnectionAndPlayerToQueue",
    value: function pushConnectionAndPlayerToQueue() {
      return regeneratorRuntime.async(function pushConnectionAndPlayerToQueue$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              this.emit('INFO', '[INFO] [PL] pushConnectionAndPlayerToQueue function activated!');
              this.queue.connection = this.connection;
              this.queue.player = this.player;

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "play",
    value: function play() {
      return regeneratorRuntime.async(function play$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this.emit('INFO', '[INFO] [PL] play function activated!');

              try {
                this.queue.isPlaying = true; //WHAT THE HECH HERE

                this.queue.current = this.queue.songs[0];
                console.log(this.queue.songs[0]);
                this.player.play(this.resource);
                this.connection.subscribe(this.player);
                this.queue.status = 'playing';
                this.emit('PLAYBACK_STARTED', this.queue);
              } catch (err) {
                this.emit('ERROR', '[ERROR] [P] play function error');
                console.log(err);
              }

            case 2:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getQueue",
    value: function getQueue() {
      this.queue = this.message.client.queue.get(this.message.guild.id);
      ;
    }
  }, {
    key: "setQueue",
    value: function setQueue() {
      this.message.client.queue.set(this.message.guild.id, this.queue);
    }
  }, {
    key: "queueSongsChanger",
    value: function queueSongsChanger() {
      this.getQueue();

      if (this.queue.songs[0].loop === false) {
        if (this.queue.config.loop === true) {
          var buffer = this.queue.songs[0];
          this.queue.songs.splice(0, 1);
          this.queue.songs.push(buffer);
        } else {
          this.queue.songs.splice(0, 1);
        }
      }

      console.log(this.queue.current);
    }
  }]);

  return player;
}(EventEmitter);

exports.player = player;