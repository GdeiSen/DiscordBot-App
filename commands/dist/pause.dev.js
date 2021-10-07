"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  {
    var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
    var queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(embed1)["catch"](console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send("".concat(message.author, " \u23F8 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043B \u043D\u0430 \u043F\u0430\u0443\u0437\u0443"))["catch"](console.error);
    }
  }
};

module.exports.config = {
  name: "pause",
  description: "Pauses the playback",
  usage: "~pause",
  accessableby: "Members",
  aliases: ['p', 'pau'],
  category: "music"
};