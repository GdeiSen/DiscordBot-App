"use strict";

exports.canModifyQueue = function (member) {
  var channelID = member.voice.channelID;
  var botChannel = member.guild.voice.channelID;

  if (channelID !== botChannel) {
    member.send("Для начала нужно быть в голосовом канале")["catch"](console.error);
    return;
  }

  return true;
};

var config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;
exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
exports.MAX_PLAYLIST_SIZE = config ? config.MAX_PLAYLIST_SIZE : process.env.MAX_PLAYLIST_SIZE;
exports.PRUNING = config ? config.PRUNING : process.env.PRUNING;
exports.STAY_TIME = config ? config.STAY_TIME : process.env.STAY_TIME;
exports.DEFAULT_VOLUME = config ? config.DEFAULT_VOLUME : process.env.DEFAULT_VOLUME;