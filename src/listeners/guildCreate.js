import { Listener } from "discord-akairo";
import { sprintf } from "sprintf-js";

import log, { logObj } from "../utils/logger";
import { updateGuildConfig } from "../actions";
import { getGuildConfig } from "../selectors";
import { getDefaultChannel } from "../utils/discord-helpers";
import ResourceStrings from "../utils/ResourceStrings.json";
const initialConfig = require("../../config/initialDbConfig.json");

const event = "guildCreate";

class GuildCreateListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(guild) {
        log(sprintf(ResourceStrings.info_joined_guild, guild.name));
        this.client.store.dispatch(updateGuildConfig({ guild_id: guild.id, config: initialConfig }));
        log(sprintf(ResourceStrings.info_config_created, guild.name));
        const config = getGuildConfig(this.client.store.getState(), guild.id);
        const defaultChannel = getDefaultChannel(guild);
        defaultChannel.send(sprintf(ResourceStrings.guild_join_message, config.prefix, config.prefix));
    }
}

export default GuildCreateListener;
