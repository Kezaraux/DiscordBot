import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../../utils/logger";
import { addReactMessage } from "../../utils/database";
import ResourceStrings from "../../utils/ResourceStrings";

const command = "setupReaction";
const aliases = [command, "setupReact", "setR", "sr", "doReact"];
const category = "reactRoles";

class SetupReactionCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [{ id: "channel", type: "string" }, { id: "messageId", type: "string" }]
        });
        log(`${command}Command created`);
    }

    async exec(message, args) {
        const channel = message.guild.channels.find(c => c.id === args.channel);
        if (!channel) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_params, "channel"));
        }
        const toBeReactMessage = await channel.fetchMessage(args.messageId);
        if (!toBeReactMessage) {
            return message.channel.send(sprintf(ResourceStrings.error_item_not_found_params), "message");
        }

        const data = {
            id: `${message.guild.id}-${toBeReactMessage.id}`,
            message: toBeReactMessage.id,
            channel: channel.id,
            guild: message.guild.id
        };

        addReactMessage.run(data);
        log(ResourceStrings.db_added_reaction_msg);
        return message.channel.send(ResourceStrings.reaction_message_added);
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
