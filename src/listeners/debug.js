import { Listener } from "discord-akairo";

import log from "../utils/logger";

const event = "debug";

class DebugListener extends Listener {
  constructor() {
    super(event, {
      emitter: "client",
      eventName: event
    });

    log(`${event}Listener created`);
  }

  exec(e) {
    console.info(e);
  }
}

export default DebugListener;
