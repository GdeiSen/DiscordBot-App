const { Client, Collection, Intents } = require("discord.js");
const { CommandMiddleware } = require("./middlewares/commandMiddleware");
const { ExtServerEngine } = require("./external_server/managers/connectionManager");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { GuildBuilder } = require('./builders/guildBuilder');
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const config = require("./config.json");
const rest = new REST({ version: '9' }).setToken(config.TOKEN);
process.on('uncaughtException', (err) => {
  console.log(err);
});

client.login(config.TOKEN);
client.aliases = new Collection();
client.categories = new Collection();
client.guildBuilder = new GuildBuilder();
client.queue = new Map();
client.commands = [];
client.prefix = config.PREFIX;
console.clear();

client.once("ready", async () => {
  client.guildBuilder.build(client);
  console.log(`⬜ Main Manager Is Enable`);
  client.user.setActivity(`Type ${config.PREFIX}help`, {
    type: "STREAMING",
  });
  if (config.USE_EXTERNAL_SERVER == true) {
    client.extServerManager = new ExtServerEngine(client);
    client.extServerManager.connect();
    client.extServerManager.createRouter();
  }
});


scanCommands('./commands/music');
scanCommands('./commands/entertainment');
scanCommands('./commands/administration');
scanCategories();

function scanCommands(path) {
  const commandFiles = fs.readdirSync(`${path}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${path}/${file}`);
    command.data.run = command.run;
    if (command?.data) client.commands.push(command.data);
  }
}

function scanCategories() {
  let buf = new Array();
  let index = 0;
  client.commands.forEach(command => {
    if (index == 0) { buf[0] = command.category; index++ }
    else {
      if (!buf.find(el => el == command.category)) { buf.push(command.category); index++ }
    }
  })
  client.categories = buf;
}

const clientId = '985276045701828628';
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: client.commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const commandMiddleware = new CommandMiddleware(client, interaction.guild);
  const command = client.commands.find(command => command.name == interaction.commandName);
  const test = commandMiddleware.test(interaction, interaction?.options?.data[0]?.value, command.middleware);
  interaction.guild.activeInteraction = interaction;
  
  let execData = {
    guild: interaction.guild,
    message: interaction,
    client: client,
    queue: interaction.guild?.queue,
    params: interaction.guild?.params,
    args: interaction?.options?.data[0]?.value.toString(),
    argsArray: interaction?.options.data,
  }

  if (test.state == false) { interaction.guild.embedManager.send({ embeds: [test.errorEmbed] }, { replyTo: interaction }); return false }
  let commandExecResult = await command.run(execData);
  if (commandExecResult?.sendData) interaction.guild.embedManager.send({ embeds: commandExecResult.sendData.embeds }, commandExecResult.sendData.params);
})
