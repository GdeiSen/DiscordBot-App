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
                    queue.status = 'pending';
                    queue.player.stop();
                    embed = embedGenerator.run('music.skip.info_01');
                    embed.setDescription("".concat(message.author.username, " ").concat(embed.description));
                    message.channel.send({
                      embeds: [embed]
                    });

                  case 7:
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
  name: "skip",
  description: "Skips a track",
  usage: "~skip",
  accessableby: "Members",
  aliases: ["sk"],
  category: "music"
};