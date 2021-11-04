"use strict";

var embedGenerator = require("../include/utils/embedGenerator");

var _require = require('discord-music-player'),
    RepeatMode = _require.RepeatMode;

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
          return regeneratorRuntime.awrap(tester.testAdioWArgsAcces().then(function _callee(result) {
            var guildQueue;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(client.player.getQueue(message.guild.id));

                  case 2:
                    guildQueue = _context.sent;

                    if (guildQueue.songloop == 0 || guildQueue.songloop == undefined) {
                      guildQueue.queueLoop = 0;
                      guildQueue.songloop = 1;
                      guildQueue.setRepeatMode(RepeatMode.SONG);
                      message.channel.send("".concat(embedGenerator.run('direct.music.loop.info_01'), " ").concat(embedGenerator.run('direct.music.loop.info_02')))["catch"](console.error);
                    } else {
                      guildQueue.queueLoop = 0;
                      guildQueue.songloop = 0;
                      guildQueue.setRepeatMode(RepeatMode.DISABLED);
                      message.channel.send("".concat(embedGenerator.run('direct.music.loop.info_01'), " ").concat(embedGenerator.run('direct.music.loop.info_03')))["catch"](console.error);
                    }

                  case 4:
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
  name: "loop",
  cooldown: 3,
  aliases: ["l"],
  description: "Option to enable track repetition",
  category: "music"
};