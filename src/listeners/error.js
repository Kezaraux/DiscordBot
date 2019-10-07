import { Listener } from "discord-akairo";

import log from "../utils/logger";

const event = "error";

class ErrorListener extends Listener {
  constructor() {
    super(event, {
      emitter: "client",
      eventName: event
    });

    log(`${event}Listener created`);
  }

  exec(e) {
    console.error(e);
  }
}

export default ErrorListener;
