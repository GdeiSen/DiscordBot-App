const { SlashCommandBuilder } = require('@discordjs/builders');
exports.CommandBuilder = class CommandBuilder extends SlashCommandBuilder {
    constructor() {
        super();
    }
    setMiddleware(middleware) {
        this.middleware = middleware;
    }
    setAliases(aliases) {
        this.aliases = aliases;
    }
    setCategory(category) {
        this.category = category;
    }
    setAccessibility(accessibility) {
        this.accessibility = accessibility;
    }
}