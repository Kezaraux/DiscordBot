import { Listener } from "discord-akairo";

import log, { logObj } from "../utils/logger";
import { getReactionRole } from "../utils/database";
import ResourceStrings from "../utils/ResourceStrings.json";

const event = "messageReactionAdd";

class MessageReactionAddListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(msgReact, user) {
        if (user.bot) {
            return;
        }
        const reactionRole = getReactionRole.get(msgReact.message.id, msgReact.emoji.name);
        if (!reactionRole) {
            log(ResourceStrings.error_react_msg_or_emoji);
            logObj(ResourceStrings.emoji_not_found_is, msgReact.emoji);
            return;
        }
        msgReact.message.guild
            .fetchMember(user)
            .then(mem => mem.addRole(reactionRole.role_id))
            .catch(e => {
                msgReact.message.channel.send(ResourceStrings.error_missing_permissions);
                logObj(ResourceStrings.error_failed_to_apply_role, e);
            });
    }
}

export default MessageReactionAddListener;
