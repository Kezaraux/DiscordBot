import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import { updateGuildConfig } from "../actions";
import ResourceStrings from "../utils/ResourceStrings.json";

const command = "prefix";
const aliases = [command, "pre"];
const category = "admin";

class PrefixCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [{ id: "prefix", type: "string" }]
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

    exec(message, args) {
        if (!args.prefix) {
            return message.channel.send(ResourceStrings.provide_new_prefix);
        }
        const oldConfig = getGuildConfig(this.client.store.getState(), message.guild.id);
        const newConfig = { ...oldConfig, prefix: args.prefix };
        this.client.store.dispatch(
            updateGuildConfig({
                guild_id: message.guild.id,
                config: newConfig
            })
        );
        log(sprintf(ResourceStrings.updated_prefix, message.guild.id, args.prefix));
        return message.channel.send(sprintf(ResourceStrings.changed_prefix, args.prefix));
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || false,
    identifier: command,
    usage: `${command} <prefix>`,
    aliases,
    category,
    blurb: "A command to change the command prefix for this guild."
};

export default PrefixCommand;
