// bot.js faylida:

const CONFIG = {
  TOKEN: process.env.BOT_TOKEN // Bu Render'dagi BOT_TOKEN nomli qiymatni oladi
    
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