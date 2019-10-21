import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../../utils/logger";
import {
    getReactMessage,
    addReactionRole,
    getReactionRoleByMessageAndRole,
    getReactionRoleByMessageAndIdentifier
} from "../../utils/database";
import ResourceStrings from "../../utils/ResourceStrings.json";

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
        const messageObj = getReactMessage.get(args.message, message.guild.id);
        if (!messageObj) {
            return message.channel.send(ResourceStrings.error_incorrect_message_id);
        }

        const channel = message.guild.channels.find(c => c.id === messageObj.channel);
        if (!channel) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_deleted, "channel"));
        }
        const reactMsg = await channel.fetchMessage(messageObj.message).catch(console.error);
        if (!reactMsg) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_deleted, "message"));
        }

        const role = message.guild.roles.find(r => r.id === args.role) || message.mentions.roles.first();
        if (!role) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_params, "role"));
        }

        const reactRoleByRole = getReactionRoleByMessageAndRole.get(reactMsg.id, role.id);
        if (reactRoleByRole) {
            return message.channel.send(ResourceStrings.error_reaction_for_role_on_message);
        }

        const reactRoleByReaction = getReactionRoleByMessageAndIdentifier.get(reactMsg.id, args.reaction);
        if (reactRoleByReaction) {
            return message.channel.send(ResourceStrings.error_reaction_for_identifier_on_message);
        }

        const data = {
            id: `${message.guild.id}-${role.id}`,
            react_message_id: `${reactMsg.id}`,
            reaction_identifier: args.reaction,
            role_id: role.id
        };

        reactMsg.react(args.reaction);
        addReactionRole.run(data);
        return message.channel.send(sprintf(ResourceStrings.reaction_set_for_role, args.reaction, role.name));
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command} <message id> <reaction/emoji> <role>`,
    aliases,
    category,
    blurb:
        "This command adds a reaction associated to a role on " +
        "a specified message. Make sure that message has been " +
        "established for reaction roles or this will fail."
};

export default AddReactionRoleCommand;
