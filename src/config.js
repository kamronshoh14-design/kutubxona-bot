// bot.js faylida:

const CONFIG = {
    //!!! Tokenni Environment Variables (Muhit o'zgaruvchilari) dan olish
    TOKEN: process.env.BOT_TOKEN || '8318442346:AAEXWW5F-maMr8KcwEOvoMLxuHj3lEDCWOs', 
    
    // Mutlaq yo'l o'zgarmaydi, chunki u hali ham 'books/' papkasini qidiradi
    BOOK_PATH: path.join(__dirname, 'books/'), 
    
    LANGUAGES: {
        'uz': 'O‘zbekcha',
        'ru': 'Русский',
        'en': 'English'
    }
};
// ... qolgan kod
module.exports = config;