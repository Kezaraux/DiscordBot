import { Command } from "discord-akairo";
import config from "config";
import { RichEmbed } from "discord.js";
import { sprintf } from "sprintf-js";

import log from "../../utils/logger";
import { addSong, removeSong, clearQueue } from "../../actions";
import { getSongQueue } from "../../selectors";
import ResourceStrings from "../../utils/ResourceStrings.json";
import { constructSong, queueSong } from "../../utils/music-helpers";

const command = "queue";
const aliases = [command, "q"];
const category = "music";

class QueueCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [{ id: "cmd", type: "string", default: "list" }, { id: "song", type: "string" }]
        });
        log(`${command}Command created`);
    }

    async exec(message, args) {
        switch (args.cmd.toLowerCase()) {
            case "list":
                const returnMsg = await constructQueueMessage(this.client.store);
                return message.channel.send(returnMsg);
            case "add":
                const builtSong = await constructSong(args.song);
                return builtSong
                    ? message.channel.send(queueSong(builtSong, this.client.store))
                    : message.channel.send(sprintf(ResourceStrings.error_item_not_valid, "URL"));
            case "remove":
                return message.channel.send(removeSongFromQueue(constructSong(args.song, this.client.store)));
            case "clear":
                return message.channel.send(clearSongQueue(this.client.store));
            default:
                return message.channel.send(ResourceStrings.unknown_sub_cmd);
        }
    }
}

//Queue command utils
const removeSongFromQueue = (song, store) => {
    if (song) {
        store.dispatch(removeSong(song.id));
        return ResourceStrings.song_removed;
    } else {
        return sprintf(ResourceStrings.error_item_not_valid, "URL");
    }
};

const clearSongQueue = store => {
    store.dispatch(clearQueue);
    return ResourceStrings.queue_cleared;
};

const constructQueueMessage = store => {
    const queue = getSongQueue(store.getState());
    const queueEmbed = new RichEmbed().setTitle(ResourceStrings.current_queue).setColor("GREEN");
    if (!queue.length) {
        return queueEmbed.addField(ResourceStrings.nothing, ResourceStrings.out_of_songs);
    }
    queue.forEach((song, i) => {
        queueEmbed.addField(`${i + 1}) ${song.title}`, `${song.url}`);
    });
    return queueEmbed;
};

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command} <list/add/remove/clear> [song]`,
    aliases,
    category,
    blurb:
        "A command to manipulate the song queue." +
        "Can be used to add, remove, and clear the queue." +
        "Use 'list' to display the entire song queue." +
        "Use add with a youtube url to add a song to the queue." +
        "Use remove with a youtube url to remove all instances of that song from the queue." +
        "Use clear to wipe the queue entirely."
};

export default QueueCommand;
