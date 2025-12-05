const utils = require('../utils');

module.exports = {
    name: 'userinfo',
    description: 'Show user information',
    category: 'info',
    react: '👤',
    alias: ['uinfo', 'whois'],
    usage: '.userinfo [@user]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        let userId;
        
        // Check if user is mentioned
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentioned.length > 0) {
            userId = mentioned[0];
        } else if (isGroup) {
            userId = msg.key.participant || jid;
        } else {
            userId = jid;
        }
        
        try {
            // Get user profile
            const profile = await sock.profilePictureUrl(userId, 'image');
            
            let userInfo = `*👤 USER INFORMATION*\n\n`;
            userInfo += `*🆔 User ID:* ${userId.split('@')[0]}\n`;
            userInfo += `*📱 Number:* +${userId.split('@')[0]}\n`;
            userInfo += `*👥 In Group:* ${isGroup ? 'Yes' : 'No'}\n`;
            
            if (isGroup) {
                try {
                    const groupMetadata = await sock.groupMetadata(jid);
                    const participant = groupMetadata.participants.find(p => p.id === userId);
                    userInfo += `*👑 Admin:* ${participant?.admin ? 'Yes' : 'No'}\n`;
                } catch (e) {}
            }
            
            userInfo += `\n*🔵 SILA AI Bot*`;
            
            await utils.sendBlueTickMessage(sock, jid, userInfo, msg);
            
        } catch (error) {
            await utils.sendBlueTickMessage(sock, jid,
                `*👤 USER INFO*\n\n` +
                `*🆔 User ID:* ${userId.split('@')[0]}\n` +
                `*📱 Number:* +${userId.split('@')[0]}\n` +
                `*👥 In Group:* ${isGroup ? 'Yes' : 'No'}\n\n` +
                `*Note:* Profile picture not available`,
                msg
            );
        }
    }
};