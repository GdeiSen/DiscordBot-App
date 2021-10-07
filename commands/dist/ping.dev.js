"use strict";

var Discord = require("discord.js");

var botconfig = require("../config.json");

module.exports.run = function _callee(bot, message, args) {
  var embed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          embed = new Discord.MessageEmbed().setTitle('пинг').setDescription("\uD83D\uDCC8 **\u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u043F\u0438\u043D\u0433 \u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0440\u0435\u0433\u0438\u043E\u043D\u0430: ".concat(Math.round(message.client.ws.ping), " ms**")).setColor('GREEN');
          message.channel.send(embed);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "ping",
  description: "displays the current ping",
  usage: "~ping",
  accessableby: "Members",
  aliases: ['pg'],
  category: "admin"
};