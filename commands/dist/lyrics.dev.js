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
          queue = message.client.queue.get(message.guild.id);
          lyrics = null;
          title = queue.songs[0].title;
          console.log(args);

          if (!(args != '~lyr', '~lyrics' && args)) {
            _context.next = 11;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(lyricsFinder(args));

        case 7:
          lyrics = _context.sent;
          if (!lyrics) lyrics = "Текст не был найден!";
          _context.next = 21;
          break;

        case 11:
          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(lyricsFinder(queue.songs[0].title));

        case 14:
          lyrics = _context.sent;
          if (!lyrics) lyrics = "Текст не был найден!\n Попробуйте использовать ручной поиск > ~lyrics [args]";
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](11);
          lyrics = "lyrics.lyricsNotFound";

        case 21:
          lyricsEmbed = new MessageEmbed().setTitle('Текст песни').setDescription(lyrics).setColor("GREEN").setTimestamp();
          if (lyricsEmbed.description.length >= 2048) lyricsEmbed.description = "".concat(lyricsEmbed.description.substr(0, 2045), "...");
          return _context.abrupt("return", message.channel.send(lyricsEmbed)["catch"](console.error));

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[11, 18]]);
};

module.exports.config = {
  name: "lyrics",
  description: "ввыводит текст песни",
  usage: "~lyrics",
  accessableby: "Members",
  aliases: ['lyr']
};