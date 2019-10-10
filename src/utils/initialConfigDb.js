import log from "./logger";

const setupInitialGuildConfig = (db, guildId, initialConfig) => {
  const tableExists = db
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guild_config'"
    )
    .get();
  log("\tChecking guild config table");
  if (!tableExists["count(*)"]) {
    const configTable = db
      .prepare(
        "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guild_config';"
      )
      .get();
    log("\tChecking guild config table");
    if (!configTable["count(*)"]) {
      log("\tNo guild config table present, initializing");
      db.prepare(
        "CREATE TABLE guild_config (guild_id TEXT PRIMARY KEY, config TEXT);"
      ).run();
      db.prepare(
        "CREATE UNIQUE INDEX idx_config_id on guild_config (guild_id);"
      ).run();
      db.pragma("synchronous = 1");
      db.pragma("journal_mode = wal");
      log("\tGuild config table established");
    }

    log(`Establishing default config for guild ${guildId}`);
    const defaultConfig = JSON.stringify(initialConfig);
    db.prepare(
      "INSERT OR REPLACE INTO guild_config (guild_id, config) values (@guild_id, @config)"
    ).run({ guild_id: guildId, config: defaultConfig });
    log(`Created default config for guild ${guildId}`);
  }
};

export default setupInitialGuildConfig;
