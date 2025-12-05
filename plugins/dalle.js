const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'dalle',
    description: 'Generate image with DALL-E AI',
    category: 'ai',
    alias: ['dallee', 'dalleai', 'dallegen'],
    usage: '.dalle <prompt>',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const prompt = args.join(' ').trim();
            
            if (!prompt) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*🎨 DALL-E AI*\n\n` +
                    `*Usage:* .dalle <description>\n` +
                    `*Example:* .dalle cat on moon\n\n` +
                    `*Powered by SILA TECH*`,
                    msg
                );
                return;
            }
            
            // Processing message
            await utils.sendBlueTickMessage(sock, jid,
                `*🔄 Generating image...*\n` +
                `"${prompt}"`,
                msg
            );
            
            // DALL-E API
            const apiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`;
            
            const response = await axios.get(apiUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            // Send image without caption
            await sock.sendMessage(jid, {
                image: Buffer.from(response.data),
                mimetype: 'image/jpeg'
            }, { quoted: msg });
            
        } catch (error) {
            console.error('DALL-E error:', error);
            
            // Try backup API
            try {
                const backupUrl = `https://api.ryzendesu.com/api/ai/text2img?prompt=${encodeURIComponent(args.join(' '))}`;
                const backupRes = await axios.get(backupUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 25000 
                });
                
                await sock.sendMessage(jid, {
                    image: Buffer.from(backupRes.data),
                    mimetype: 'image/jpeg'
                }, { quoted: msg });
                
            } catch (backupError) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*❌ Failed to generate image!*\n\n` +
                    `Try again with different prompt.\n\n` +
                    `*Powered by SILA TECH*`,
                    msg
                );
            }
        }
    }
};