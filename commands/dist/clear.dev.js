"use strict";

var Discord = require("discord.js");

text = require("../text_packs/en.json");

var embedGenerator = require("../include/embedGenerator");

module.exports.run = function _callee(bot, message, args) {
  var delete_messages, embed1, embed2, embed3, embed4, num;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          delete_messages = function delete_messages() {
            return regeneratorRuntime.async(function delete_messages$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(message.channel.messages.fetch({
                      limit: num
                    }).then(function (messages) {
                      message.channel.bulkDelete(messages);
                      var embed = new Discord.MessageEmbed().setTitle(text.warnings.clear.info_01.embedTitle).setDescription(text.warnings.clear.info_01.embedDescription + "".concat(num - 1)).setColor(text.warnings.clear.info_01.embedColor);
                      message.channel.send(embed).then(function (message) {
                        return message["delete"]({
                          timeout: 2000
                        });
                      });
                    }));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          embed1 = embedGenerator.run('warnings.clear.error_02');
          message.channel.send(embed1);
          embed2 = new Discord.MessageEmbed().setTitle(text.warnings.clear.error_02.embedTitle).setDescription(text.warnings.clear.error_02.embedDescription).setColor(text.warnings.clear.error_02.embedColor);
          embed3 = new Discord.MessageEmbed().setTitle(text.warnings.clear.error_03.embedTitle).setDescription(text.warnings.clear.error_03.embedDescription).setColor(text.warnings.clear.error_03.embedColor);
          embed4 = new Discord.MessageEmbed().setTitle(text.warnings.clear.error_04.embedTitle).setDescription(text.warnings.clear.error_04.embedDescription).setColor(text.warnings.clear.error_04.embedColor);

          if (args) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed1).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 9:
          if (!isNaN(args)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed2).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 11:
          if (!(args > 26)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed3).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 13:
          if (!(args < 1)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed4).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 15:
          num = Number(args) + 1;
          ;
          delete_messages();
          _context2.next = 23;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);
          console.log('clear error');

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

module.exports.config = {
  name: "clear",
  description: "Deletes the specified number of messages",
  usage: "~claer",
  accessableby: "Members",
  aliases: ['c', 'cl'],
  category: "admin"
};