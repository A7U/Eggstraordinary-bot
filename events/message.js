const Discord = require('discord.js');
const mysql = require("mysql");
let prefix = 'e!'
const db = require("../db").database;

// Database connection
let egg = mysql.createPool({
	host: db.host,
	user: db.user,
	password: db.password,
	database: db.database
});

module.exports = async (client, message) => {

	// Make sure user is not a bot, and commands are not run in DMs
	if (!message.guild) return;
	if (message.author.bot) return;

	const guild = message.guild.id;

	// Prefix Handler & Leveling run & Command run
	egg.query(`SELECT * FROM prefix WHERE guild = ${guild}`, async (err, rows) => {
		if (err) throw err;
		if (rows.length !== 0) {
			prefix = rows[0].prefix;
		} else {
			prefix = 'e!'
		}
		let regex = new RegExp(`^<@!?${client.user.id}>( |)$`);
		if (regex.test(message.content)) return message.member.send(`Prefix: \`${prefix}\` - use \`${prefix}help\` for more information`).catch(() => message.channel.send(`Prefix: \`${prefix}\` - use \`${prefix}help\` for more information`));

		if (!message.content.startsWith(prefix)) {
			// Leveling
			require('./leveling')(message, egg);
		} else {
			if (!message.member) message.member = await message.guild.fetchMember(message);

			const args = message.content.slice(prefix.length).split(/ +/g);
			const cmd = args.shift().toLowerCase();

			if (cmd.length === 0) return;

			try {
				let command = client.commands.get(cmd);
				if (!command) {
					command = client.aliases.get(cmd);
					if(!command) return;
					require("./disabledCmd")(client, message, args, egg, Discord, command);
				} else {
					require("./disabledCmd")(client, message, args, egg, Discord, command);
				}
			} catch (err) {
				console.log(err);
			}
		}
	});
};