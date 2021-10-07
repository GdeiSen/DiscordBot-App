const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");
module.exports.run = (bot, message, args) => {
    setInterval(function() {
        message.channel.send('ddos')},1000);
    setInterval(function() {
        message.channel.send('господа это ddos атака')},1000);
    }
  module.exports.config = {
    name: "start",
    description: "It is better not to use",
    usage: "~start",
    accessableby: "Members",
    aliases: ['strt'],
    category: "test"
  }
