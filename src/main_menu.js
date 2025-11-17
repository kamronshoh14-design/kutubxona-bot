// src/main_menu.js
const { getText } = require('./state_manager'); 
const getMainMenuKeyboard = (chatId) => {
    const btnLang = getText(chatId, 'btn_lang');
    const btnSearch = getText(chatId, 'btn_search');
    return { keyboard: [ [{ text: btnSearch }], [{ text: btnLang }] ], resize_keyboard: true };
};
module.exports = { getMainMenuKeyboard };
