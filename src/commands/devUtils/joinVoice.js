import { Command } from "discord-akairo";
import config from "config";

import log from "../../utils/logger";
import { joinVoiceChannel } from "../../utils/discord-helpers";

const command = "joinVoice";
const aliases = [command, "join", "jv", "j"];
const category = "devUtils";

class JoinVoiceCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category
        });
        log(`${command}Command created`);
    }

    async exec(message) {
        return message.channel.send(await joinVoiceChannel(message, this.client.store));
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

export default JoinVoiceCommand;
