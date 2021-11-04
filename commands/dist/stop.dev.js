"use strict";

var embedGenerator = require("../include/utils/embedGenerator");

var _require = require("../include/music_engine/queueMaster"),
    queueMaster = _require.queueMaster;

var _require2 = require("../include/utils/accesTester.js"),
    accesTester = _require2.accesTester;

module.exports.run = function _callee2(client, message, args) {
  var tester;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          tester = new accesTester(message, args);
          _context2.next = 3;
          return regeneratorRuntime.awrap(tester.testPlayCommandAudioAccesPack().then(function _callee(result) {
            var queue, embed;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    queue = client.queue.get(message.guild.id);
                    QueueMaster = new queueMaster(client, message);
                    QueueMaster.clearQueue();
                    queue.status = 'stopped';
                    queue.player.stop();
                    embed = embedGenerator.run('music.stop.info_01');
                    embed.setDescription("".concat(message.author.username, " ").concat(embed.description));
                    message.channel.send({
                      embeds: [embed]
                    });

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }, function (error) {
            message.channel.send({
              embeds: [error]
            });
            return 0;
          }));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.config = {
  name: "stop",
  description: "Stops playback",
  usage: "~stop",
  accessableby: "Members",
  aliases: ["stp"],
  category: "music"
};