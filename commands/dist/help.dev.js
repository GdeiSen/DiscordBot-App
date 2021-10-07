"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var text = require("../text_packs/en.json");

module.exports.run = function (client, message, args) {
  var commands = message.client.commands.array();
  message.client.categories.forEach(function (category) {
    var embed = new MessageEmbed().setTitle("".concat(message.client.user.username) + text.info.help[category].embedTitle).setDescription(text.info.help[category].embedDescription).setColor(text.info.help[category].embedColor);
    commands.forEach(function (cmd) {
      if (cmd.config.category == category) {
        embed.addField("**".concat(message.client.prefix).concat(cmd.config.name, "**"), "".concat(cmd.config.description), true);
      }
    });
    message.channel.send(embed);
  });
};

module.exports.config = {
  name: "help",
  description: "Displays the description of the command",
  usage: "~help",
  accessableby: "Members",
  aliases: ['h', 'hlp'],
  category: "admin"
};