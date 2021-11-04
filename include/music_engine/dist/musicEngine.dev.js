"use strict";

var _require = require("./queueMaster.js"),
    queueMaster = _require.queueMaster;

var _require2 = require("discord.js"),
    MessageEmbed = _require2.MessageEmbed;

var _require3 = require('./playerMaster'),
    player = _require3.player;

var embedGenerator = require("../utils/embedGenerator");

var text = require("../../text_packs/en.json");

module.exports.run = function _callee(client, message, args, options) {
  var QueueMaster, queue, Player;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            QueueMaster = new queueMaster(client, message);
            QueueMaster.createQueue();
            queue = QueueMaster.getQueue();
            QueueMaster.addListener('INFO', function (text) {
              console.log(text);
            });
            QueueMaster.addListener('ERROR', function (text) {
              console.log(text);
            });
            console.log(QueueMaster.rawListeners('INFO'));
            Player = new player(queue, message);
            Player.addListener('INFO', function (text) {
              console.log(text);
            });
            Player.addListener('ERROR', function (text) {
              console.log(text);
            });

            if (options == 'auto') {
              QueueMaster.resolveAuto(args);
              QueueMaster.addListener('SONG_LOADING_DONE', function () {
                Player.start();
              });
            } else if (options == 'playlist_auto') {
              QueueMaster.resolvePlaylist(args);
              QueueMaster.addListener('PLAYLIST_LOADING_DONE', function (playlist, author) {
                Player.start();
                var addedEmbed = new MessageEmbed().setColor(text.info.embedColor).setTitle("\u2705  Playlist successfully added!\n\n ".concat(playlist.title, " \n")).addField("\uD83D\uDE4D\u200D\u2642\uFE0F By User:", "`".concat(author, "`"), true).setThumbnail(playlist.thumbnails["default"].url).setURL(playlist.url).setTimestamp();
                message.channel.send({
                  embeds: [addedEmbed]
                });
              });
            }

            Player.addListener('PLAYBACK_STARTED', function (queue) {
              var song = queue.current;
              var addedEmbed = new MessageEmbed().setColor(text.info.embedColor).setTitle(":musical_note:  Now Playing  :musical_note:\n\n ".concat(song.title, " \n")).addField("\u23F1 Duration: ", "`".concat(song.duration, "`"), true).addField("\uD83D\uDE4D\u200D\u2642\uFE0F By User: ", "`".concat(song.author, "`"), true).setThumbnail(song.thumbnail).setURL(song.url).setTimestamp();
              if (queue.songs[1]) addedEmbed.addField("\uD83D\uDCE2 Next: ", "`".concat(queue.songs[1].title, "`"), true);else {
                addedEmbed.addField("\uD83D\uDCE2 Next: ", "`Nothing`", true);
              }
              message.channel.send({
                embeds: [addedEmbed]
              });
            });
            Player.addListener('QUEUE_ENDED', function () {
              var embed = embedGenerator.run('music.play.info_03');
              message.channel.send({
                embeds: [embed]
              });
            });
            Player.addListener('SONG_ADDED', function (song) {
              var embed = embedGenerator.run('music.play.info_05');
              embed.setDescription("".concat(message.author.username, " ").concat(embedGenerator.run('direct.music.play.info_02_02'), " **").concat(song.title, "**"));
              embed.setURL(song.url);
              message.channel.send({
                embeds: [embed]
              });
            });
            Player.addListener('DISCONNECTED', function () {
              var embed = embedGenerator.run('music.play.info_04');
              message.channel.send({
                embeds: [embed]
              });
            });
          } catch (err) {
            console.log('[ERROR] [EX] Function error');
            console.log(err);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};