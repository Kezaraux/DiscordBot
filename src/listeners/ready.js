import { Listener } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getAllReactMessages, getGuildConfig, saveGuildConfig } from "../utils/database";
import { loadGuildConfigs } from "../actions";
import ResourceStrings from "../utils/ResourceStrings.json";

const defaultConfig = require("../../config/initialDbConfig.json");
const wait = require("util").promisify(setTimeout);

const event = "ready";

class ReadyListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    async exec() {
        log(ResourceStrings.info_ready_hit);

        log(ResourceStrings.info_check_config);
        this.client.guilds.forEach(g => {
            const config = getGuildConfig.get(g.id);
            if (!config) {
                log(sprintf(ResourceStrings.info_no_config, g.id));
                saveGuildConfig.run({
                    guild_id: g.id,
                    config: JSON.stringify(defaultConfig)
                });
            }
        });
        this.client.store.dispatch(loadGuildConfigs());
        log(ResourceStrings.info_done_configs);

        if (config.get("features.reactRoles")) {
            log(ResourceStrings.info_refreshing_react_msgs);
            const reactMessages = getAllReactMessages.all();
            for (const rm of reactMessages) {
                const guild = this.client.guilds.find(g => g.id === rm.guild);
                if (!guild) {
                    log(ResourceStrings.error_guild_for_react_msg);
                } else {
                    const channel = guild.channels.find(c => c.id === rm.channel);
                    if (!channel) {
                        log(sprintf(ResourceStrings.error_item_not_found_deleted, "channel for a message"));
                        log("DEV WORK HERE IN THE FUTURE?");
                        //Possibly delete the react stuff since it no longer exists?
                        continue;
                    }
                    await channel.fetchMessage(rm.message).catch(console.error);
                    log(sprintf(ResourceStrings.info_fetched_msg, rm.message));
                }
            }
        }

        log(ResourceStrings.info_waiting_to_cache);
        wait(1000);
        log(ResourceStrings.info_starting_cache);

        this.client.invites = {};
        this.client.guilds.forEach(g => {
            g.fetchInvites().then(invs => {
                this.client.invites[g.id] = invs;
            });
        });

        log(ResourceStrings.info_cached);
        log(ResourceStrings.info_ready_completed);
    }
}

export default ReadyListener;
