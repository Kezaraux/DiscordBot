import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";
import { addReactMessage } from "../utils/database";

const command = "setupReaction";
const aliases = [command, "setupReact", "setR", "sr", "doReact"];
const category = "reactRoles";

class SetupReactionCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      args: [
        { id: "channel", type: "string" },
        { id: "messageId", type: "string" }
      ]
    });
    log(`${command}Command created`);
  }

  async exec(message, args) {
    const channel = message.guild.channels.find(c => c.id === args.channel);
    if (!channel) {
      return message.channel.send("I couldn't find the channel you specified!");
    }
    const toBeReactMessage = await channel.fetchMessage(args.messageId);
    if (!toBeReactMessage) {
      return message.channel.send("I couldn't find the message you specified!");
    }

    const data = {
      id: `${message.guild.id}-${toBeReactMessage.id}`,
      message: toBeReactMessage.id,
      channel: channel.id,
      guild: message.guild.id
    };

    addReactMessage.run(data);
    log("Added reaction message to database");
    return message.channel.send(
      "The message has been added as a reaction message!"
    );
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${command} <channel id> <message id>`,
  aliases,
  category,
  blurb:
    "Reacts to a message with the specified emoji." +
    "Anyone who clicks that reaction will gain the associated role"
};

export default SetupReactionCommand;
