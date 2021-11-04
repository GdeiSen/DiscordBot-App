"use strict";

var _require = require("discord.js"),
    Client = _require.Client,
    Collection = _require.Collection,
    Intents = _require.Intents;

var client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

var config = require("./config.json");

var fs = require("fs");

client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.login(config.TOKEN);
client.prefix = config.PREFIX;
client.queue = new Map();

var text = require("./text_packs/en.json");

var _require2 = require("discord.js"),
    MessageEmbed = _require2.MessageEmbed;

client.once("ready", function () {
  console.log("\u2B1C Main Base Is Enable");
  client.user.setActivity("In Development!", {
    type: "LISTENING"
  });
});
client.on("warn", function (info) {
  return console.log(info);
});
client.on("error", console.error);
fs.readdir("./commands/", function (err, files) {
  console.log('(command scan started)');
  if (err) console.log(err);
  var jsfile = files.filter(function (f) {
    return f.split(".").pop() === "js";
  });

  if (jsfile.length <= 0) {
    return console.log("⬜ Unable To Find Commands");
  }

  jsfile.forEach(function (f, i) {
    var pull = require("./commands/".concat(f));

    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(function (alias) {
      client.aliases.set(alias, pull.config.name);
    });
    var buf = new Array();
    var index = 0;
    client.commands.forEach(function (element) {
      if (index == 0) {
        buf[0] = element.config.category;
        index++;
      } else {
        if (!buf.find(function (el) {
          return el == element.config.category;
        })) {
          buf.push(element.config.category);
          index++;
        }
      }
    });
    client.categories = buf;
  });
  console.log('(command scan finished)');
});
client.on('messageCreate', function _callee(message) {
  var messageArray, cmd, args, commandfile, error_text;
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
          messageArray = message.content.split(" ");
          cmd = messageArray[0];
          args = message.content.split(' ').slice(1).join();

          if (message.content.startsWith(client.prefix)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return");

        case 11:
          commandfile = client.commands.get(cmd.slice(client.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(client.prefix.length)));
          _context.prev = 12;

          if (commandfile && require("./include/utils/idBlocker").run(message) === "admin") {
            commandfile.run(client, message, args);
          }

          ;
          _context.next = 23;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](12);
          error_text = new MessageEmbed().setTitle(text.warnings.error_01.embedTitle).setDescription(text.warnings.error_01.embedDescription).setColor(text.warnings.error_01.embedColor);
          message.channel.send(error_text);
          console.log(_context.t0);
          return _context.abrupt("return");

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[12, 17]]);
});