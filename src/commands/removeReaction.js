import { Command } from "discord-akairo";
import config from "config";

import log, { logObj } from "../utils/logger";

const command = "removeReaction";
const aliases = [command, "removeReact", "remR", "rr", "delReact"];
const category = "reactRoles";

class RemoveReactionCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      args: [{ id: "messageId", type: "string" }]
    });
    log(`${command}Command created`);
  }

  async exec(message, args) {
    const dbReactMessage = this.client.getReactMessage.get(
      args.messageId,
      message.guild.id
    );
    if (!dbReactMessage) {
      return message.channel.send(
        "I couldn't find an entry in the database for that message."
      );
    }

    const channel = message.guild.channels.find(
      c => c.id === dbReactMessage.channel
    );
    if (!channel) {
      return message.channel.send("I couldn't find the channel you specified!");
    }
    const reactMessage = await channel.fetchMessage(args.messageId);
    if (!reactMessage) {
      return message.channel.send(
        "I couldn't find the message in the channel you specified!"
      );
    }

    const dbReactionRolesForMessage = this.client.getReactionRolesForMessage.all(
      args.messageId
    );

    for (let i = 0; i < dbReactionRolesForMessage.length; i++) {
      const reaction = dbReactionRolesForMessage[i];
      const role = message.guild.roles.find(
        role => role.id === reaction.role_id
      );
      if (!role) {
        log(
          `\tIt appears that the role associated with ${reaction.reaction_identifier} has been deleted`
        );
        this.client.removeReactionRole.run(reaction.id);
        continue;
      }
      const reactionOnMessage = reactMessage.reactions.find(
        r => r.emoji.name === reaction.reaction_identifier
      );
      if (!reactionOnMessage) {
        log(
          "\tThe reaction couldn't be found on the message, we're they all removed?"
        );
        this.client.removeReactionRole.run(reaction.id);
        continue;
      }
      reactionOnMessage.users.forEach(async user => {
        reactionOnMessage.remove(user);
        const guildMem = await message.guild.fetchMember(user);
        !guildMem
          ? log(
              `\tAttempted to grab user ${u.username}, but they aren't on this guild`
            )
          : guildMem.removeRole(role);
      });
      log(`\tRemoving reaction role of id ${reaction.id} from the database`);
      this.client.removeReactionRole.run(reaction.id);
    }

    this.client.removeReactMessage.run(dbReactMessage.id);
    log(
      `The reaction message of id ${dbReactMessage.id} and all its roles have been deleted`
    );

    return message.channel.send(
      "The reaction message and all associated reaction roles have been deleted."
    );
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${command} <message id>`,
  aliases,
  blurb:
    "Removes all roles from users that have reacted to the message " +
    "and removes all database associations."
};

export default RemoveReactionCommand;
