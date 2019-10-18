import { Listener } from "discord-akairo";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import ResourceStrings from "../utils/ResourceStrings.json";

const event = "commandBlocked";

class CommandBlockedListener extends Listener {
    constructor() {
        super(event, {
            emitter: "commandHandler",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(message, command, reason) {
        const guildConfig = getGuildConfig(this.client.store.getState(), message.guild.id);
        log(sprintf(ResourceStrings.warn_command_blocked, message.author.username, command.id, reason));
        message.channel.send(sprintf(ResourceStrings.error_user_permissions, command, guildConfig.adminRole));
    }
}

export default CommandBlockedListener;
