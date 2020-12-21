"use strict";

/**
 * Module Imports
 */
var _require = require("discord.js"),
    Client = _require.Client,
    Collection = _require.Collection;

var _require2 = require("fs"),
    readdirSync = _require2.readdirSync;

var _require3 = require("path"),
    join = _require3.join;

var _require4 = require("./util/EvobotUtil"),
    TOKEN = _require4.TOKEN,
    PREFIX = _require4.PREFIX;

var Discord = require("discord.js");

var fs = require("fs");

var _require5 = require("console"),
    groupCollapsed = _require5.groupCollapsed;

var client = new Client({
  disableMentions: "everyone"
});
client.commands = new Collection();
client.aliases = new Collection();
client.login(process.env.token);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
var cooldowns = new Collection();
/**
 * Client Events
 */

client.on("ready", function () {
  console.log("".concat(client.user.username, " ready!"));
  client.user.setActivity("~help \u0438 ~play", {
    type: "LISTENING"
  });
});
client.on("warn", function (info) {
  return console.log(info);
});
client.on("error", console.error);
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
client.on("message", function _callee(message) {
  var prefix, messageArray, cmd, args, error_text, commandfile;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!message.author.bot) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          if (message.guild) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return");

        case 4:
          if (!(message.author.bot || message.channel.type === "dm")) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          prefix = "~";
          messageArray = message.content.split(" ");
          cmd = messageArray[0];
          args = message.content.substring(message.content.indexOf(' ') + 1);

          if (message.content.startsWith(prefix)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return");

        case 12:
          error_text = new Discord.MessageEmbed().setTitle('Критическая ошибка').setDescription('**была вызвана критическая ошибка в синтаксисе или в коде файла функции, функция не может быть вызвана до исправления неточностей в коде, свяжитесь с администратором бота**').setColor('RED');
          commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
          _context.prev = 14;
          if (commandfile) commandfile.run(client, message, args);
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](14);
          message.channel.send(error_text);
          return _context.abrupt("return");

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[14, 18]]);
});