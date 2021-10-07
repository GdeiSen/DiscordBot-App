"use strict";

var _require = require('discord.js'),
    discord = _require.discord;

text = require("../text_packs/en.json");

var _require2 = require('discord-buttons'),
    MessageButton = _require2.MessageButton;

module.exports.run = function (bot, message, args) {
  var button = new MessageButton().setStyle('red').setLabel('button').setID('click_to_function');
  message.channel.send("Lmao", button);
};

module.exports.config = {
  name: "t",
  description: "LMAO",
  usage: "~t",
  accessableby: "Members",
  aliases: ['tt', 't'],
  category: "admin"
};