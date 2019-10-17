import { Command } from "discord-akairo";
import config from "config";

import log, { logObj } from "../utils/logger";

const command = "state";
const aliases = [command, "s"];
const category = "devUtils";

class StateCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category
        });
        log(`${command}Command created`);
    }

    exec(message) {
        logObj("Current redux state:", this.client.store.getState());
        return message.channel.send("Logged the state!");
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || false,
    identifier: command,
    usage: `${command}`,
    aliases,
    category,
    blurb: "Logs the current redux state to the console."
};

export default StateCommand;
