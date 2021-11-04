"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var embedGenerator = require("../include/utils/embedGenerator");

var _require2 = require('discord.js'),
    MessageActionRow = _require2.MessageActionRow,
    MessageButton = _require2.MessageButton;

module.exports.run = function _callee2(bot, message, args) {
  var embed1, embed4, permissions, queue, row, currentPage, embeds, embed;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(embedGenerator.run('warnings.error_03'));

        case 2:
          embed1 = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(embedGenerator.run('music.play.error_04'));

        case 5:
          embed4 = _context2.sent;
          permissions = message.channel.permissionsFor(message.client.user);

          if (permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", message.reply({
            embeds: [embed4]
          }));

        case 9:
          queue = message.client.queue.get(message.guild.id);

          if (queue) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", message.channel.send({
            embeds: [embed1]
          }));

        case 12:
          row = new MessageActionRow().addComponents(new MessageButton().setCustomId('primary').setLabel('Primary').setStyle('PRIMARY'));
          currentPage = 0;
          _context2.next = 16;
          return regeneratorRuntime.awrap(generateQueueEmbed(message, queue.songs, queue.current));

        case 16:
          embeds = _context2.sent;
          embed = embeds[currentPage];
          console.log(embeds);
          setTimeout(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    message.channel.send({
                      content: 'Queue',
                      embeds: [embed],
                      components: [row]
                    });

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }, 3000); //   try {
          //     await queueEmbed.react("⬅️");
          //     await queueEmbed.react("⏹");
          //     await queueEmbed.react("➡️");
          //   } catch (error) {
          //     console.error(error);
          //     message.channel.send({content: `${error.message}`}).catch(console.error);
          //   }
          //   const filter = (reaction, user) =>
          //     ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name);
          //   const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });
          //   collector.on("collect", async (reaction, user) => {
          //     try {
          //       if (reaction.emoji.name === "➡️") {
          //         if (currentPage < embeds.length - 1) {
          //           currentPage++;
          //           queueEmbed.edit(`**страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          //         }
          //       } else if (reaction.emoji.name === "⬅️") {
          //         if (currentPage !== 0) {
          //           --currentPage;
          //           queueEmbed.edit(`**страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          //         }
          //       } else {
          //         collector.stop();
          //         reaction.message.reactions.removeAll();
          //       }
          //       await reaction.users.remove(message.author.id);
          //     } catch (error) {
          //       console.error(error);
          //       return message.channel.send({content:`error.message`}).catch(console.error);
          //     }
          //   });
          // }

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function generateQueueEmbed(message, queue, current1) {
  var embeds, k, currentSong, _loop, i;

  return regeneratorRuntime.async(function generateQueueEmbed$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          embeds = [];
          k = 10;
          currentSong = current1;

          _loop = function _loop(i) {
            var current = queue.slice(i, k);
            var j = i;
            k += 10;
            var info = current.map(function (track) {
              return "".concat(++j, " - [").concat(track.title, "](").concat(track.url, ")");
            }).join("\n");
            var embed = new MessageEmbed();
            embed.setTitle('Title').setThumbnail(queue[0].thumbnails).setDescription("**Now Playing - [".concat(currentSong.title, "](").concat(currentSong.url, ")**\n\n").concat(info)).setTimestamp().setColor('BLACK');
            console.log(embed);
            embeds.push(embed);
          };

          for (i = 0; i < queue.length; i += 10) {
            _loop(i);
          }

          console.log(embeds);
          return _context3.abrupt("return", embeds);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

module.exports.config = {
  name: "queue",
  usage: "~queue",
  description: "Displays the status of the current queue",
  accessableby: "Members",
  aliases: ['q'],
  category: "music"
};