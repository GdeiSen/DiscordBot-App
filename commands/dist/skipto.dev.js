"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var queue = message.client.queue.get(message.guild.id);
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var embed2 = new Discord.MessageEmbed().setTitle('ошибка').setDescription("**\u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0442\u0440\u0435\u043A\u043E\u0432 \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438.\n\u0438\u043B\u0438 \u0432\u044B \u043F\u0440\u0435\u0432\u044B\u0441\u0438\u043B\u0438 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u0434\u043B\u044F \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430 - 15**").setColor('RED');
  if (!queue) return message.channel.send(embed1)["catch"](console.error);
  if (!args.length || isNaN(args)) return message.reply("\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435: ".concat(message.client.prefix).concat(module.exports.name, " <Queue Number>"))["catch"](console.error);
  if (!queue) return message.channel.send(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return;
  if (args > queue.songs.length) return message.reply(embed2)["catch"](console.error);
  queue.playing = true;

  if (queue.loop) {
    for (var i = 0; i < args - 2; i++) {
      queue.songs.push(queue.songs.shift());
    }
  } else {
    queue.songs = queue.songs.slice(args - 2);
  }

  queue.connection.dispatcher.end();
  queue.textChannel.send("".concat(message.author, " \u23ED \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u043B \u043D\u0430 ").concat(args - 1, " \u0442\u0440\u0435\u043A\u043E\u0432"))["catch"](console.error);
};

module.exports.config = {
  name: "skipto",
  description: "Skips a track for a certain period",
  usage: "~skipto args",
  accessableby: "Members",
  aliases: ['skpt'],
  category: "music"
};