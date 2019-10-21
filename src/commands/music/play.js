import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../../utils/logger";
import { constructSong, queueSong } from "../../utils/music-helpers";
import { joinVoiceChannel } from "../../utils/discord-helpers";

const command = "play";
const aliases = [command, "p"];
const category = "music";

class PlayCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [{ id: "song", type: "string" }]
        });
        log(`${command}Command created`);
    }

    async exec(message, args) {
        if (args.song) {
            // Queue the song
            const builtSong = await constructSong(args.song);
            if (builtSong) {
                message.channel.send(queueSong(builtSong, this.client.store));
            } else {
                return message.channel.send(sprintf(ResourceStrings.error_item_not_valid, "URL"));
            }
        }

        // Start playing the queue
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

export default PlayCommand;
