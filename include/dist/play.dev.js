"use strict";

var ytdl = require("erit-ytdl");

var scdl = require("soundcloud-downloader")["default"];

var _require = require("../include/play"),
    play = _require.play;

var _require2 = require("../util/EvobotUtil"),
    canModifyQueue = _require2.canModifyQueue,
    STAY_TIME = _require2.STAY_TIME;

module.exports = {
  play: function play(song, message) {
    var _require3, SOUNDCLOUD_CLIENT_ID, config, PRUNING, queue, stream, streamType, dispatcher, playingMessage, filter, collector;

    return regeneratorRuntime.async(function play$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _require3 = require("../util/EvobotUtil"), SOUNDCLOUD_CLIENT_ID = _require3.SOUNDCLOUD_CLIENT_ID;

            try {
              config = require("../config.json");
            } catch (error) {
              config = null;
            }

            PRUNING = config ? config.PRUNING : process.env.PRUNING;
            queue = message.client.queue.get(message.guild.id);

            if (song) {
              _context.next = 8;
              break;
            }

            setTimeout(function () {
              if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
              queue.channel.leave();
            }, STAY_TIME * 1000);
            queue.textChannel.send("Кажется музыка закончилась!")["catch"](console.error);
            return _context.abrupt("return", message.client.queue["delete"](message.guild.id));

          case 8:
            stream = null;
            streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
            _context.prev = 10;

            if (!song.url.includes("youtube.com")) {
              _context.next = 17;
              break;
            }

            _context.next = 14;
            return regeneratorRuntime.awrap(ytdl(song.url, {
              highWaterMark: 1 << 25
            }));

          case 14:
            stream = _context.sent;
            _context.next = 30;
            break;

          case 17:
            if (!song.url.includes("soundcloud.com")) {
              _context.next = 30;
              break;
            }

            _context.prev = 18;
            _context.next = 21;
            return regeneratorRuntime.awrap(scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID));

          case 21:
            stream = _context.sent;
            _context.next = 30;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](18);
            _context.next = 28;
            return regeneratorRuntime.awrap(scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID));

          case 28:
            stream = _context.sent;
            streamType = "unknown";

          case 30:
            _context.next = 37;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](10);

            if (queue) {
              queue.songs.shift();
              module.exports.play(queue.songs[0], message);
            }

            console.error(_context.t1);
            return _context.abrupt("return", message.channel.send("Error: ".concat(_context.t1.message ? _context.t1.message : _context.t1)));

          case 37:
            queue.connection.on("disconnect", function () {
              return message.client.queue["delete"](message.guild.id);
            });
            dispatcher = queue.connection.play(stream, {
              type: streamType
            }).on("finish", function () {
              if (collector && !collector.ended) collector.stop();

              if (queue.loop) {
                // if loop is on, push the song back at the end of the queue
                // so it can repeat endlessly
                var lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports.play(queue.songs[0], message);
              } else {
                // Recursively play the next song
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
              }
            }).on("error", function (err) {
              console.error(err);
              queue.songs.shift();
              module.exports.play(queue.songs[0], message);
            });
            dispatcher.setVolumeLogarithmic(queue.volume / 100);
            _context.prev = 40;
            queue.textChannel.send("**\u0421\u0415\u0419\u0427\u0410\u0421 \u0418\u0413\u0420\u0410\u0415\u0422**");
            _context.next = 44;
            return regeneratorRuntime.awrap(queue.textChannel.send("".concat(song.url)));

          case 44:
            playingMessage = _context.sent;
            _context.next = 47;
            return regeneratorRuntime.awrap(playingMessage.react("⏭"));

          case 47:
            _context.next = 49;
            return regeneratorRuntime.awrap(playingMessage.react("⏯"));

          case 49:
            _context.next = 51;
            return regeneratorRuntime.awrap(playingMessage.react("🔇"));

          case 51:
            _context.next = 53;
            return regeneratorRuntime.awrap(playingMessage.react("🔉"));

          case 53:
            _context.next = 55;
            return regeneratorRuntime.awrap(playingMessage.react("🔊"));

          case 55:
            _context.next = 57;
            return regeneratorRuntime.awrap(playingMessage.react("🔁"));

          case 57:
            _context.next = 59;
            return regeneratorRuntime.awrap(playingMessage.react("⏹"));

          case 59:
            _context.next = 64;
            break;

          case 61:
            _context.prev = 61;
            _context.t2 = _context["catch"](40);
            console.error(_context.t2);

          case 64:
            filter = function filter(reaction, user) {
              return user.id !== message.client.user.id;
            };

            collector = playingMessage.createReactionCollector(filter, {
              time: song.duration > 0 ? song.duration * 1000 : 600000
            });
            collector.on("collect", function (reaction, user) {
              if (!queue) return;
              var member = message.guild.member(user);

              switch (reaction.emoji.name) {
                case "⏭":
                  queue.playing = true;
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member)) return;
                  queue.connection.dispatcher.end();
                  queue.textChannel.send("".concat(user, " \u23E9 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u043B \u0442\u0440\u0435\u043A")).then(function (queue) {
                    return queue["delete"]({
                      timeout: 1500
                    });
                  })["catch"](console.error);
                  collector.stop();
                  break;

                case "⏯":
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member)) return;

                  if (queue.playing) {
                    queue.playing = !queue.playing;
                    queue.connection.dispatcher.pause();
                    queue.textChannel.send("".concat(user, " \u23F8 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043B \u043D\u0430 \u043F\u0430\u0443\u0437\u0443")).then(function (queue) {
                      return queue["delete"]({
                        timeout: 1500
                      });
                    })["catch"](console.error);
                  } else {
                    queue.playing = !queue.playing;
                    queue.connection.dispatcher.resume();
                    queue.textChannel.send("".concat(user, " \u25B6 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u043B \u0432\u043E\u0437\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435")).then(function (queue) {
                      return queue["delete"]({
                        timeout: 1500
                      });
                    })["catch"](console.error);
                  }

                  break;

                case "🔇":
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member)) return;

                  if (queue.volume <= 0) {
                    queue.volume = 30;
                    queue.connection.dispatcher.setVolumeLogarithmic(100 / 30);
                    queue.textChannel.send("".concat(user, " \uD83D\uDD0A \u0432\u043A\u043B\u044E\u0447\u0438\u043B \u0437\u0432\u0443\u043A")).then(function (queue) {
                      return queue["delete"]({
                        timeout: 1500
                      });
                    });
                    ;
                  } else {
                    queue.volume = 0;
                    queue.connection.dispatcher.setVolumeLogarithmic(0);
                    queue.textChannel.send("".concat(user, " \uD83D\uDD07 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u043B \u0437\u0432\u0443\u043A")).then(function (queue) {
                      return queue["delete"]({
                        timeout: 1500
                      });
                    });
                  }

                  break;

                case "🔉":
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member) || queue.volume == 0) return;
                  if (queue.volume - 10 <= 0) queue.volume = 0;else queue.volume = queue.volume - 10;
                  queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
                  queue.textChannel.send("".concat(user, " \uD83D\uDD09 \u043F\u043E\u043D\u0438\u0437\u0438\u043B \u0433\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C \u043A ").concat(queue.volume, "%")).then(function (queue) {
                    return queue["delete"]({
                      timeout: 1500
                    });
                  })["catch"](console.error);
                  break;

                case "🔊":
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member) || queue.volume == 100) return;
                  if (queue.volume + 10 >= 100) queue.volume = 100;else queue.volume = queue.volume + 10;
                  queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
                  queue.textChannel.send("".concat(user, " \uD83D\uDD0A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u043B \u0433\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C \u043A ").concat(queue.volume, "%")).then(function (queue) {
                    return queue["delete"]({
                      timeout: 1500
                    });
                  })["catch"](console.error);
                  break;

                case "🔁":
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member)) return;
                  queue.loop = !queue.loop;
                  queue.textChannel.send("\u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435 \u0442\u0440\u0435\u043A\u0430 ".concat(queue.loop ? "**включено**" : "**выключено**")).then(function (queue) {
                    return queue["delete"]({
                      timeout: 1500
                    });
                  })["catch"](console.error);
                  break;

                case "⏹":
                  reaction.users.remove(user)["catch"](console.error);
                  if (!canModifyQueue(member)) return;
                  queue.songs = [];
                  queue.textChannel.send("".concat(user, " \u23F9 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B \u0442\u0440\u0435\u043A")).then(function (queue) {
                    return queue["delete"]({
                      timeout: 1500
                    });
                  })["catch"](console.error);

                  try {
                    queue.connection.dispatcher.end();
                  } catch (error) {
                    console.error(error);
                    queue.connection.disconnect();
                  }

                  collector.stop();
                  break;

                default:
                  reaction.users.remove(user)["catch"](console.error);
                  break;
              }
            });
            collector.on("end", function () {
              playingMessage.reactions.removeAll()["catch"](console.error);

              if (PRUNING && playingMessage && !playingMessage.deleted) {
                playingMessage["delete"]({
                  timeout: 3000
                })["catch"](console.error);
              }
            });

          case 68:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[10, 32], [18, 24], [40, 61]]);
  }
};