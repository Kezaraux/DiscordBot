import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "message";
const aliases = [command, "msg", "m"];
const category = "reactRoles";

class MessageCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      split: "quoted",
      args: [
        { id: "channel", type: "string" },
        { id: "message", type: "string" }
      ]
    });
    log(`${command}Command created`);
  }

  exec(message, args) {
    const channel = message.guild.channels.find(c => c.id === args.channel);
    return channel
      ? channel.send(args.message)
      : message.channel.send(
          "I couldn't find that channel! Make sure you put in the channel ID!"
        );
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command} <channel id> "<message content>"`,
  aliases,
  blurb: "Sends a message to the specified channel with the contents"
};

export default MessageCommand;
