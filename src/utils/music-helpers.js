import ytdl from "ytdl-core";
import md5 from "md5";

import ResourceStrings from "./ResourceStrings.json";

const youtubeRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

export const constructSong = async song => {
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

export const queueSong = (song, store) => {
    store.dispatch(addSong(song));
    return ResourceStrings.song_added;
};
