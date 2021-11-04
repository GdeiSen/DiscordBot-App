"use strict";

var progressbar = require('string-progressbar');

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var _require2 = require("../include/utils/accesTester.js"),
    accesTester = _require2.accesTester;

var embedGenerator = require("../include/utils/embedGenerator");

module.exports.run = function _callee(client, message, args) {
  var queue;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(client.queue.get(message.guild.id));

        case 3:
          queue = _context.sent;
          console.log(queue.player._state.resource); // let queue = await client.queue.get(message.guild.id);
          // let embed1 = await embedGenerator.run('warnings.error_03');
          // if (!queue) return message.reply({embeds: [embed1]}).catch(console.error);
          // const song = queue.current;
          // let total = Math.round(queue.current.durationObj.seconds + (queue.current.durationObj.minutes*60) + (queue.current.durationObj.hours*3600))
          // let current = Math.round(queue.connection.receiver.connectionData.nonce/50);
          // let songStart;
          // if((current - total) < 0){
          //   songStart = total - Math.abs(current - total);
          // }else{songStart = current - total};
          // let songCurrent = (current - song.nonce/50);
          // let date = new Date(0);
          // let timeString;
          // if(songCurrent>3600){
          //   date.setSeconds(songCurrent);
          //   timeString = date.toISOString().substr(11, 8);
          // }
          // if(songCurrent<=3600){
          //   date.setSeconds(songCurrent);
          //   timeString = date.toISOString().substr(14, 5);
          // }
          // let nowPlaying = await embedGenerator.run('music.nowPlaying.info_01');
          // nowPlaying
          //   .setDescription(`${song.title}\n${song.url}`)
          //   .setAuthor(message.client.user.username)
          //   .setThumbnail(song.thumbnail)
          //   .addField(`${timeString} [${progressbar(total,songCurrent,20)[0]}]`,`Still Playing`,true);
          // return message.channel.send({embeds: [nowPlaying]});

          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log('[ERROR] [NP] Module error');
          console.log(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports.config = {
  name: "nowplaying",
  description: "displays the current playback",
  usage: "~nowplaying",
  accessableby: "Members",
  aliases: ['now', 'n', 'np'],
  category: "music"
};