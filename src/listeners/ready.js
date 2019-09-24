import { Listener } from "discord-akairo";

import log from "../utils/logger";

class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      eventName: "ready"
    });

    log("ReadyListener created");
  }

  exec() {
    log("The bot is ready to go!");
  }
}

export default ReadyListener;
