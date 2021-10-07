"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var embed2 = new Discord.MessageEmbed().setTitle('ошибка').setDescription("**\u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0442\u0440\u0435\u043A\u043E\u0432 \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438**").setColor('RED');
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return;
  if (args[0] > queue.songs.length) return message.reply(embed2)["catch"](console.error);
  if (!args.length) return message.reply("\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435: ".concat(message.client.prefix, "remove <\u043D\u043E\u043C\u0435\u0440>"));
  if (isNaN(args[0])) return message.reply("\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435: ".concat(message.client.prefix, "remove <\u043D\u043E\u043C\u0435\u0440>"));
  var song = queue.songs.splice(args - 1, 1);
  queue.textChannel.send("".concat(message.author, " \u274C \u0443\u0431\u0440\u0430\u043B **").concat(song[0].title, "** \u0438\u0437 \u043E\u0447\u0435\u0440\u0435\u0434\u0438"));
};

module.exports.config = {
  name: "remove",
  description: "deletes a track from the queue",
  usage: "~remove args",
  accessableby: "Members",
  aliases: [],
  category: "music"
};