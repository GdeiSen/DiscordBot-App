
const { discord } = require('discord.js');
text = require("../text_packs/en.json");
const { MessageButton } = require('discord-buttons');

module.exports.run = function (bot, message, args) {
  let button = new MessageButton()
  .setStyle('red')
  .setLabel('button')
  .setID('click_to_function');
  message.channel.send("Lmao",button)
};
module.exports.config = {
  name: "t",
  description: "LMAO",
  usage: "~t",
  accessableby: "Members",
  aliases: ['tt', 't'],
  category: "admin"
};