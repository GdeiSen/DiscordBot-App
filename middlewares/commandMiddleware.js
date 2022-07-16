const embedGenerator = require("../utils/embedGenerator.js");
const EventEmitter = require('events');
class CommandMiddleware extends EventEmitter {
  constructor(client, guild) {
    super();
    this.client = client;
    this.guild = guild;
  }

  test(message, args, accessPermission) {
    let cooldown = this.testCoolDown();
    if (cooldown?.state == false) { return cooldown };
    let data = {
      voiceChannel: message.member.voice.channel,
      member: message.member,
      guild: message.guild,
      queue: message.guild.queue,
      channel: message.channel,
      author: message.author,
      args: args
    }
    return this.#test(accessPermission, data)
  }

  #test(testers, data) {
    let state = true;
    let errorEmbed;
    testers.some((tester) => {
      let testResult = this[tester](data);
      if (testResult.state !== true) { state = testResult.state; errorEmbed = testResult.errorEmbed; return true }
    })
    return ({ state: state, errorEmbed: errorEmbed })
  }

  testCoolDown() {
    let embed = embedGenerator.run("warnings.error_08");
    if (this.guild.isAvailable == false) {
      return { state: false, errorEmbed: embed }
    }
    else { return { state: true } }
  }

  setCooldown() {
    this.guild.isAvailable = false;
    this.guild.commandCooldown = setTimeout(() => {
      this.guild.isAvailable = true;
    }, 2000);
  }

  testUserId(data) {
    return { state: true };
  }

  testUserVoiceChannelAvailability(data) {
    let embed = embedGenerator.run("music.play.error_02");
    const voiceChannel = data.member.voice.channel;
    if (!voiceChannel) return { state: false, errorEmbed: embed }
    else return { state: true };
  }

  testAudioPermissions(data) {
    let embed1 = embedGenerator.run("music.play.error_03");
    let embed2 = embedGenerator.run("music.play.error_04");
    const permissions = data.voiceChannel.permissionsFor(this.client.user);
    if (!permissions.has("CONNECT")) return { state: false, errorEmbed: embed1 }
    if (!permissions.has("SPEAK")) return { state: false, errorEmbed: embed2 }
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) return { state: false, errorEmbed: embed1 }
    else return { state: true };
  }

  testCollector(data) {
    let embed = embedGenerator.run("music.search.error_01");
    if (data.channel.activeCollector) return { state: false, errorEmbed: embed }
    else return { state: true };
  }

  testArgs(data) {
    let embed = embedGenerator.run("music.play.info_01");
    if (data?.args?.length < 1) return { state: false, errorEmbed: embed }
    else return { state: true };
  }

  testSameUserBotLocation(data) {
    if (data.queue != null) {
      let embed = embedGenerator.run("music.play.error_01");
      if (data.queue.status == 'playing' && data.member.voice.channel !== data.guild.me.voice.channel) return { state: false, errorEmbed: embed };
    }
    return { state: true };
  }

  testQueueStatus(data) {
    let embed = embedGenerator.run("warnings.error_03");
    if (data.queue == null || (data.queue.status !== 'playing' && data.queue.status !== 'paused')) return { state: false, errorEmbed: embed };
    else return { state: true };
  }

}
exports.CommandMiddleware = CommandMiddleware;
