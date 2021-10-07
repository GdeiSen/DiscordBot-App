"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle('ошибка').setDescription('**Ничего не воспроизводится**').setColor('RED');
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return;
  var songs = queue.songs;

  for (var i = songs.length - 1; i > 1; i--) {
    var j = 1 + Math.floor(Math.random() * i);
    var _ref = [songs[j], songs[i]];
    songs[i] = _ref[0];
    songs[j] = _ref[1];
  }

  queue.songs = songs;
  message.client.queue.set(message.guild.id, queue);
  queue.textChannel.send("".concat(message.author, " \uD83D\uDD00 \u043F\u0435\u0440\u0435\u043C\u0435\u0448\u0430\u043B \u043E\u0447\u0435\u0440\u0435\u0434\u044C"))["catch"](console.error);
};

module.exports.config = {
  name: "shuffle",
  description: "Shuffles the queue",
  usage: "~shuffle",
  accessableby: "Members",
  aliases: ['sh'],
  category: "music"
};