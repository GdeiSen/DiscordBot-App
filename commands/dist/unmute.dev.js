"use strict";

var Discord = require("discord.js");

module.exports.run = function _callee(bot, message, args) {
  var error_text, member, mutedRole, verifiedRole, embed, _embed;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          error_text = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Возможно вы допустили ошибку в синтаксисе комманды**').setColor('RED');
          _context.prev = 1;
          member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(function (x) {
            return x.user.username === args.slice(0).join(" ") || x.user.username === args[0];
          });
          _context.next = 9;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](1);
          message.channel.send(error_text);
          return _context.abrupt("return");

        case 9:
          if (!(message.member.id === "614819288506695697")) {
            _context.next = 19;
            break;
          }

          if (message.member.hasPermission(['ADMINISTRATOR'])) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return");

        case 12:
          if (!(member.hasPermission(['ADMINISTRATOR']) && !message.member.hasPermission('ADMINISTRATOR'))) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return");

        case 14:
          mutedRole = message.guild.roles.cache.get('780109552037265419');
          verifiedRole = message.guild.roles.cache.get('780090984896790548');

          if (mutedRole) {
            member.roles.remove(mutedRole);
            member.roles.add(verifiedRole);
            embed = new Discord.MessageEmbed().setTitle('MUTE').setDescription('**Я думаю он исправился**').setColor('GREEN');
            message.channel.send(embed);
          }

          _context.next = 20;
          break;

        case 19:
          if (message.member.id != "614819288506695697") {
            _embed = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**У вас нет прав на исполльзование этой комманды.**').setColor('RED');
            message.channel.send(_embed);
          }

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 5]]);
};

module.exports.config = {
  name: "unmute",
  description: "Снимает блокировку с участника сервера (blocked!)",
  usage: "?unmute",
  accessableby: "Members",
  aliases: []
};