"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.reply(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return;
  queue.playing = true;
  queue.connection.dispatcher.end();
  queue.textChannel.send("".concat(message.author, " \u23ED \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u043B \u0442\u0440\u0435\u043A"))["catch"](console.error);
};

module.exports.config = {
  name: "skip",
  description: "Skips a track",
  usage: "~skip",
  accessableby: "Members",
  aliases: ['sk'],
  category: "music"
};