// src/language_menu.js
const { LANGUAGES } = require('./config'); 
const getLanguageKeyboard = () => {
    const languageButtons = Object.keys(LANGUAGES).map(code => ({ text: LANGUAGES[code], callback_data: `lang_${code}` }));
    return { inline_keyboard: [ languageButtons.slice(0, 2), languageButtons.slice(2) ] };
};
module.exports = { getLanguageKeyboard };