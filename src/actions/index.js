export const RESET_ERROR_MESSAGE = "RESET_ERROR_MESSAGE";
export const resetErrorMessage = () => ({ type: RESET_ERROR_MESSAGE });
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const setErrorMessage = error => ({ type: SET_ERROR_MESSAGE, error });

export const ADD_SONG = "ADD_SONG";
export const addSong = song => ({ type: ADD_SONG, song });
export const REMOVE_SONG = "REMOVE_SONG";
export const removeSong = songId => ({ type: REMOVE_SONG, songId });
export const CLEAR_QUEUE = "CLEAR_QUEUE";
export const clearQueue = () => ({ type: CLEAR_QUEUE });
export const SET_VOLUME = "SET_VOLUME";
export const setVolume = vol => ({ type: SET_VOLUME, vol });
export const SET_SONG_DISPATCHER = "SET_SONG_DISPATCHER";
export const setSongDispatcher = dispatch => ({
    type: SET_SONG_DISPATCHER,
    dispatch
});
export const MOVE_TO_NEXT_SONG = "MOVE_TO_NEXT_SONG";
export const moveToNextSong = () => ({ type: MOVE_TO_NEXT_SONG });
export const CYCLE_PLAYING = "CYCLE_PLAYING";
export const cyclePlaying = () => ({ type: CYCLE_PLAYING });
export const RESET_SONG_CONSTRUCT = "RESET_SONG_CONSTRUCT";
export const resetSongConstruct = () => ({ type: RESET_SONG_CONSTRUCT });

export const SET_VOICE_CONNECTION = "SET_VOICE_CONNECTION";
export const setVoiceConnection = connection => ({
    type: SET_VOICE_CONNECTION,
    connection
});
export const SET_VOICE_CHANNEL = "SET_VOICE_CHANNEL";
export const setVoiceChannel = vc => ({ type: SET_VOICE_CHANNEL, vc });
export const SET_TEXT_CHANNEL = "SET_TEXT_CHANNEL";
export const setTextChannel = tc => ({ type: SET_TEXT_CHANNEL, tc });

export const LOAD_GUILD_CONFIGS = "LOAD_GUILD_CONFIGS";
export const loadGuildConfigs = () => ({ type: LOAD_GUILD_CONFIGS });
export const UPDATE_GUILD_CONFIG = "UPDATE_GUILD_CONFIG";
export const updateGuildConfig = newCfg => ({
    type: UPDATE_GUILD_CONFIG,
    newCfg
});
export const DELETE_GUILD_CONFIG = "DELETE_GUILD_CONFIG";
export const deleteGuildConfig = guild_id => ({
    type: DELETE_GUILD_CONFIG,
    guild_id
});
