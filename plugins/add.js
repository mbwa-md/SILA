const utils = require('../utils');

module.exports = {
    name: 'add',
    description: 'Add member to group',
    category: 'group',
    react: '➕',
    alias: ['invite', 'adduser'],
    usage: '.add <number>',
    example: '.add 255612345678',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isGroup) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Group only command!', msg);
            return;
        }
        
        if (!isAdmin && !isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
            return;
        }
        
        const number = args[0];
        
        if (!number) {
            await utils.sendBlueTickMessage(sock, jid,
                `*➕ ADD MEMBER*\n\n` +
                `*Usage:* .add <number>\n` +
                `*Example:* .add 255612345678\n\n` +
                `*Format:* Country code + number`,
                msg
            );
            return;
        }
        
        const userJid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;
        
        try {
            await sock.groupParticipantsUpdate(jid, [userJid], 'add');
            await utils.sendBlueTickMessage(sock, jid,
                `✅ Added ${number} to group!`,
                msg
            );
        } catch (error) {
            await utils.sendBlueTickMessage(sock, jid,
                `❌ Failed to add ${number}: ${error.message}\n\n` +
                `Make sure:\n` +
                `1. Number is correct\n` +
                `2. User has WhatsApp\n` +
                `3. User hasn't blocked the bot`,
                msg
            );
        }
    }
};