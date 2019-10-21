import * as songConstruct from "./songConstruct";
import * as config from "./config";

export const getError = state => state.error;

export const getSongConstruct = state => state.songConstruct;
export const getSongQueue = state => songConstruct.getSongQueue(state.songConstruct);
export const getVoiceConnection = state => songConstruct.getVoiceConnection(state.songConstruct);
export const getVoiceChannel = state => songConstruct.getVoiceChannel(state.songConstruct);
export const getTextChannel = state => songConstruct.getTextChannel(state.songConstruct);
export const getVolume = state => songConstruct.getVolume(state.songConstruct);
export const getCurrentSong = state => songConstruct.getCurrentSong(state.songConstruct);
export const getPlaying = state => songConstruct.getPlaying(state.songConstruct);
export const getSongDispatcher = state => songConstruct.getSongDispatcher(state.songConstruct);

export const getGuildConfig = (state, guild_id) => config.getGuildConfig(state.configs_by_guild_id, guild_id);
