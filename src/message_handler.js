// src/message_handler.js
const { getLanguage, getText } = require('./state_manager'); 
const { getLanguageKeyboard } = require('./language_menu'); 
const { getMainMenuKeyboard } = require('./main_menu'); 
const { handleBookSearch } = require('./book_service'); 

const userSearchStatus = {}; 

const handleMessage = async (bot, msg) => {
    const chatId = msg.chat.id;
    const langCode = getLanguage(chatId);
    const text = msg.text;

    const btnLangText = getText(chatId, 'btn_lang');
    const btnSearchText = getText(chatId, 'btn_search');
    const searchPrompt = getText(chatId, 'search_prompt');
    const mainMenuText = getText(chatId, 'main_menu');

    if (text === btnLangText) {
        userSearchStatus[chatId] = false; 
        await bot.sendMessage(chatId, "Iltimos, tilni tanlang:", {
            reply_markup: getLanguageKeyboard()
        });
    } else if (text === btnSearchText) {
        userSearchStatus[chatId] = true; 
        await bot.sendMessage(chatId, searchPrompt, {
            reply_markup: { remove_keyboard: true }
        });
    } else if (userSearchStatus[chatId] === true) {
        userSearchStatus[chatId] = false; 
        await handleBookSearch(bot, chatId, langCode, text, getText(chatId, 'book_not_found'));
        await bot.sendMessage(chatId, mainMenuText, {
            reply_markup: getMainMenuKeyboard(chatId)
        });
    } else {
        await bot.sendMessage(chatId, mainMenuText, {
            reply_markup: getMainMenuKeyboard(chatId)
        });
    }
};
module.exports = { handleMessage };