import { AkairoClient } from "discord-akairo";
import config from "config";

import log, { logObj } from "./utils/logger";
import configureStore from "./utils/store";
import sql, { getGuildConfig } from "./utils/database";

const client = new AkairoClient({
  ownerID: config.get("private.ownerId"),
  prefix: msg => {
    if (msg.guild) {
      const config = getGuildConfig.get(msg.guild.id);
      if (!config) {
        log(
          "Didn't find a config when getting prefix! This should never happen!"
        );
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
