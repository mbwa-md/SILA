const utils = require('../utils');

module.exports = {
    name: 'uptime',
    description: 'Show bot uptime',
    category: 'basic',
    alias: ['runtime', 'up', 'botuptime'],
    usage: '.uptime',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            // Bot uptime
            const uptime = process.uptime();
            
            // Format uptime using utils function
            const uptimeString = utils.formatTime(uptime);
            
            // Get current date using utils
            const currentDate = utils.formatDate();
            
            // Create message with Christmas animation
            await utils.sendChristmasAnimation(sock, jid, async () => {
                // After tree animation, send uptime with blue tick
                const uptimeMessage = `*🤖 SILA AI BOT UPTIME*\n\n` +
                                    `⏰ *Running Time:* ${uptimeString}\n` +
                                    `📅 *Current Date:* ${currentDate.split(',')[0]}\n` +
                                    `🕐 *Current Time:* ${new Date().toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}\n` +
                                    `⚡ *Status:* Online\n` +
                                    `🔋 *Performance:* Optimal`;
                
                await utils.sendBlueTickMessage(sock, jid, uptimeMessage, utils.fakevCard);
            });
            
        } catch (error) {
            console.error('Uptime command error:', error);
            
            // Simple fallback using utils
            const uptime = process.uptime();
            const uptimeString = utils.formatTime(uptime);
            
            await utils.sendMessage(sock, jid, 
                `*🤖 UPTIME*\n\n` +
                `⏰ *Running Time:* ${uptimeString}\n` +
                `📅 *Bot Status:* Online\n` +
                `🔵 SILA AI • WhatsApp Verified`,
                utils.fakevCard
            );
        }
    }
};