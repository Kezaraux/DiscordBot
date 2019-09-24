import * as songConstruct from "./songConstruct";

export const getError = state => state.error;

export const getSongConstruct = state => state.songConstruct;
export const getSongQueue = state =>
  songConstruct.getSongQueue(state.songConstruct);
export const getVoiceConnection = state =>
  songConstruct.getVoiceConnection(state.songConstruct);
export const getVoiceChannel = state =>
  songConstruct.getVoiceChannel(state.songConstruct);
export const getTextChannel = state =>
  songConstruct.getTextChannel(state.songConstruct);
export const getVolume = state => songConstruct.getVolume(state.songConstruct);
export const getCurrentSong = state =>
  songConstruct.getCurrentSong(state.songConstruct);
export const getPlaying = state =>
  songConstruct.getPlaying(state.songConstruct);
