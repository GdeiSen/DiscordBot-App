"use strict";

var createBar = require("string-progressbar");

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var embedGenerator = require("../include/embedGenerator");

module.exports.run = function _callee(bot, message, args) {
  var queue, embed1, song, seek, left, nowPlaying;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          queue = message.client.queue.get(message.guild.id);
          _context.next = 3;
          return regeneratorRuntime.awrap(embedGenerator.run('warnings.error_03'));

        case 3:
          embed1 = _context.sent;

          if (queue) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", message.reply(embed1)["catch"](console.error));

        case 6:
          song = queue.songs[0];
          seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
          left = song.duration - seek;
          _context.next = 11;
          return regeneratorRuntime.awrap(embedGenerator.run('music.nowPlaying.info_01'));

        case 11:
          nowPlaying = _context.sent;
          nowPlaying.setDescription("".concat(song.title, "\n").concat(song.url)).setAuthor(message.client.user.username).setThumbnail(song.thumbnails);

          if (song.duration > 0) {
            nowPlaying.addField("\u200B", new Date(seek * 1000).toISOString().substr(11, 8) + "[" + createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), true);
            nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
          }

          return _context.abrupt("return", message.channel.send(nowPlaying));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "nowplaying",
  description: "displays the current playback",
  usage: "~nowplaying",
  accessableby: "Members",
  aliases: ['now', 'n', 'np'],
  category: "music"
};