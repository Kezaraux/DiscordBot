import { Listener } from "discord-akairo";

import log from "../utils/logger";

class CommandBlockedListener extends Listener {
  constructor() {
    super("commandBlocked", {
      emitter: "commandHandler",
      eventName: "commandBlocked"
    });

    log("CommandBlockedListener created");
  }

  exec(message, command, reason) {
    log(
      `${message.author.username} was blocked from using ${command.id}.\nReason: ${reason}`
    );
  }
}

export default CommandBlockedListener;
