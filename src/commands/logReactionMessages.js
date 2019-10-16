import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";

import log, { logObj } from "../utils/logger";
import { getAllReactMessages } from "../utils/database";

const command = "logMsgTable";
const aliases = [command, "lmt"];
const category = "devUtils";

class LogReactMessageTableCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category
    });
    log(`${command}Command created`);
  }

  exec(message) {
    const reactionMessages = getAllReactMessages.all();
    logObj("Logging reaction messages", reactionMessages);
    const embed = new RichEmbed()
      .setTitle("Reaction Messages")
      .setColor("GREEN");
    reactionMessages.forEach(rm => {
      const channelName = message.guild.channels.find(c => c.id === rm.channel)
        .name;
      embed.addField(`Channel: ${channelName}`, `Message ID: ${rm.message}`);
    });

    return message.channel.send(embed);
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || false,
  identifier: command,
  usage: `${command}`,
  aliases,
  category,
  blurb: "Logs all the items found in the reaction messages table"
};

export default LogReactMessageTableCommand;
