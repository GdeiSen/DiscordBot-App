"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var _require2 = require("../include/play"),
    play = _require2.play;

var YouTubeAPI = require("simple-youtube-api");

var scdl = require("soundcloud-downloader")["default"];

var Discord = require("discord.js");

var _require3 = require("../util/EvobotUtil"),
    YOUTUBE_API_KEY = _require3.YOUTUBE_API_KEY,
    SOUNDCLOUD_CLIENT_ID = _require3.SOUNDCLOUD_CLIENT_ID,
    MAX_PLAYLIST_SIZE = _require3.MAX_PLAYLIST_SIZE,
    DEFAULT_VOLUME = _require3.DEFAULT_VOLUME;

var youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports.run = function _callee(bot, message, args) {
  var _serverQueue$songs, _queueConstruct$songs;

  var embed1, embed2, embed3, embed4, embed5, embed6, embed7, channel, serverQueue, permissions, search, pattern, url, urlValid, queueConstruct, playlist, videos, results, newSongs, songs, playlistEmbed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Для начала нужно быть в голосовом канале!').setColor('RED');
          embed2 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Вы должны быть в одинаковым канале с ботом!').setColor('RED');
          embed3 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Кажется у меня недостаточно прав для присоединения к вашему каналу!').setColor('RED');
          embed4 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Кажется у меня недостаточно прав для проигрывания музыки!').setColor('RED');
          embed5 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('К сожалению ничего не нашлось!').setColor('RED');
          embed6 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Кажется что-то пошло не так!').setColor('RED');
          embed7 = new Discord.MessageEmbed().setTitle('использование').setDescription("~ play <YouTube URL | Video Name | Soundcloud URL>").setColor('ORANGE');
          channel = message.member.voice.channel;
          serverQueue = message.client.queue.get(message.guild.id);

          if (args.length) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", message.reply(embed7)["catch"](console.error));

        case 11:
          if (channel) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", message.reply(embed1)["catch"](console.error));

        case 13:
          permissions = channel.permissionsFor(message.client.user);

          if (permissions.has("CONNECT")) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", message.reply(embed3));

        case 16:
          if (permissions.has("SPEAK")) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", message.reply(embed4));

        case 18:
          if (!(serverQueue && channel !== message.guild.me.voice.channel)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", message.reply(embed2)["catch"](console.error));

        case 20:
          search = args;
          pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
          url = args;
          urlValid = pattern.test(args);
          queueConstruct = {
            textChannel: message.channel,
            channel: channel,
            connection: null,
            songs: [],
            loop: false,
            volume: DEFAULT_VOLUME || 100,
            playing: true
          };
          playlist = null;
          videos = [];

          if (!urlValid) {
            _context.next = 43;
            break;
          }

          _context.prev = 28;
          _context.next = 31;
          return regeneratorRuntime.awrap(youtube.getPlaylist(url, {
            part: "snippet"
          }));

        case 31:
          playlist = _context.sent;
          _context.next = 34;
          return regeneratorRuntime.awrap(playlist.getVideos(MAX_PLAYLIST_SIZE || 30, {
            part: "snippet"
          }));

        case 34:
          videos = _context.sent;
          _context.next = 41;
          break;

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](28);
          console.error(_context.t0);
          return _context.abrupt("return", message.reply(embed5)["catch"](console.error));

        case 41:
          _context.next = 66;
          break;

        case 43:
          if (!scdl.isValidUrl(args[0])) {
            _context.next = 52;
            break;
          }

          if (!args[0].includes("/sets/")) {
            _context.next = 50;
            break;
          }

          message.channel.send("⌛ поиск плейлиста");
          _context.next = 48;
          return regeneratorRuntime.awrap(scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID));

        case 48:
          playlist = _context.sent;
          videos = playlist.tracks.map(function (track) {
            return {
              title: track.title,
              url: track.permalink_url,
              duration: track.duration / 1000
            };
          });

        case 50:
          _context.next = 66;
          break;

        case 52:
          _context.prev = 52;
          _context.next = 55;
          return regeneratorRuntime.awrap(youtube.searchPlaylists(search, 1, {
            part: "snippet"
          }));

        case 55:
          results = _context.sent;
          playlist = results[0];
          _context.next = 59;
          return regeneratorRuntime.awrap(playlist.getVideos(MAX_PLAYLIST_SIZE || 30, {
            part: "snippet"
          }));

        case 59:
          videos = _context.sent;
          _context.next = 66;
          break;

        case 62:
          _context.prev = 62;
          _context.t1 = _context["catch"](52);
          console.error(_context.t1);
          return _context.abrupt("return", message.reply(_context.t1.message)["catch"](console.error));

        case 66:
          newSongs = videos.map(function (video) {
            return song = {
              title: video.title,
              url: video.url,
              duration: video.durationSeconds
            };
          });
          serverQueue ? (_serverQueue$songs = serverQueue.songs).push.apply(_serverQueue$songs, _toConsumableArray(newSongs)) : (_queueConstruct$songs = queueConstruct.songs).push.apply(_queueConstruct$songs, _toConsumableArray(newSongs));
          songs = serverQueue ? serverQueue.songs : queueConstruct.songs;
          playlistEmbed = new MessageEmbed().setTitle("".concat(playlist.title)).setDescription(songs.map(function (song, index) {
            return "".concat(index + 1, ". ").concat(song.title);
          })).setURL(playlist.url).setColor("#F8AA2A");
          if (playlistEmbed.description.length >= 2048) playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + "\nПлейлист был превышен...";
          message.channel.send("".concat(message.author, " \u0417\u0430\u043A\u0430\u0437\u0430\u043B \u043F\u043B\u0435\u0439\u043B\u0438\u0441\u0442"), playlistEmbed);

          if (serverQueue) {
            _context.next = 90;
            break;
          }

          message.client.queue.set(message.guild.id, queueConstruct);
          _context.prev = 74;
          _context.next = 77;
          return regeneratorRuntime.awrap(channel.join());

        case 77:
          queueConstruct.connection = _context.sent;
          _context.next = 80;
          return regeneratorRuntime.awrap(queueConstruct.connection.voice.setSelfDeaf(true));

        case 80:
          play(queueConstruct.songs[0], message);
          _context.next = 90;
          break;

        case 83:
          _context.prev = 83;
          _context.t2 = _context["catch"](74);
          console.error(_context.t2);
          message.client.queue["delete"](message.guild.id);
          _context.next = 89;
          return regeneratorRuntime.awrap(channel.leave());

        case 89:
          return _context.abrupt("return", message.channel.send(embed2)["catch"](console.error));

        case 90:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[28, 37], [52, 62], [74, 83]]);
};

module.exports.config = {
  name: "playlist",
  description: "выполняет проигрывание плейлиста",
  usage: "~playlist",
  accessableby: "Members",
  aliases: ['pl']
};