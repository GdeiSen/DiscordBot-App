"use strict";

var Discord = require("discord.js");

text = require("../text_packs/en.json");

var embedGenerator = require("../include/embedGenerator");

module.exports.run = function _callee(bot, message, args) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = message.channel;
          _context.next = 3;
          return regeneratorRuntime.awrap(embedGenerator.run('warnings.clear.error_01'));

        case 3:
          _context.t1 = _context.sent;

          _context.t0.send.call(_context.t0, _context.t1);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "t",
  description: "",
  usage: "~t",
  accessableby: "Members",
  aliases: ['tt', 't'],
  category: "admin"
};