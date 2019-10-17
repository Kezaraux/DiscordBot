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
        console.warn(e);
    }
}

export default WarnListener;
