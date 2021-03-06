// Made by: Michael Juarez & JT Harlan

require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
const prefix = '!'; // I think we can move this to the config file later. I'm not quite sure how that works atm.

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return; //If the message either doesn't start with the prefix or was sent by a bot, exit early
  
  const args = msg.content.slice(prefix.length).split(/ +/); //Creates an "args" variable that slices off the prefic entirely and then splits it into an array by spaces
  const command = args.shift().toLowerCase(); // Converts command to lowercase
  //var tmp = msg.content.toUpperCase() // Converts most recent message to uppercase
  var authorRole = msg.member.roles.highest.name // Gets the highest server role of the person who initiated the command
  var author = msg.member.id // Gets their id
  var msgAuthor = msg.member // Gets their member profile
  var rollTaker = "162997214199676928"
  var students = []
  //if (tmp === "!ROLL" && (authorRole === "@the_boys" || author === "162997214199676928" || author === "172143655518208000")) { //This is for perms on specific people
  if (command === 'roll') {
    msg.channel.send("React to this!")
    .then(function (botMsg) {
      botMsg.react('✋') // Reacts to above message ^ <-[("React to this!")]

      const filter = (reaction, user) => {
        return reaction.emoji.name === '✋' && user.id != botMsg.author.id // Filter to make sure people are using the correct emote to react
      }
      const collector = botMsg.createReactionCollector(filter, {time: 5000})

      console.log('Beginning to collect...')
      collector.on('collect', (reaction, user) => { // Waits for people to react
        console.log(`Collected "${reaction.emoji.name}" from ${user.tag}`)
        students.push(user.username)
      })
      collector.on('end', collected => { // Executes after the time ends
        console.log(`Collected "${students.length}" items`)
        botMsg.edit("Alright, that's all for now folks!")

        students.sort()
        var printArr = students.join('\n') // Puts elements of array into large string
        
        // For some reason, sending a DM breaks the bot
        // msgAuthor.send('>>> __***Rollcall:***__\n' + printArr)

        // So, for now, I decided to just have it print out in the channel in which it is called. Will need to fix later.
        if (students.length === 0) {
          msg.channel.send('No One is Here!')
        } else {
          msg.channel.send('>>> __***Rollcall:***__\n' + printArr) // Prints out student list
        }
      })
    })
  }
})

client.login(process.env.BOT_TOKEN)