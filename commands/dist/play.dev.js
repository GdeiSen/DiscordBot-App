"use strict";

var _require = require("../include/play"),
    play = _require.play;

var Discord = require("discord.js");

var ytdl = require("ytdl-core");

var YouTubeAPI = require("simple-youtube-api");

var scdl = require("soundcloud-downloader")["default"];

var https = require("https");

var _require2 = require("../util/EvobotUtil"),
    YOUTUBE_API_KEY = _require2.YOUTUBE_API_KEY,
    SOUNDCLOUD_CLIENT_ID = _require2.SOUNDCLOUD_CLIENT_ID,
    DEFAULT_VOLUME = _require2.DEFAULT_VOLUME;

var youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports.run = function _callee(bot, message, args) {
  var channel, embed1, embed2, embed3, embed4, embed5, embed6, embed7, serverQueue, permissions, search, videoPattern, playlistPattern, url, urlValid, queueConstruct, songInfo, song, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          channel = message.member.voice.channel;
          embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Для начала нужно быть в голосовом канале!').setColor('RED');
          embed2 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Вы должны быть в одинаковым канале с ботом!').setColor('RED');
          embed3 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Кажется у меня недостаточно прав для присоединения к вашему каналу!').setColor('RED');
          embed4 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Кажется у меня недостаточно прав для проигрывания музыки!').setColor('RED');
          embed5 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('К сожалению ничего не нашлось!').setColor('RED');
          embed6 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Кажется что-то пошло не так!').setColor('RED');
          embed7 = new Discord.MessageEmbed().setTitle('использование').setDescription("".concat(message.client.prefix, " play <YouTube URL | Video Name>")).setColor('ORANGE');
          serverQueue = message.client.queue.get(message.guild.id);
          message["delete"]();

          if (channel) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", message.reply(embed1));

        case 12:
          if (!(serverQueue && channel !== message.guild.me.voice.channel)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", message.reply(embed2)["catch"](console.error));

        case 14:
          if (args.length) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", message.reply(embed7)["catch"](console.error));

        case 16:
          permissions = channel.permissionsFor(message.client.user);

          if (permissions.has("CONNECT")) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", message.reply(embed3));

        case 19:
          if (permissions.has("SPEAK")) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", message.reply(embed4));

        case 21:
          search = args;
          videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
          playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
          url = args;
          urlValid = videoPattern.test(args); // Start the playlist if playlist url was provided

          if (!(!videoPattern.test(args) && playlistPattern.test(args))) {
            _context.next = 30;
            break;
          }

          return _context.abrupt("return", message.client.commands.get("playlist").run(bot, message, args));

        case 30:
          if (!(scdl.isValidUrl(url) && url.includes("/sets/"))) {
            _context.next = 32;
            break;
          }

          return _context.abrupt("return", message.client.commands.get("playlist").run(bot, message, args));

        case 32:
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
            _context.next = 49;
            break;
          }

          _context.prev = 36;
          _context.next = 39;
          return regeneratorRuntime.awrap(ytdl.getInfo(url));

        case 39:
          songInfo = _context.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds
          };
          _context.next = 47;
          break;

        case 43:
          _context.prev = 43;
          _context.t0 = _context["catch"](36);
          console.error(_context.t0);
          return _context.abrupt("return", message.reply(_context.t0.message)["catch"](console.error));

        case 47:
          _context.next = 63;
          break;

        case 49:
          _context.prev = 49;
          _context.next = 52;
          return regeneratorRuntime.awrap(youtube.searchVideos(search, 1));

        case 52:
          results = _context.sent;
          _context.next = 55;
          return regeneratorRuntime.awrap(ytdl.getInfo(results[0].url));

        case 55:
          songInfo = _context.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds
          };
          _context.next = 63;
          break;

        case 59:
          _context.prev = 59;
          _context.t1 = _context["catch"](49);
          console.error(_context.t1);
          return _context.abrupt("return", message.reply(_context.t1.message)["catch"](console.error));

        case 63:
          if (!serverQueue) {
            _context.next = 66;
            break;
          }

          serverQueue.songs.push(song);
          return _context.abrupt("return", serverQueue.textChannel.send("\u2705 **".concat(song.title, "** \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u043B ").concat(message.author))["catch"](console.error));

        case 66:
          queueConstruct.songs.push(song);
          message.client.queue.set(message.guild.id, queueConstruct);
          _context.prev = 68;
          _context.next = 71;
          return regeneratorRuntime.awrap(channel.join());

        case 71:
          queueConstruct.connection = _context.sent;
          _context.next = 74;
          return regeneratorRuntime.awrap(queueConstruct.connection.voice.setSelfDeaf(true));

        case 74:
          play(queueConstruct.songs[0], message);
          _context.next = 84;
          break;

        case 77:
          _context.prev = 77;
          _context.t2 = _context["catch"](68);
          console.error(_context.t2);
          message.client.queue["delete"](message.guild.id);
          _context.next = 83;
          return regeneratorRuntime.awrap(channel.leave());

        case 83:
          return _context.abrupt("return", message.channel.send(" ".concat(_context.t2))["catch"](console.error));

        case 84:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[36, 43], [49, 59], [68, 77]]);
};

module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ['p'],
  description: "Проигрывает песни"
};