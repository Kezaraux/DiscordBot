import { Command } from "discord-akairo";
import config from "config";
import md5 from "md5";
import { RichEmbed } from "discord.js";
import ytdl from "ytdl-core";

import log from "../utils/logger";
import { addSong, removeSong, clearQueue } from "../actions";
import { getSongQueue } from "../selectors";

const command = "queue";
const aliases = [command, "q"];
const category = "music";

class QueueCommand extends Command {
  constructor() {
    super(command, {
      aliases,
      args: [
        { id: "cmd", type: "string", default: "list" },
        { id: "song", type: "string" }
      ]
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
          : message.channel.send("Please provide a proper URL!");
      case "remove":
        return message.channel.send(
          removeSongFromQueue(constructSong(args.song, this.client.store))
        );
      case "clear":
        return message.channel.send(clearSongQueue(this.client.store));
      default:
        return message.channel.send("I didn't understand that sub command!");
    }
  }
}

//Queue command utils
const youtubeRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

const constructSong = async song => {
  if (!youtubeRegex.test(song)) {
    return undefined;
  }
  const songInfo = await ytdl.getBasicInfo(song);
  const hash = md5(song);
  return {
    url: song,
    id: hash,
    title: songInfo.title
  };
};

const queueSong = (song, store) => {
  store.dispatch(addSong(song));
  return "Your song has been added to the queue!";
};

const removeSongFromQueue = (song, store) => {
  if (song) {
    store.dispatch(removeSong(song.id));
    return "All instances of that song have been removed from the queue!";
  } else {
    return "Please provide a proper URL!";
  }
};

const clearSongQueue = store => {
  store.dispatch(clearQueue);
  return "The song queue has been cleared!";
};

const constructQueueMessage = store => {
  const queue = getSongQueue(store.getState());
  const queueEmbed = new RichEmbed()
    .setTitle("Current song queue")
    .setColor("GREEN");
  if (!queue.length) {
    return queueEmbed.addField("Nothing", "We're out of songs!");
  }
  queue.forEach((song, i) => {
    queueEmbed.addField(`${i + 1}) ${song.title}`, `${song.url}`);
  });
  return queueEmbed;
};

export const help = {
  isHidden: config.get(`features.${category}`) || false,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command} <list/add/remove/clear> [song]`,
  aliases,
  blurb:
    "A command to manipulate the song queue." +
    "Can be used to add, remove, and clear the queue." +
    "Use 'list' to display the entire song queue." +
    "Use add with a youtube url to add a song to the queue." +
    "Use remove with a youtube url to remove all instances of that song from the queue." +
    "Use clear to wipe the queue entirely."
};

export default QueueCommand;
