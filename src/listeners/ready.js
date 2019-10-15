import { Listener } from "discord-akairo";
import config from "config";

import log from "../utils/logger";
import {
  getAllReactMessages,
  getGuildConfig,
  saveGuildConfig
} from "../utils/database";

const defaultConfig = require("../../config/initialDbConfig.json");
const wait = require("util").promisify(setTimeout);

class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      eventName: "ready"
    });

    log("ReadyListener created");
  }

  async exec() {
    log("Ready event hit, doing last preparations");

    log("\tEnsuring a config exists for each guild I'm in");
    this.client.guilds.forEach(g => {
      const config = getGuildConfig.get(g.id);
      if (!config) {
        log(`\tGuild ${g.id} did not have a config, creating one now`);
        saveGuildConfig.run({
          guild_id: g.id,
          config: JSON.stringify(defaultConfig)
        });
      }
    });
    log("\tDone checking configs");

    if (config.get("features.reactRoles")) {
      log("\tRefreshing any old reaction messages");
      const reactMessages = getAllReactMessages.all();
      for (const rm of reactMessages) {
        const guild = this.client.guilds.find(g => g.id === rm.guild);
        if (!guild) {
          log(
            "\tGuild for a react message wasn't found. Was I removed from it?"
          );
        } else {
          const channel = guild.channels.find(c => c.id === rm.channel);
          if (!channel) {
            log("\tI couldn't find the channel for a message, was it deleted?");
            //Possibly delete the react stuff since it no longer exists?
            continue;
          }
          await channel.fetchMessage(rm.message).catch(console.error);
          log(`\tFetched message: ${rm.message}`);
        }
      }
    }

    log("\tWaiting to cache server invites");
    wait(1000);
    log("\tCaching server invites");

    this.client.invites = {};
    this.client.guilds.forEach(g => {
      g.fetchInvites().then(invs => {
        this.client.invites[g.id] = invs;
      });
    });

    log("\tServer invites are cached");
    log("Ready setup completed");
  }
}

export default ReadyListener;
