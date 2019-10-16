import { Listener } from "discord-akairo";
import config from "config";

import log from "../utils/logger";
import { getScore, setScore } from "../utils/database";

class MessageReactionAddListener extends Listener {
  constructor() {
    super("message", {
      emitter: "client",
      eventName: "message"
    });
    log("Message listener ready");
  }

  exec(message) {
    if (config.get("features.score")) {
      if (!message.author.bot) {
        log("\tGot message");
        let score = getScore.get(message.author.id, message.guild.id);
        if (!score) {
          score = {
            id: `${message.guild.id}-${message.author.id}`,
            user: message.author.id,
            guild: message.guild.id,
            points: 0,
            level: 1
          };
        }
        // log(`\tScore for ${message.author.username}`);
        // console.log(score);
        score.points++;
        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        if (score.level < curLevel) {
          score.level++;
          message.reply(`You've leveled up to level ${curLevel}! Congrats!`);
        }
        setScore.run(score);
      }
    }
  }
}

export default MessageReactionAddListener;
