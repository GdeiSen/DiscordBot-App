"use strict";

var Discord = require("discord.js");

module.exports.run = function _callee(bot, message, args) {
  var error_text, member, mutedRole, verifiedRole, verifiedRole2, verifiedRole4, embed, _embed;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          error_text = new Discord.MessageEmbed().setTitle('oшибка').setDescription('**Возможно вы допустили ошибку в синтаксисе комманды**').setColor('RED');
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
            _context.next = 21;
            break;
          }

          if (!(!message.member.hasPermission(['ADMINISTRATOR']) && member.id === "614819288506695697")) {
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
          verifiedRole = message.guild.roles.cache.get('780088627203538965');
          verifiedRole2 = message.guild.roles.cache.get('780090984896790548');
          verifiedRole4 = message.guild.roles.cache.get('780088627203538965');

          if (mutedRole) {
            member.roles.add(mutedRole);
            member.roles.remove(verifiedRole);
            member.roles.remove(verifiedRole2);
            member.roles.remove(verifiedRole4);
            embed = new Discord.MessageEmbed().setTitle('MUTE').setDescription('**Данный пользаватель был успешно заблокирован**').setColor('GREEN');
            message.channel.send(embed);
          }

          _context.next = 22;
          break;

        case 21:
          if (message.member.id != "614819288506695697") {
            _embed = new Discord.MessageEmbed().setTitle('Ошибка').setDescription('**У вас нет прав на исполльзование этой комманды**').setColor('RED');
            message.channel.send(_embed);
          }

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 5]]);
};

module.exports.config = {
  name: "mute",
  description: "Gives the role of a psychopath who does not have access to the server functions (blocked!)",
  usage: "~mute",
  accessableby: "Members",
  aliases: ['mut'],
  category: "test"
};