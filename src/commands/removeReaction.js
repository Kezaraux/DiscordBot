import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log, { logObj } from "../utils/logger";
import {
    getReactMessage,
    getReactionRolesForMessage,
    removeReactMessage,
    removeReactionRole
} from "../utils/database";
import ResourceStrings from "../utils/ResourceStrings.json";

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
        const dbReactMessage = getReactMessage.get(args.messageId, message.guild.id);
        if (!dbReactMessage) {
            return message.channel.send(ResourceStrings.error_no_db_entry);
        }

        const channel = message.guild.channels.find(c => c.id === dbReactMessage.channel);
        if (!channel) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found, "channel"));
        }
        const reactMessage = await channel.fetchMessage(args.messageId);
        if (!reactMessage) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found, "message"));
        }

        const dbReactionRolesForMessage = getReactionRolesForMessage.all(args.messageId);

        for (let i = 0; i < dbReactionRolesForMessage.length; i++) {
            const reaction = dbReactionRolesForMessage[i];
            const role = message.guild.roles.find(role => role.id === reaction.role_id);
            if (!role) {
                log(`\t${sprintf(ResourceStrings.error_role_delete, reaction.reaction_identifier)}`);
                removeReactionRole.run(reaction.id);
                continue;
            }
            const reactionOnMessage = reactMessage.reactions.find(
                r => r.emoji.name === reaction.reaction_identifier
            );
            if (!reactionOnMessage) {
                log(`\t${ResourceStrings.error_reaction_not_found}`);
                removeReactionRole.run(reaction.id);
                continue;
            }
            reactionOnMessage.users.forEach(async user => {
                reactionOnMessage.remove(user);
                const guildMem = await message.guild.fetchMember(user);
                !guildMem
                    ? log(
                          `\t${sprintf(
                              ResourceStrings.error_user_not_in_guild,
                              u.username,
                              message.guild.id
                          )}`
                      )
                    : guildMem.removeRole(role);
            });
            log(`\t${sprintf(ResourceStrings.db_remove_item, "reaction role", reaction.id)}`);
            removeReactionRole.run(reaction.id);
        }

        removeReactMessage.run(dbReactMessage.id);
        log(`${ResourceStrings.reaction_message_deleted} Reaction message of id ${dbReactMessage.id}`);

        return message.channel.send(ResourceStrings.reaction_message_deleted);
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command} <message id>`,
    aliases,
    category,
    blurb:
        "Removes all roles from users that have reacted to the message " +
        "and removes all database associations."
};

export default RemoveReactionCommand;
