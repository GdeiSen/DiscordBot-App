"use strict";

var Discord = require("discord.js");

var botconfig = require("../config.json");

module.exports.run = function _callee(bot, message, args) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          message.channel.send('https://tenor.com/view/bear-dance-move-cute-gif-10759975');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "party",
  description: "Sends a gif message of a dancing bear",
  usage: "~party",
  accessableby: "Members",
  aliases: ['prty', 'pa'],
  category: "entertainment"
};