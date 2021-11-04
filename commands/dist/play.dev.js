"use strict";

var text = require("../text_packs/en.json");

var player = require("../include/music_engine/musicEngine");

var embedGenerator = require("../include/utils/embedGenerator");

var _require = require("../include/utils/accesTester.js"),
    accesTester = _require.accesTester;

module.exports.run = function _callee2(client, message, args) {
  var tester;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          tester = new accesTester(message, args);
          _context2.next = 3;
          return regeneratorRuntime.awrap(tester.testPlayAudioAccesPack().then(function _callee(result) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    player.run(client, message, args, 'auto');

                  case 1:
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
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays songs",
  category: "music"
};