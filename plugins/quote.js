const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'quote',
    description: 'Get random inspirational quote',
    category: 'fun',
    react: '💭',
    alias: ['quotes', 'inspire'],
    usage: '.quote',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const quote = response.data;
            
            const quoteText = `*💭 INSPIRATIONAL QUOTE*\n\n` +
                            `"${quote.content}"\n\n` +
                            `*- ${quote.author}*\n\n` +
                            `*📚 Tags:* ${quote.tags.join(', ')}\n` +
                            `*🔢 Length:* ${quote.length} characters`;
            
            await utils.sendBlueTickMessage(sock, jid, quoteText, msg);
            
        } catch (error) {
            // Fallback quote
            const fallbackQuotes = [
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
                "Stay hungry, stay foolish. - Steve Jobs",
                "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
            ];
            
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            await utils.sendBlueTickMessage(sock, jid,
                `*💭 QUOTE OF THE DAY*\n\n${randomQuote}`,
                msg
            );
        }
    }
};