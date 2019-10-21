import { Command } from "discord-akairo";
import config from "config";

import log from "../../utils/logger";
import { getGuildConfig } from "../../selectors";
import ResourceStrings from "../../utils/ResourceStrings.json";

const command = "shutdown";
const aliases = [command, "sd"];
const category = "admin";

class ShutdownCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category
        });
        log(`${command}Command created`);
    }

    userPermissions(message) {
        const guildConfig = getGuildConfig(this.client.store.getState(), message.guild.id);
        return (
            message.member.roles.find(r => r.name === guildConfig.adminRole) ||
            message.author.id === guildConfig.ownerId
        );
    }

    exec(message) {
        log(ResourceStrings.shutting_down);
        return message.channel.send(ResourceStrings.shutting_down).then(() => {
            this.client.destroy();
            log(ResourceStrings.bot_offline);
            process.exit();
        });
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || false,
    identifier: command,
    usage: `${command}`,
    aliases,
    category,
    blurb: "A command to shut down the bot"
};

export default ShutdownCommand;
