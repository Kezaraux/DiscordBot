import long from "long";

import { permissions } from "./constants";

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
