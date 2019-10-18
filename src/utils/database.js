import SQLite from "better-sqlite3";
import config from "config";

import log from "./logger";

const sql = new SQLite("./bot.db");

log("Assessing database status");
export let getScore;
export let setScore;
if (config.get("features.score")) {
    const scoreTable = sql
        .prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';")
        .get();
    log("\tChecking score table");
    if (!scoreTable["count(*)"]) {
        log("\tNo score table present, initializing");
        sql.prepare(
            "CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);"
        ).run();
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("\tScore table established");
    }
    getScore = sql.prepare(
        "INSERT OR REPLACE INTO scores (id, user, guild, points, level) values (@id, @user, @guild, @points, @level);"
    );
    setScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    log("\tScore database usage statements ready");
}

export let addReactMessage;
export let getReactMessage;
export let getAllReactMessages;
export let removeReactMessage;

export let addReactionRole;
export let getReactionRole;
export let getReactionRoleById;
export let getReactionRoleByMessageAndIdentifier;
export let getReactionRoleByMessageAndRole;
export let getReactionRolesForMessage;
export let removeReactionRole;
export let getAllReactionRoles;
if (config.get("features.reactRoles")) {
    const messageTable = sql
        .prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'reaction_messages';")
        .get();
    log("\tChecking message table");
    if (!messageTable["count(*)"]) {
        log("\tNo message table present, initializing");
        sql.prepare(
            "CREATE TABLE reaction_messages (id TEXT PRIMARY KEY, message TEXT, channel TEXT, guild TEXT);"
        ).run();
        sql.prepare("CREATE UNIQUE INDEX idx_messages_id on reaction_messages (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("\tMessage table established");
    }
    log("\tReaction messages table usage statements ready");

    const roleTable = sql
        .prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'reaction_roles'")
        .get();
    log("\tChecking reaction role table");
    if (!roleTable["count(*)"]) {
        log("\tNo role table present, initializing");
        sql.prepare(
            "CREATE TABLE reaction_roles (id TEXT PRIMARY KEY, react_message_id TEXT, reaction_identifier TEXT, role_id TEXT);"
        ).run();
        sql.prepare("CREATE UNIQUE INDEX idx_react_role_id on reaction_roles (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("\tReaction role table established");
    }

    addReactMessage = sql.prepare(
        "INSERT OR REPLACE INTO reaction_messages (id, message, channel, guild) values (@id, @message, @channel, @guild);"
    );
    getReactMessage = sql.prepare("SELECT * FROM reaction_messages WHERE message = ? AND guild = ?");
    getAllReactMessages = sql.prepare("SELECT * FROM reaction_messages");
    removeReactMessage = sql.prepare("DELETE FROM reaction_messages WHERE id = ?;");

    addReactionRole = sql.prepare(
        "INSERT OR REPLACE INTO reaction_roles (id, react_message_id, reaction_identifier, role_id) values (@id, @react_message_id, @reaction_identifier, @role_id);"
    );
    getReactionRole = sql.prepare(
        "SELECT * FROM reaction_roles WHERE react_message_id = ? AND reaction_identifier = ?"
    );
    getReactionRoleById = sql.prepare("SELECT * FROM reaction_roles WHERE id = ?");
    getReactionRoleByMessageAndRole = sql.prepare(
        "SELECT * FROM reaction_roles WHERE react_message_id = ? AND role_id = ?"
    );
    getReactionRoleByMessageAndIdentifier = sql.prepare(
        "SELECT * FROM reaction_roles WHERE react_message_id = ? AND reaction_identifier = ?"
    );
    getReactionRolesForMessage = sql.prepare("SELECT * FROM reaction_roles WHERE react_message_id = ?");
    removeReactionRole = sql.prepare("DELETE FROM reaction_roles WHERE id = ?;");
    getAllReactionRoles = sql.prepare("SELECT * FROM reaction_roles");

    log("\tReaction role table usage statements ready");
}

log("\tChecking config table");
const configTable = sql
    .prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guild_config'")
    .get();
if (!configTable["count(*)"]) {
    const configTable = sql
        .prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guild_config';")
        .get();
    log("\tChecking guild config table");
    if (!configTable["count(*)"]) {
        log("\tNo guild config table present, initializing");
        sql.prepare("CREATE TABLE guild_config (guild_id TEXT PRIMARY KEY, config TEXT);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_config_id on guild_config (guild_id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        log("\tGuild config table established");
    }
}
export const getAllGuildConfigs = sql.prepare("SELECT * FROM guild_config");
export const getGuildConfig = sql.prepare("SELECT * FROM guild_config WHERE guild_id = ?");
export const saveGuildConfig = sql.prepare(
    "INSERT OR REPLACE INTO guild_config (guild_id, config) values (@guild_id, @config)"
);
export const removeGuildConfig = sql.prepare("DELETE FROM guild_config WHERE guild_id = ?");

log("Database is ready with correct features");

export default sql;
