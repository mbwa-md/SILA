const utils = require('../utils');

module.exports = {
    name: 'unblock',
    description: 'Unblock user from bot',
    category: 'admin',
    react: '✅',
    alias: ['unban', 'unblockuser'],
    usage: '.unblock @user',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Owner only command!', msg);
            return;
        }
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentioned.length === 0) {
            await utils.sendBlueTickMessage(sock, jid,
                `*✅ UNBLOCK USER*\n\n` +
                `*Usage:* .unblock @user\n` +
                `*Or:* Reply to user message with .unblock\n\n` +
                `Allows user to use bot commands again.`,
                msg
            );
            return;
        }
        
        const ban = require('../lib/ban');
        const user = mentioned[0];
        
        ban.unbanUser(user);
        await utils.sendBlueTickMessage(sock, jid,
            `✅ Unblocked @${user.split('@')[0]}! They can now use bot.`,
            msg
        );
    }
};