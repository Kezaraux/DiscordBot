import { Listener } from "discord-akairo";

import log from "../utils/logger";
import { getReactionRole } from "../utils/database";
import ResourceStrings from "../utils/ResourceStrings.json";

const event = "messageReactionRemove";
class MessageReactionRemoveListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(msgReact, user) {
        const emoji = msgReact.message.guild.emojis.find(e => e.id === msgReact.emoji.id);
        const reactionRole = getReactionRole.get(
            msgReact.message.id,
            emoji ? `<:${emoji.name}:${emoji.id}>` : msgReact.emoji.name
        );
        if (!reactionRole) {
            log(ResourceStrings.error_react_msg_or_emoji + ResourceStrings.warn_bot_removing_reactions);
            return;
        }
        msgReact.message.guild
            .fetchMember(user)
            .then(mem => mem.removeRole(reactionRole.role_id))
            .catch(e => {
                msgReact.message.channel.send(ResourceStrings.error_missing_permissions);
                logObj(ResourceStrings.error_failed_to_apply_role, e);
            });
    }
}

export default MessageReactionRemoveListener;
