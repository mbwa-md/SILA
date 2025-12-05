const utils = require('../utils');

module.exports = {
    name: 'tagall',
    description: 'Mention all group members',
    category: 'group',
    react: '🏷️',
    alias: ['mentionall', 'everyone', 'all'],
    usage: '.tagall [message]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isGroup) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Group only command!', msg);
            return;
        }
        
        if (!isAdmin) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(jid);
            const participants = groupMetadata.participants;
            const mentions = participants.map(p => p.id);
            
            const message = args.join(' ') || 'Hello everyone!';
            
            await sock.sendMessage(jid, {
                text: `*📢 ATTENTION!*\n\n${message}\n\n` + 
                      participants.map(p => `@${p.id.split('@')[0]}`).join(' '),
                mentions: mentions
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Tagall error:', error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ Error:* ${error.message}`,
                msg
            );
        }
    }
};