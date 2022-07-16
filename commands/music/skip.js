const { MessageButton, MessageActionRow } = require("discord.js");
const { CommandBuilder } = require("../../builders/commandDataBuilder");
const embedGenerator = require("../../utils/embedGenerator")

/**
 * Skips tracks
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.guild The discord server guild object previously redesigned using guildBuilder
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 * @param {string} data.args Additional data specified when calling the command by the user [EXAMPLE] /add <args> --> /add AC/DC Track [ (args == 'AC/DC Track') = true ]
 */
module.exports.run = async (data) => {
  let args = data.args;
  let guild = data.guild;
  let message = data.message;
  let queue = data.queue;
  let client = data.client;
  let embed;

  // if (guild.params.voteToSkip == true) {
  //   let voteToSkipEmbed = embedGenerator.run('music.voteToSkip');
  //   let votedUsers = new Map;

  //   let row = new MessageActionRow().addComponents(
  //     new MessageButton()
  //       .setCustomId("voteSkip")
  //       .setEmoji("✅")
  //       .setLabel("skip")
  //       .setStyle("SUCCESS"),
  //     new MessageButton()
  //       .setCustomId("voteNope")
  //       .setLabel("nope")
  //       .setEmoji("🅾️")
  //       .setStyle("DANGER")
  //   )

  //   let collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });

  //   collector.on('collect', async item => {
  //     switch (item.customId) {
  //       case 'voteSkip': {
  //         if (item.user.voice.channel !== guild.me.voice.channel) return 0;
  //         let votedUser = votedUsers.get(item.user.id)
  //         if (votedUser) return 0;
  //         votedUsers.set(item.user.id, item.user);
  //         guild.embedManager.edit()
  //         break;
  //       }
  //       case 'voteNope': break;
  //       default: break;
  //     }
  //   });
  // }

  if (!args) {
    guild?.queueManager.skip();
    embed = embedGenerator.run('music.skipto.info_01')
  }

  else if (args > queue.songs.length) {
    embed = embedGenerator.run('music.skipto.error_01');
  }

  else if (args) {
    guild.queueManager.skipTo(args)
    embed = embedGenerator.run('music.skipto.info_01');
  }

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
};

const data = new CommandBuilder()
data.setName('skip')
data.setDescription('Skips tracks')
data.addStringOption(option =>
  option.setName('skipto')
    .setDescription('Skip to')
    .setRequired(false))
data.setMiddleware(["testUserId", "testQueueStatus", "testAudioPermissions"]);
data.setCategory('music')
module.exports.data = data;