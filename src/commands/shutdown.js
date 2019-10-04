import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "shutdown";
const aliases = [command, "sd"];
const category = "admin";

class ShutdownCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      ownerOnly: true
    });
    log(`${command}Command created`);
  }

  exec(message) {
    log("Shutdown command recieved");
    return message.channel.send("Going to shut down!").then(() => {
      this.client.destroy();
    });
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || false,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command}`,
  aliases,
  blurb: "A command to shut down the bot"
};

export default ShutdownCommand;
