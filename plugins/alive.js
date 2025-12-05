const utils = require('../utils');
const config = require('../config');
const axios = require('axios');

module.exports = {
    name: 'alive',
    description: 'Check if bot is alive with Christmas tree',
    category: 'basic',
    alias: ['bot', 'online', 'check', 'christmas', 'xmas'],
    usage: '.alive',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            // Your custom alive image
            const imageUrl = 'https://files.catbox.moe/jwmx1j.jpg';
            
            // Bot uptime
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            // Christmas tree message
            const aliveMessage = `*🤖 SILA AI BOT - CHRISTMAS EDITION*\n\n` +
                               `✅ *Status:* ONLINE & FESTIVE\n` +
                               `⚡ *Speed:* Ultra Fast\n` +
                               `⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
                               `🔋 *Power:* 100% Christmas Spirit\n` +
                               `🎄 *Holiday Mode:* ACTIVE\n\n` +
                               `*👑 Owner:* +255 61 249 1554\n` +
                               `*🎁 Contact:* +255612491554\n` +
                               `*🔵 WhatsApp ‧ Verified*\n\n` +
                               `*Merry Christmas!* 🎅`;
            
            // Send Christmas animation first
            await utils.sendChristmasAnimation(sock, jid, async () => {
                // After tree animation, send alive info
                
                // Try to send image with caption
                try {
                    const response = await axios.get(imageUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 10000
                    });
                    
                    const imageBuffer = Buffer.from(response.data);
                    
                    // Send image with Christmas caption
                    await sock.sendMessage(jid, {
                        image: imageBuffer,
                        caption: aliveMessage,
                        jpegThumbnail: imageBuffer,
                        mimetype: 'image/jpeg'
                    });
                    
                } catch (imageError) {
                    // If image fails, send Christmas message with channel forwarding
                    console.log('Image failed, sending Christmas message:', imageError.message);
                    await utils.sendChristmasMessage(sock, jid, aliveMessage, true, utils.christmasFakevCard);
                }
            });
            
        } catch (error) {
            console.error('Alive command error:', error);
            
            // Simple Christmas fallback
            const fallbackTree = utils.getChristmasTree();
            const fallbackMessage = `${fallbackTree}\n\n` +
                                   `*🤖 SILA AI BOT*\n\n` +
                                   `✅ *Status:* ALIVE\n` +
                                   `⚡ *Bot is working*\n` +
                                   `🎄 *Christmas Mode: ON*\n` +
                                   `🔵 *WhatsApp ‧ Verified*`;
            
            await utils.sendMessage(sock, jid, fallbackMessage, utils.fakevCard);
        }
    }
};