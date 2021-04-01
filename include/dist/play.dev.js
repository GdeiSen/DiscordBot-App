"use strict";

var ytdl = require("ytdl-core-discord");

var ytdl_style = require("ytdl-core");

var Discord = require("discord.js");

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue,
    STAY_TIME = _require.STAY_TIME;

module.exports = {
  play: function play(song, message, args) {
    var config, PRUNING, queue, stream, streamType, dispatcher, url, addedEmbed, playingMessage, filter, collector;
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
            queue.textChannel.send("❌ Очередь закончилась")["catch"](console.error);
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
            url = args;
            _context.next = 27;
            return regeneratorRuntime.awrap(ytdl_style.getInfo(song.url));

          case 27:
            songInfo = _context.sent;
            song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url,
              duration: songInfo.videoDetails.lengthSeconds,
              thumbnails: songInfo.videoDetails.thumbnails[3].url
            };
            addedEmbed = new Discord.MessageEmbed().setColor('GREEN').setTitle(":musical_note: \u0421\u0435\u0439\u0447\u0430\u0441 \u0438\u0433\u0440\u0430\u0435\u0442 :musical_note:\n ".concat(song.title, " ")).addField("\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: ", new Date(song.duration * 1000).toISOString().substr(11, 8)).setThumbnail(song.thumbnails).setURL(song.url);
            _context.prev = 30;
            _context.next = 33;
            return regeneratorRuntime.awrap(queue.textChannel.send(addedEmbed));

          case 33:
            playingMessage = _context.sent;
            _context.next = 36;
            return regeneratorRuntime.awrap(playingMessage.react("⏭"));

          case 36:
            _context.next = 38;
            return regeneratorRuntime.awrap(playingMessage.react("⏯"));

          case 38:
            _context.next = 40;
            return regeneratorRuntime.awrap(playingMessage.react("🔇"));

          case 40:
            _context.next = 42;
            return regeneratorRuntime.awrap(playingMessage.react("🔉"));

          case 42:
            _context.next = 44;
            return regeneratorRuntime.awrap(playingMessage.react("🔊"));

          case 44:
            _context.next = 46;
            return regeneratorRuntime.awrap(playingMessage.react("🔁"));

          case 46:
            _context.next = 48;
            return regeneratorRuntime.awrap(playingMessage.react("⏹"));

          case 48:
            _context.next = 53;
            break;

          case 50:
            _context.prev = 50;
            _context.t1 = _context["catch"](30);
            console.error(_context.t1);

          case 53:
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
                    queue.connection.dispatcher.pause(true);
                    queue.textChannel.send("".concat(user, " \u23F8 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043B \u043D\u0430 \u043F\u0430\u0443\u0437\u0443")).then(function (queue) {
                      return queue["delete"]({
                        timeout: 1500
                      });
                    })["catch"](console.error);
                  } else {
                    queue.playing = !queue.playing;
                    queue.connection.dispatcher.resume(true);
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
                  if (Number(queue.volume) + 10 >= 100) queue.volume = 100;else queue.volume = Number(queue.volume) + 10;
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

          case 57:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[9, 16], [30, 50]]);
  }
};