module.exports.run = async (client, message, args) => {
  client.musicPlayer.play(message, args);
};

module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ['p','start'],
  description: "Plays songs",
  category: "music",
  accesTest: "music-player"
};
