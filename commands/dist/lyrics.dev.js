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

          if (queue) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", message.channel.send('ничего не играет')["catch"](console.error));

        case 3:
          lyrics = null;
          title = queue.songs[0].title;
          console.log(args);

          if (!(args != '~lyr' && args)) {
            _context.next = 13;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(lyricsFinder(args));

        case 9:
          lyrics = _context.sent;
          if (!lyrics) lyrics = "Текст не был найден!";
          _context.next = 23;
          break;

        case 13:
          _context.prev = 13;
          _context.next = 16;
          return regeneratorRuntime.awrap(lyricsFinder(queue.songs[0].title));

        case 16:
          lyrics = _context.sent;
          if (!lyrics) lyrics = "Текст не был найден!\n Попробуйте использовать ручной поиск > ~lyrics [args]";
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](13);
          lyrics = "lyrics.lyricsNotFound";

        case 23:
          lyricsEmbed = new MessageEmbed().setTitle('Текст песни').setDescription(lyrics).setColor("GREEN").setTimestamp();
          if (lyricsEmbed.description.length >= 2048) lyricsEmbed.description = "".concat(lyricsEmbed.description.substr(0, 2045), "...");
          return _context.abrupt("return", message.channel.send(lyricsEmbed)["catch"](console.error));

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[13, 20]]);
};

module.exports.config = {
  name: "lyrics",
  description: "ввыводит текст песни",
  usage: "~lyrics",
  accessableby: "Members",
  aliases: ['lyr']
};