const utils = require('../utils');

module.exports = {
    name: 'block',
    description: 'Block user from using bot',
    category: 'admin',
    react: '🚫',
    alias: ['banuser', 'blockuser'],
    usage: '.block @user',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Owner only command!', msg);
            return;
        }
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentioned.length === 0) {
            await utils.sendBlueTickMessage(sock, jid,
                `*🚫 BLOCK USER*\n\n` +
                `*Usage:* .block @user\n` +
                `*Or:* Reply to user message with .block\n\n` +
                `Prevents user from using bot commands.`,
                msg
            );
            return;
        }
        
        const ban = require('../lib/ban');
        const user = mentioned[0];
        
        ban.banUser(user);
        await utils.sendBlueTickMessage(sock, jid,
            `✅ Blocked @${user.split('@')[0]} from using bot!`,
            msg
        );
    }
};