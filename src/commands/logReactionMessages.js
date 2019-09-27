import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

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
    const reactionMessages = this.client.getAllReactMessages.all();
    console.log(reactionMessages);
    return message.channel.send("Logged all present reaction messages boss!");
  }
}

export const help = {
  isHidden: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command}`,
  aliases,
  blurb: "Logs all the items found in the reaction messages table"
};

export default LogReactMessageTableCommand;
