"use strict";

var config = require("./config.json");

var jointocreatemap = new Map();

module.exports = function (client) {
  var description = {
    name: "jointocreate",
    filename: "jointocreate.js",
    version: "3.2"
  }; //SECURITY LOOP

  new Promise(function (resolve) {
    setInterval(function () {
      resolve(2);

      try {
        var guild = client.guilds.cache.get(config.guildid);
        var channels = guild.channels.cache.map(function (ch) {
          return ch.id;
        });

        for (var i = 0; i < channels.length; i++) {
          var key = "tempvoicechannel_".concat(guild.id, "_").concat(channels[i]);

          if (jointocreatemap.get(key)) {
            var vc = guild.channels.cache.get(jointocreatemap.get(key));

            if (vc.members.size < 1) {
              jointocreatemap["delete"](key);
              return vc["delete"]();
            } else {}
          }
        }
      } catch (_unused) {}
    }, 10000);
  }); //log that the module is loaded

  console.log(" :: \u2B1C\uFE0F Module: ".concat(description.name, " | Loaded version ").concat(description.version, " from (\"").concat(description.filename, "\")")); //voice state update event to check joining/leaving channels

  client.on("voiceStateUpdate", function (oldState, newState) {
    // SET CHANNEL NAME STRING
    //IGNORE BUT DONT DELETE!
    var oldparentname = "unknown";
    var oldchannelname = "unknown";
    var oldchanelid = "unknown";
    if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name;
    if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name;
    if (oldState && oldState.channelID) oldchanelid = oldState.channelID;
    var newparentname = "unknown";
    var newchannelname = "unknown";
    var newchanelid = "unknown";
    if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name;
    if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name;
    if (newState && newState.channelID) newchanelid = newState.channelID;

    if (oldState.channelID) {
      if (typeof oldState.channel.parent !== "undefined") oldChannelName = "".concat(oldparentname, "\n\t**").concat(oldchannelname, "**\n*").concat(oldchanelid, "*");else oldChannelName = "-\n\t**".concat(oldparentname, "**\n*").concat(oldchanelid, "*");
    }

    if (newState.channelID) {
      if (typeof newState.channel.parent !== "undefined") newChannelName = "".concat(newparentname, "\n\t**").concat(newchannelname, "**\n*").concat(newchanelid, "*");else newChannelName = "-\n\t**".concat(newchannelname, "**\n*").concat(newchanelid, "*");
    } // JOINED V12


    if (!oldState.channelID && newState.channelID) {
      if (newState.channelID !== config.JOINTOCREATECHANNEL) return; //if its not the jointocreatechannel skip

      jointocreatechannel(newState); //load the function
    } // LEFT V12


    if (oldState.channelID && !newState.channelID) {
      //get the jointocreatechannel id from the map
      if (jointocreatemap.get("tempvoicechannel_".concat(oldState.guild.id, "_").concat(oldState.channelID))) {
        //fetch it from the guild
        var vc = oldState.guild.channels.cache.get(jointocreatemap.get("tempvoicechannel_".concat(oldState.guild.id, "_").concat(oldState.channelID))); //if the channel size is below one

        if (vc.members.size < 1) {
          //delete it from the map
          jointocreatemap["delete"]("tempvoicechannel_".concat(oldState.guild.id, "_").concat(oldState.channelID)); //log that it is deleted

          console.log(" :: " + oldState.member.user.username + "#" + oldState.member.user.discriminator + " :: Room wurde gelöscht"); //delete the voice channel

          return vc["delete"]();
        } else {}
      }
    } // Switch v12


    if (oldState.channelID && newState.channelID) {
      if (oldState.channelID !== newState.channelID) {
        //if its the join to create channel
        if (newState.channelID === config.JOINTOCREATECHANNEL) //make a new channel
          jointocreatechannel(oldState); //BUT if its also a channel ín the map (temp voice channel)

        if (jointocreatemap.get("tempvoicechannel_".concat(oldState.guild.id, "_").concat(oldState.channelID))) {
          //fetch the channel
          var vc = oldState.guild.channels.cache.get(jointocreatemap.get("tempvoicechannel_".concat(oldState.guild.id, "_").concat(oldState.channelID))); //if the size is under 1

          if (vc.members.size < 1) {
            //delete it from the map
            jointocreatemap["delete"]("tempvoicechannel_".concat(oldState.guild.id, "_").concat(oldState.channelID)); //log it 

            console.log(" :: " + oldState.member.user.username + "#" + oldState.member.user.discriminator + " :: Room wurde gelöscht"); //delete the room

            return vc["delete"]();
          } else {}
        }
      }
    }
  });

  function jointocreatechannel(user) {
    return regeneratorRuntime.async(function jointocreatechannel$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //log it 
            console.log(" :: " + user.member.user.username + "#" + user.member.user.discriminator + " :: Created a Room"); //user.member.user.send("This can be used to message the member that a new room was created")

            _context2.next = 3;
            return regeneratorRuntime.awrap(user.guild.channels.create("\u043A\u043E\u043C\u043D\u0430\u0442\u0430 ".concat(user.member.user.username), {
              type: 'voice',
              parent: '815581800369356811',
              //user.channel.parent.id, //or set it as a category id
              userLimit: '2'
            }).then(function _callee(vc) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      //move user to the new channel
                      user.setChannel(vc); //set the new channel to the map

                      jointocreatemap.set("tempvoicechannel_".concat(vc.guild.id, "_").concat(vc.id), vc.id); //change the permissions of the channel

                      _context.next = 4;
                      return regeneratorRuntime.awrap(vc.overwritePermissions([{
                        id: user.id,
                        allow: ['MANAGE_CHANNELS']
                      }, {
                        id: user.guild.id,
                        allow: ['VIEW_CHANNEL']
                      }]));

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};