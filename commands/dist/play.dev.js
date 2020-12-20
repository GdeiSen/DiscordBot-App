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

module.exports.run = function _callee(client, message, args) {
  var channel, embed1, embed2, embed3, embed4, embed5, embed6, embed7, serverQueue, permissions, search, videoPattern, playlistPattern, scRegex, mobileScRegex, url, urlValid, queueConstruct, songInfo, song, trackInfo, results;
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
          embed7 = new Discord.MessageEmbed().setTitle('использование').setDescription("".concat(message.client.prefix, " play <YouTube URL | Video Name | Soundcloud URL>")).setColor('ORANGE');
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
          scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
          mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
          url = args[0];
          urlValid = videoPattern.test(args[0]); // Start the playlist if playlist url was provided

          if (!(!videoPattern.test(args[0]) && playlistPattern.test(args[0]))) {
            _context.next = 32;
            break;
          }

          return _context.abrupt("return", message.client.commands.get("playlist").run(message, args));

        case 32:
          if (!(scdl.isValidUrl(url) && url.includes("/sets/"))) {
            _context.next = 34;
            break;
          }

          return _context.abrupt("return", message.client.commands.get("playlist").run(message, args));

        case 34:
          if (!mobileScRegex.test(url)) {
            _context.next = 44;
            break;
          }

          _context.prev = 35;
          https.get(url, function (res) {
            if (res.statusCode == "302") {
              return message.client.commands.get("play").run(message, [res.headers.location]);
            } else {
              return message.reply(embed5)["catch"](console.error);
            }
          });
          _context.next = 43;
          break;

        case 39:
          _context.prev = 39;
          _context.t0 = _context["catch"](35);
          console.error(_context.t0);
          return _context.abrupt("return", message.reply(_context.t0.message)["catch"](console.error));

        case 43:
          return _context.abrupt("return", message.reply(embed6)["catch"](console.error));

        case 44:
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
            _context.next = 61;
            break;
          }

          _context.prev = 48;
          _context.next = 51;
          return regeneratorRuntime.awrap(ytdl.getInfo(url));

        case 51:
          songInfo = _context.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds
          };
          _context.next = 59;
          break;

        case 55:
          _context.prev = 55;
          _context.t1 = _context["catch"](48);
          console.error(_context.t1);
          return _context.abrupt("return", message.reply(_context.t1.message)["catch"](console.error));

        case 59:
          _context.next = 89;
          break;

        case 61:
          if (!scRegex.test(url)) {
            _context.next = 75;
            break;
          }

          _context.prev = 62;
          _context.next = 65;
          return regeneratorRuntime.awrap(scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID));

        case 65:
          trackInfo = _context.sent;
          song = {
            title: trackInfo.title,
            url: trackInfo.permalink_url,
            duration: Math.ceil(trackInfo.duration / 1000)
          };
          _context.next = 73;
          break;

        case 69:
          _context.prev = 69;
          _context.t2 = _context["catch"](62);
          console.error(_context.t2);
          return _context.abrupt("return", message.reply(_context.t2.message)["catch"](console.error));

        case 73:
          _context.next = 89;
          break;

        case 75:
          _context.prev = 75;
          _context.next = 78;
          return regeneratorRuntime.awrap(youtube.searchVideos(search, 1));

        case 78:
          results = _context.sent;
          _context.next = 81;
          return regeneratorRuntime.awrap(ytdl.getInfo(results[0].url));

        case 81:
          songInfo = _context.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds
          };
          _context.next = 89;
          break;

        case 85:
          _context.prev = 85;
          _context.t3 = _context["catch"](75);
          console.error(_context.t3);
          return _context.abrupt("return", message.reply(_context.t3.message)["catch"](console.error));

        case 89:
          if (!serverQueue) {
            _context.next = 92;
            break;
          }

          serverQueue.songs.push(song);
          return _context.abrupt("return", serverQueue.textChannel.send("\u2705 **".concat(song.title, "** \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u043B ").concat(message.author))["catch"](console.error));

        case 92:
          queueConstruct.songs.push(song);
          message.client.queue.set(message.guild.id, queueConstruct);
          _context.prev = 94;
          _context.next = 97;
          return regeneratorRuntime.awrap(channel.join());

        case 97:
          queueConstruct.connection = _context.sent;
          _context.next = 100;
          return regeneratorRuntime.awrap(queueConstruct.connection.voice.setSelfDeaf(true));

        case 100:
          play(queueConstruct.songs[0], message);
          _context.next = 110;
          break;

        case 103:
          _context.prev = 103;
          _context.t4 = _context["catch"](94);
          console.error(_context.t4);
          message.client.queue["delete"](message.guild.id);
          _context.next = 109;
          return regeneratorRuntime.awrap(channel.leave());

        case 109:
          return _context.abrupt("return", message.channel.send(" ".concat(_context.t4))["catch"](console.error));

        case 110:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[35, 39], [48, 55], [62, 69], [75, 85], [94, 103]]);
};

module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Проигрывает песни с YouTube и <SoundCloud(в разработке)>"
};