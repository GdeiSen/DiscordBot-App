"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Discord = require('discord.js');

var moment = require('moment');

require('moment-duration-format');

var _require = require('discord.js'),
    Util = _require.Util;

var YouTube = require('simple-youtube-api');

var ytdl = require('ytdl-core');

var config = require('../../settings.json');

var LenoxCommand = require('../LenoxCommand.js');

var youtube = new YouTube(config.googlekey);

module.exports =
/*#__PURE__*/
function (_LenoxCommand) {
  _inherits(playCommand, _LenoxCommand);

  function playCommand(client) {
    _classCallCheck(this, playCommand);

    return _possibleConstructorReturn(this, _getPrototypeOf(playCommand).call(this, client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Searches for music that matches to your request',
      format: 'play {query}',
      aliases: [],
      examples: ['play Gangnam Style'],
      clientpermissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK'],
      userpermissions: [],
      shortDescription: 'Musicplayersettings',
      dashboardsettings: true
    }));
  }

  _createClass(playCommand, [{
    key: "run",
    value: function run(msg) {
      var langSet, lang, queue, skipvote, input, searchString, url, voiceChannel, i, play, handleVideo, playlist, videos, serverQueue, _i, _Object$values, _video, video2, playlistadded, video, _videos, index, embed, embed2, response, videoIndex;

      return regeneratorRuntime.async(function run$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              handleVideo = function _ref2(video, playlist) {
                var serverQueue, song, duration, published, embed, queueConstruct, vote, connection;
                return regeneratorRuntime.async(function handleVideo$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        serverQueue = queue.get(msg.guild.id);
                        song = {
                          duration: moment.duration(video.duration).format("d[ ".concat(lang.messageevent_days, "], h[ ").concat(lang.messageevent_hours, "], m[ ").concat(lang.messageevent_minutes, "] s[ ").concat(lang.messageevent_seconds, "]")),
                          thumbnail: video.thumbnails["default"].url,
                          publishedat: video.publishedAt,
                          id: video.id,
                          title: Util.escapeMarkdown(video.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' ')),
                          url: "https://www.youtube.com/watch?v=".concat(video.id)
                        };

                        if (!(moment.duration(video.duration).format('m') > 30 && msg.client.provider.getUser(msg.author.id, 'premium').status === false)) {
                          _context3.next = 4;
                          break;
                        }

                        return _context3.abrupt("return", msg.reply(lang.play_songlengthlimit));

                      case 4:
                        if (!serverQueue) {
                          _context3.next = 17;
                          break;
                        }

                        if (!(serverQueue.songs.length > 8 && msg.client.provider.getGuild(msg.guild.id, 'premium').status === false)) {
                          _context3.next = 7;
                          break;
                        }

                        return _context3.abrupt("return", msg.reply(lang.play_limitreached));

                      case 7:
                        _context3.next = 9;
                        return regeneratorRuntime.awrap(serverQueue.songs.push(song));

                      case 9:
                        if (!playlist) {
                          _context3.next = 11;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 11:
                        duration = lang.play_duration.replace('%duration', song.duration);
                        published = lang.play_published.replace('%publishedatdate', song.publishedat);
                        embed = new Discord.MessageEmbed().setAuthor(lang.play_songadded).setDescription(duration).setThumbnail(song.thumbnail).setColor('#009900').setURL(song.url).setFooter(published).setTitle(song.title);
                        return _context3.abrupt("return", msg.channel.send({
                          embed: embed
                        }));

                      case 17:
                        /* eslint no-else-return: 0 */
                        queueConstruct = {
                          textChannel: msg.channel,
                          voiceChannel: voiceChannel,
                          connection: null,
                          songs: [],
                          volume: 2,
                          playing: true
                        };
                        _context3.next = 20;
                        return regeneratorRuntime.awrap(queue.set(msg.guild.id, queueConstruct));

                      case 20:
                        _context3.next = 22;
                        return regeneratorRuntime.awrap(queueConstruct.songs.push(song));

                      case 22:
                        vote = {
                          users: []
                        };
                        skipvote.set(msg.guild.id, vote);
                        _context3.prev = 24;
                        _context3.next = 27;
                        return regeneratorRuntime.awrap(voiceChannel.join());

                      case 27:
                        connection = _context3.sent;
                        queueConstruct.connection = connection;
                        _context3.next = 31;
                        return regeneratorRuntime.awrap(play(msg.guild, queueConstruct.songs[0]));

                      case 31:
                        _context3.next = 40;
                        break;

                      case 33:
                        _context3.prev = 33;
                        _context3.t0 = _context3["catch"](24);
                        _context3.next = 37;
                        return regeneratorRuntime.awrap(queue["delete"](msg.guild.id));

                      case 37:
                        _context3.next = 39;
                        return regeneratorRuntime.awrap(skipvote["delete"](msg.guild.id));

                      case 39:
                        return _context3.abrupt("return", msg.channel.send(lang.play_errorjoin));

                      case 40:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, null, null, [[24, 33]]);
              };

              play = function _ref(guild, song) {
                var serverQueue, stream, dispatcher, vote, duration, published, embed;
                return regeneratorRuntime.async(function play$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return regeneratorRuntime.awrap(queue.get(guild.id));

                      case 2:
                        serverQueue = _context2.sent;

                        if (song) {
                          _context2.next = 9;
                          break;
                        }

                        _context2.next = 6;
                        return regeneratorRuntime.awrap(serverQueue.voiceChannel.leave());

                      case 6:
                        _context2.next = 8;
                        return regeneratorRuntime.awrap(queue["delete"](guild.id));

                      case 8:
                        return _context2.abrupt("return");

                      case 9:
                        _context2.next = 11;
                        return regeneratorRuntime.awrap(ytdl(song.url, {
                          filter: 'audioonly'
                        }));

                      case 11:
                        stream = _context2.sent;
                        _context2.next = 14;
                        return regeneratorRuntime.awrap(serverQueue.connection.play(stream).on('end', function _callee(reason) {
                          return regeneratorRuntime.async(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  if (reason === 'Stream is not generating quickly enough.') ;
                                  serverQueue.songs.shift('Stream is not generating quickly enough');
                                  _context.next = 4;
                                  return regeneratorRuntime.awrap(play(guild, serverQueue.songs[0]));

                                case 4:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          });
                        }).on('error', function (error) {
                          return console.error(error);
                        }));

                      case 14:
                        dispatcher = _context2.sent;
                        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
                        vote = {
                          users: []
                        };
                        skipvote.set(msg.guild.id, vote);
                        duration = lang.play_duration.replace('%duration', song.duration);
                        published = lang.play_published.replace('%publishedatdate', song.publishedat);
                        embed = new Discord.MessageEmbed().setAuthor(lang.play_startplaying).setDescription(duration).setImage(song.thumbnail).setColor('#009900').setURL(song.url).setFooter(published).setTitle(song.title);
                        return _context2.abrupt("return", msg.channel.send({
                          embed: embed
                        }));

                      case 22:
                      case "end":
                        return _context2.stop();
                    }
                  }
                });
              };

              langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
              lang = require("../../languages/".concat(langSet, ".json"));
              queue = msg.client.queue;
              skipvote = msg.client.skipvote;
              input = msg.content.split(' ');
              searchString = input.slice(1).join(' ');
              url = input[1] ? input[1].replace(/<(.+)>/g, '$1') : '';
              moment.locale(msg.client.provider.getGuild(msg.guild.id, 'momentLanguage'));
              voiceChannel = msg.member.voice.channel;

              if (voiceChannel) {
                _context4.next = 13;
                break;
              }

              return _context4.abrupt("return", msg.channel.send(lang.play_notvoicechannel));

            case 13:
              i = 0;

            case 14:
              if (!(i < msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist').length)) {
                _context4.next = 20;
                break;
              }

              if (!(voiceChannel.id === msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist')[i])) {
                _context4.next = 17;
                break;
              }

              return _context4.abrupt("return", msg.reply(lang.play_blacklistchannel));

            case 17:
              i += 1;
              _context4.next = 14;
              break;

            case 20:
              if (!url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                _context4.next = 43;
                break;
              }

              _context4.next = 23;
              return regeneratorRuntime.awrap(youtube.getPlaylist(url));

            case 23:
              playlist = _context4.sent;
              _context4.next = 26;
              return regeneratorRuntime.awrap(playlist.getVideos());

            case 26:
              videos = _context4.sent;
              serverQueue = queue.get(msg.guild.id);

              if (!(Object.keys(videos).length + (serverQueue ? serverQueue.songs.length : 0) > 8 && msg.client.provider.getGuild(msg.guild.id, 'premium').status === false)) {
                _context4.next = 30;
                break;
              }

              return _context4.abrupt("return", msg.reply(lang.play_limitreached));

            case 30:
              _i = 0, _Object$values = Object.values(videos);

            case 31:
              if (!(_i < _Object$values.length)) {
                _context4.next = 41;
                break;
              }

              _video = _Object$values[_i];
              _context4.next = 35;
              return regeneratorRuntime.awrap(youtube.getVideoByID(_video.id));

            case 35:
              video2 = _context4.sent;
              _context4.next = 38;
              return regeneratorRuntime.awrap(handleVideo(video2, true));

            case 38:
              _i++;
              _context4.next = 31;
              break;

            case 41:
              playlistadded = lang.play_playlistadded.replace('%playlisttitle', "**".concat(playlist.title, "**"));
              return _context4.abrupt("return", msg.channel.send(playlistadded));

            case 43:
              _context4.prev = 43;
              _context4.next = 46;
              return regeneratorRuntime.awrap(youtube.getVideo(url));

            case 46:
              video = _context4.sent;
              _context4.next = 80;
              break;

            case 49:
              _context4.prev = 49;
              _context4.t0 = _context4["catch"](43);
              _context4.prev = 51;
              _context4.next = 54;
              return regeneratorRuntime.awrap(youtube.searchVideos(searchString, 10));

            case 54:
              _videos = _context4.sent;

              if (!(_videos.length === 0)) {
                _context4.next = 57;
                break;
              }

              return _context4.abrupt("return", msg.channel.send(lang.play_noresult));

            case 57:
              index = 0;
              embed = new Discord.MessageEmbed().setColor('#7BB3FF').setDescription("".concat(_videos.map(function (video2) {
                return "**".concat(++index, " -** ").concat(video2.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' '));
              }).join('\n'))).setAuthor(lang.play_songselection, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');
              embed2 = new Discord.MessageEmbed().setColor('#0066CC').setDescription(lang.play_value);
              msg.channel.send({
                embed: embed
              });
              msg.channel.send({
                embed: embed2
              });
              _context4.prev = 62;
              _context4.next = 65;
              return regeneratorRuntime.awrap(msg.channel.awaitMessages(function (msg2) {
                return msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id;
              }, {
                max: 1,
                time: 20000,
                errors: ['time']
              }));

            case 65:
              response = _context4.sent;
              _context4.next = 71;
              break;

            case 68:
              _context4.prev = 68;
              _context4.t1 = _context4["catch"](62);
              return _context4.abrupt("return", msg.channel.send(lang.play_error));

            case 71:
              videoIndex = parseInt(response.first().content, 10);
              _context4.next = 74;
              return regeneratorRuntime.awrap(youtube.getVideoByID(_videos[videoIndex - 1].id));

            case 74:
              video = _context4.sent;
              _context4.next = 80;
              break;

            case 77:
              _context4.prev = 77;
              _context4.t2 = _context4["catch"](51);
              return _context4.abrupt("return", msg.channel.send(lang.play_noresult));

            case 80:
              handleVideo(video, false);

            case 81:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[43, 49], [51, 77], [62, 68]]);
    }
  }]);

  return playCommand;
}(LenoxCommand);