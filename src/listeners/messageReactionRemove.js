import { Listener } from "discord-akairo";

import log from "../utils/logger";
import { getReactionRole } from "../utils/database";

class MessageReactionRemoveListener extends Listener {
    constructor() {
        super("messageReactionRemove", {
            emitter: "client",
            eventName: "messageReactionRemove"
        });

        log("MessageReactionRemoveListener created");
    }

    exec(msgReact, user) {
        const reactionRole = getReactionRole.get(msgReact.message.id, msgReact.emoji.name);
        if (!reactionRole) {
            log(
                "Message not found in DB OR emoji isn't established for message in DB" +
                    "\n\tBot could have deleted a reaction role and is removing reactions."
            );
            return;
        }
        msgReact.message.guild
            .fetchMember(user)
            .then(mem => mem.removeRole(reactionRole.role_id))
            .catch(console.error);
    }
}

export default MessageReactionRemoveListener;
