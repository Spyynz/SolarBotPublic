require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const colors = require('colors')
const Canvas = require('canvas')
const spyynz = `347491506187141122`
const notspyynz = `You aren't Spyynz. This is a Spyynz exclusive command.`
const solarcolor = `#fc9a19`
// const red = `#ff0000`
// const green = `#00ff00`
// const blue = `#0000ff`
// const white = `#ffffff`
// const black = `#000000`
const botchannels = [`bot`, `bots`, `command`, `commands`, `bot-commands`, `bot-command`]

function stateErr(eventName) {
    console.log(`An error occurred with the event "${eventName}": ${err}`)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`.yellow)
    // client.user.setActivity(`Solar Client`, {type: "PLAYING"})
    client.user.setStatus('idle')
})
try {
    client.on('message', async (message) => {
        let args = message.content.substring(process.env.PREFIX.length).split(" ");
        if(!message.content.startsWith(process.env.PREFIX)) return;
        if(message.guild === null) return;
        if(message.author.bot) return;
        if (!botchannels.includes(message.channel.name)) {
            if (message.author.id == spyynz) {
                message.channel.send(`Permission Granted.`)
                return;
            }
            else {
                message.channel.send(`oops, use bot channel`)
            }
        }
        else if (botchannels.includes(message.channel.name) || message.author.id == spyynz) {
            switch(args[0]) {
                case 'help':
                    let helpEmbed = new Discord.MessageEmbed()
                    .setColor(solarcolor)
                    .setTitle(`Help`)
                    .setDescription(`The !help command is being worked on at the moment. Try again later...`)
                    message.channel.send(helpEmbed)
                break;
                case 'test':
                    if (message.author.id == spyynz || message.author.id == '774282574276067349') {
                        if (!args[1]) {
                            message.channel.send(`You didn't enter a test option. Here are the current options:\n` + '```\n!test join\n!test message\n```')
                        }
                        else if (args[1] == 'guildMemberAdd' || args[1] == 'join') {
                            client.emit('guildMemberAdd', message.member);
                        }
                        else if (args[1] == 'message') {
                            message.channel.send(`Test!`);
                        }
                        else if (args[1] == `guildMemberRemove` || args[1] == 'leave') {
                            client.emit('guildMemberRemove', message.member);
                        }
                        else {
                            message.channel.send(`I don't know this test command, sorry!`)
                        }
                    }
                    else {
                        message.channel.send(notspyynz)
                    }
                break;
                case 'roleclear':
                    while (message.guild.roles.cache.find(nr => nr.name === 'new role'))
                    message.guild.roles.cache.find(async nr => nr.name === 'new role')
                    .delete()
                    let roleclearEmbed = new Discord.MessageEmbed()
                    .setColor(`#00ff00`)
                    .setTitle(`Roles Cleared`)
                    .setDescription(`Deleted all roles with the name "new role"`)

                    await message.channel.send(roleclearEmbed)
                break;
                // case 'slowmode':
                //     if (message.member.permissions.has("MANAGE_MESSAGES")) {
                //         if (args[1] == Number.isInteger())
                //     }
            }
        }
    })
}
catch(err) {
    stateErr('message')
}

try {
    client.on('guildMemberAdd', async (member) => {
        console.log(`${member.user.tag} joined Solar`)
        const channel = member.guild.channels.cache.find(ch2 => ch2.name === 'welcome')
        const channel2 = member.guild.channels.cache.find(ch2 => ch2.name === 'logs');
        let guildMemberAddEmbed = new Discord.MessageEmbed()
        .setColor(`#00ff00`)
        .setDescription(`**${member.user.tag}** joined the server`)
        
        const canvas = Canvas.createCanvas(800, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Select the font size and type from one of the natively available fonts
        ctx.font = '45px sans-serif';
        // Select the style that will be used to fill the text in
        ctx.fillStyle = '#ffffff';
        // Actually fill the text with a solid color
        ctx.fillText(`Welcome, ${member.displayName}!`, canvas.width / 3.2, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);
        ctx.stroke()

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`Welcome to the server, ${member}!`, attachment);
        channel2.send(guildMemberAddEmbed);
    })
}
catch(err) {
    stateErr('guildMemberAdd')
}
try {
    client.on('guildMemberRemove', async (member) => {
        const channel = member.guild.channels.cache.find(ch2 => ch2.name === 'welcome')
        const channel2 = member.guild.channels.cache.find(ch2 => ch2.name === 'logs');
        let guildMemberRemoveEmbed = new Discord.MessageEmbed()
        .setColor(`#ff0000`)
        .setDescription(`**${member.user.tag}** left the server`)
        channel2.send(guildMemberRemoveEmbed)
        console.log(`${member.user.tag} left Solar`)
    })
}
catch(err) {
    stateErr('guildMemberRemove')
}
try {
    client.on('inviteCreate', async (invite) => {
        const channel = invite.guild.channels.cache.find(ch => ch.name === 'logs');
        let inviteCreateEmbed = new Discord.MessageEmbed()
        .setColor(`#00ff00`)
        .setTitle(`New Event: inviteCreate`)
        .addFields(
            { name: `Link`, value: `${invite}` },
            { name: `Creator`, value: `${invite.inviter.tag}` },
            { name: `Creation Date`, value: `${invite.createdAt}` },
            { name: `Expiration Date`, value: `${invite.expiresAt}` },
            { name: `Maximum Uses`, value: `${invite.maxUses.toString()}` },
            { name: `Maximum Age`, value: `${invite.maxAge.toString()} seconds` },
            { name: `Invitation Code`, value: `${invite.code.toString()}` })
        channel.send(inviteCreateEmbed)
        console.log(`An invite "${invite.code.toString()}" was created by ${invite.inviter.tag}`)
    })
}
catch(err) {
    stateErr('inviteCreate')
}
try {
    client.on('messageDelete', async (message) => {
        const channel = message.guild.channels.cache.find(ch => ch.name === 'logs');
        let messageDeleteEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`New Event: messageDelete`)
        .addFields(
            { name: `Message Content`, value: `${message.content}` },
            { name: `Message Sender`, value: `${message.author.tag}` })
        channel.send(messageDeleteEmbed)
    })
}
catch(err) {
    stateErr('messageDelete')
}

client.login(process.env.TOKEN)