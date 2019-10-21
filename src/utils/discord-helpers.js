import long from "long";

import { permissions } from "./constants";
import { getVoiceConnection } from "../selectors";
import ResourceStrings from "./ResourceStrings.json";

export const getDefaultChannel = guild => {
    // Original default channel
    if (guild.channels.has(guild.id)) {
        return guild.channels.get(guild.id);
    }

    // General channel
    const generalChannel = guild.channels.find(c => c.name === "general");
    if (generalChannel) {
        return generalChannel;
    }

    // Find the highest text channel the bot can talk in
    return guild.channels.filter(
        c =>
            c.type === "text" &&
            c
                .permissionsFor(guild.client.user)
                .has(permissions.SEND_MESSAGES)
                .sort(
                    (a, b) =>
                        a.position - b.position ||
                        long
                            .fromString(a.id)
                            .sub(long.fromString(b.id))
                            .toNumber()
                )
                .first()
    );
};

export const findChannel = (guild, channelId) => guild.channels.find(c => c.id === channelId);

export const hasPermissionFor = (channel, roleOrMem, perm) => channel.permissionsFor(roleOrMem).has(perm);

export const isUserInVoiceChannel = msg => {
    return Boolean(msg.member.voiceChannel);
}

export const isBotInVoiceChannel = store => {
    return Boolean(getVoiceConnection(store.getState()));
}

export const joinVoiceChannel = async (msg, store, user) => {
    if (getVoiceConnection(store.getState())) {
        return ResourceStrings.error_already_in_voice
    }

    const vc = msg.member.voiceChannel;
    if (!vc) {
        return ResourceStrings.error_not_in_voice;
    }

    const botGuildMem = await msg.guild.fetchMember(user);
    const thing = msg.client.user;
    const perms = vc.permissionsFor(thing);
    if (!perms.has(permissions.CONNECT) || !perms.has(permissions.SPEAK)) {
        console.log("THIS IS HAPPENING");
        return ResourceStrings.error_perms_to_join_and_speak;
    }

    return "Boop";
}