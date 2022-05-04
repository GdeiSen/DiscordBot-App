const embedGenerator = require("./embedGenerator.js");
const EventEmitter = require('events');
class AccessTester extends EventEmitter {
  constructor(client, guild) {
    super();
    this.client = client;
    this.guild = guild;
  }
  async test(message, args, testQuery) {
    let coolDown = await this.testCoolDown();
    if(coolDown?.state == false){this.emit('DENIED', coolDown.errorEmbed);  return 0};
    switch (testQuery) {
      case 'none': { this.noneTestPack(message); break }
      case 'blocked': { this.blockedTestPack(); break }
      case 'music-command': { this.musicCommandTestPack(message); break }
      case 'music-player': { this.musicPlayerTestPack(message, args); break }
      case 'collector-player-command': { this.musicPlayerWithCollectorTestPack(message, args); break }
      case 'collector-music-command': { this.musicCommandWithCollectorTestPack(message); break }
      case 'connection-command': { this.connectionCommandTestPack(message); break }
      default: break;
    }
    this.setCooldown();
  }

  async testCoolDown() {
    let embed = embedGenerator.run("warnings.error_08");
    if (this.guild.isAvailable == false){ 
      return { state: false, errorEmbed: embed } }
    else {this.emit('GRANTED')}
  }

  async setCooldown() {
    this.guild.isAvailable = false;
    this.guild.timeOut = setTimeout(() => {
      this.guild.isAvailable = true;
    }, 2000);
  }
  async noneTestPack(message) {
    let userId_test = await this.testUserId(message.author);
    if (userId_test.state !== true) { this.emit('DENIED', userId_test); return 0 }
    else { this.emit('GRANTED') }
  }
  async blockedTestPack() {
    let embed = await embedGenerator.run("warnings.error_06");
    this.emit('DENIED', embed)
  }
  async musicCommandTestPack(message) {
    let userId_test = await this.testUserId(message.author);
    if (userId_test.state !== true) { this.emit('DENIED', userId_test.errorEmbed); return 0 }
    let queue_test = await this.testQueueStatus(message.guild);
    if (queue_test.state !== true) { this.emit('DENIED', queue_test.errorEmbed); return 0 }
    let perm_test = await this.testAudioPermissions(message.member.voice.channel)
    if (perm_test.state !== true) { this.emit('DENIED', perm_test.errorEmbed); return 0 }
    this.emit('GRANTED')
  }
  async musicPlayerTestPack(message, args) {
    let userId_test = await this.testUserId(message.author);
    if (userId_test.state !== true) { this.emit('DENIED', userId_test.errorEmbed); return 0 }
    let member_test = await this.testSameUserBotLocation(message.guild, message.member);
    if (member_test.state !== true) { this.emit('DENIED', member_test.errorEmbed); return 0 }
    let voice_test = await this.testUserVoiceChannelAvailability(message.member);
    if (voice_test.state !== true) { this.emit('DENIED', voice_test.errorEmbed); return 0 }
    let perm_test = await this.testAudioPermissions(message.member.voice.channel)
    if (perm_test.state !== true) { this.emit('DENIED', perm_test.errorEmbed); return 0 }
    let args_test = await this.testArgs(args);
    if (args_test.state !== true) { this.emit('DENIED', args_test.errorEmbed); return 0 }
    this.emit('GRANTED')
  }
  async musicCommandWithCollectorTestPack(message) {
    let collector_test = await this.testCollector(message.channel);
    if (collector_test.state !== true) { this.emit('DENIED', collector_test.errorEmbed); return 0 }
    let userId_test = await this.testUserId(message.author);
    if (userId_test.state !== true) { this.emit('DENIED', userId_test.errorEmbed); return 0 }
    let queue_test = await this.testQueueStatus(message.guild);
    if (queue_test.state !== true) { this.emit('DENIED', queue_test.errorEmbed); return 0 }
    let perm_test = await this.testAudioPermissions(message.member.voice.channel)
    if (perm_test.state !== true) { this.emit('DENIED', perm_test.errorEmbed); return 0 }
    this.emit('GRANTED')
  }
  async musicPlayerWithCollectorTestPack(message, args) {
    let collector_test = await this.testCollector(message.channel);
    if (collector_test.state !== true) { this.emit('DENIED', collector_test.errorEmbed); return 0 }
    let userId_test = await this.testUserId(message.author);
    if (userId_test.state !== true) { this.emit('DENIED', userId_test.errorEmbed); return 0 }
    let member_test = await this.testSameUserBotLocation(message.guild, message.member);
    if (member_test.state !== true) { this.emit('DENIED', member_test.errorEmbed); return 0 }
    let voice_test = await this.testUserVoiceChannelAvailability(message.member);
    if (voice_test.state !== true) { this.emit('DENIED', voice_test.errorEmbed); return 0 }
    let perm_test = await this.testAudioPermissions(message.member.voice.channel)
    if (perm_test.state !== true) { this.emit('DENIED', perm_test.errorEmbed); return 0 }
    let args_test = await this.testArgs(args);
    if (args_test.state !== true) { this.emit('DENIED', args_test.errorEmbed); return 0 }
    this.emit('GRANTED')
  }
  async connectionCommandTestPack(message) {
    let userId_test = await this.testUserId(message.author);
    if (userId_test.state !== true) { this.emit('DENIED', userId_test.errorEmbed); return 0 }
    let voice_test = await this.testUserVoiceChannelAvailability(message.member);
    if (voice_test.state !== true) { this.emit('DENIED', voice_test.errorEmbed); return 0 }
    let perm_test = await this.testAudioPermissions(message.member.voice.channel)
    if (perm_test.state !== true) { this.emit('DENIED', perm_test.errorEmbed); return 0 }
    this.emit('GRANTED')
  }

