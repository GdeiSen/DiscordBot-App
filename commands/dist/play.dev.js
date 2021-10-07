"use strict";

var _require = require("../include/play"),
    play = _require.play;

var _require2 = require("@discordjs/voice"),
    joinVoiceChannel = _require2.joinVoiceChannel;

var ytdl = require("ytdl-core");

var YouTubeAPI = require("simple-youtube-api");

var _require3 = require("../util/EvobotUtil"),
    YOUTUBE_API_KEY = _require3.YOUTUBE_API_KEY,
    DEFAULT_VOLUME = _require3.DEFAULT_VOLUME;

var youtube = new YouTubeAPI(YOUTUBE_API_KEY);
text = require("../text_packs/en.json");

var embedGenerator = require("../include/embedGenerator");

module.exports.run = function _callee(bot, message, args) {
  var channel, embed1, embed2, embed3, embed4, embed5, embed6, embed7, serverQueue, permissions, search, videoPattern, playlistPattern, url, urlValid, connection, queueConstruct, songInfo, song, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          channel = message.member.voice.channel; //Syntaxis should be upgraded to v13 here!

          _context.next = 3;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_02"));

        case 3:
          embed1 = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_01"));

        case 6:
          embed2 = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_03"));

        case 9:
          embed3 = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_04"));

        case 12:
          embed4 = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_05"));

        case 15:
          embed5 = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.error_06"));

        case 18:
          embed6 = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(embedGenerator.run("music.play.info_01"));

        case 21:
          embed7 = _context.sent;
          serverQueue = message.client.queue.get(message.guild.id); //message.delete();

          if (channel) {
            _context.next = 25;
            break;
          }

          return _context.abrupt("return", message.channel.send({
            embeds: [embed1]
          }));

        case 25:
          if (!(serverQueue && channel !== message.guild.me.voice.channel)) {
            _context.next = 27;
            break;
          }

          return _context.abrupt("return", message.channel.send({
            embeds: [embed2]
          })["catch"](console.error));

        case 27:
          if (args.length) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("return", message.channel.send({
            embeds: [embed7]
          })["catch"](console.error));

        case 29:
          permissions = channel.permissionsFor(message.client.user);

          if (permissions.has("CONNECT")) {
            _context.next = 32;
            break;
          }

          return _context.abrupt("return", message.channel.send({
            embeds: [embed3]
          }));

        case 32:
          if (permissions.has("SPEAK")) {
            _context.next = 34;
            break;
          }

          return _context.abrupt("return", message.channel.send({
            embeds: [embed4]
          }));

        case 34:
          search = args;
          videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
          playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
          url = args;
          urlValid = videoPattern.test(args); // Start the playlist if playlist url was provided

          if (!(!videoPattern.test(args) && playlistPattern.test(args))) {
            _context.next = 41;
            break;
          }

          return _context.abrupt("return", message.client.commands.get("playlist").run(bot, message, args));

        case 41:
          connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
          });
          queueConstruct = {
            textChannel: message.channel,
            channel: channel,
            connection: null,
            songs: [],
            loop: false,
            volume: DEFAULT_VOLUME || 30,
            playing: true
          };
          songInfo = null;
          song = null;

          if (!urlValid) {
            _context.next = 58;
            break;
          }

          _context.prev = 46;
          _context.next = 49;
          return regeneratorRuntime.awrap(ytdl.getInfo(url));

        case 49:
          songInfo = _context.sent;
          _context.next = 56;
          break;

        case 52:
          _context.prev = 52;
          _context.t0 = _context["catch"](46);
          console.error(_context.t0);
          return _context.abrupt("return", message.channel.send({
            embeds: [embed6]
          })["catch"](console.error));

        case 56:
          _context.next = 70;
          break;

        case 58:
          _context.prev = 58;
          _context.next = 61;
          return regeneratorRuntime.awrap(youtube.searchVideos(search, 1));

        case 61:
          results = _context.sent;
          _context.next = 64;
          return regeneratorRuntime.awrap(ytdl.getInfo(results[0].url));

        case 64:
          songInfo = _context.sent;
          _context.next = 70;
          break;

        case 67:
          _context.prev = 67;
          _context.t1 = _context["catch"](58);
          return _context.abrupt("return", message.channel.send({
            embeds: [embed5]
          })["catch"](console.error));

        case 70:
          _context.prev = 70;
          song = {
            url: songInfo.videoDetails.video_url,
            author: message.author.username
          };
          console.log(song.author);
          _context.next = 78;
          break;

        case 75:
          _context.prev = 75;
          _context.t2 = _context["catch"](70);
          return _context.abrupt("return", message.channel.send({
            embeds: [embed5]
          })["catch"](console.error));

        case 78:
          if (!serverQueue) {
            _context.next = 81;
            break;
          }

          serverQueue.songs.push(song);
          return _context.abrupt("return", serverQueue.textChannel.send({
            content: "".concat(text.music.play.info_02_01, " **").concat(song.title, "** ").concat(text.music.play.info_02_02, " ").concat(message.author)
          })["catch"](console.error));

        case 81:
          queueConstruct.songs.push(song);
          message.client.queue.set(message.guild.id, queueConstruct);
          _context.prev = 83;
          _context.next = 86;
          return regeneratorRuntime.awrap(channel.join());

        case 86:
          queueConstruct.connection = _context.sent;
          _context.next = 89;
          return regeneratorRuntime.awrap(queueConstruct.connection.voice.setSelfDeaf(true));

        case 89:
          play(queueConstruct.songs[0], message, args);
          _context.next = 99;
          break;

        case 92:
          _context.prev = 92;
          _context.t3 = _context["catch"](83);
          console.error(_context.t3);
          message.client.queue["delete"](message.guild.id);
          _context.next = 98;
          return regeneratorRuntime.awrap(channel.leave());

        case 98:
          return _context.abrupt("return", message.channel.send({
            content: " ".concat(_context.t3)
          })["catch"](console.error));

        case 99:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[46, 52], [58, 67], [70, 75], [83, 92]]);
};

module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays songs",
  category: "music"
};