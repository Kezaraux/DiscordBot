import { Listener } from "discord-akairo";

import log, { logObj } from "../utils/logger";
import { updateGuildConfig } from "../actions";
const initialConfig = require("../../config/initialDbConfig.json");

const event = "guildCreate";

class GuildCreateListener extends Listener {
  constructor() {
    super(event, {
      emitter: "client",
      eventName: event
    });

    log(`${event}Listener created`);
  }

  exec(guild) {
    log(`Bot has joined guild: ${guild.name}`);
    this.client.store.dispatch(
      updateGuildConfig({ guild_id: guild.id, config: initialConfig })
    );
  }
}

export default GuildCreateListener;
