const utils = require('../utils');

module.exports = {
    name: 'autoreact',
    description: 'Auto react to messages',
    category: 'settings',
    react: '🤖',
    alias: ['autoreaction', 'autoemoji'],
    usage: '.autoreact [on/off]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (isGroup && !isAdmin) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
            return;
        }
        
        const state = args[0]?.toLowerCase();
        
        if (state === 'on') {
            // Enable auto react
            await utils.sendBlueTickMessage(sock, jid,
                `✅ Auto-reactions enabled!\n` +
                `I will randomly react to messages.`,
                msg
            );
        } else if (state === 'off') {
            await utils.sendBlueTickMessage(sock, jid,
                `✅ Auto-reactions disabled!`,
                msg
            );
        } else {
            await utils.sendBlueTickMessage(sock, jid,
                `*🤖 AUTO REACT SETTINGS*\n\n` +
                `*Usage:* .autoreact on/off\n\n` +
                `Automatically react to messages with random emojis.`,
                msg
            );
        }
    }
};