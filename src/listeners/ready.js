import { Listener } from "discord-akairo";
import config from "config";

import log from "../utils/logger";

const wait = require("util").promisify(setTimeout);

class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      eventName: "ready"
    });

    log("ReadyListener created");
  }

  exec() {
    const sql = this.client.db;

    log("Bot has started, assessing database status");
    if (config.get("features.score")) {
      const scoreTable = sql
        .prepare(
          "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';"
        )
        .get();
      log("Checking score table");
      if (!scoreTable["count(*)"]) {
        log("No score table present, initializing");
        sql
          .prepare(
            "CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);"
          )
          .run();
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("Score table established");
      }
      this.client.getScore = sql.prepare(
        "SELECT * FROM scores WHERE user = ? AND guild = ?"
      );
      this.client.setScore = sql.prepare(
        "INSERT OR REPLACE INTO scores (id, user, guild, points, level) values (@id, @user, @guild, @points, @level);"
      );
      log("Score database usage statements ready");
    }

    if(config.get("features.reactRoles")) {
      const messageTable = sql
        .prepare(
          "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'reaction_messages';"
        )
        .get();
      log("Checking message table");
      if (!messageTable["count(*)"]) {
        log("No message table present, initializing");
        sql
          .prepare(
            "CREATE TABLE reaction_messages (id TEXT PRIMARY KEY, message TEXT, channel TEXT, guild TEXT);"
          )
          .run();
        sql
          .prepare(
            "CREATE UNIQUE INDEX idx_messages_id on reaction_messages (id);"
          )
          .run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("Message table established");
      }
      this.client.addReactMessage = sql.prepare(
        "INSERT OR REPLACE INTO reaction_messages (id, message, channel, guild) values (@id, @message, @channel, @guild);"
      );
      this.client.getReactMessage = sql.prepare(
        "SELECT * FROM reaction_messages WHERE message = ? AND guild = ?"
      );
      this.client.getAllReactMessages = sql.prepare(
        "SELECT * FROM reaction_messages"
      );
      this.client.removeReactMessage = sql.prepare(
        "DELETE FROM reaction_messages WHERE id = :id;"
      );
      log("Reaction messages table usage statements ready");
    }

    log("Database is good to go");

    log("Waiting to cache server invites");
    wait(1000);
    log("Caching server invites");

    this.client.invites = {};
    this.client.guilds.forEach(g => {
      g.fetchInvites().then(invs => {
        this.client.invites[g.id] = invs;
      });
    });

    log("Server invites are cached");
  }
}

export default ReadyListener;
