"use strict";

var Discord = require("discord.js");

text = require("../text_packs/en.json");

module.exports.run = function _callee(bot, message, args) {
  var arggs, random, messagec, embed;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          arggs = args;
          random = Math.floor(Math.random() * 20) + 1;

          if (random === 1) {
            messagec = text.entertainmet.ball.info_01;
          } else if (random === 20) {
            messagec = text.entertainmet.ball.info_02;
          } else if (random === 2) {
            messagec = text.entertainmet.ball.info_03;
          } else if (random === 19) {
            messagec = text.entertainmet.ball.info_04;
          } else if (random === 3) {
            messagec = text.entertainmet.ball.info_05;
          } else if (random === 18) {
            messagec = text.entertainmet.ball.info_06;
          } else if (random === 4) {
            messagec = text.entertainmet.ball.info_07;
          } else if (random === 17) {
            messagec = text.entertainmet.ball.info_08;
          } else if (random === 5) {
            messagec = text.entertainmet.ball.info_09;
          } else if (random === 16) {
            messagec = text.entertainmet.ball.info_10;
          } else if (random === 6) {
            messagec = text.entertainmet.ball.info_11;
          } else if (random === 15) {
            messagec = text.entertainmet.ball.info_12;
          } else if (random === 7) {
            messagec = text.entertainmet.ball.info_13;
          } else if (random === 14) {
            messagec = text.entertainmet.ball.info_14;
          } else if (random === 8) {
            messagec = text.entertainmet.ball.info_15;
          } else if (random === 13) {
            messagec = text.entertainmet.ball.info_16;
          } else if (random === 9) {
            messagec = text.entertainmet.ball.info_17;
          } else if (random === 12) {
            messagec = text.entertainmet.ball.info_1;
          } else if (random === 10) {
            messagec = text.entertainmet.ball.info_5;
          } else if (random === 11) {
            messagec = text.entertainmet.ball.info_9;
          }

          embed = new Discord.MessageEmbed().setTitle("\uD83D\uDD2E 8Ball").setDescription("".concat(arggs, "? **").concat(messagec, "**")).setColor('PURPLE');
          message.channel.send(embed);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.config = {
  name: "8ball",
  usage: "~8ball",
  description: "Deduces your verdict of fate",
  accessableby: "Members",
  aliases: ['8', '8b', 'b'],
  category: "entertainment"
};