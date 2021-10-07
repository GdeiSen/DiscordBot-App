"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var embedGenerator = require("../include/embedGenerator");

module.exports.run = function _callee2(bot, message, args) {
  var embed1, embed4, permissions, queue, currentPage, embeds, queueEmbed, filter, collector;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(embedGenerator.run('warnings.error_03'));

        case 2:
          embed1 = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_04'));

        case 5:
          embed4 = _context2.sent;
          permissions = message.channel.permissionsFor(message.client.user);

          if (permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", message.reply(embed4));

        case 9:
          queue = message.client.queue.get(message.guild.id);

          if (queue) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed1));

        case 12:
          currentPage = 0;
          _context2.next = 15;
          return regeneratorRuntime.awrap(generateQueueEmbed(message, queue.songs));

        case 15:
          embeds = _context2.sent;
          _context2.next = 18;
          return regeneratorRuntime.awrap(message.channel.send("**page - ".concat(currentPage + 1, "/").concat(embeds.length, "**"), embeds[currentPage]));

        case 18:
          queueEmbed = _context2.sent;
          _context2.prev = 19;
          _context2.next = 22;
          return regeneratorRuntime.awrap(queueEmbed.react("⬅️"));

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(queueEmbed.react("⏹"));

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(queueEmbed.react("➡️"));

        case 26:
          _context2.next = 32;
          break;

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2["catch"](19);
          console.error(_context2.t0);
          message.channel.send(_context2.t0.message)["catch"](console.error);

        case 32:
          filter = function filter(reaction, user) {
            return ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name);
          };

          collector = queueEmbed.createReactionCollector(filter, {
            time: 60000
          });
          collector.on("collect", function _callee(reaction, user) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;

                    if (reaction.emoji.name === "➡️") {
                      if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit("**\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 - ".concat(currentPage + 1, "/").concat(embeds.length, "**"), embeds[currentPage]);
                      }
                    } else if (reaction.emoji.name === "⬅️") {
                      if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit("**\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 - ".concat(currentPage + 1, "/").concat(embeds.length, "**"), embeds[currentPage]);
                      }
                    } else {
                      collector.stop();
                      reaction.message.reactions.removeAll();
                    }

                    _context.next = 4;
                    return regeneratorRuntime.awrap(reaction.users.remove(message.author.id));

                  case 4:
                    _context.next = 10;
                    break;

                  case 6:
                    _context.prev = 6;
                    _context.t0 = _context["catch"](0);
                    console.error(_context.t0);
                    return _context.abrupt("return", message.channel.send(_context.t0.message)["catch"](console.error));

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[0, 6]]);
          });

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[19, 28]]);
};

function generateQueueEmbed(message, queue) {
  var embeds, k, _loop, i;

  return regeneratorRuntime.async(function generateQueueEmbed$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          embeds = [];
          k = 10;

          _loop = function _loop(i) {
            var current, j, info, embed;
            return regeneratorRuntime.async(function _loop$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    current = queue.slice(i, k);
                    j = i;
                    k += 10;
                    info = current.map(function (track) {
                      return "".concat(++j, " - [").concat(track.title, "](").concat(track.url, ")");
                    }).join("\n");
                    _context3.next = 6;
                    return regeneratorRuntime.awrap(embedGenerator.run('music.queue.info_02'));

                  case 6:
                    embed = _context3.sent;
                    _context3.next = 9;
                    return regeneratorRuntime.awrap(embed.setThumbnail(queue[0].thumbnails).setDescription("**".concat(embed.description, " - [").concat(queue[0].title, "](").concat(queue[0].url, ")**\n\n").concat(info)).setTimestamp());

                  case 9:
                    console.log(embed);
                    embeds.push(embed);

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          };

          i = 0;

        case 4:
          if (!(i < queue.length)) {
            _context4.next = 10;
            break;
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(_loop(i));

        case 7:
          i += 10;
          _context4.next = 4;
          break;

        case 10:
          return _context4.abrupt("return", embeds);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Displays the status of the current queue",
  accessableby: "Members",
  aliases: ['q'],
  category: "music"
};