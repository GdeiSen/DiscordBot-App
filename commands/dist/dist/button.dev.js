"use strict";

var _require = require('discord.js'),
    MessageEmbed = _require.MessageEmbed;

text = require("../text_packs/en.json");

var _require2 = require('discord-menu-buttons'),
    Menu = _require2.Menu,
    Button = _require2.Button;

module.exports.run = function _callee(bot, message, args) {
  var next = new Button().setLabel("▶").setID("next").setStyle("blurple");
  var stop = new Button().setLabel('⛔').setID('stop').setStyle('red');
  var previous = new Button().setLabel("◀").setID("previous").setStyle("blurple");
  var buttons = [previous, stop, next];
  var pages = [{
    name: '1',
    content: new MessageEmbed().setDescription('Page one.'),
    buttons: buttons
  }, {
    name: '2',
    content: new MessageEmbed().setDescription('Page two.'),
    buttons: buttons
  }, {
    name: '3',
    content: new MessageEmbed().setDescription('Page three.'),
    buttons: buttons
  }];
  var menu = new Menu(message.channel, message.author.id, pages, null, false);
  menu.start();
  message.channel.send(buttons);
};

module.exports.config = {
  name: "t",
  description: "LMAO",
  usage: "~t",
  accessableby: "Members",
  aliases: ['tt', 't'],
  category: "admin"
};