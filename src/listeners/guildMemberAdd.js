import { Listener } from "discord-akairo";
import { sprintf } from "sprintf-js";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";
import ResourceStrings from "../utils/ResourceStrings.json";

const event = "guildMemberAdd";

class GuildMemberAddListener extends Listener {
    constructor() {
        super(event, {
            emitter: "client",
            eventName: event
        });

        log(`${event}Listener created`);
    }

    exec(member) {
        // Handle logging new members with invite codes
        member.guild.fetchInvites().then(invs => {
            const config = getGuildConfig(this.client.store.getState(), member.guild.id);
            const newJoinLogChannel = config.newJoinLogChannel || "new-members";

            const oldGuildInvites = this.client.invites[member.guild.id];
            this.client.invites[member.guild.id] = invs;
            const invite = invs.find(i => oldGuildInvites.get(i.code).uses < i.uses);
            const inviter = this.client.users.get(invite.inviter.id);
            const logChannel = member.guild.channels.find(channel => channel.name === newJoinLogChannel);
            logChannel.send(
                sprintf(
                    ResourceStrings.info_member_joined,
                    member.user.tag,
                    invite.code,
                    inviter.tag,
                    invite.uses
                )
            );
        });
    }
}

export default GuildMemberAddListener;
