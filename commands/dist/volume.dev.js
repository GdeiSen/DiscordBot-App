"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var embed2 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Для начала нужно быть в голосовом канале**').setColor('RED');
  var embed3 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Введите параметр громкости**').setColor('RED');
  var embed4 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Введите параметр громкости от 0 до 100**').setColor('RED');
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.reply(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return message.reply(embed2)["catch"](console.error);
  if (!args) return message.reply("\uD83D\uDD0A \u0413\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C: **".concat(queue.volume, "%**"))["catch"](console.error);
  if (isNaN(args)) return message.reply("\uD83D\uDD0A \u0413\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C: **".concat(queue.volume, "%**"))["catch"](console.error);
  if (Number(args) > 100 || Number(args) < 0) return message.reply(embed4)["catch"](console.error);
  queue.volume = args;
  queue.connection.dispatcher.setVolumeLogarithmic(args / 100);
  return queue.textChannel.send("\u0413\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C \u0432\u044B\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0430 \u043D\u0430: **".concat(args, "%**"))["catch"](console.error);
};

module.exports.config = {
  name: "volume",
  description: "Sets the volume value",
  usage: "~volume args",
  accessableby: "Members",
  aliases: ['vol'],
  category: "music"
};