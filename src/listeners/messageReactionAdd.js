import { Listener } from "discord-akairo";

import log from "../utils/logger";

class MessageReactionAddListener extends Listener {
  constructor() {
    super("messageReactionAdd", {
      emitter: "client",
      eventName: "messageReactionAdd"
    });

    log("MessageReactionAddListener created");
  }

  exec(msgReact, user) {
    const reactionRole = this.client.getReactionRole.get(
      msgReact.message.id,
      msgReact.emoji.name
    );
    if (!reactionRole) {
      log(
        "Message not found in DB OR emoji isn't established for message in DB"
      );
      console.log(msgReact.emoji);
      return;
    }
    msgReact.message.guild
      .fetchMember(user)
      .then(mem => mem.addRole(reactionRole.role_id))
      .catch(console.error);
  }
}

export default MessageReactionAddListener;
