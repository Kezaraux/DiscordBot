import { Command } from "discord-akairo";
import config from "config";

import log from "../../utils/logger";
import { leaveVoiceChannel } from "../../utils/discord-helpers";

const command = "leaveVoice";
const aliases = [command, "leave", "lv"];
const category = "devUtils";

class LeaveVoiceCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category
        });
        log(`${command}Command created`);
    }

    async exec(message) {
        return message.channel.send(leaveVoiceChannel(message, this.client.store));
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

export default LeaveVoiceCommand;
