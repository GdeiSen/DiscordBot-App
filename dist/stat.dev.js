"use strict";

var config = require("./config.json");

module.exports = function (client) {
  var guild = client.guilds.cache.get(config.guildid);
  var people = guild.members.count;
  console.log(people);
};