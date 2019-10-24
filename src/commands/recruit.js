import { Command } from "discord-akairo";
import config from "config";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import ResourceStrings from "../utils/ResourceStrings.json";

const command = "recruit";
const aliases = [command, "rec"];
const category = "gamingCommunity";

class PingCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [{ id: "member", type: "string" }]
        });
        log(`${command}Command created`);
    }

    exec(message, args) {
        const guildConfig = getGuildConfig(this.client.store.getState(), message.guild.id);
        const recruitRole = message.guild.roles.find(r => r.name === guildConfig.recruiterMin);
        if (!recruitRole) {
            return message.channel.send(ResourceStrings.error_no_recruit_role_found);
        }

        const hasRecruitRole =
            message.member.highestRole.calculatedPosition >= recruitRole.calculatedPosition;
        if (!hasRecruitRole) {
            return message.channel.send(sprintf(ResourceStrings.warn_need_recruit_role, recruitRole.name));
        }

        if (!args.member) {
            return message.channel.send(ResourceStrings.error_need_to_mention_user);
        }

        const guildMember = message.mentions.members.first();
        const memberRole = message.guild.roles.find(r => r.name === guildConfig.memberRole);
        if (!memberRole) {
            return message.channel.send(ResourceStrings.error_no_member_role_found);
        }

        guildMember
            .addRole(memberRole)
            .catch(log(ResourceStrings.error_missing_permissions))
            .finally(() => {
                if (guildMember.roles.find(r => r.name === guildConfig.memberRole)) {
                    message.channel.send(
                        sprintf(ResourceStrings.member_role_added, memberRole.name, guildMember.displayName)
                    );
                } else {
                    message.channel.send(ResourceStrings.error_missing_permissions);
                }
            });
        return;
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command} <user mention>`,
    aliases,
    category,
    blurb:
        "Add the member role to a user in the guild. You must be a specified rank or higher to use this command!"
};

export default PingCommand;
