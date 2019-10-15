import { Listener } from "discord-akairo";

import log, { logObj } from "../utils/logger";

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
    // logObj(
    //   "Here are all configs from DB: ",
    //   sql.prepare("SELECT * FROM guild_config").all()
    // );
  }
}

export default GuildCreateListener;
