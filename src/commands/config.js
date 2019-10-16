import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import { updateGuildConfig } from "../actions";

const configKeys = Object.keys(require("../../config/initialDbConfig.json"));

const command = "config";
const aliases = [command, "conf"];
const category = "admin";

class ConfigCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      category,
      args: [
        {
          id: "option",
          type: configKeys,
          prompt: {
            start: message => {
              const guildConfig = getGuildConfig(
                this.client.store.getState(),
                message.guild.id
              );
              const content =
                "Select config option to update from the current config options";
              const embed = new RichEmbed()
                .setTitle(`Config for ${message.guild.name}`)
                .setColor("WHITE");
              for (const [key, val] of Object.entries(guildConfig)) {
                embed.addField(key, `Currently: ${val}`);
              }
              return { embed, content };
            },
            retry: "That wasn't a config option, please choose a valid option!"
          }
        },
        {
          id: "value",
          type: "string",
          prompt: { start: "Please enter the new value." }
        }
      ],
      channelRestriction: "guild"
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
    const oldConfig = getGuildConfig(
      this.client.store.getState(),
      message.guild.id
    );
    const newConfig = { ...oldConfig, [args.option]: args.value };

    this.client.store.dispatch(
      updateGuildConfig({
        guild_id: message.guild.id,
        config: newConfig
      })
    );
    log(`Updated the config for guild ${message.guild.id} to ${args.prefix}`);
    return message.channel.send(
      `I've updated the config for ${args.option} to be ${args.value}`
    );
  }
}

export const help = {
  isEnabled: config.get(`features.${category}`) || true,
  identifier: command,
  usage: `${command}`,
  aliases,
  category,
  blurb: "Use this command to change the config for this guild"
};

export default ConfigCommand;
