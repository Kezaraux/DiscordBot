import { Listener } from "discord-akairo";
import config from "config";

import log from "../utils/logger";
import { getGuildConfig } from "../selectors";

class GuildMemberAddListener extends Listener {
  constructor() {
    super("guildMemberAdd", {
      emitter: "client",
      eventName: "guildMemberAdd"
    });

    log("GuildMemberAddListener created");
  }

  exec(member) {
    // Handle logging new members with invite codes
    member.guild.fetchInvites().then(invs => {
      const config = getGuildConfig(
        this.client.store.getState(),
        member.guild.id
      );
      const newJoinLogChannel = config.newJoinLogChannel || "new-members";

      const oldGuildInvites = this.client.invites[member.guild.id];
      this.client.invites[member.guild.id] = invs;
      const invite = invs.find(i => oldGuildInvites.get(i.code).uses < i.uses);
      const inviter = this.client.users.get(invite.inviter.id);
      const logChannel = member.guild.channels.find(
        channel => channel.name === newJoinLogChannel
      );
      logChannel.send(
        `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}.\nInvite was used ${invite.uses} times since its creation.`
      );
    });
  }
}

export default GuildMemberAddListener;
