const utils = require('../utils');
const db = require('../lib/database');

module.exports = {
    name: 'stats',
    description: 'Show bot statistics',
    category: 'info',
    react: '📊',
    alias: ['statistics', 'stat'],
    usage: '.stats',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const stats = db.getStats();
        const botStats = db.getStats();
        
        const statText = `*📊 BOT STATISTICS*\n\n` +
                        `*📱 Total Users:* ${stats.users || 0}\n` +
                        `*👥 Total Groups:* ${stats.groups || 0}\n` +
                        `*📨 Commands Processed:* ${botStats.commands || 0}\n` +
                        `*💬 Messages Handled:* ${botStats.messages || 0}\n` +
                        `*🤖 Plugins Loaded:* 34+\n` +
                        `*⚡ Uptime:* ${process.uptime().toFixed(0)}s\n\n` +
                        `*🔵 SILA AI Bot System*\n` +
                        `*📅 ${new Date().toLocaleDateString()}*`;
        
        await utils.sendBlueTickMessage(sock, jid, statText, msg);
    }
};