"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

module.exports.run = function (client, message, args) {
  var commands = message.client.commands.array();
  var helpEmbed = new MessageEmbed().setTitle("".concat(message.client.user.username, " Help")).setDescription("Полный список комманд").setColor("#F8AA2A");
  message.client.commands.forEach(function (cmd) {
    helpEmbed.addField("**".concat(message.client.prefix).concat(cmd.config.name, "**"), "`".concat(cmd.config.description, "`"), true);
  });
  helpEmbed.setTimestamp();
  return message.channel.send(helpEmbed)["catch"](console.error);
};

module.exports.config = {
  name: "help",
  description: "Выводит описание комманд",
  usage: "~help",
  accessableby: "Members",
  aliases: ['h', 'hlp']
};