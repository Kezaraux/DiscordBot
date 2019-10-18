import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import { updateGuildConfig } from "../actions";
import ResourceStrings from "../utils/ResourceStrings.json";

const configKeys = Object.keys(require("../../config/initialDbConfig.json"));

const command = "config";
const aliases = [command, "conf"];
const category = "admin";

class ConfigCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [
                {
                    id: "option",
                    type: configKeys,
                    prompt: {
                        start: message => {
                            const guildConfig = getGuildConfig(
                                this.client.store.getState(),
                                message.guild.id
                            );
                            const content = ResourceStrings.select_config_option;
                            const embed = new RichEmbed()
                                .setTitle(`Config for ${message.guild.name}`)
                                .setColor("WHITE");
                            for (const [key, val] of Object.entries(guildConfig)) {
                                embed.addField(key, `Currently: ${val}`);
                            }
                            return { embed, content };
                        },
                        retry: ResourceStrings.error_invalid_option_retry
                    }
                },
                {
                    id: "value",
                    type: "string",
                    prompt: { start: ResourceStrings.prompt_value }
                }
            ],
            channelRestriction: "guild"
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
        const oldConfig = getGuildConfig(this.client.store.getState(), message.guild.id);
        const newConfig = { ...oldConfig, [args.option]: args.value };

        this.client.store.dispatch(
            updateGuildConfig({
                guild_id: message.guild.id,
                config: newConfig
            })
        );
        log(sprintf(ResourceStrings.updated_config_option, args.option, args.value, message.guild.id));
        return message.channel.send(
            sprintf(ResourceStrings.updated_config_option, args.option, args.value, message.guild.id)
        );
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command}`,
    aliases,
    category,
    blurb: "Use this command to change the config for this guild"
};

export default ConfigCommand;
