import { Listener } from "discord-akairo";

import log, { logObj } from "../utils/logger";
import { getReactionRole } from "../utils/database";
import ResourceStrings from "../utils/ResourceStrings.json";

class MessageReactionAddListener extends Listener {
    constructor() {
        super("messageReactionAdd", {
            emitter: "client",
            eventName: "messageReactionAdd"
        });

        log("MessageReactionAddListener created");
    }

    exec(msgReact, user) {
        if (user.bot) {
            return;
        }
        const reactionRole = getReactionRole.get(msgReact.message.id, msgReact.emoji.name);
        if (!reactionRole) {
            log("Message not found in DB OR emoji isn't established for message in DB");
            logObj("Emoji not found is:", msgReact.emoji);
            return;
        }
        msgReact.message.guild
            .fetchMember(user)
            .then(mem => mem.addRole(reactionRole.role_id))
            .catch(e => {
                msgReact.message.channel.send(ResourceStrings.error_missing_permissions);
                logObj("Failed to apply role, error:", e);
            });
    }
}

export default MessageReactionAddListener;
