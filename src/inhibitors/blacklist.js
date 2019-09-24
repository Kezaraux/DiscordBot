import { Inhibitor } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super("blacklist", {
      reason: "blacklist"
    });
    log("BlacklistInhibitor created");
  }

  exec(message) {
    const blacklist = config.get("bot.blacklistedUsers");
    return blacklist.includes(message.author.id);
  }
}

export default BlacklistInhibitor;
