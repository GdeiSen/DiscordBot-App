"use strict";

var Discord = require("discord.js");

module.exports.run = function _callee3(client, message, args) {
  var embed, msgEmbed;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          embed = new Discord.MessageEmbed().setTitle('Присоединение к NoGamingWeeks отряду').setDescription('Нажмите на ok чтобы вступить и еще раз, чтобы сдаться\nИ не забывайте об осознанном выборе и решении').setColor('RED');
          _context3.next = 3;
          return regeneratorRuntime.awrap(message.channel.send(embed));

        case 3:
          msgEmbed = _context3.sent;
          msgEmbed.react('🆗');
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

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.config = {
  name: "react_role",
  description: "Тестовая комманда для выдачи роли по нажатию на реакцию",
  usage: "~react_role",
  accessableby: "Members",
  aliases: []
};