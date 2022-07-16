class EmbedManager {
    constructor(client, guild) {
        this.guild = guild;
        this.client = guild.client;
        this.queue = guild.queue;
    }

    async send(data, params) {
        let reply;
        if (params?.replyTo) {
            await params.replyTo.reply(data).catch(async () => {
                if (params?.channel || params?.replyTo) {
                    let channel = params?.channel || params?.replyTo?.channel;
                    reply = await channel.send(data).catch(async () => {
                        if (this.guild?.textChannel) {
                            reply = await this.guild.textChannel.send(data).catch(() => { })
                        }
                    });
                }
            })
        }
        else if (params?.channel) {
            let channel = params?.channel;
            reply = await channel.send(data).catch(async () => {
                if (this.guild?.textChannel) {
                    reply = await this.guild.textChannel.send(data).catch(() => { })
                }
            });
        }
        if (params?.embedTimeout !== 'none') setTimeout(() => this.delete(reply || params?.replyTo), params?.embedTimeout || this.guild.params.embedTimeout);
        return reply || params?.replyTo;
    }

    delete(message, params) {
        if (message?.delete) message.delete().catch(() => { });
        else if (message?.deleteReply) message.deleteReply().catch(() => { });
    }


    edit(message, data) {
        if (message?.edit) message.edit(data).catch(() => { })
        else if (message?.editReply) message.editReply(data).catch(() => { })
    }

    deleteAllActiveEmbeds() {
        this.deleteActivePlayerEmbed();
        this.deleteActiveNowPlayingEmbed();
        this.deleteActiveQueueEmbed();
        this.deleteActiveSearchEmbed();
    }

    deleteActivePlayerEmbed() {
        this.delete(this.guild.activeEmbeds.playerEmbed);
    }

    deleteActiveNowPlayingEmbed() {
        this.delete(this.guild.activeEmbeds.nowPlayingEmbed);
    }

    deleteActiveQueueEmbed() {
        this.delete(this.guild.activeEmbeds.queueEmbed);
    }

    deleteActiveSearchEmbed() {
        this.delete(this.guild.activeEmbeds.searchEmbed);
    }

}
exports.EmbedManager = EmbedManager;


