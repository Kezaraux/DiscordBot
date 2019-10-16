import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";

const command = "shutdown";
const aliases = [command, "sd"];
const category = "admin";

class ShutdownCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category
    });
    log(`${command}Command created`);
  }

  userPermissions(message) {
    const guildConfig = getGuildConfig(
      this.client.store.getState(),
      message.guild.id
    );
    return (
      message.member.roles.exists(
        role => role.name === guildConfig.adminRole
      ) || message.author.id === config.get("private.ownerId")
    );
  }

  exec(message) {
    log("Shutdown command recieved");
    return message.channel.send("Going to shut down!").then(() => {
      this.client.destroy();
      log("Bot has shut down.");
      process.exit();
    });
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || false,
  identifier: command,
  usage: `${command}`,
  aliases,
  category,
  blurb: "A command to shut down the bot"
};

export default ShutdownCommand;
