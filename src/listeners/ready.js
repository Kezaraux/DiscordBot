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

  async exec() {
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

    if (config.get("features.reactRoles")) {
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

      log("Refreshing any old reaction messages");
      const reactMessages = this.client.getAllReactMessages.all();
      for (const rm of reactMessages) {
        const guild = this.client.guilds.find(g => g.id === rm.guild);
        if (!guild) {
          log("Guild for a react message wasn't found. Was I removed from it?");
        } else {
          const channel = guild.channels.find(c => c.id === rm.channel);
          await channel.fetchMessage(rm.message).catch(console.error);
          log(`Fetched message: ${rm.message}`);
        }
      }

      const roleTable = sql
        .prepare(
          "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'reaction_roles'"
        )
        .get();
      log("Checking reaction role table");
      if (!roleTable["count(*)"]) {
        log("No role table present, initializing");
        sql
          .prepare(
            "CREATE TABLE reaction_roles (id TEXT PRIMARY KEY, react_message_id TEXT, reaction_identifier TEXT, role_id TEXT);"
          )
          .run();
        sql
          .prepare(
            "CREATE UNIQUE INDEX idx_react_role_id on reaction_roles (id);"
          )
          .run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("Reaction role table established");
      }
      this.client.addReactionRole = sql.prepare(
        "INSERT OR REPLACE INTO reaction_roles (id, react_message_id, reaction_identifier, role_id) values (@id, @react_message_id, @reaction_identifier, @role_id);"
      );
      this.client.getReactionRole = sql.prepare(
        "SELECT * FROM reaction_roles WHERE react_message_id = ? AND reaction_identifier = ?"
      );
      this.client.removeReactionRole = sql.prepare(
        "DELETE FROM reaction_roles WHERE id = :id;"
      );
      this.client.getAllReactionRoles = sql.prepare(
        "SELECT * FROM reaction_roles"
      );
      log("Reaction role table usage statements ready");
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
    log("Ready setup completed");
  }
}

export default ReadyListener;
