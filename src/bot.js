const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// ================= CONFIG =================
const CONFIG = {
    // 🛑 TOKEN QATORINI TO'G'RILANG:
    TOKEN: process.env.BOT_TOKEN, 
    BOOK_PATH: path.join(__dirname, 'books'),
    LANGUAGES: { uz: 'O‘zbekcha', ru: 'Русский', en: 'English' }
};

const i18n = {
    uz: { welcome: "Assalomu alaykum! Tilni tanlang yoki kitob qidirishni boshlang.", lang_selected: "Sizning tilingiz: O‘zbekcha", main_menu: "Bosh menyudasiz.", search_prompt: "Iltimos, qidirayotgan kitob nomini kiriting:", book_not_found: "Uzur, '%s' kitob topilmadi.", btn_lang: "🌐 Tilni tanlash", btn_search: "📖 Kitob qidirish" },
    ru: { welcome: "Здравствуйте! Выберите язык или начните поиск книги.", lang_selected: "Ваш язык: Русский", main_menu: "Вы в главном меню.", search_prompt: "Введите название книги:", book_not_found: "Извините, книга '%s' не найдена.", btn_lang: "🌐 Выбрать язык", btn_search: "📖 Искать книгу" },
    en: { welcome: "Hello! Select language or search a book.", lang_selected: "Your language: English", main_menu: "You are in main menu.", search_prompt: "Enter book title:", book_not_found: "Sorry, '%s' book not found.", btn_lang: "🌐 Select Language", btn_search: "📖 Search Book" }
};

const userStates = {}; // chatId -> lang
const userSearchStatus = {}; // chatId -> true/false

// ================= FUNCTIONS =================
const getLanguage = chatId => userStates[chatId] || 'uz';
const setLanguage = (chatId, lang) => { userStates[chatId] = lang; };
const getText = (chatId, key) => i18n[getLanguage(chatId)][key] || key;

const normalizeString = str => str.toLowerCase().replace(/[\s_\-]+/g, '');

const findBookFile = (langCode, bookTitle) => {
    const normalizedTitle = normalizeString(bookTitle);
    const langPath = path.join(CONFIG.BOOK_PATH, langCode);

    if (!fs.existsSync(langPath)) return null;

    const files = fs.readdirSync(langPath);
    const foundFile = files.find(file => normalizeString(file).includes(normalizedTitle) && file.endsWith('.pdf'));

    return foundFile ? path.join(langPath, foundFile) : null;
};

// ================= KEYBOARDS =================
const getMainMenuKeyboard = chatId => ({
    keyboard: [
        [{ text: getText(chatId, 'btn_search') }],
        [{ text: getText(chatId, 'btn_lang') }]
    ], resize_keyboard: true
});

const getLanguageKeyboard = () => ({
    inline_keyboard: [
        [{ text: 'O‘zbekcha', callback_data: 'lang_uz' }, { text: 'Русский', callback_data: 'lang_ru' }],
        [{ text: 'English', callback_data: 'lang_en' }]
    ]
});

// ================= BOT =================
const bot = new TelegramBot(CONFIG.TOKEN, { polling: true });

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, getText(chatId, 'welcome'), { reply_markup: getMainMenuKeyboard(chatId) });
});

bot.on('message', async msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const lang = getLanguage(chatId);

    if (text === getText(chatId, 'btn_lang')) {
        userSearchStatus[chatId] = false;
        await bot.sendMessage(chatId, "Tilni tanlang:", { reply_markup: getLanguageKeyboard() });
    } else if (text === getText(chatId, 'btn_search')) {
        userSearchStatus[chatId] = true;
        await bot.sendMessage(chatId, getText(chatId, 'search_prompt'), { reply_markup: { remove_keyboard: true } });
    } else if (userSearchStatus[chatId]) {
        userSearchStatus[chatId] = false;
        const filePath = findBookFile(lang, text);
        if (filePath) {
            await bot.sendDocument(chatId, filePath);
        } else {
            await bot.sendMessage(chatId, getText(chatId, 'book_not_found').replace('%s', text));
        }
        await bot.sendMessage(chatId, getText(chatId, 'main_menu'), { reply_markup: getMainMenuKeyboard(chatId) });
    } else {
        await bot.sendMessage(chatId, getText(chatId, 'main_menu'), { reply_markup: getMainMenuKeyboard(chatId) });
    }
});

bot.on('callback_query', async query => {
    const chatId = query.message.chat.id;
    const data = query.data;
    if (data.startsWith('lang_')) {
        const newLang = data.split('_')[1];
        setLanguage(chatId, newLang);
        await bot.answerCallbackQuery(query.id, { text: getText(chatId, 'lang_selected') });
        await bot.sendMessage(chatId, getText(chatId, 'main_menu'), { reply_markup: getMainMenuKeyboard(chatId) });
    }
});

bot.on('polling_error', error => console.error(error));


// src/Bot.js fayliga qo'shiladi

bot.on('channel_post', async (msg) => {
    // 1. Kanal xabarlarini tinglash (channel_post)
    
    // 2. Agar xabar fayl (document) bo'lsa tekshiramiz
    if (msg.document) {
        
        // 3. Agar fayl turi PDF bo'lsa tekshiramiz
        if (msg.document.mime_type === 'application/pdf') {
            
            const file_id = msg.document.file_id;
            const file_name = msg.document.file_name;
            
            // 4. Faylni Telegramdan olish uchun yo'lni olamiz
            const file_link = await bot.getFileLink(file_id);
            
            // 5. Faylni saqlash yo'lini belgilaymiz (config.js dagi BOOKS papkasiga)
            const destination_path = path.join(CONFIG.BOOK_PATH, file_name);

            try {
                // Faylni yuklab olamiz
                const response = await fetch(file_link);
                const buffer = await response.buffer();
                
                // Faylni BOOK_PATH ga saqlaymiz
                fs.writeFileSync(destination_path, buffer);
                
                // Administratorga xabar berish (ixtiyoriy)
                bot.sendMessage(msg.chat.id, `✅ Kitob saqlandi: ${file_name}`);
                
            } catch (error) {
                console.error("Kitobni yuklashda xato:", error);
                bot.sendMessage(msg.chat.id, `❌ Kitobni saqlashda xato yuz berdi!`);
            }
        }
    }
});
console.log("Kutubxona AI Bot ishga tushdi...");
