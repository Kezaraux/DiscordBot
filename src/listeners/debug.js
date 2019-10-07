import { Listener } from "discord-akairo";
import config from "config";

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
    if (config.get("features.debug")) {
      console.info(e);
    }
  }
}

export default DebugListener;
