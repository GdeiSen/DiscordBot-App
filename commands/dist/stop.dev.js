"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.reply(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return;
  queue.songs = [];
  queue.connection.dispatcher.end();
  queue.textChannel.send("".concat(message.author, " \u23F9 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B \u043C\u0443\u0437\u044B\u043A\u0443!"))["catch"](console.error);
};

module.exports.config = {
  name: "stop",
  description: "Stops playback",
  usage: "~stop",
  accessableby: "Members",
  aliases: ['stp'],
  category: "music"
};