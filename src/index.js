import { AkairoClient } from "discord-akairo";
import config from "config";

import log from "./utils/logger";
import configureStore from "./utils/store";

const client = new AkairoClient({
  ownerID: config.get("private.ownerId"),
  prefix: config.get("bot.prefix"),
  commandDirectory: "src/commands",
  inhibitorDirectory: "src/inhibitors",
  listenerDirectory: "src/listeners"
});

client.store = configureStore();

client.login(config.get("private.botKey")).then(() => {
  client.store = configureStore();
  log("Bot has logged in.");
});
