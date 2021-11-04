"use strict";

var embedGenerator = require("../include/utils/embedGenerator");

var _require = require("../include/music_engine/queueMaster"),
    queueMaster = _require.queueMaster;

var _require2 = require("../include/utils/accesTester.js"),
    accesTester = _require2.accesTester;

var skip = require('./skip');

module.exports.run = function _callee2(client, message, args) {
  var tester;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          tester = new accesTester(message, args);
          _context2.next = 3;
          return regeneratorRuntime.awrap(tester.testPlayCommandAudioAccesPack().then(function _callee(result) {
            var queue, embed2, i, embed;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    queue = message.client.queue.get(message.guild.id);
                    embed2 = embedGenerator.run('music.skipto.error_01');

                    if (!(args > queue.songs.length)) {
                      _context.next = 6;
                      break;
                    }

                    return _context.abrupt("return", message.reply({
                      embeds: [embed2]
                    })["catch"](console.error));

                  case 6:
                    if (!(args == 1 || args == 0)) {
                      _context.next = 9;
                      break;
                    }

                    skip.run(client, message, args);
                    return _context.abrupt("return", 0);

                  case 9:
                    if (queue.config.loop == true) {
                      for (i = 0; i < args - 2; i++) {
                        queue.songs.push(queue.songs.shift());
                      }
                    } else {
                      queue.songs = queue.songs.slice(args - 2);
                    }

                    QueueMaster = new queueMaster(client, message);
                    queue.status = 'pending';
                    queue.player.stop();
                    embed = embedGenerator.run('music.skip.info_01');
                    embed.setDescription("".concat(message.author.username, " ").concat(embed.description));
                    message.channel.send({
                      embeds: [embed]
                    });

                  case 16:
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
  name: "skipto",
  description: "Skips a track for a certain period",
  usage: "~skipto args",
  accessableby: "Members",
  aliases: ["skpt"],
  category: "music"
};