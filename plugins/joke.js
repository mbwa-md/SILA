const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'joke',
    description: 'Get random joke',
    category: 'fun',
    react: '😂',
    alias: ['jokes', 'funny'],
    usage: '.joke',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
            const joke = response.data;
            
            const jokeText = `*😂 RANDOM JOKE*\n\n` +
                           `*${joke.setup}*\n\n` +
                           `*${joke.punchline}*`;
            
            await utils.sendBlueTickMessage(sock, jid, jokeText, msg);
            
        } catch (error) {
            // Fallback jokes
            const fallbackJokes = [
                "Why don't scientists trust atoms?\nBecause they make up everything!",
                "Why did the scarecrow win an award?\nHe was outstanding in his field!",
                "What do you call a fish with no eyes?\nFsh!",
                "Why don't skeletons fight each other?\nThey don't have the guts!",
                "What do you call a bear with no teeth?\nA gummy bear!"
            ];
            
            const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
            await utils.sendBlueTickMessage(sock, jid,
                `*😂 JOKE TIME*\n\n${randomJoke}`,
                msg
            );
        }
    }
};