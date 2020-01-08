const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

var i = 1;
var CN = null;
var person;
var category;
var channelid;

client.once("ready", () => {
    console.log('Ready!');
    client.user.setActivity(`Hammertime`);
});

client.on("message", async message => {

    //if(message.author.bot) return;
    //if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(message.content);
    console.log(message.createdAt)
    console.log(message.author.username + " - " + message.author.id);
    console.log("----------");

    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    if (command === "report") {
        CN = makeChannel(message);
        person = message.author;
        console.log(CN + "-- 2")
        message.channel.send(`---**OK**---`);
        i++;
    }
    if (command === "rc") {
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Staff"].includes(r.name)) )
            return message.reply("No permission.");
        i = 1;
        message.channel.send('Counter reset.');
    }
    if (message.content === `---**OK**---`) {
        info(message,person,CN)
    }
    if (command === "clear"){
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Staff"].includes(r.name)) )
            return message.reply("No permission.");
        var CH = 1;
        while (CH != null){
        CH = message.guild.channels.find(c => c.name.startsWith("report-") && c.type == "category");
        CH.delete();
        }
    }
 });

function getChannelID(message,CN){
    return message.guild.channels.find(c => c.name === CN);
}

function getRoleID(message,role){
    return message.guild.roles.find(r => r.name == `${role}`);

}

function makeChannel(message){
    var server = message.guild;
    var channelname = `report-${i}`
    server.createChannel(channelname, {
        type: 'text',
        permissionOverwrites: [
            {
                id: server.id,
                deny: ['VIEW_CHANNEL'],
            },
            // {
            //     id: getRoleID(message,"Administrator"),
            //     allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            // },
            {
                id: getRoleID(message,"Admin"),
                allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            },
            {
                id: getRoleID(message,"Test"),
                allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            },
            // {
            //     id: getRoleID(message,"Staff"),
            //     allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            // },
            // {
            //     id: getRoleID(message,"Moderator"),
            //     allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            // },
            {
                id: message.author.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],
            },]
    })
    console.log(channelname + " -- 1")
    return channelname;
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

async function info(message,person,CN){
    channelid = message.guild.channels.find(c => c.name === CN);
    //channelid = getChannelID(message,CN);
    if (channelid === null) {
        message.channel.send(`${person} - Report channel created. Go to ${CN}.`);
        console.log(CN + "-- 3")
    } else {
        message.channel.send(`${person} - Report channel created. Go to ${channelid}.`);
        category = message.guild.channels.find(c => c.name == "testshite" && c.type == "category");
        channelid= await channelid.setParent(category.id);
        console.log(CN + "-- 4")
    }
}

client.login(config.token);
