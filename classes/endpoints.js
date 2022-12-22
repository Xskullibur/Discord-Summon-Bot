// For Global Endpoints Documentation see: https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands
// For Guild Endpoints see: https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands

class GlobalApplicationEndpoint {
    /**
     * Endpoints that applies to all guilds
     * @param {string} appId Application ID
     */
    constructor(appId) {
        this._appId = appId
        this._endpoints = `applications/${appId}`
    }

    allCommandsEndpoint() {
        return this._endpoints += `/commands`
    }

    singleCommandEndpoint(commandId) {
        return this._endpoints += `/commands/${commandId}`
    }
}

class GuildApplicationEndpoint extends GlobalApplicationEndpoint {
    /**
     * Endpoints that applies to a specific guild
     * @param {string} guildId Guild ID
     * @param {string} appId Application ID
     */
    constructor(guildId, appId) {
        super(appId)
        this._guildId = guildId
        this._endpoints += `/guilds/${guildId}`
    }
}

export {
    GlobalApplicationEndpoint,
    GuildApplicationEndpoint
}