import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "addReactionRole";
const aliases = [command, "arr"];
const category = "reactRoles";

class AddReactionRoleCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      args: [
        { id: "message", type: "string" },
        { id: "reaction", type: "string" },
        { id: "role", type: "string" }
      ]
    });
    log(`${command}Command created`);
  }

  exec(message, args) {
    console.log({message, args});
    return message.channel.send("Logged message and args to console");
  }
}

export const help = {
  isHidden: config.get(`features.${category}`) || false,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command} <message id> <reaction/emoji> <role>`,
  aliases,
  blurb:
    "A basic command to see if the bot works!" +
    "\nThe bot will respond with 'Pong!'"
};

export default AddReactionRoleCommand;
