// src/book_service.js
const path = require('path');
const fs = require('fs');
const { BOOK_PATH } = require('./config'); 

const findBookFile = (langCode, bookTitle) => {
    const normalizedTitle = bookTitle.trim().toLowerCase(); 
    const langPath = path.join(BOOK_PATH, langCode);

    try {
        const files = fs.readdirSync(langPath);
        const foundFile = files.find(file => 
            file.toLowerCase().includes(normalizedTitle) && file.endsWith('.pdf')
        );
        return foundFile ? path.join(langPath, foundFile) : null;
    } catch (error) {
        console.error(`Kitob papkasi (${langPath}) bilan bog'liq xato:`, error.message);
        return null;
    }
};

const handleBookSearch = async (bot, chatId, langCode, bookTitle, notFoundText) => {
    const filePath = findBookFile(langCode, bookTitle);

    if (filePath) {
        try {
            await bot.sendDocument(chatId, filePath);
        } catch (error) {
            console.error("Faylni yuborishda xato:", error.message);
            await bot.sendMessage(chatId, "Uzur, kitobni yuborishda texnik xato yuz berdi.");
        }
    } else {
        const message = notFoundText.replace('%s', bookTitle);
        await bot.sendMessage(chatId, message);
    }
};
module.exports = { handleBookSearch };