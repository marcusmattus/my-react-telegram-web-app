const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with the token you got from BotFather
const bot = new TelegramBot('7281379998:AAEKbv88HlP13R02F7uI-wF2-3jIX7q29bE', { polling: true });

// Handle the /start command and send the game link
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send the game to the user
  bot.sendGame(chatId, 'Launch on TAP');  // Replace 'your_game_short_name' with your actual game's short name
});

console.log('Bot is running...');
