import { Listener } from "discord-akairo";

import log from "../utils/logger";

class MessageReactionAddListener extends Listener {
  constructor() {
    super("messageReactionAdd", {
      emitter: "client",
      eventName: "messageReactionAdd"
    });

    log("RawListener created");
  }

  exec(msgReact) {
    //console.log(msgReact);
    console.log(msgReact.emoji.identifier);
    console.log(msgReact.message.author.username);
  }
}

export default MessageReactionAddListener;
