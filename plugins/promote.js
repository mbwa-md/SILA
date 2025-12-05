const utils = require('../utils');

module.exports = {
    name: 'promote',
    description: 'Promote member to admin',
    category: 'group',
    react: '👑',
    alias: ['admin', 'makeadmin'],
    usage: '.promote @user',
    
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
                `*👑 PROMOTE MEMBER*\n\n` +
                `*Usage:* .promote @user\n` +
                `*Or:* Reply to user message with .promote`,
                msg
            );
            return;
        }
        
        for (const user of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [user], 'promote');
                await utils.sendBlueTickMessage(sock, jid,
                    `✅ Promoted @${user.split('@')[0]} to admin!`,
                    msg
                );
                await utils.sleep(1000);
            } catch (error) {
                await utils.sendBlueTickMessage(sock, jid,
                    `❌ Failed to promote @${user.split('@')[0]}: ${error.message}`,
                    msg
                );
            }
        }
    }
};