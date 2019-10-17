import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "ping";
const aliases = [command, "p"];
const category = "default";

class PingCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category
        });
        log(`${command}Command created`);
    }

    exec(message) {
        return message.channel.send("Pong!");
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command}`,
    aliases,
    category,
    blurb: "A basic command to see if the bot works!" + "\nThe bot will respond with 'Pong!'"
};

export default PingCommand;
