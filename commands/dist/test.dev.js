"use strict";

var Discord = require("discord.js");

var botconfig = require("../config.json");

module.exports.run = function _callee(bot, message, args) {
  var embed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          embed = new Discord.MessageEmbed().setTitle('Тест').setDescription('**функция теста бота завершена!**').setColor('GREEN');
          message.channel.send(embed);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "test",
  description: "Test command for checking the bot's performance",
  usage: "~test",
  accessableby: "Members",
  aliases: [],
  category: "admin"
};