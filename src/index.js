import { AkairoClient } from "discord-akairo";
import config from "config";

import log from "./utils/logger";
import configureStore from "./utils/store";
import sql from "./utils/database";

const client = new AkairoClient({
  ownerID: config.get("private.ownerId"),
  prefix: msg => {
    if (msg.guild) {
      let getConfig;
      try {
        getConfig = sql.prepare(
          "SELECT config FROM guild_config WHERE guild_id = ?"
        );
      } catch (err) {
        setupInitialGuildConfig(sql, msg.guild.id, initialDbConfig);
        getConfig = sql.prepare(
          "SELECT config FROM guild_config WHERE guild_id = ?"
        );
      }
      const config = getConfig.get(msg.guild.id);
      if (!config) {
        log(
          "Didn't find a config when getting prefix! This should never happen!"
        );
        setupInitialGuildConfig(sql, msg.guild.id, initialDbConfig);
        return initialDbConfig.prefix;
      }
      const configJson = JSON.parse(config.config);
      return configJson.prefix;
    }
  },
  commandDirectory: "src/commands",
  inhibitorDirectory: "src/inhibitors",
  listenerDirectory: "src/listeners"
});

client.store = configureStore();
client.db = sql;

client.login(config.get("private.botKey")).then(() => {
  log("Bot has logged in.");
});
