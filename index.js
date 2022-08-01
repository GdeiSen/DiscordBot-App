const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { CommandMiddleware } = require("./middlewares/commandMiddleware");
const { ExtServerEngine } = require("./external_server/managers/connectionManager");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { GuildBuilder } = require('./builders/guildBuilder');
const { CommandsBuilder } = require('./builders/commandsBuilder')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const config = require("./config.json");
const rest = new REST({ version: '9' }).setToken(config.TOKEN);

client.info = {
  commandsCount: 0,
  status: 'offline',
  commandsCategories: 0,
  slashCommandsStatus: 'not updated'
}

process.on('uncaughtException', (err) => {
  console.log(err);
});
client.login(config.TOKEN);

client.categories = new Collection();
client.guildBuilder = new GuildBuilder();
client.commandsBuilder = new CommandsBuilder(client);
client.queue = new Map();
client.commands = [];
client.prefix = config.PREFIX;


client.once("ready", async () => {
  client.info.status = 'ready';
  client.guildBuilder.build(client);
  console.log(`[INFO] Main Manager Is Enable`);
  client.commandsBuilder.executeCommandListeners();
  client.user.setActivity(`Type 👉 /help 👈`, {
    type: "STREAMING",
  });
  if (config.USE_EXTERNAL_SERVER == true) {
    client.extServerManager = new ExtServerEngine(client);
    client.extServerManager.connect();
    client.extServerManager.createRouter();
  }
});

client.commandsBuilder.scanCommands('./commands/music');
client.commandsBuilder.scanCommands('./commands/entertainment');
client.commandsBuilder.scanCommands('./commands/administration');
client.commandsBuilder.scanCategories();

(async () => {
  try {
    console.log('[INFO] Started refreshing application (/) commands');
    await rest.put(
      Routes.applicationCommands(config.CLIENT_ID),
      { body: client.commands },
    );
    console.log('[INFO] Successfully reloaded application (/) commands');
  } catch (error) {
    console.error(error);
  }
})();

client.on('guildCreate', (guild) => {
  client.guildBuilder.build(client, guild);
  client.commandsBuilder.executeCommandListeners(guild);
})

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
    channel: interaction.channel,
    queue: interaction.guild?.queue,
    params: interaction.guild?.params,
    args: interaction?.options?.data[0]?.value.toString(),
    argsArray: interaction?.options.data,
  }

  if (test.state == false) { interaction.guild.embedManager.send({ embeds: [test.errorEmbed] }, { replyTo: interaction }); return false }
  let commandExecResult = await command.run(execData);
  if (commandExecResult?.sendData) interaction.guild.embedManager.send({ embeds: commandExecResult.sendData.embeds }, commandExecResult.sendData.params);
})
