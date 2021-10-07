"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("../include/queue"),
    queue = _require.queue;

var _require2 = require("../include/play"),
    play = _require2.play;

var YouTubeAPI = require("simple-youtube-api");

var Discord = require("discord.js");

var _require3 = require("../util/EvobotUtil"),
    YOUTUBE_API_KEY = _require3.YOUTUBE_API_KEY,
    SOUNDCLOUD_CLIENT_ID = _require3.SOUNDCLOUD_CLIENT_ID,
    MAX_PLAYLIST_SIZE = _require3.MAX_PLAYLIST_SIZE,
    DEFAULT_VOLUME = _require3.DEFAULT_VOLUME;

var youtube = new YouTubeAPI(YOUTUBE_API_KEY);

var embedGenerator = require("../include/embedGenerator");

module.exports.run = function _callee(bot, message, args) {
  var _serverQueue$songs, _queueConstruct$songs;

  var embed1, embed2, embed3, embed4, embed5, embed6, embed7, channel, serverQueue, permissions, search, pattern, url, urlValid, queueConstruct, playlist, videos, results, newSongs, songs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_02'));

        case 2:
          embed1 = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_01'));

        case 5:
          embed2 = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_03'));

        case 8:
          embed3 = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_04'));

        case 11:
          embed4 = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_05'));

        case 14:
          embed5 = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_06'));

        case 17:
          embed6 = _context.sent;
          _context.next = 20;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.info_01'));

        case 20:
          embed7 = _context.sent;
          embed7.setDescription(embed7.description + " **Playlist \"args\"**");
          channel = message.member.voice.channel;
          serverQueue = message.client.queue.get(message.guild.id);

          if (!(serverQueue && channel !== message.guild.me.voice.channel)) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", message.reply(embed2)["catch"](console.error));

        case 26:
          if (args.length) {
            _context.next = 28;
            break;
          }

          return _context.abrupt("return", message.reply(embed7)["catch"](console.error));

        case 28:
          if (channel) {
            _context.next = 30;
            break;
          }

          return _context.abrupt("return", message.reply(embed1)["catch"](console.error));

        case 30:
          permissions = channel.permissionsFor(message.client.user);

          if (permissions.has("CONNECT")) {
            _context.next = 33;
            break;
          }

          return _context.abrupt("return", message.reply(embed3));

        case 33:
          if (permissions.has("SPEAK")) {
            _context.next = 35;
            break;
          }

          return _context.abrupt("return", message.reply(embed4));

        case 35:
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
            volume: DEFAULT_VOLUME || 50,
            playing: true
          };
          playlist = null;
          videos = [];

          if (!urlValid) {
            _context.next = 58;
            break;
          }

          _context.prev = 43;
          _context.next = 46;
          return regeneratorRuntime.awrap(youtube.getPlaylist(url, {
            part: "snippet"
          }));

        case 46:
          playlist = _context.sent;
          _context.next = 49;
          return regeneratorRuntime.awrap(playlist.getVideos(MAX_PLAYLIST_SIZE || 30, {
            part: "snippet"
          }));

        case 49:
          videos = _context.sent;
          _context.next = 56;
          break;

        case 52:
          _context.prev = 52;
          _context.t0 = _context["catch"](43);
          console.error(_context.t0);
          return _context.abrupt("return", message.reply(embed5)["catch"](console.error));

        case 56:
          _context.next = 72;
          break;

        case 58:
          _context.prev = 58;
          _context.next = 61;
          return regeneratorRuntime.awrap(youtube.searchPlaylists(search, 1, {
            part: "snippet"
          }));

        case 61:
          results = _context.sent;
          playlist = results[0];
          _context.next = 65;
          return regeneratorRuntime.awrap(playlist.getVideos(MAX_PLAYLIST_SIZE || 30, {
            part: "snippet"
          }));

        case 65:
          videos = _context.sent;
          _context.next = 72;
          break;

        case 68:
          _context.prev = 68;
          _context.t1 = _context["catch"](58);
          console.error(_context.t1);
          return _context.abrupt("return", message.reply(_context.t1.message)["catch"](console.error));

        case 72:
          newSongs = videos.map(function (video) {
            return song = {
              url: video.url,
              author: message.author
            };
          });
          serverQueue ? (_serverQueue$songs = serverQueue.songs).push.apply(_serverQueue$songs, _toConsumableArray(newSongs)) : (_queueConstruct$songs = queueConstruct.songs).push.apply(_queueConstruct$songs, _toConsumableArray(newSongs));
          songs = serverQueue ? serverQueue.songs : queueConstruct.songs;
          message.channel.send("".concat(message.author, " \u0417\u0430\u043A\u0430\u0437\u0430\u043B \u043F\u043B\u0435\u0439\u043B\u0438\u0441\u0442"));

          if (serverQueue) {
            _context.next = 94;
            break;
          }

          message.client.queue.set(message.guild.id, queueConstruct);
          _context.prev = 78;
          _context.next = 81;
          return regeneratorRuntime.awrap(channel.join());

        case 81:
          queueConstruct.connection = _context.sent;
          _context.next = 84;
          return regeneratorRuntime.awrap(queueConstruct.connection.voice.setSelfDeaf(true));

        case 84:
          play(queueConstruct.songs[0], message, args);
          _context.next = 94;
          break;

        case 87:
          _context.prev = 87;
          _context.t2 = _context["catch"](78);
          console.error(_context.t2);
          message.client.queue["delete"](message.guild.id);
          _context.next = 93;
          return regeneratorRuntime.awrap(channel.leave());

        case 93:
          return _context.abrupt("return", message.channel.send(embed2)["catch"](console.error));

        case 94:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[43, 52], [58, 68], [78, 87]]);
};

module.exports.config = {
  name: "playlist",
  description: "plays a playlist",
  usage: "~playlist",
  accessableby: "Members",
  aliases: ['pl'],
  category: "music"
};