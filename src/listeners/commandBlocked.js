import { Listener } from "discord-akairo";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import ResourceStrings from "../utils/ResourceStrings.json";

class CommandBlockedListener extends Listener {
    constructor() {
        super("commandBlocked", {
            emitter: "commandHandler",
            eventName: "commandBlocked"
        });

        log("CommandBlockedListener created");
    }

    exec(message, command, reason) {
        const guildConfig = getGuildConfig(this.client.store.getState(), message.guild.id);
        log(`${message.author.username} was blocked from using ${command.id}.\nReason: ${reason}`);
        message.channel.send(sprintf(ResourceStrings.error_user_permissions, command, guildConfig.adminRole));
    }
}

export default CommandBlockedListener;
