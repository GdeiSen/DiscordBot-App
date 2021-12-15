const player = require("../include/music_engine/musicEngine");
module.exports.run = async (client, message, args) => {
    player.run(client, message, args, "auto");
    queue.playerMaster.emit('PLAYER_METHOD_ACT','play',true)
};
module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays songs",
  category: "music",
  accesTest: "music-player"
};
