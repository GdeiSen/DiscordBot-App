"use strict";

//const { MessageEmbed, Message } = require("discord.js");
var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed,
    Collector = _require.Collector;

var config = require("../config.json");

var text = require("../text_packs/en.json");

module.exports.run = function _callee(client, message, args) {
  var info_text_0, info_text_1, info_text_2, info_text_3, filter, response, reply, restart_message, collector;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          filter = function _ref(message) {
            if (!message.author.bot) return 1;
          };

          info_text_0 = new MessageEmbed().setTitle(text.info.info_02.embedTitle).setDescription(text.info.info_02.embedDescription).setColor(text.info.info_02.embedColor);
          message.channel.send(info_text_0);
          info_text_1 = new MessageEmbed().setTitle(text.info.info_03.embedTitle).setDescription(text.info.info_03.embedDescription).setColor(text.info.info_03.embedColor);
          info_text_2 = new MessageEmbed().setTitle(text.info.info_04.embedTitle).setDescription(text.info.info_04.embedDescription).setColor(text.info.info_04.embedColor);
          info_text_3 = new MessageEmbed().setTitle(text.info.info_05.embedTitle).setDescription(text.info.info_05.embedDescription).setColor(text.info.info_05.embedColor);
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"]
          }));

        case 9:
          response = _context.sent;
          reply = response.first().content;

          if (!(reply == "7777")) {
            _context.next = 21;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(message.channel.send(info_text_1));

        case 14:
          restart_message = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(restart_message.react("🔁"));

        case 17:
          collector = restart_message.createReactionCollector(function (filter) {
            return 1;
          }, {
            max: 1,
            time: 30000,
            errors: ["time"]
          });
          collector.on("collect", function (reaction) {
            switch (reaction.emoji.name) {
              case "🔁":
                message.channel.send("begin reloading").then(function (msg) {
                  setTimeout(function () {
                    msg.edit("reloading is complete!");
                  }, 10000);
                }).then(client.destroy()).then(client.login(config.TOKEN));
                break;
            }
          });
          /*collector.on("end", async () => {
              restart_message.reactions.removeAll().catch(console.error);
            await restart_message.react("⏳");
            
          });*/

          _context.next = 22;
          break;

        case 21:
          message.channel.send(info_text_2);

        case 22:
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](6);
          message.channel.send(info_text_3);
          console.log(_context.t0);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 24]]);
};

module.exports.config = {
  name: "emergency",
  description: "emergency mode for administrator",
  usage: "~emergency",
  accessableby: "Members",
  aliases: ['emerg', 'e'],
  category: "test"
};