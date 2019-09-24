import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "setupReaction";
const aliases = [command, "setupReact", "setR", "sr", "doReact"];

class SetupReactionCommand extends Command {
  constructor() {
    super(command, {
      aliases
    });
    log(`${command}Command created`);
  }

  exec(message) {
    return message.channel.send("Pong!");
  }
}

export const help = {
  isHidden: false,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command}`,
  aliases,
  blurb:
    "Reacts to a message with the specified emoji." +
    "Anyone who clicks that reaction will gain the associated role"
};

export default SetupReactionCommand;
