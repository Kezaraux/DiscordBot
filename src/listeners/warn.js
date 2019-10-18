import { Listener } from "discord-akairo";

import log from "../utils/logger";

const event = "warn";

class WarnListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(e) {
        log("WARN");
        console.warn(e);
        if (e.code === 50013) {
            log("SOMETHING");
        }
    }
}

export default WarnListener;
