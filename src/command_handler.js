// src/command_handler.js
const { getText } = require('./state_manager'); 
const { getMainMenuKeyboard } = require('./main_menu'); 
const handleStart = async (bot, msg) => {
    const chatId = msg.chat.id;
    const welcomeText = getText(chatId, 'welcome');
    const keyboard = getMainMenuKeyboard(chatId);
    await bot.sendMessage(chatId, welcomeText, { reply_markup: keyboard });
};
module.exports = { handleStart };