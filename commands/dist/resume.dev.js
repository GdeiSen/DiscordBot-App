"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.reply(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return;

  if (!queue.playing) {
    queue.playing = true;
    queue.connection.dispatcher.resume();
    return queue.textChannel.send("".concat(message.author, " \u25B6 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u043B \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435!"))["catch"](console.error);
  }

  return message.reply("воспроизведение продолжено")["catch"](console.error);
};

module.exports.config = {
  name: "resume",
  description: "Continues playing the track",
  usage: "~resume",
  accessableby: "Members",
  aliases: ['res'],
  category: "music"
};