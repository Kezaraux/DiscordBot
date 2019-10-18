import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getReactMessage, getReactionRole, removeReactionRole } from "../utils/database";
import ResourceStrings from "../utils/ResourceStrings.json";

const command = "removeReactionRole";
const aliases = [command, "rrr"];
const category = "reactRoles";

class RemoveReactionRoleCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [{ id: "message", type: "string" }, { id: "reaction", type: "string" }]
        });
        log(`${command}Command created`);
    }

    async exec(message, args) {
        // Get the reaction message from DB
        const messageObj = getReactMessage.get(args.message, message.guild.id);
        if (!messageObj) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_params, "message"));
        }

        // Get the channel the message is located in
        const channel = message.guild.channels.find(c => c.id === messageObj.channel);
        if (!channel) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_deleted, "channel"));
        }

        // Ensure the reaction message is cached by the bot so we can work with it
        const reactMsg = await channel.fetchMessage(messageObj.message).catch(console.error);
        if (!reactMsg) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_deleted, "message"));
        }

        // Get the reaction role that we want to work with
        const reactRole = getReactionRole.get(messageObj.message, args.reaction);
        if (!reactRole) {
            return message.channel.send(
                sprintf(ResourceStrings.error_reaction_role_not_found, args.reaction)
            );
        }

        // Get the actual role on the guild side of things
        const role = message.guild.roles.find(r => r.id === reactRole.role_id);
        if (!role) {
            return message.channel.send(
                sprintf(ResourceStrings.error_item_not_found_deleted, "role for react message")
            );
        }

        // Remove all reactions from the message
        // Remove the role from all users
        const reactionOnMessage = reactMsg.reactions.find(
            r => r.emoji.name === reactRole.reaction_identifier
        );
        log(ResourceStrings.warn_removing_reactions);
        reactionOnMessage.users.forEach(async u => {
            reactionOnMessage.remove(u);
            const guildMem = await message.guild.fetchMember(u);
            !guildMem
                ? log(sprintf(ResourceStrings.error_item_not_found, "user"))
                : guildMem.removeRole(role);
        });

        removeReactionRole.run(`${message.guild.id}-${role.id}`);
        return message.channel.send(sprintf(ResourceStrings.reaction_role_removed, args.reaction));
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command} <message id> <reaction/emoji>`,
    aliases,
    category,
    blurb:
        "This command adds a reaction associated to a role on " +
        "a specified message. Make sure that message has been " +
        "established for reaction roles or this will fail."
};

export default RemoveReactionRoleCommand;
