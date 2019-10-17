import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

import log, { logObj } from "../utils/logger";
import { getGuildConfig } from "../selectors";

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
        helpEmbed.setFooter(
            "Square brackets denote an optional argument. Triangle brackets denote a required argument."
        );
        // If the user tried to specify a command for help
        if (args.cmd) {
            const cmd = cmdData.find(cmd => cmd.aliases.includes(args.cmd));
            if (cmd === undefined) {
                return message.channel.send("That command doesn't exist!");
            } else {
                helpEmbed.setTitle(`Information for ${args.cmd}`);
                helpEmbed.addField("Usage", `${guildConfig.prefix}${cmd.usage}`);
                const aliases = cmd.aliases.filter(a => a !== cmd.identifier);
                aliases.length > 0
                    ? helpEmbed.addField(
                          `You can use the following instead of ${cmd.identifier}`,
                          aliases.join(", ")
                      )
                    : null;
                helpEmbed.addField("Info", cmd.blurb);
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

        helpEmbed.setTitle("List of commands by category");
        Object.keys(cmdObject).forEach(key => {
            if (key === "admin" && !hasAdminRole) {
                return;
            }
            helpEmbed.addField(
                `${key} category:`,
                cmdObject[key].join(", ") +
                    (hasAdminRole && key === "admin"
                        ? `\nThese commands require you to have the \`${guildConfig.adminRole}\` role\nEnsure this role exists on your server, or update the config to change the role`
                        : "")
            );
        });
        helpEmbed.addField(
            "For more information on a command",
            `Use ${guildConfig.prefix}help [command]\nIf you know an alias for a command those will work as well`
        );
        if (!hasAdminRole) {
            helpEmbed.addField(
                "Other information",
                `Admin commands will not be listed unless you have the role \`${guildConfig.adminRole}\``
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
