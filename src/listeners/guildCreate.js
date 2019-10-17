import { Listener } from "discord-akairo";

import log, { logObj } from "../utils/logger";
import { updateGuildConfig } from "../actions";
import { getGuildConfig } from "../selectors";
import { getDefaultChannel } from "../utils/discord-helpers";
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
        log(`Bot has joined guild: ${guild.name}`);
        this.client.store.dispatch(updateGuildConfig({ guild_id: guild.id, config: initialConfig }));
        log(`Config created for guild ${guild.name}`);
        const config = getGuildConfig(this.client.store.getState(), guild.id);
        const defaultChannel = getDefaultChannel(guild);
        defaultChannel.send(
            "Hi! Thanks for adding me to your server!\n" +
                `The default prefix for my commands is: \`${config.prefix}\`` +
                `\nTry it out with \`${config.prefix}help\` to see a list of my commands!`
        );
    }
}

export default GuildCreateListener;
