"use strict";

var Discord = require("discord.js");

var lyricsFinder = require("lyrics-finder");

module.exports.run = function _callee(bot, message, args) {
  var queue, embed1, embed2, embed3, lyrics, title, embed4;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          queue = message.client.queue.get(message.guild.id);
          console.log(args);
          embed1 = new Discord.MessageEmbed().setTitle(text.music.lyrics.error_01.embedTitle).setDescription(text.music.lyrics.error_01.embedDescription).setColor(text.music.lyrics.error_01.embedColor);
          embed2 = new Discord.MessageEmbed().setTitle(text.music.lyrics.error_02.embedTitle).setDescription(text.music.lyrics.error_02.embedDescription).setColor(text.music.lyrics.error_02.embedColor);
          embed3 = new Discord.MessageEmbed().setTitle(text.music.lyrics.error_03.embedTitle).setDescription(text.music.lyrics.error_03.embedDescription).setColor(text.music.lyrics.error_03.embedColor);
          lyrics = null;

          if (!(!queue && !args)) {
            _context.next = 12;
            break;
          }

          message.channel.send(embed3);
          return _context.abrupt("return", 0);

        case 12:
          if (!(!queue && args)) {
            _context.next = 26;
            break;
          }

          _context.prev = 13;
          _context.next = 16;
          return regeneratorRuntime.awrap(lyricsFinder(args));

        case 16:
          lyrics = _context.sent;

          if (lyrics) {
            _context.next = 19;
            break;
          }

          throw error;

        case 19:
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](13);
          lyrics = text.music.lyrics.error_01.embedDescription;

        case 24:
          _context.next = 41;
          break;

        case 26:
          if (!(queue && !args)) {
            _context.next = 41;
            break;
          }

          _context.prev = 27;
          title = queue.songs[0].title;
          _context.next = 31;
          return regeneratorRuntime.awrap(lyricsFinder(title));

        case 31:
          lyrics = _context.sent;
          console.log(title);
          console.log(lyrics);

          if (lyrics) {
            _context.next = 36;
            break;
          }

          throw error;

        case 36:
          _context.next = 41;
          break;

        case 38:
          _context.prev = 38;
          _context.t1 = _context["catch"](27);
          lyrics = text.music.lyrics.error_01.embedDescription;

        case 41:
          embed4 = new Discord.MessageEmbed().setTitle(text.music.lyrics.info_01.embedTitle).setDescription("".concat(lyrics)).setColor(text.music.lyrics.info_01.embedColor);
          if (embed4.description.length >= 2048) embed4.description = "".concat(embed4.description.substr(0, 2045), "...");
          message.channel.send(embed4)["catch"](console.error);
          _context.next = 49;
          break;

        case 46:
          _context.prev = 46;
          _context.t2 = _context["catch"](0);
          console.log(_context.t2);

        case 49:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 46], [13, 21], [27, 38]]);
};

module.exports.config = {
  name: "lyrics",
  description: "displays the lyrics of the song",
  usage: "~lyrics",
  accessableby: "Members",
  aliases: ['lyr'],
  category: "music"
};