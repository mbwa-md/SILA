const utils = require('../utils');

module.exports = {
    name: 'dice',
    description: 'Roll a dice',
    category: 'fun',
    react: '🎲',
    alias: ['roll', 'diceroll'],
    usage: '.dice',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const roll = Math.floor(Math.random() * 6) + 1;
        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚄'];
        
        const result = `*🎲 DICE ROLL*\n\n` +
                      `You rolled: *${roll}* ${diceFaces[roll-1]}\n\n` +
                      `${roll === 6 ? '🎉 Critical success!' : 
                        roll === 1 ? '😅 Snake eyes!' : 
                        'Nice roll!'}`;
        
        await utils.sendBlueTickMessage(sock, jid, result, msg);
    }
};