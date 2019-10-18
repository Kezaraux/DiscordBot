import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";
import { sprintf } from "sprintf-js";
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

import log, { logObj } from "../utils/logger";
import { getGuildConfig } from "../selectors";
import ResourceStrings from "../utils/ResourceStrings.json";

const command = "help";
const aliases = [command];
const category = "default";

class HelpCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [
                {
                    id: "cmd",
                    type: "string"
                }
            ]
        });
        log(`${command}Command created`);
    }

    async exec(message, args) {
        const guildConfig = getGuildConfig(this.client.store.getState(), message.guild.id);

        const hasAdminRole = message.member.roles.find(r => r.name === guildConfig.adminRole);
        if (hasAdminRole) {
            log("Help command, has admin role!");
        }

        const cmdData = await getAllCommands();
        const helpEmbed = new RichEmbed();
        helpEmbed.setColor("WHITE");
        helpEmbed.setFooter(ResourceStrings.bracket_info);
        // If the user tried to specify a command for help
        if (args.cmd) {
            const cmd = cmdData.find(cmd => cmd.aliases.includes(args.cmd));
            if (cmd === undefined) {
                return message.channel.send(ResourceStrings.error_command_dne);
            } else {
                helpEmbed.setTitle(sprintf(ResourceStrings.information_for, cmd.identifier));
                helpEmbed.addField(ResourceStrings.usage, `${guildConfig.prefix}${cmd.usage}`);
                const aliases = cmd.aliases.filter(a => a !== cmd.identifier);
                aliases.length > 0
                    ? helpEmbed.addField(
                          sprintf(ResourceStrings.use_following_instead, cmd.identifier),
                          aliases.join(", ")
                      )
                    : null;
                helpEmbed.addField(ResourceStrings.info, cmd.blurb);
                return message.channel.send(helpEmbed);
            }
        }

        // No command specified, give a list of all commands
        const cmdObject = cmdData.reduce((result, cmd) => {
            if (!result[cmd.category]) {
                result[cmd.category] = [];
            }

            result[cmd.category].push(cmd.identifier);
            return result;
        }, {});

        helpEmbed.setTitle(ResourceStrings.commands_by_cat);
        Object.keys(cmdObject).forEach(key => {
            if (key === "admin" && !hasAdminRole) {
                return;
            }
            helpEmbed.addField(
                sprintf(ResourceStrings.some_cat, key),
                cmdObject[key].join(", ") +
                    (hasAdminRole && key === "admin"
                        ? sprintf(ResourceStrings.command_needs_admin, guildConfig.adminRole)
                        : "")
            );
        });
        helpEmbed.addField(
            ResourceStrings.more_command_info,
            sprintf(ResourceStrings.more_info_blurb, guildConfig.prefix)
        );
        if (!hasAdminRole) {
            helpEmbed.addField(
                ResourceStrings.other_information,
                sprintf(ResourceStrings.admin_cmds_not_listed, guildConfig.adminRole)
            );
        }

        return message.channel.send(helpEmbed);
    }
}

const getAllCommands = async () => {
    const files = await readdir("./src/commands/");
    let cmdFiles = files.filter(f => f.split(".").pop() === "js");
    if (cmdFiles.length === 0) {
        log("No commands to load! That's impossible!");
        return [];
    }

    let cmdList = [];
    cmdFiles.forEach(file => {
        const help = require(`./${file}`).help;
        cmdList.push(help);
    });

    return cmdList;
};

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    aliases,
    category,
    usage: `${command} [command]`,
    blurb:
        "Use this command on it's own to get a list of all the commands." +
        "\nUse the command while specifying another command to get detailed information on that command!" +
        "\nSquare brackets denote an optional parameter, while triangle brackets denote a required parameter."
};

export default HelpCommand;
