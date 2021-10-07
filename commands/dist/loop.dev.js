"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

var text = require("../text_packs/en.json");

module.exports.run = function (bot, message, args) {
  var embed1 = new Discord.MessageEmbed().setTitle(text.warnings.error_03.embedTitle).setDescription(text.warnings.error_03.embedDescription).setColor(text.warnings.error_03.embedColor);
  var queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.reply(embed1)["catch"](console.error);
  if (!canModifyQueue(message.member)) return; // toggle from false to true and reverse

  queue.loop = !queue.loop;
  return queue.textChannel.send("".concat(text.music.loop.info_01, ": ").concat(queue.loop ? text.music.loop.info_02 : text.music.loop.info_03))["catch"](console.error);
};

module.exports.config = {
  name: "loop",
  cooldown: 3,
  aliases: ['l'],
  description: "Option to enable track repetition",
  category: "music"
};