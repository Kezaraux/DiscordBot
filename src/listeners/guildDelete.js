import { Listener } from "discord-akairo";
import { sprintf } from "sprintf-js";

import log, { logObj } from "../utils/logger";
import { deleteGuildConfig } from "../actions";
import ResourceStrings from "../utils/ResourceStrings.json";

const event = "guildDelete";

class GuildDeleteListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(guild) {
        log(sprintf(ResourceStrings.info_left_guild, guild.name));
        this.client.store.dispatch(deleteGuildConfig({ guild_id: guild.id }));
        log(sprintf(ResourceStrings.info_config_deleted, guild.name));
    }
}

export default GuildDeleteListener;
