// reportbot source

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
    //if(message.content.indexOf(config.prefix) !== 0) return; // check on prefix (!)

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // get all args
    const command = args.shift().toLowerCase(); // get command (=first arg)

    console.log(message.content);
    console.log(message.createdAt)
    console.log(message.author.username + " - " + message.author.id);
    console.log("----------");

    // basic ping
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    // start report process
    if (command === "report") {
        CN = makeChannel(message);
        person = message.author;
        console.log(CN + "-- 2")
        message.channel.send(`---**OK**---`);
        //wait(1000)
        i++;
    }

    // reset increment
    if (command === "rc") {
        //check on perms
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Staff"].includes(r.name)) ) //hardcoded roles yeet
            return message.reply("No permission.");
        i = 1;
        message.channel.send('Counter reset.');
    }
    // fucky workaround that seems to work sometimes
    if (message.content === `---**OK**---`) {
        info(message,person,CN)
    }
    // doesnt work atm need troubleshoot
    if (command === "clear"){
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Staff"].includes(r.name)) )
            return message.reply("No permission.");
        var CH = 1;
        while (CH != null){
        CH = message.guild.channels.find(c => c.name.startsWith("report-") && c.type == "text");
        CH.delete();
        }
    }
 });

// can be used - seemed to be less succesful for getting the channel id in time
function getChannelID(message,CN){
    return message.guild.channels.find(c => c.name === CN);
}

// does what it says
function getRoleID(message,role){
    return message.guild.roles.find(r => r.name == `${role}`);

}

// main channel creation process
// TODO: find out if perms hashes are usable & if theyre easier to use 
// TODO: store role IDs in future to avoid repeated calls for role id whenever channel gets made
function makeChannel(message){
    var server = message.guild;
    var channelname = `report-${i}`
    server.createChannel(channelname, {
        type: 'text',
        permissionOverwrites: [         //commented nonexisting roles in testserver
            {   // deny visibility to everyone
                id: server.id,
                deny: ['VIEW_CHANNEL'],
            },
            // {
            //     id: getRoleID(message,"Administrator"),
            //     allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            // },
            {   // allow basic perms for admin etc
                id: getRoleID(message,"Admin"),
                allow: ['VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES', 'EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],

            },
            {   // for testing
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
            {   // allow author
                id: message.author.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY'],
            },]
    })
    console.log(channelname + " -- 1")
    return channelname;
}

// no impact on success % it seems
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

 // chucked everything in a function, potential higher success %
async function info(message,person,CN){
    channelid = message.guild.channels.find(c => c.name === CN);

    //channelid = getChannelID(message,CN);  // seems to perform worse
    // when the thing is fucky
    if (channelid === null) {
        message.channel.send(`${person} - Report channel created. Go to ${CN}.`);
        console.log(CN + "-- FAIL")

    // when the thing aint fucky and works for a change
    } else {
        message.channel.send(`${person} - Report channel created. Go to ${channelid}.`);
        category = message.guild.channels.find(c => c.name == "testshite" && c.type == "category");
        channelid = await channelid.setParent(category.id);
        console.log(CN + "-- SUCCESS")
    }
}

// final
client.login(config.token);
