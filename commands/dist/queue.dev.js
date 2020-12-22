"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

module.exports.run = function _callee2(bot, message, args) {
  var embed1, embed4, permissions, queue, currentPage, embeds, queueEmbed, filter, collector;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          embed1 = new MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
          embed4 = new MessageEmbed().setTitle('ошибка').setDescription('Кажется у меня недостаточно прав для проигрывания музыки!').setColor('RED');
          permissions = message.channel.permissionsFor(message.client.user);

          if (permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", message.reply(embed4));

        case 5:
          queue = message.client.queue.get(message.guild.id);

          if (queue) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed1));

        case 8:
          currentPage = 0;
          embeds = generateQueueEmbed(message, queue.songs);
          _context2.next = 12;
          return regeneratorRuntime.awrap(message.channel.send("**\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 - ".concat(currentPage + 1, "/").concat(embeds.length, "**"), embeds[currentPage]));

        case 12:
          queueEmbed = _context2.sent;
          _context2.prev = 13;
          _context2.next = 16;
          return regeneratorRuntime.awrap(queueEmbed.react("⬅️"));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(queueEmbed.react("⏹"));

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(queueEmbed.react("➡️"));

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](13);
          console.error(_context2.t0);
          message.channel.send(_context2.t0.message)["catch"](console.error);

        case 26:
          filter = function filter(reaction, user) {
            return ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
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

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[13, 22]]);
};

function generateQueueEmbed(message, queue) {
  var embeds = [];
  var k = 10;

  var _loop = function _loop(i) {
    var current = queue.slice(i, k);
    var j = i;
    k += 10;
    var info = current.map(function (track) {
      return "".concat(++j, " - [").concat(track.title, "](").concat(track.url, ")");
    }).join("\n");
    var embed = new MessageEmbed().setTitle("Очередь\n").setThumbnail(message.guild.iconURL()).setColor('GREEN').setDescription("**\u0441\u0435\u0439\u0447\u0430\u0441 \u0438\u0433\u0440\u0430\u0435\u0442 - [".concat(queue[0].title, "](").concat(queue[0].url, ")**\n\n").concat(info, "\n\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u043C")).setTimestamp();
    embeds.push(embed);
  };

  for (var i = 0; i < queue.length; i += 10) {
    _loop(i);
  }

  return embeds;
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Выводит состояние цекущей очереди",
  accessableby: "Members",
  aliases: ['q']
};