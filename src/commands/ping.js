import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "ping";
const aliases = [command, "p"];

class PingCommand extends Command {
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
    "A basic command to see if the bot works!" +
    "\nThe bot will respond with 'Pong!'"
};

export default PingCommand;
