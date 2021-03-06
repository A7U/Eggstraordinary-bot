module.exports = {
    name: 'inventory',
    aliases: ['inven', 'bag'],
    description: "View your inventory, shows list of items you purchased from the shop",
    category: 'eggs',
    run: async (client, message, args, egg, Discord) => {

        // Table: inventory
        // Content:  userid VARCHAR(255), guild VARCHAR(255), timer bigint, chicken bit, farm bit, frog bit, duck bit

        const guild = message.guild.id;
        const userid = message.author.id;

        if (args[0]) {

            let user = message.mentions.users.first() || message.guild.members.cache.find(u => u.user.username === args[0]);
            if(!user) return;
            
            egg.query(`SELECT * FROM inventory WHERE guild = ${guild} AND userid = ${user.id || user.user.id}`, (err, rows) => {
                if (err) throw err;
                if (rows.length === 0) {
                    message.channel.send(`I think ${user.username || user.user.username} is up to something. He has nothing in his inventory!`).then(m => m.delete({
                        timeout: 5000
                    }));

                } else {

                    if (!rows[0].Chicken && !rows[0].Farm && !rows[0].Duck && !rows[0].Frog) return message.channel.send(`${user.username || user.user.username} has nothing in their inventory!`)

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`${user.username || user.user.username}'s Inventory`)
                        .addFields(
                            !rows[0].Chicken ? [] : {
                                name: '🐔',
                                value: `${rows[0].Chicken}`,
                                inline: true
                            },
                            !rows[0].Farm ? [] : {
                                name: '👩‍🌾',
                                value: rows[0].Farm,
                                inline: true
                            },
                            !rows[0].Duck ? [] : {
                                name: '🦆',
                                value: rows[0].Duck,
                                inline: true
                            },
                            !rows[0].Frog ? [] : {
                                name: '🐸',
                                value: rows[0].Frog,
                                inline: true
                            }
                        )
                        .setColor('YELLOW')
                        .setThumbnail(user.user ? user.user.avatarURL() : user.avatarURL())
                    message.channel.send(embed)
                }
            });
        } else {
            egg.query(`SELECT * FROM inventory WHERE guild = ${guild} AND userid = ${userid}`, (err, rows) => {
                if (err) throw err;
                if (rows.length === 0) {
                    message.reply(`you have nothing in your inventory!`).then(m => m.delete({
                        timeout: 5000
                    }))
                } else {

                    if (!rows[0].Chicken && !rows[0].Farm && !rows[0].Duck && !rows[0].Frog) return message.reply(`you have nothing in your inventory!`)

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`${message.author.username}'s Inventory`)
                        .addFields(
                            !rows[0].Chicken ? [] : {
                                name: '🐔',
                                value: `${rows[0].Chicken}`,
                                inline: true
                            },
                            !rows[0].Farm ? [] : {
                                name: '👩‍🌾',
                                value: rows[0].Farm,
                                inline: true
                            },
                            !rows[0].Duck ? [] : {
                                name: '🦆',
                                value: rows[0].Duck,
                                inline: true
                            },
                            !rows[0].Frog ? [] : {
                                name: '🐸',
                                value: rows[0].Frog,
                                inline: true
                            }
                        )
                        .setColor('YELLOW')
                        .setThumbnail(message.author.avatarURL())
                    message.channel.send(embed)
                }

            });

        }


    }
};