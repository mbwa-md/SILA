const utils = require('../utils');
const config = require('../config');
const os = require('os');

module.exports = {
    name: 'botinfo',
    description: 'Show bot information',
    category: 'info',
    react: '🤖',
    alias: ['info', 'about'],
    usage: '.botinfo',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const memory = process.memoryUsage();
        const usedMemory = (memory.heapUsed / 1024 / 1024).toFixed(2);
        const totalMemory = (memory.heapTotal / 1024 / 1024).toFixed(2);
        
        const info = `*🤖 BOT INFORMATION*\n\n` +
                    `*🤖 Name:* ${config.BOT_NAME}\n` +
                    `*👑 Owner:* +255 61 249 1554\n` +
                    `*⚡ Version:* 7.0.0\n` +
                    `*📱 Platform:* ${process.platform}\n` +
                    `*⏰ Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
                    `*💾 Memory:* ${usedMemory}MB / ${totalMemory}MB\n` +
                    `*🔵 Status:* ✅ Active\n\n` +
                    `*💫 Powered by SILA AI*\n` +
                    `*🔵 WhatsApp ‧ Verified*`;
                             
        await utils.sendBlueTickMessage(sock, jid, info, msg);
    }
};