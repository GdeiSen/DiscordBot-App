"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var embedGenerator = require("./embedGenerator.js");

var accesTester =
/*#__PURE__*/
function () {
  function accesTester(message, args) {
    _classCallCheck(this, accesTester);

    this.message = message;
    this.args = args;
  }

  _createClass(accesTester, [{
    key: "testPlayAudioAccesPack",
    value: function testPlayAudioAccesPack() {
      var _this = this;

      var testAudioAcces = new Promise(function _callee(resolve, reject) {
        var voice_test, perm_test, args_test, member_test;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(_this.testUserVoiceChannelAvailability());

              case 2:
                voice_test = _context.sent;

                if (!(voice_test != null)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return regeneratorRuntime.awrap(reject(voice_test));

              case 6:
                return _context.abrupt("return", 0);

              case 7:
                _context.next = 9;
                return regeneratorRuntime.awrap(_this.testAudioPermissions());

              case 9:
                perm_test = _context.sent;

                if (!(perm_test != null)) {
                  _context.next = 14;
                  break;
                }

                _context.next = 13;
                return regeneratorRuntime.awrap(reject(perm_test));

              case 13:
                return _context.abrupt("return", 0);

              case 14:
                _context.next = 16;
                return regeneratorRuntime.awrap(_this.testArgs());

              case 16:
                args_test = _context.sent;

                if (!(args_test != null)) {
                  _context.next = 21;
                  break;
                }

                _context.next = 20;
                return regeneratorRuntime.awrap(reject(args_test));

              case 20:
                return _context.abrupt("return", 0);

              case 21:
                _context.next = 23;
                return regeneratorRuntime.awrap(_this.testSameUserBotLoacation());

              case 23:
                member_test = _context.sent;

                if (!(member_test != null)) {
                  _context.next = 30;
                  break;
                }

                _context.next = 27;
                return regeneratorRuntime.awrap(reject(member_test));

              case 27:
                return _context.abrupt("return", 0);

              case 30:
                resolve('acces_granted');

              case 31:
              case "end":
                return _context.stop();
            }
          }
        });
      });
      return testAudioAcces;
    }
  }, {
    key: "testPlayCommandAudioAccesPack",
    value: function testPlayCommandAudioAccesPack() {
      var _this2 = this;

      var testAudioAcces = new Promise(function _callee2(resolve, reject) {
        var voice_test, perm_test, member_test, queue_test;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return regeneratorRuntime.awrap(_this2.testUserVoiceChannelAvailability());

              case 2:
                voice_test = _context2.sent;

                if (!(voice_test != null)) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return regeneratorRuntime.awrap(reject(voice_test));

              case 6:
                return _context2.abrupt("return", 0);

              case 7:
                _context2.next = 9;
                return regeneratorRuntime.awrap(_this2.testAudioPermissions());

              case 9:
                perm_test = _context2.sent;

                if (!(perm_test != null)) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 13;
                return regeneratorRuntime.awrap(reject(perm_test));

              case 13:
                return _context2.abrupt("return", 0);

              case 14:
                _context2.next = 16;
                return regeneratorRuntime.awrap(_this2.testSameUserBotLoacation());

              case 16:
                member_test = _context2.sent;

                if (!(member_test != null)) {
                  _context2.next = 21;
                  break;
                }

                _context2.next = 20;
                return regeneratorRuntime.awrap(reject(member_test));

              case 20:
                return _context2.abrupt("return", 0);

              case 21:
                _context2.next = 23;
                return regeneratorRuntime.awrap(_this2.testQueueStatus());

              case 23:
                queue_test = _context2.sent;

                if (!(queue_test != null)) {
                  _context2.next = 30;
                  break;
                }

                _context2.next = 27;
                return regeneratorRuntime.awrap(reject(queue_test));

              case 27:
                return _context2.abrupt("return", 0);

              case 30:
                resolve();

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        });
      });
      return testAudioAcces;
    }
  }, {
    key: "testUserVoiceChannelAvailability",
    value: function testUserVoiceChannelAvailability() {
      var embed1, voiceChannel;
      return regeneratorRuntime.async(function testUserVoiceChannelAvailability$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_02"));

            case 2:
              embed1 = _context3.sent;
              _context3.next = 5;
              return regeneratorRuntime.awrap(this.message.member.voice.channel);

            case 5:
              voiceChannel = _context3.sent;

              if (voiceChannel) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt("return", embed1);

            case 10:
              this.voiceChannel = voiceChannel;

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testAudioPermissions",
    value: function testAudioPermissions() {
      var embed3, embed4, permissions;
      return regeneratorRuntime.async(function testAudioPermissions$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_03"));

            case 2:
              embed3 = _context4.sent;
              _context4.next = 5;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_04"));

            case 5:
              embed4 = _context4.sent;
              permissions = this.voiceChannel.permissionsFor(this.message.client.user);

              if (permissions.has("CONNECT")) {
                _context4.next = 9;
                break;
              }

              return _context4.abrupt("return", embed3);

            case 9:
              if (permissions.has("SPEAK")) {
                _context4.next = 11;
                break;
              }

              return _context4.abrupt("return", embed4);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testArgs",
    value: function testArgs() {
      var embed7;
      return regeneratorRuntime.async(function testArgs$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.info_01"));

            case 2:
              embed7 = _context5.sent;

              if (this.args.length) {
                _context5.next = 5;
                break;
              }

              return _context5.abrupt("return", embed7);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testSameUserBotLoacation",
    value: function testSameUserBotLoacation() {
      var queue, embed2;
      return regeneratorRuntime.async(function testSameUserBotLoacation$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(this.message.client.queue.get(this.message.guild.id));

            case 2:
              queue = _context6.sent;

              if (!(queue != null)) {
                _context6.next = 9;
                break;
              }

              _context6.next = 6;
              return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_01"));

            case 6:
              embed2 = _context6.sent;

              if (!(queue.isPlaying == true && this.voiceChannel !== this.message.guild.me.voice.channel)) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return", embed2);

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "testQueueStatus",
    value: function testQueueStatus() {
      var queue, embed2;
      return regeneratorRuntime.async(function testQueueStatus$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              queue = this.message.client.queue.get(this.message.guild.id);
              _context7.next = 3;
              return regeneratorRuntime.awrap(embedGenerator.run("warnings.error_03"));

            case 3:
              embed2 = _context7.sent;

              if (!(queue == null)) {
                _context7.next = 6;
                break;
              }

              return _context7.abrupt("return", embed2);

            case 6:
              if (!(queue.status !== 'playing' && queue.status !== 'paused')) {
                _context7.next = 8;
                break;
              }

              return _context7.abrupt("return", embed2);

            case 8:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }]);

  return accesTester;
}();

exports.accesTester = accesTester;