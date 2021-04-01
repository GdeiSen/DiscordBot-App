"use strict";

var Discord = require("discord.js");

module.exports.run = function _callee(bot, message, args) {
  var embed1, embed2, embed3, embed4, arggs, amount, num, delete_messages;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          delete_messages = function _ref() {
            return regeneratorRuntime.async(function delete_messages$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(message.channel.messages.fetch({
                      limit: num
                    }).then(function (messages) {
                      message.channel.bulkDelete(messages);

                      if (num === 2) {
                        var embed = new Discord.MessageEmbed().setDescription("**\u0423\u0434\u0430\u043B\u0435\u043D\u043E ".concat(num - 1, " \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435**")).setColor('GREEN');
                        message.channel.send(embed).then(function (message) {
                          return message["delete"]({
                            timeout: 2000
                          });
                        });
                      } else if (num === 3 || num === 4 || num === 5) {
                        var _embed = new Discord.MessageEmbed().setDescription("**\u0423\u0434\u0430\u043B\u0435\u043D\u043E ".concat(num - 1, " \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F**")).setColor('GREEN');

                        message.channel.send(_embed).then(function (message) {
                          return message["delete"]({
                            timeout: 2000
                          });
                        });
                      } else if (num > 2) {
                        var _embed2 = new Discord.MessageEmbed().setDescription("**\u0423\u0434\u0430\u043B\u0435\u043D\u043E ".concat(num - 1, " \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439**")).setColor('GREEN');

                        message.channel.send(_embed2).then(function (message) {
                          return message["delete"]({
                            timeout: 2000
                          });
                        });
                      }
                    }));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          embed1 = new Discord.MessageEmbed().setTitle("\u041E\u0448\u0438\u0431\u043A\u0430").setDescription("**\u0412\u044B \u0437\u0430\u0431\u044B\u043B\u0438 \u0432\u0432\u0435\u0441\u0442\u0438 \u0447\u0438\u0441\u043B\u043E!**").setColor('RED');
          embed2 = new Discord.MessageEmbed().setTitle("\u041E\u0448\u0438\u0431\u043A\u0430").setDescription("**\u0412\u0432\u0435\u0434\u0435\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0438\u0434 \u0447\u0438\u0441\u043B\u0430**").setColor('RED');
          embed3 = new Discord.MessageEmbed().setTitle("\u041E\u0448\u0438\u0431\u043A\u0430").setDescription("**\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E \u043C\u0435\u043D\u044C\u0448\u0435 25**").setColor('RED');
          embed4 = new Discord.MessageEmbed().setTitle("\u041E\u0448\u0438\u0431\u043A\u0430").setDescription("**\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u0447\u0435\u043C \u043D\u043E\u043B\u044C**").setColor('RED');
          arggs = message.content.split(' ').slice(1);
          amount = arggs.join(' ');

          if (amount) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed1).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 9:
          if (!isNaN(amount)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed2).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 11:
          if (!(amount > 26)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed3).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 13:
          if (!(amount < 1)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", message.channel.send(embed4).then(function (message) {
            return message["delete"]({
              timeout: 5000
            });
          }));

        case 15:
          num = Number(amount) + 1;
          ;
          delete_messages(); // Вызов асинхронной функции

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.config = {
  name: "clear",
  description: "Удаляет заданное количество сообщений",
  usage: "~claer",
  accessableby: "Members",
  aliases: ['c', 'cl']
};