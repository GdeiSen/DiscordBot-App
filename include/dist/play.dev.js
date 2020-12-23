"use strict";

var ytdl = require("erit-ytdl");

var _require = require("../include/play"),
    play = _require.play;

var Discord = require("discord.js");

var _require2 = require("../util/EvobotUtil"),
    canModifyQueue = _require2.canModifyQueue,
    STAY_TIME = _require2.STAY_TIME;

module.exports = {
  play: function play(song, message) {
    var config, PRUNING, queue, stream, streamType, dispatcher, embed, addedEmbed, playingMessage, filter, collector;
    return regeneratorRuntime.async(function play$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              config = require("../config.json");
            } catch (error) {
              config = null;
            }

            PRUNING = config ? config.PRUNING : process.env.PRUNING;
            queue = message.client.queue.get(message.guild.id);

            if (song) {
              _context.next = 7;
              break;
            }

            setTimeout(function () {
              if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
              queue.channel.leave();
            }, STAY_TIME * 1000);
            queue.textChannel.send("Кажется музыка закончилась!")["catch"](console.error);
            return _context.abrupt("return", message.client.queue["delete"](message.guild.id));

          case 7:
            stream = null;
            streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
            _context.prev = 9;

            if (!song.url.includes("youtube.com")) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return regeneratorRuntime.awrap(ytdl(song.url, {
              highWaterMark: 1 << 25
            }));

          case 13:
            stream = _context.sent;

          case 14:
            _context.next = 21;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](9);

            if (queue) {
              queue.songs.shift();
              module.exports.play(queue.songs[0], message);
            }

            console.error(_context.t0);
            return _context.abrupt("return", message.channel.send("Error: ".concat(_context.t0.message ? _context.t0.message : _context.t0)));

          case 21:
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
            embed = {
              color: 3447003,
              author: {
                name: song.username,
                icon_url: song.avatar // eslint-disable-line camelcase

              },
              image: {
                url: song.thumbnail
              }
            };
            message.channel.send(embed);
            addedEmbed = new Discord.MessageEmbed().setColor('GREEN').setTitle(":musical_note: ".concat(song.title)).addField("\u0411\u044B\u043B\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u044C ", "\u042D\u0442\u043E\u0442 \u0442\u0440\u0435\u043A #".concat(queue.songs.length, " \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438")).setImage(song.thumbnail).setURL(song.url);
            _context.prev = 27;
            _context.next = 30;
            return regeneratorRuntime.awrap(queue.textChannel.send(addedEmbed));

          case 30:
            playingMessage = _context.sent;
            _context.next = 33;
            return regeneratorRuntime.awrap(playingMessage.react("⏭"));

          case 33:
            _context.next = 35;
            return regeneratorRuntime.awrap(playingMessage.react("⏯"));

          case 35:
            _context.next = 37;
            return regeneratorRuntime.awrap(playingMessage.react("🔇"));

          case 37:
            _context.next = 39;
            return regeneratorRuntime.awrap(playingMessage.react("🔉"));

          case 39:
            _context.next = 41;
            return regeneratorRuntime.awrap(playingMessage.react("🔊"));

          case 41:
            _context.next = 43;
            return regeneratorRuntime.awrap(playingMessage.react("🔁"));

          case 43:
            _context.next = 45;
            return regeneratorRuntime.awrap(playingMessage.react("⏹"));

          case 45:
            _context.next = 50;
            break;

          case 47:
            _context.prev = 47;
            _context.t1 = _context["catch"](27);
            console.error(_context.t1);

          case 50:
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
                    queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
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

          case 54:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[9, 16], [27, 47]]);
  }
};