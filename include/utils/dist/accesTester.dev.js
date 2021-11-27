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

var embedGenerator = require("./embedGenerator.js");

var EventEmitter = require('events');

var accesTester =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(accesTester, _EventEmitter);

  function accesTester(message, args, option) {
    var _this;

    _classCallCheck(this, accesTester);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(accesTester).call(this));
    _this.message = message;
    _this.args = args;
    _this.option = option;
    return _this;
  }

  _createClass(accesTester, [{
    key: "startSelector",
    value: function startSelector() {
      var embed1;
      return regeneratorRuntime.async(function startSelector$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = this.option;
              _context.next = _context.t0 === 'none' ? 3 : _context.t0 === 'blocked' ? 5 : _context.t0 === 'music-command' ? 10 : _context.t0 === 'music-player' ? 12 : 14;
              break;

            case 3:
              this.testCommandAccesPack();
              return _context.abrupt("break", 15);

            case 5:
              _context.next = 7;
              return regeneratorRuntime.awrap(embedGenerator.run("warnings.error_06"));

            case 7:
              embed1 = _context.sent;
              this.emit('DENIED', embed1);
              return _context.abrupt("break", 15);

            case 10:
              this.testPlayCommandAudioAccesPack();
              return _context.abrupt("break", 15);

            case 12:
              this.testPlayAudioAccesPack();
              return _context.abrupt("break", 15);

            case 14:
              return _context.abrupt("break", 15);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    } //====================================================================================== PACKS

  }, {
    key: "testCommandAccesPack",
    value: function testCommandAccesPack() {
      var userId_test;
      return regeneratorRuntime.async(function testCommandAccesPack$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(this.testUserId());

            case 2:
              userId_test = _context2.sent;

              if (!userId_test) {
                _context2.next = 8;
                break;
              }

              this.emit('DENIED', userId_test);
              return _context2.abrupt("return", 0);

            case 8:
              this.emit('GRANTED');

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testPlayAudioAccesPack",
    value: function testPlayAudioAccesPack() {
      var userId_test, voice_test, perm_test, args_test, member_test;
      return regeneratorRuntime.async(function testPlayAudioAccesPack$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.testUserId());

            case 2:
              userId_test = _context3.sent;

              if (!userId_test) {
                _context3.next = 6;
                break;
              }

              this.emit('DENIED', userId_test);
              return _context3.abrupt("return", 0);

            case 6:
              _context3.next = 8;
              return regeneratorRuntime.awrap(this.testUserVoiceChannelAvailability());

            case 8:
              voice_test = _context3.sent;

              if (!voice_test) {
                _context3.next = 12;
                break;
              }

              this.emit('DENIED', voice_test);
              return _context3.abrupt("return", 0);

            case 12:
              _context3.next = 14;
              return regeneratorRuntime.awrap(this.testAudioPermissions());

            case 14:
              perm_test = _context3.sent;

              if (!perm_test) {
                _context3.next = 18;
                break;
              }

              this.emit('DENIED', perm_test);
              return _context3.abrupt("return", 0);

            case 18:
              _context3.next = 20;
              return regeneratorRuntime.awrap(this.testArgs());

            case 20:
              args_test = _context3.sent;

              if (!args_test) {
                _context3.next = 24;
                break;
              }

              this.emit('DENIED', args_test);
              return _context3.abrupt("return", 0);

            case 24:
              _context3.next = 26;
              return regeneratorRuntime.awrap(this.testSameUserBotLoacation());

            case 26:
              member_test = _context3.sent;

              if (!member_test) {
                _context3.next = 32;
                break;
              }

              this.emit('DENIED', member_test);
              return _context3.abrupt("return", 0);

            case 32:
              this.emit('GRANTED');

            case 33:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testPlayCommandAudioAccesPack",
    value: function testPlayCommandAudioAccesPack() {
      var userId_test, voice_test, perm_test, member_test, queue_test;
      return regeneratorRuntime.async(function testPlayCommandAudioAccesPack$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.testUserId());

            case 2:
              userId_test = _context4.sent;

              if (!userId_test) {
                _context4.next = 6;
                break;
              }

              this.emit('DENIED', userId_test);
              return _context4.abrupt("return", 0);

            case 6:
              _context4.next = 8;
              return regeneratorRuntime.awrap(this.testUserVoiceChannelAvailability());

            case 8:
              voice_test = _context4.sent;

              if (!voice_test) {
                _context4.next = 12;
                break;
              }

              this.emit('DENIED', voice_test);
              return _context4.abrupt("return", 0);

            case 12:
              _context4.next = 14;
              return regeneratorRuntime.awrap(this.testAudioPermissions());

            case 14:
              perm_test = _context4.sent;

              if (!perm_test) {
                _context4.next = 18;
                break;
              }

              this.emit('DENIED', perm_test);
              return _context4.abrupt("return", 0);

            case 18:
              _context4.next = 20;
              return regeneratorRuntime.awrap(this.testSameUserBotLoacation());

            case 20:
              member_test = _context4.sent;

              if (!member_test) {
                _context4.next = 24;
                break;
              }

              this.emit('DENIED', member_test);
              return _context4.abrupt("return", 0);

            case 24:
              _context4.next = 26;
              return regeneratorRuntime.awrap(this.testQueueStatus());

            case 26:
              queue_test = _context4.sent;

              if (!queue_test) {
                _context4.next = 32;
                break;
              }

              this.emit('DENIED', queue_test);
              return _context4.abrupt("return", 0);

            case 32:
              this.emit('GRANTED');

            case 33:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    } //====================================================================================== TESTERS

  }, {
    key: "testUserId",
    value: function testUserId() {
      var embed1;
      return regeneratorRuntime.async(function testUserId$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("warnings.error_02"));

            case 2:
              embed1 = _context5.sent;

              if (!(this.message.author.id === "614819288506695697" || this.message.author.id === "---596967380089962496" || this.message.author.id === "---468380034273509376" && !this.message.author.bot)) {
                _context5.next = 7;
                break;
              }

              ;
              _context5.next = 8;
              break;

            case 7:
              return _context5.abrupt("return", embed1);

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testUserVoiceChannelAvailability",
    value: function testUserVoiceChannelAvailability() {
      var embed1, voiceChannel;
      return regeneratorRuntime.async(function testUserVoiceChannelAvailability$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_02"));

            case 2:
              embed1 = _context6.sent;
              _context6.next = 5;
              return regeneratorRuntime.awrap(this.message.member.voice.channel);

            case 5:
              voiceChannel = _context6.sent;

              if (voiceChannel) {
                _context6.next = 10;
                break;
              }

              return _context6.abrupt("return", embed1);

            case 10:
              this.voiceChannel = voiceChannel;

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testAudioPermissions",
    value: function testAudioPermissions() {
      var embed3, embed4, permissions;
      return regeneratorRuntime.async(function testAudioPermissions$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_03"));

            case 2:
              embed3 = _context7.sent;
              _context7.next = 5;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_04"));

            case 5:
              embed4 = _context7.sent;
              permissions = this.voiceChannel.permissionsFor(this.message.client.user);

              if (permissions.has("CONNECT")) {
                _context7.next = 9;
                break;
              }

              return _context7.abrupt("return", embed3);

            case 9:
              if (permissions.has("SPEAK")) {
                _context7.next = 11;
                break;
              }

              return _context7.abrupt("return", embed4);

            case 11:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testArgs",
    value: function testArgs() {
      var embed7;
      return regeneratorRuntime.async(function testArgs$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.info_01"));

            case 2:
              embed7 = _context8.sent;

              if (this.args.length) {
                _context8.next = 5;
                break;
              }

              return _context8.abrupt("return", embed7);

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testSameUserBotLoacation",
    value: function testSameUserBotLoacation() {
      var queue, embed2;
      return regeneratorRuntime.async(function testSameUserBotLoacation$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(this.message.client.queue.get(this.message.guild.id));

            case 2:
              queue = _context9.sent;

              if (!(queue != null)) {
                _context9.next = 9;
                break;
              }

              _context9.next = 6;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_01"));

            case 6:
              embed2 = _context9.sent;

              if (!(queue.isPlaying == true && this.voiceChannel !== this.message.guild.me.voice.channel)) {
                _context9.next = 9;
                break;
              }

              return _context9.abrupt("return", embed2);

            case 9:
            case "end":
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testQueueStatus",
    value: function testQueueStatus() {
      var queue, embed2;
      return regeneratorRuntime.async(function testQueueStatus$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              queue = this.message.client.queue.get(this.message.guild.id);
              _context10.next = 3;
              return regeneratorRuntime.awrap(embedGenerator.run("warnings.error_03"));

            case 3:
              embed2 = _context10.sent;

              if (!(queue == null)) {
                _context10.next = 6;
                break;
              }

              return _context10.abrupt("return", embed2);

            case 6:
              if (!(queue.status !== 'playing' && queue.status !== 'paused')) {
                _context10.next = 8;
                break;
              }

              return _context10.abrupt("return", embed2);

            case 8:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }]);

  return accesTester;
}(EventEmitter);

exports.accesTester = accesTester;