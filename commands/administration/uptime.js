const Discord = require("discord.js");
const { CommandBuilder } = require("../../builders/commandDataBuilder");

/**
 * Test command for checking the bot's performance
 *
 * @param {object} data An object with the necessary data to run the function. All the following fields of this object are required to be filled in
 * @param {object} data.client The current main client of this bot
 * @param {object} data.message Discord message from the user (participant in the command launch process). Specified to specify the path to send a response message from the bot
 */
module.exports.run = async (data) => {
  let message = data.message;
  let client = data.client;
  let seconds = Math.floor(client.uptime / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  let embed = new Discord.MessageEmbed()
    .setTitle('Bot LifeTime Function')
    .setDescription(`⏰ **Last Reboot:** Time: \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``)
    .setColor('BLACK')

  return { sendData: { embeds: [embed], params: { replyTo: message } }, result: true }
}

const data = new CommandBuilder()
data.setName('uptime')
data.setDescription("Displays the current uptime of the bot")
data.setMiddleware([]);
data.setCategory('admin')
module.exports.data = data;