"use strict";

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
          return regeneratorRuntime.awrap(tester.testPlayCommandAudioAccesPack().then(function _callee(result) {
            var queue, embed;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    queue = client.queue.get(message.guild.id);

                    if (queue.status === 'playing') {
                      message.channel.send({
                        content: "".concat(message.author, " ").concat(embedGenerator.run('direct.music.resume.info_02'))
                      })["catch"](console.error);
                    } else {
                      embed = embedGenerator.run('music.resume.info_01');
                      embed.setDescription("".concat(message.author.username, " ").concat(embed.description));
                      message.channel.send({
                        embeds: [embed]
                      });
                    }

                    queue.status = 'playing';
                    queue.player.unpause();
                    queue.player.emit('UNPAUSED');

                  case 5:
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
  name: "resume",
  description: "Continues playing the track",
  usage: "~resume",
  accessableby: "Members",
  aliases: ['res'],
  category: "music"
};