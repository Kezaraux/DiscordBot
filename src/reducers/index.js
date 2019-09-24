import * as actions from "../actions";
import { combineReducers } from "redux";

const baseConstructState = {
  queue: [],
  volume: 5,
  playing: false,
  textChannel: undefined,
  voiceChannel: undefined,
  connection: undefined,
  dispatcher: undefined,
  currentSong: undefined
};

const songConstruct = (state = baseConstructState, action) => {
  switch (action.type) {
    case actions.ADD_SONG:
      return { ...state, queue: [...state.queue, action.song] };
    case actions.REMOVE_SONG:
      return {
        ...state,
        queue: [...state.queue.filter(song => song.id !== action.songId)]
      };
    case actions.CLEAR_QUEUE:
      return { ...state, queue: [] };
    case actions.SET_VOICE_CHANNEL:
      return { ...state, voiceChannel: action.vc };
    case actions.SET_VOICE_CONNECTION:
      return { ...state, connection: action.connection };
    case actions.SET_TEXT_CHANNEL:
      return { ...state, textChannel: action.tc };
    case actions.SET_VOLUME:
      return { ...state, volume: action.vol };
    case actions.SET_SONG_DISPATCHER:
      return { ...state, dispatcher: action.dispatch };
    case actions.MOVE_TO_NEXT_SONG:
      return {
        ...state,
        currentSong: state.queue[0],
        queue: state.queue.slice(1)
      };
    case actions.CYCLE_PLAYING:
      return { ...state, playing: !state.playing };
    case actions.RESET_SONG_CONSTRUCT:
      return baseConstructState;
    default:
      return state;
  }
};

const errorMessage = (state = null, action) => {
  const { type, error } = action;

  if (type === actions.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return error;
  }

  return state;
};

const rootReducer = combineReducers({
  songConstruct,
  errorMessage
});

export default rootReducer;
