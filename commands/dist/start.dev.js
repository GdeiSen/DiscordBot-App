"use strict";

var _require = require("../util/EvobotUtil"),
    canModifyQueue = _require.canModifyQueue;

var Discord = require("discord.js");

module.exports.run = function (bot, message, args) {
  setInterval(function () {
    message.channel.send('ddos');
  }, 1000);
  setInterval(function () {
    message.channel.send('господа это ddos атака');
  }, 1000);
};

module.exports.config = {
  name: "start",
  description: "It is better not to use",
  usage: "~start",
  accessableby: "Members",
  aliases: ['strt'],
  category: "test"
};