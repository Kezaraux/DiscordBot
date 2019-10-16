import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";

import log, { logObj } from "../utils/logger";
import { getAllReactionRoles } from "../utils/database";

const command = "logRoleTable";
const aliases = [command, "lrt"];
const category = "devUtils";

class LogReactRolesTableCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category
    });
    log(`${command}Command created`);
  }

  exec(message) {
    const reactionRoles = getAllReactionRoles.all();
    logObj("Logging reaction roles", reactionRoles);
    const embed = new RichEmbed().setTitle("Reaction Roles").setColor("GREEN");
    reactionRoles.forEach(r => {
      embed.addField(
        `Message ID: ${r.react_message_id}`,
        r.reaction_identifier
      );
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

export default LogReactRolesTableCommand;
