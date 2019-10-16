import { omit } from "lodash";

import * as actions from "../actions";
import {
  getAllGuildConfigs,
  saveGuildConfig,
  removeGuildConfig
} from "../utils/database";

const allConfigs = getAllGuildConfigs.all();
const baseState = {};
allConfigs.forEach(cf => {
  const cfJson = JSON.parse(cf.config);
  baseState[cf.guild_id] = cfJson;
});

const configs_by_guild_id = (state = baseState, action) => {
  switch (action.type) {
    case actions.LOAD_GUILD_CONFIGS:
      const allConfigs = getAllGuildConfigs.all();
      const newState = {};
      allConfigs.forEach(cf => {
        const cfJson = JSON.parse(cf.config);
        newState[cf.guild_id] = cfJson;
      });
      return newState;
    case actions.UPDATE_GUILD_CONFIG:
      const newCfgStr = JSON.stringify(action.newCfg.config);
      saveGuildConfig.run({
        guild_id: action.newCfg.guild_id,
        config: newCfgStr
      });
      return { ...state, [action.newCfg.guild_id]: action.newCfg.config };
    case actions.DELETE_GUILD_CONFIG:
      removeGuildConfig.run(action.guild_id.guild_id);
      return { ...omit(state, action.guild_id.guild_id) };
    default:
      return state;
  }
};

export default configs_by_guild_id;
