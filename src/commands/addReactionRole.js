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

  async exec(message, args) {
    //console.log({message, args});
    console.log({args});

    const messageObj = this.client.getReactMessage.get(args.message, message.guild.id);
    console.log({messageObj});
    const channel = message.guild.channels.find(c => c.id === messageObj.channel);
    if (!channel) {
      return message.channel.send("Didn't find the channel for the message, this should never happen.");
    }
    const reactMsg = await channel.fetchMessage(messageObj.message).catch(console.error);
    if (!reactMsg) {
      return message.channel.send("Did not find the message in the channel. Was it deleted?");
    }

    // const reaction = message.guild.emojis.find(e => e.identifier === args.reaction.id);
    // console.log({reaction});
    // if (!reaction) {
    //   return message.channel.send("Please be sure to add a reaction to be used!");
    // }

    const role = message.guild.roles.find(r => r.id === args.role) || message.mentions.roles.first();
    if (!role) {
      return message.channel.send("We couldn't find that role, make sure you gave the proper id or mentioned it!");
    }

    const data = {
      id: `${message.guild.id}-${role.id}`,
      react_message_id: `${reactMsg.id}`,
      reaction_identifier: args.reaction,
      role_id: role.id
    }

    reactMsg.react(args.reaction);
    this.client.addReactionRole.run(data);
    return message.channel.send(`${args.reaction} has been set as a trigger for @${role.name} on the specified message.`);
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command} <message id> <reaction/emoji> <role>`,
  aliases,
  blurb:
    "A basic command to see if the bot works!" +
    "\nThe bot will respond with 'Pong!'"
};

export default AddReactionRoleCommand;
