"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var Discord = require("discord.js");

var YouTubeAPI = require("simple-youtube-api");

var _require2 = require("../util/EvobotUtil"),
    YOUTUBE_API_KEY = _require2.YOUTUBE_API_KEY;

var youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports.run = function _callee(bot, message, args) {
  var embed1, embed2, search, resultsEmbed, filter, results, resultsMessage, response, reply, songs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, song, choice;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('Для начала нужно быть в голосовом канале!').setColor('RED');
          embed2 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('коллектор сообщений уже был взаимодействован в этом каанале!').setColor('RED');

          if (args.length) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", message.reply("\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435: ".concat(message.client.prefix).concat(module.exports.name, " <Video Name>"))["catch"](console.error));

        case 4:
          if (!message.channel.activeCollector) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", message.reply(embed2));

        case 6:
          if (message.member.voice.channel) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", message.reply(embed1)["catch"](console.error));

        case 8:
          search = args;
          resultsEmbed = new MessageEmbed().setTitle("\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u043C\u0435\u0440 \u0442\u0440\u0435\u043A\u0430 \u0434\u043B\u044F \u043F\u0440\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u043D\u0438\u044F").setDescription("Results for: ".concat(search)).setColor("GREEN");
          _context.prev = 10;

          filter = function filter(msg) {
            var pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
            return pattern.test(msg.content);
          };

          _context.next = 14;
          return regeneratorRuntime.awrap(youtube.searchVideos(search, 10));

        case 14:
          results = _context.sent;
          results.map(function (video, index) {
            return resultsEmbed.addField(video.shortURL, "".concat(index + 1, ". ").concat(video.title));
          });
          _context.next = 18;
          return regeneratorRuntime.awrap(message.channel.send(resultsEmbed));

        case 18:
          resultsMessage = _context.sent;
          message.channel.activeCollector = true;
          _context.next = 22;
          return regeneratorRuntime.awrap(message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"]
          }));

        case 22:
          response = _context.sent;
          reply = response.first().content;

          if (!reply.includes(",")) {
            _context.next = 54;
            break;
          }

          songs = reply.split(",").map(function (str) {
            return str.trim();
          });
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 29;
          _iterator = songs[Symbol.iterator]();

        case 31:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 38;
            break;
          }

          song = _step.value;
          _context.next = 35;
          return regeneratorRuntime.awrap(message.client.commands.get("play").run(bot, message, [resultsEmbed.fields[parseInt(song) - 1].name]));

        case 35:
          _iteratorNormalCompletion = true;
          _context.next = 31;
          break;

        case 38:
          _context.next = 44;
          break;

        case 40:
          _context.prev = 40;
          _context.t0 = _context["catch"](29);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 44:
          _context.prev = 44;
          _context.prev = 45;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 47:
          _context.prev = 47;

          if (!_didIteratorError) {
            _context.next = 50;
            break;
          }

          throw _iteratorError;

        case 50:
          return _context.finish(47);

        case 51:
          return _context.finish(44);

        case 52:
          _context.next = 56;
          break;

        case 54:
          choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
          message.client.commands.get("play").run(bot, message, [choice]);

        case 56:
          message.channel.activeCollector = false;
          resultsMessage["delete"]()["catch"](console.error);
          response.first()["delete"]()["catch"](console.error);
          _context.next = 67;
          break;

        case 61:
          _context.prev = 61;
          _context.t1 = _context["catch"](10);
          console.error(_context.t1);
          message.channel.activeCollector = false;
          message.reply(_context.t1.message)["catch"](console.error);
          return _context.abrupt("return");

        case 67:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 61], [29, 40, 44, 52], [45,, 47, 51]]);
};

module.exports.config = {
  name: "search",
  description: "выполняет поиск трека и проигрывает его",
  usage: "~search",
  accessableby: "Members",
  aliases: ['s']
};