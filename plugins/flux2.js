const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'flux2',
    description: 'Generate AI image using Flux AI',
    category: 'ai',
    alias: ['aiimg', 'aimage', 'aipic'],
    usage: '.flux <prompt>',
    example: '.flux lion running in jungle',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const prompt = args.join(' ').trim();
            
            if (!prompt) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*🎨 FLUX AI IMAGE GENERATOR*\n\n` +
                    `*Usage:* .flux <description>\n` +
                    `*Example:* .flux beautiful sunset\n\n` +
                    `*Aspect Ratio:* 2:3\n` +
                    `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`,
                    msg
                );
                return;
            }
            
            // Processing message
            await utils.sendBlueTickMessage(sock, jid,
                `*🔄 Generating image...*\n` +
                `"${prompt}"\n` +
                `⏳ Please wait...`,
                msg
            );
            
            // Flux AI API
            const apiUrl = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(prompt)}&aspect_ratio=2:3`;
            
            const response = await axios.get(apiUrl, {
                headers: {
                    'accept': '*/*',
                    'user-agent': 'SILA-AI/1.0.0'
                },
                timeout: 30000
            });
            
            if (!response.data?.image_link) {
                throw new Error('No image generated');
            }
            
            const imageUrl = response.data.image_link;
            
            // Download image
            const imageRes = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            const imageBuffer = Buffer.from(imageRes.data);
            
            // Send image
            await sock.sendMessage(jid, {
                image: imageBuffer,
                caption: `*🎨 FLUX AI IMAGE*\n\n` +
                        `*📝 Prompt:* ${prompt}\n` +
                        `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`,
                mimetype: 'image/jpeg'
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Flux error:', error);
            
            // Try backup API
            try {
                const backupUrl = `https://shizoapi.onrender.com/api/ai/imagine?prompt=${encodeURIComponent(args.join(' '))}`;
                const backupRes = await axios.get(backupUrl, { timeout: 25000 });
                
                if (backupRes.data?.image) {
                    const backupImage = await axios.get(backupRes.data.image, { 
                        responseType: 'arraybuffer' 
                    });
                    
                    const backupBuffer = Buffer.from(backupImage.data);
                    
                    await sock.sendMessage(jid, {
                        image: backupBuffer,
                        caption: `*🎨 AI IMAGE*\n\n` +
                                `*📝 Prompt:* ${args.join(' ')}\n` +                                 `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`,
                        mimetype: 'image/jpeg'
                    }, { quoted: msg });
                    
                    return;
                }
            } catch (backupError) {
                // Error message
                await utils.sendBlueTickMessage(sock, jid,
                    `*❌ Failed to generate image!*\n\n` +
                    `*Error:* ${error.message}\n\n` +
                    `*Try:*\n` +
                    `• Different prompt\n` +
                    `• Try again later\n\n` +
                    `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`,
                    msg
                );
            }
        }
    }
};