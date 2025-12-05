const axios = require('axios');
const utils = require('../utils');

module.exports = {
    name: 'flux',
    description: 'Generate AI images',
    category: 'ai',
    alias: ['imagine', 'aiimg'],
    usage: '.flux [prompt]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            // Fix: Ensure args is an array or convert it
            let prompt = '';
            
            if (Array.isArray(args)) {
                prompt = args.join(' ').trim();
            } else if (typeof args === 'string') {
                prompt = args.trim();
            } else if (args) {
                prompt = String(args).trim();
            }
            
            if (!prompt) {
                const usageText = `╭━━【 𝐅𝐋𝐔𝐗 】━━━━━━━━╮
│ 🎨 AI Image Generator
╰━━━━━━━━━━━━━━━━━━━━╯

📝 *Usage:* .flux [prompt]`;
                
                await utils.sendMessage(sock, jid, usageText, utils.fakevCard);
                return;
            }

            // Send processing message
            const processingText = `╭━━【 𝐅𝐋𝐔𝐗 】━━━━━━━━╮
│ 🎨 Generating image...
╰━━━━━━━━━━━━━━━━━━━━╯`;
            
            await utils.sendMessage(sock, jid, processingText, utils.fakevCard);

            // Use the API
            const apiUrl = `https://shizoapi.onrender.com/api/ai/imagine?apikey=shizo&query=${encodeURIComponent(prompt)}`;
            
            console.log(`Flux API Request: ${apiUrl}`);
            
            const response = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.data || response.data.length === 0) {
                throw new Error('Empty response from API');
            }

            const imageBuffer = Buffer.from(response.data);
            
            console.log(`Flux: Image generated, size: ${imageBuffer.length} bytes`);

            // Send the generated image
            const caption = `╭━━【 𝐅𝐋𝐔𝐗 】━━━━━━━━╮
│ 🎨 *Prompt:* ${prompt}
╰━━━━━━━━━━━━━━━━━━━━╯`;
            
            await sock.sendMessage(jid, {
                image: imageBuffer,
                caption: caption
            });

        } catch (error) {
            console.error('Flux command error:', error);
            
            let errorMessage = 'Failed to generate';
            if (error.code === 'ECONNABORTED') errorMessage = 'Request timed out';
            if (error.code === 'ECONNREFUSED') errorMessage = 'API unavailable';
            if (error.response?.status === 404) errorMessage = 'API not found';
            
            const errorText = `╭━━【 𝐅𝐋𝐔𝐗 】━━━━━━━━╮
│ ❌ ${errorMessage}
╰━━━━━━━━━━━━━━━━━━━━╯`;
            
            await utils.sendMessage(sock, jid, errorText, utils.fakevCard);
        }
    }
};