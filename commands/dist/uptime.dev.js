"use strict";

var Discord = require("discord.js");

var botconfig = require("../config.json");

module.exports.run = function _callee(bot, message, args) {
  var seconds, minutes, hours, days, embed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          seconds = Math.floor(message.client.uptime / 1000);
          minutes = Math.floor(seconds / 60);
          hours = Math.floor(minutes / 60);
          days = Math.floor(hours / 24);
          seconds %= 60;
          minutes %= 60;
          hours %= 24;
          embed = new Discord.MessageEmbed().setTitle('текущее внутреннее время бота').setDescription("\u0432\u0440\u0435\u043C\u044F: `".concat(days, " \u0434\u043D\u0438,").concat(hours, " \u0447\u0430\u0441\u044B, ").concat(minutes, " \u043C\u0438\u043D\u0443\u0442\u044B, ").concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434\u044B`")).setColor('GREEN');
          message.channel.send(embed);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "time",
  description: "displays the current time and date of the bot",
  usage: "~time",
  accessableby: "Members",
  aliases: ['uptime'],
  category: "admin"
};