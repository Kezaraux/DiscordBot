import { Command } from "discord-akairo";
import { RichEmbed } from "discord.js";
import config from "config";
import { chunk, shuffle, size } from "lodash";

import log from "../utils/logger";
import ResourceStrings from "../utils/ResourceStrings.json";

const command = "teams";
const aliases = [command, "t"];
const category = "default";

class TeamsCommand extends Command {
    constructor() {
        super(command, {
            aliases,
            category,
            args: [
                {
                    id: "numTeams",
                    type: "number",
                    prompt: {
                        start: ResourceStrings.prompt_number_teams,
                        retry: ResourceStrings.prompt_warn_valid_number
                    }
                },
                {
                    id: "players",
                    type: "string",
                    prompt: {
                        start: [ResourceStrings.prompt_team_members, ResourceStrings.prompt_finished],
                        infinite: true
                    }
                }
            ]
        });
        log(`${command}Command created`);
    }

    exec(message, args) {
        console.log(args);
        const rand = shuffle(args.players);
        console.log(rand);
        const teams = chunk(rand, Math.ceil(size(rand) / args.numTeams));
        console.log(teams);
        const teamEmbed = new RichEmbed();
        teamEmbed.setColor("WHITE").setTitle("Random Teams");
        teams.map((team, index) => teamEmbed.addField(`Team ${index + 1}`, team.join("\n"), true));
        message.channel.send(teamEmbed);
    }
}

export const help = {
    isEnabled: config.get(`features.${category}`) || true,
    identifier: command,
    usage: `${command} [number of players]`,
    aliases,
    category,
    blurb:
        "Use this command when you need to make some random teams!\nHaving a number of players divisible by the number of teams is recommended for the best results!"
};

export default TeamsCommand;
