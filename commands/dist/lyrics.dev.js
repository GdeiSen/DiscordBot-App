"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var lyricsFinder = require("lyrics-finder");

module.exports.run = function _callee(bot, message, args) {
  var queue, lyrics, title, lyricsEmbed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          queue = message.client.queue.get(message.guild.id);
          lyrics = null;
          title = queue.songs[0].title;
          console.log(args);

          if (!(args != '~lyr', '~lyrics' && args)) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(lyricsFinder(args));

        case 8:
          lyrics = _context.sent;
          if (!lyrics) lyrics = "Текст не был найден!";
          _context.next = 22;
          break;

        case 12:
          _context.prev = 12;
          _context.next = 15;
          return regeneratorRuntime.awrap(lyricsFinder(queue.songs[0].title));

        case 15:
          lyrics = _context.sent;
          if (!lyrics) lyrics = "Текст не был найден!\n Попробуйте использовать ручной поиск > ~lyrics [args]";
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](12);
          lyrics = "lyrics.lyricsNotFound";

        case 22:
          lyricsEmbed = new MessageEmbed().setTitle('Текст песни').setDescription(lyrics).setColor("GREEN").setTimestamp();
          if (lyricsEmbed.description.length >= 2048) lyricsEmbed.description = "".concat(lyricsEmbed.description.substr(0, 2045), "...");
          return _context.abrupt("return", message.channel.send(lyricsEmbed)["catch"](console.error));

        case 27:
          _context.prev = 27;
          _context.t1 = _context["catch"](0);
          console.log('lyrics error');

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27], [12, 19]]);
};

module.exports.config = {
  name: "lyrics",
  description: "ввыводит текст песни",
  usage: "~lyrics",
  accessableby: "Members",
  aliases: ['lyr']
};