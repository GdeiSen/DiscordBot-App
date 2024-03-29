const { EmbedBuilder } = require("discord.js");
const text = require("../../data/text_packs/en.json");
const { CommandBuilder } = require("../../builders/commandDataBuilder");

/**
 * Displays the description of the commands
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.client The current main client of this bot
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = (data) => {
  let message = data.message;
  let commands = data?.client.commands || message.client.commands;
  let embeds = [];

  message.client.categories.forEach(category => {
    let embed = new EmbedBuilder()
      .setTitle(`${message.client.user.username}` + text.info.help[category].embedTitle)
      .setDescription(text.info.help[category].embedDescription)
      .setColor(text.info.help[category].embedColor);
    commands.forEach(cmd => {
      if (cmd.category == category) {
        embed.addFields({
          name: `**${message.client.prefix}${cmd.name}**`,
          value: `${cmd.description}`,
          inline: true
        })
      }
    })
    embeds.push(embed);
  })
  data.guild.embedManager.send({ embeds: embeds }, { replyTo: data.message, embedTimeout: 'none' });
};

const data = new CommandBuilder()
data.setName('help')
data.setDescription('Displays the description of the commands')
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;