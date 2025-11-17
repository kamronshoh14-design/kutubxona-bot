// src/state_manager.js
const userStates = {};
const i18n = {
    uz: { welcome: "Assalomu alaykum! Bot tilini tanlang yoki kitob qidirishni boshlang.", lang_selected: "Sizning tilingiz: O‘zbekcha", main_menu: "Bosh menyudasiz.", search_prompt: "Iltimos, qidirayotgan kitobingiz nomini kiriting:", book_not_found: "Uzur, bu tilda '%s' nomli kitob topilmadi.", btn_lang: "🇺🇿🇷🇺🇬🇧 Tilni tanlash", btn_search: "📖 Kitob qidirish" },
    ru: { welcome: "Здравствуйте! Выберите язык бота или начните поиск книги.", lang_selected: "Ваш язык: Русский", main_menu: "Вы находитесь в главном меню.", search_prompt: "Пожалуйста, введите название книги, которую ищете:", book_not_found: "Извините, книга с названием '%s' на этом языке не найдена.", btn_lang: "🇺🇿🇷🇺🇬🇧 Выбрать язык", btn_search: "📖 Искать книгу" },
    en: { welcome: "Hello! Select the bot language or start searching for a book.", lang_selected: "Your language: English", main_menu: "You are in the main menu.", search_prompt: "Please enter the name of the book you are looking for:", book_not_found: "Sorry, no book named '%s' was found in this language.", btn_lang: "🇺🇿🇷🇺🇬🇧 Select Language", btn_search: "📖 Search Book" }
};
const getLanguage = (chatId) => userStates[chatId] || 'uz'; 
const setLanguage = (chatId, langCode) => { userStates[chatId] = langCode; };
const getText = (chatId, key) => {
    const lang = getLanguage(chatId);
    return i18n[lang] ? i18n[lang][key] || key : key;
};
module.exports = { getLanguage, setLanguage, getText };