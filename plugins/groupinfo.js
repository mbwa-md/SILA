const utils = require('../utils');

module.exports = {
    name: 'groupinfo',
    description: 'Show group information',
    category: 'group',
    react: '👥',
    alias: ['ginfo', 'group', 'info'],
    usage: '.groupinfo',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isGroup) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Group only command!', msg);
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(jid);
            const participants = groupMetadata.participants;
            const admins = participants.filter(p => p.admin).length;
            
            const info = `*👥 GROUP INFORMATION*\n\n` +
                        `*📛 Name:* ${groupMetadata.subject}\n` +
                        `*🆔 ID:* ${groupMetadata.id}\n` +
                        `*👥 Members:* ${participants.length}\n` +
                        `*👑 Admins:* ${admins}\n` +
                        `*📅 Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n` +
                        `*👤 Creator:* ${groupMetadata.owner || 'Unknown'}\n` +
                        `*🔒 Restrict:* ${groupMetadata.restrict ? 'Yes' : 'No'}\n` +
                        `*👻 Announce:* ${groupMetadata.announce ? 'Yes' : 'No'}`;
            
            await utils.sendBlueTickMessage(sock, jid, info, msg);
            
        } catch (error) {
            console.error('Groupinfo error:', error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ Error:* ${error.message}`,
                msg
            );
        }
    }
};