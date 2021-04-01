"use strict";

/**
 * Module Imports
 */
var _require = require("discord.js"),
    Client = _require.Client,
    Collection = _require.Collection;

var _require2 = require("./util/EvobotUtil"),
    TOKEN = _require2.TOKEN,
    PREFIX = _require2.PREFIX;

var Discord = require("discord.js");

var fs = require("fs");

var client = new Client({
  disableMentions: "everyone"
});
client.commands = new Collection();
client.aliases = new Collection();
client.login('NzgwMDA1NDU3OTkzNTMxMzky.X7oysA.Q6aDTTXWaKuGkLYjm1bXe58OjdU');
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
/**
 * Client Events
 */

client.on("ready", function () {
  console.log("".concat(client.user.username, " ready!"));
  client.user.setActivity("~help \u0438 ~play", {
    type: "LISTENING"
  });

  var jointocreate = require("./jointocreate");

  jointocreate(client);
});
client.on("warn", function (info) {
  return console.log(info);
});
client.on("error", console.error);
client.on("messageReactionAdd", function _callee(reaction, user) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!reaction.message.partial) {
            _context.next = 3;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(reaction.message.fetch());

        case 3:
          if (!reaction.partial) {
            _context.next = 6;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(reaction.fetch());

        case 6:
          if (!user.bot) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return");

        case 8:
          if (reaction.message.guild) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return");

        case 10:
          if (!(reaction.message.channel.id === "780086468944199709")) {
            _context.next = 14;
            break;
          }

          if (!(reaction.emoji.name === '🆗')) {
            _context.next = 14;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(reaction.message.guild.members.cache.get(user.id).roles.add("827289516095701033"));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
});
client.on("messageReactionRemove", function _callee2(reaction, user) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!reaction.message.partial) {
            _context2.next = 3;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(reaction.message.fetch());

        case 3:
          if (!reaction.partial) {
            _context2.next = 6;
            break;
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(reaction.fetch());

        case 6:
          if (!user.bot) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return");

        case 8:
          if (reaction.message.guild) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return");

        case 10:
          if (!(reaction.message.channel.id === "780086468944199709")) {
            _context2.next = 14;
            break;
          }

          if (!(reaction.emoji.name === '🆗')) {
            _context2.next = 14;
            break;
          }

          _context2.next = 14;
          return regeneratorRuntime.awrap(reaction.message.guild.members.cache.get(user.id).roles.remove("827289516095701033"));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});
fs.readdir("./commands/", function (err, files) {
  if (err) console.log(err);
  var jsfile = files.filter(function (f) {
    return f.split(".").pop() === "js";
  });

  if (jsfile.length <= 0) {
    return console.log("[LOGS] Couldn't Find Commands!");
  }

  jsfile.forEach(function (f, i) {
    var pull = require("./commands/".concat(f));

    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(function (alias) {
      client.aliases.set(alias, pull.config.name);
    });
  });
});
client.on("message", function _callee3(message) {
  var prefix, messageArray, cmd, args, error_text, commandfile;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!message.author.bot) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return");

        case 2:
          if (message.guild) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return");

        case 4:
          if (!(message.author.bot || message.channel.type === "dm")) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return");

        case 6:
          prefix = "~";
          messageArray = message.content.split(" ");
          cmd = messageArray[0];
          args = message.content.substring(message.content.indexOf(' ') + 1);

          if (message.content.startsWith(prefix)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return");

        case 12:
          error_text = new Discord.MessageEmbed().setTitle('Критическая ошибка').setDescription('**была вызвана критическая ошибка в синтаксисе или в коде файла функции, функция не может быть вызвана до исправления неточностей в коде, свяжитесь с администратором бота**').setColor('RED');
          commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
          _context3.prev = 14;
          if (commandfile) commandfile.run(client, message, args);
          _context3.next = 22;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](14);
          message.channel.send(error_text);
          return _context3.abrupt("return");

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[14, 18]]);
});