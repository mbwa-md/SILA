const utils = require('../utils');

module.exports = {
    name: 'bc',
    description: 'Broadcast message to all users',
    category: 'admin',
    react: '📢',
    alias: ['broadcast', 'announce'],
    usage: '.bc <message>',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Owner only command!', msg);
            return;
        }
        
        const message = args.join(' ').trim();
        
        if (!message) {
            await utils.sendBlueTickMessage(sock, jid,
                `*📢 BROADCAST SYSTEM*\n\n` +
                `*Usage:* .bc <message>\n` +
                `*Example:* .bc Hello everyone!\n\n` +
                `Sends message to all bot users.`,
                msg
            );
            return;
        }
        
        await utils.sendBlueTickMessage(sock, jid,
            `*📢 Broadcasting...*\n` +
            `Message: "${message}"\n` +
            `This may take a while...`,
            msg
        );
        
        // In real implementation, you would get all users from database
        // This is simplified version
        try {
            const broadcastMessage = `*📢 BROADCAST FROM BOT OWNER*\n\n` +
                                   `${message}\n\n` +
                                   `*🔵 SILA AI Bot*\n` +
                                   `*📅 ${new Date().toLocaleString()}*`;
            
            // Here you would loop through all users
            await utils.sendBlueTickMessage(sock, jid,
                `*✅ Broadcast sent!*\n` +
                `(Demo mode - in real bot would send to all users)`,
                msg
            );
            
        } catch (error) {
            console.error('Broadcast error:', error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ Broadcast failed:* ${error.message}`,
                msg
            );
        }
    }
};