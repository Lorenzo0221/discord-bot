require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],

});
(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    eventHandler(client);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
  
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection Error");
  console.log(reason, promise)
});

process.on("uncaughtException", (err, origin) => {
  console.log("Uncaught Exeception Error");
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("Uncaught Exception Error");
  console.log(err, origin);
});
eventHandler(client);

client.login(process.env.TOKEN);
