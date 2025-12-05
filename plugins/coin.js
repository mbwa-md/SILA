const utils = require('../utils');

module.exports = {
    name: 'coin',
    description: 'Flip a coin',
    category: 'fun',
    react: '🪙',
    alias: ['flip', 'coinflip'],
    usage: '.coin',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '👑' : '🦅';
        
        const flipResult = `*🪙 COIN FLIP*\n\n` +
                          `The coin landed on: *${result}* ${emoji}\n\n` +
                          `${result === 'Heads' ? 'Heads you win!' : 'Tails never fails!'}`;
        
        await utils.sendBlueTickMessage(sock, jid, flipResult, msg);
    }
};