import { Listener } from "discord-akairo";

import log, { logObj } from "../utils/logger";
import { deleteGuildConfig } from "../actions";

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
        log(`Bot has left guild: ${guild.name}`);
        this.client.store.dispatch(deleteGuildConfig({ guild_id: guild.id }));
        log(`Config removed for guild ${guild.name}`);
    }
}

export default GuildDeleteListener;
