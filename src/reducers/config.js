import * as actions from "../actions";
import SQLite from "better-sqlite3";
import config from "config";
const sql = new SQLite("./bot.db");

import setupInitialGuildConfig from "../utils/initialConfigDb";
const initialConfig = require("../../config/initialDbConfig.json");

setupInitialGuildConfig(sql, config.get("setup.guildId"), initialConfig);

const getAllGuildConfigs = sql.prepare("SELECT * FROM guild_config");
const saveGuildConfig = sql.prepare(
  "INSERT OR REPLACE INTO guild_config (guild_id, config) values (@guild_id, @config)"
);

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
    default:
      return state;
  }
};

export default configs_by_guild_id;
