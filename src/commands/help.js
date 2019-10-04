import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

import log from "../utils/logger";

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
    const cmdData = await getAllCommands();
    const helpEmbed = new RichEmbed();
    helpEmbed.setColor("WHITE");
    if (args.cmd) {
      const cmd = cmdData.find(cmd => cmd.identifier === args.cmd);
      if (cmd === undefined) {
        return message.channel.send("That command doesn't exist!");
      } else {
        helpEmbed.setTitle(`Information for ${args.cmd}`);
        helpEmbed.addField("Usage", cmd.usage);
        const aliases = cmd.aliases.filter(a => a !== cmd.identifier);
        aliases.length > 0
          ? helpEmbed.addField(
              `You can use the following instead of ${args.cmd}`,
              aliases.join(", ")
            )
          : null;
        helpEmbed.addField("Info", cmd.blurb);
        return message.channel.send(helpEmbed);
      }
    }
    helpEmbed.setTitle("List of commands");
    helpEmbed.addField(
      "Commands",
      cmdData
        .filter(cmd => cmd.isEnabled)
        .map(cmd => cmd.identifier)
        .join(", ")
    );
    helpEmbed.addField(
      "For more information on a command",
      `Use ${config.get("bot.prefix")}help [command]`
    );

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
    /*cmdList.push({
      isHidden: help.isHidden,
      identifier: help.identifier,
      aliases: help.aliases,
      usage: help.usage,
      blurb: help.blurb
    });*/
    cmdList.push(help);
  });

  return cmdList;
};

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  aliases,
  usage: `${config.get("bot.prefix")}help [command]`,
  blurb:
    "Use this command on it's own to get a list of all the commands." +
    "\nUse the command while specifying another command to get detailed information on that command!" +
    "\nSquare brackets denote an optional parameter, while triangle brackets denote a required parameter."
};

export default HelpCommand;
