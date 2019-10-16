import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import { updateGuildConfig } from "../actions";

const command = "prefix";
const aliases = [command, "pre"];
const category = "admin";

class PrefixCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      args: [{ id: "prefix", type: "string" }]
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

  exec(message, args) {
    if (!args.prefix) {
      return message.channel.send("Please provide a new prefix to change to!");
    }
    const oldConfig = getGuildConfig(
      this.client.store.getState(),
      message.guild.id
    );
    const newConfig = { ...oldConfig, prefix: args.prefix };
    this.client.store.dispatch(
      updateGuildConfig({
        guild_id: message.guild.id,
        config: newConfig
      })
    );
    log(`Updated the prefix for guild ${message.guild.id} to ${args.prefix}`);
    return message.channel.send(
      `Changed the prefix for this server to ${args.prefix}`
    );
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || false,
  identifier: command,
  usage: `${command} <prefix>`,
  aliases,
  category,
  blurb: "A command to change the command prefix for this guild."
};

export default PrefixCommand;
