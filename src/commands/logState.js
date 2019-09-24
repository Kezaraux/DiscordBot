import { Command } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const command = "state";
const aliases = [command, "s"];

class StateCommand extends Command {
  constructor() {
    super(command, {
      aliases
    });
    log("StateCommand created");
  }

  exec(message) {
    console.log(this.client.store.getState());
    return message.channel.send("Logged the state!");
  }
}

export const help = {
  isHidden: true,
  identifier: command,
  usage: `${config.get("bot.prefix")}${command}`,
  aliases,
  blurb: "Logs the current redux state to the console."
};

export default StateCommand;
