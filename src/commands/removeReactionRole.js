import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "removeReactionRole";
const aliases = [command, "rrr"];
const category = "reactRoles";

class RemoveReactionRoleCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      args: [
        { id: "message", type: "string" },
        { id: "reaction", type: "string" }
      ]
    });
    log(`${command}Command created`);
  }

  async exec(message, args) {
    // Get the reaction message from DB
    const messageObj = this.client.getReactMessage.get(
      args.message,
      message.guild.id
    );
    if (!messageObj) {
      return message.channel.send(
        "Are you sure you gave the correct message ID?"
      );
    }

    // Get the channel the message is located in
    const channel = message.guild.channels.find(
      c => c.id === messageObj.channel
    );
    if (!channel) {
      return message.channel.send(
        "Didn't find the channel for the message, this should never happen unless the channel was deleted."
      );
    }

    // Ensure the reaction message is cached by the bot so we can work with it
    const reactMsg = await channel
      .fetchMessage(messageObj.message)
      .catch(console.error);
    if (!reactMsg) {
      return message.channel.send(
        "Did not find the message in the channel. Was it deleted?"
      );
    }

    // Get the reaction role that we want to work with
    const reactRole = this.client.getReactionRole.get(
      messageObj.message,
      args.reaction
    );
    if (!reactRole) {
      return message.channel.send(
        `Couldn't find the react role with the ${args.reaction} for the message.`
      );
    }

    // Get the actual role on the guild side of things
    const role = message.guild.roles.find(r => r.id === reactRole.role_id);
    if (!role) {
      return message.channel.send(
        "We couldn't find the role for the react message, was it deleted?"
      );
    }

    // Remove all reactions from the message
    // Remove the role from all users
    const reactionOnMessage = reactMsg.reactions.find(
      r => r.emoji.name === reactRole.reaction_identifier
    );
    log("About to attempt to remove reactions, ignore warnings");
    reactionOnMessage.users.forEach(async u => {
      reactionOnMessage.remove(u);
      const guildMem = await message.guild.fetchMember(u);
      !guildMem
        ? log("Tried to grab a user to remove role, couldn't find them.")
        : guildMem.removeRole(role);
    });

    this.client.removeReactionRole.run(`${message.guild.id}-${role.id}`);
    return message.channel.send(
      `${args.reaction} has been removed from the specified message.`
    );
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${command} <message id> <reaction/emoji>`,
  aliases,
  blurb:
    "This command adds a reaction associated to a role on " +
    "a specified message. Make sure that message has been " +
    "established for reaction roles or this will fail."
};

export default RemoveReactionRoleCommand;
