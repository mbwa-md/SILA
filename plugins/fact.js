const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'fact',
    description: 'Get random interesting fact',
    category: 'fun',
    react: '📚',
    alias: ['facts', 'interesting'],
    usage: '.fact',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            const fact = response.data;
            
            const factText = `*📚 RANDOM FACT*\n\n` +
                           `${fact.text}\n\n` +
                           `*🔗 Source:* ${fact.source_url || 'Unknown'}`;
            
            await utils.sendBlueTickMessage(sock, jid, factText, msg);
            
        } catch (error) {
            // Fallback facts
            const fallbackFacts = [
                "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
                "Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.",
                "A day on Venus is longer than a year on Venus. It takes Venus 243 Earth days to rotate once, but only 225 Earth days to orbit the sun.",
                "Bananas are berries, but strawberries aren't.",
                "The shortest war in history was between Britain and Zanzibar on August 27, 1896. It lasted only 38 minutes."
            ];
            
            const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
            await utils.sendBlueTickMessage(sock, jid,
                `*📚 DID YOU KNOW?*\n\n${randomFact}`,
                msg
            );
        }
    }
};