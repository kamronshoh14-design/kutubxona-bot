// src/query_handler.js
const { setLanguage, getText } = require('./state_manager'); 
const { getMainMenuKeyboard } = require('./main_menu'); 
const handleCallbackQuery = async (bot, query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data.startsWith('lang_')) {
        const newLang = data.split('_')[1];
        setLanguage(chatId, newLang);
        const langSelectedText = getText(chatId, 'lang_selected');
        const mainMenuText = getText(chatId, 'main_menu');
        const keyboard = getMainMenuKeyboard(chatId);
        
        await bot.answerCallbackQuery(query.id, { text: langSelectedText });
        await bot.sendMessage(chatId, mainMenuText, { reply_markup: keyboard });
    } 
};
module.exports = { handleCallbackQuery };