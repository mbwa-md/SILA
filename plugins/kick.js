const utils = require('../utils');

module.exports = {
    name: 'kick',
    description: 'Remove member from group',
    category: 'group',
    react: '👢',
    alias: ['remove', 'ban'],
    usage: '.kick @user',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isGroup) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Group only command!', msg);
            return;
        }
        
        if (!isAdmin && !isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
            return;
        }
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentioned.length === 0) {
            await utils.sendBlueTickMessage(sock, jid,
                `*👢 KICK MEMBER*\n\n` +
                `*Usage:* .kick @user\n` +
                `*Or:* Reply to user message with .kick`,
                msg
            );
            return;
        }
        
        for (const user of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [user], 'remove');
                await utils.sendBlueTickMessage(sock, jid,
                    `✅ Kicked @${user.split('@')[0]} from group!`,
                    msg
                );
                await utils.sleep(1000);
            } catch (error) {
                await utils.sendBlueTickMessage(sock, jid,
                    `❌ Failed to kick @${user.split('@')[0]}: ${error.message}`,
                    msg
                );
            }
        }
    }
};