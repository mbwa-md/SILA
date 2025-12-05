const utils = require('../utils');

module.exports = {
    name: 'demote',
    description: 'Demote admin to member',
    category: 'group',
    react: '⬇️',
    alias: ['removeadmin', 'unadmin'],
    usage: '.demote @user',
    
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
                `*⬇️ DEMOTE ADMIN*\n\n` +
                `*Usage:* .demote @user\n` +
                `*Or:* Reply to admin message with .demote`,
                msg
            );
            return;
        }
        
        for (const user of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [user], 'demote');
                await utils.sendBlueTickMessage(sock, jid,
                    `✅ Demoted @${user.split('@')[0]} from admin!`,
                    msg
                );
                await utils.sleep(1000);
            } catch (error) {
                await utils.sendBlueTickMessage(sock, jid,
                    `❌ Failed to demote @${user.split('@')[0]}: ${error.message}`,
                    msg
                );
            }
        }
    }
};