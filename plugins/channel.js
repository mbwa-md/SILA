const utils = require('../utils');

module.exports = {
    name: 'channel',
    description: 'Manage newsletter channels',
    category: 'settings',
    react: '📢',
    alias: ['newsletter', 'broadcast'],
    usage: '.channel [join/leave]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Owner only command!', msg);
            return;
        }
        
        const action = args[0]?.toLowerCase();
        
        if (action === 'join') {
            await utils.sendBlueTickMessage(sock, jid,
                `✅ Joined newsletter channels!\n` +
                `You will receive updates and announcements.`,
                msg
            );
        } else if (action === 'leave') {
            await utils.sendBlueTickMessage(sock, jid,
                `✅ Left newsletter channels.`,
                msg
            );
        } else {
            await utils.sendBlueTickMessage(sock, jid,
                `*📢 NEWSLETTER CHANNELS*\n\n` +
                `*Usage:* .channel join/leave\n\n` +
                `Join official SILA AI channels for updates and news.`,
                msg
            );
        }
    }
};