  async testUserId(author) {
    // let embed = await embedGenerator.run("warnings.error_02");
    // if (author.id === "614819288506695697" || author.id === "596967380089962496" || author.id === "468380034273509376" && !author.bot) return { state: true };
    // else return { state: false, errorEmbed: embed };
    return { state: true };
  }
  async testUserVoiceChannelAvailability(member) {
    let embed = await embedGenerator.run("music.play.error_02");
    const voiceChannel = await member.voice.channel;
    if (!voiceChannel) return { state: false, errorEmbed: embed }
    else return { state: true };
  }
  async testAudioPermissions(voiceChannel) {
    let embed1 = await embedGenerator.run("music.play.error_03");
    let embed2 = await embedGenerator.run("music.play.error_04");
    const permissions = voiceChannel.permissionsFor(this.client.user);
    if (!permissions.has("CONNECT")) return { state: false, errorEmbed: embed1 }
    if (!permissions.has("SPEAK")) return { state: false, errorEmbed: embed2 }
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) return { state: false, errorEmbed: embed1 }
    else return { state: true };
  }
  async testCollector(channel) {
    let embed = await embedGenerator.run("music.search.error_01");
    if (channel.activeCollector) return { state: false, errorEmbed: embed }
    else return { state: true };
  }
  async testArgs(args) {
    let embed = await embedGenerator.run("music.play.info_01");
    if (args.length < 1) return { state: false, errorEmbed: embed }
    else return { state: true };
  }
  async testSameUserBotLocation(guild, member) {
    let queue = await this.client.queue.get(guild.id);
    if (queue != null) {
      let embed = await embedGenerator.run("music.play.error_01");
      if (queue.isPlaying == true && member.voice.channel !== guild.me.voice.channel) return { state: false, errorEmbed: embed };
    }
    return { state: true };
  }
  async testQueueStatus(guild) {
    let queue = await this.client.queue.get(guild.id);
    let embed = await embedGenerator.run("warnings.error_03");
    if (queue == null || (queue.status !== 'playing' && queue.status !== 'paused')) return { state: false, errorEmbed: embed };
    else return { state: true };
  }
}
exports.AccessTester = AccessTester;
