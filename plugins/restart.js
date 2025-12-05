const utils = require('../utils');

module.exports = {
    name: 'restart',
    description: 'Restart the bot',
    category: 'admin',
    react: '🔄',
    alias: ['reboot', 'refresh'],
    usage: '.restart',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Owner only command!', msg);
            return;
        }
        
        await utils.sendBlueTickMessage(sock, jid,
            `*🔄 RESTARTING BOT...*\n\n` +
            `Bot will restart in 3 seconds.\n` +
            `Please wait for reconnection.`,
            msg
        );
        
        // Restart after delay
        setTimeout(() => {
            process.exit(0);
        }, 3000);
    }
};