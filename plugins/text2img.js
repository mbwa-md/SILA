const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'text2img',
    description: 'Generate image from text with multiple styles',
    category: 'ai',
    alias: ['imagengen', 'texttoimage', 'genimg'],
    usage: '.text2img <prompt>',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const prompt = args.join(' ').trim();
            
            if (!prompt) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*🎨 TEXT TO IMAGE GENERATOR*\n\n` +
                    `*Usage:* .text2img <description>\n` +
                    `*Example:* .text2img dragon flying over mountains\n\n` +
                    `*Styles available:* 19 different AI styles\n\n` +
                    `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
                    msg
                );
                return;
            }
            
            // Processing message
            await utils.sendBlueTickMessage(sock, jid,
                `*🔄 Creating image from text...*\n` +
                `"${prompt}"\n` +
                `✨ Please wait...`,
                msg
            );
            
            // API URL with style 19
            const apiUrl = `https://api.vreden.my.id/api/artificial/aiease/text2img?prompt=${encodeURIComponent(prompt)}&style=19`;
            
            const response = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 40000
            });
            
            if (!response.data?.result || response.data.result.length === 0) {
                throw new Error('No images received');
            }
            
            const imageUrl = response.data.result[0]?.origin;
            
            if (!imageUrl) {
                throw new Error('No image URL found');
            }
            
            // Download image
            const imageRes = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://api.vreden.my.id/'
                },
                timeout: 30000
            });
            
            const imageBuffer = Buffer.from(imageRes.data);
            
            // Send image with stylish caption
            await sock.sendMessage(jid, {
                image: imageBuffer,
                caption: `*╭───『 🎨 ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ 』───╮*\n` +
                        `*│*\n` +
                        `*│  📝 ᴘʀᴏᴍᴘᴛ:*\n` +
                        `*│  ${prompt}*\n` +
                        `*│*\n` +
                        `*│  🎭 ꜱᴛʏʟᴇ: 19*\n` +
                        `*│  🖼️ ʀᴇꜱᴏʟᴜᴛɪᴏɴ: 1024x1024*\n` +
                        `*│*\n` +
                        `*╰─────────────*\n\n` +
                        `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
                mimetype: 'image/jpeg'
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Text2Img error:', error);
            
            // Try backup APIs
            try {
                await utils.sendBlueTickMessage(sock, jid,
                    `*🔄 Trying alternative API...*`,
                    msg
                );
                
                const backupApis = [
                    `https://api.ryzendesu.com/api/ai/text2img?prompt=${encodeURIComponent(args.join(' '))}`,
                    `https://api.nekolabs.my.id/api/ai/text2img?prompt=${encodeURIComponent(args.join(' '))}`,
                    `https://shizoapi.onrender.com/api/ai/imagine?prompt=${encodeURIComponent(args.join(' '))}`
                ];
                
                let success = false;
                
                for (const apiUrl of backupApis) {
                    try {
                        const response = await axios.get(apiUrl, { timeout: 25000 });
                        
                        if (response.data?.result || response.data?.image) {
                            const imageUrl = response.data.result || response.data.image;
                            const imageRes = await axios.get(imageUrl, { 
                                responseType: 'arraybuffer',
                                timeout: 30000
                            });
                            
                            const imageBuffer = Buffer.from(imageRes.data);
                            
                            await sock.sendMessage(jid, {
                                image: imageBuffer,
                                caption: `*🖼️ ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ*\n\n` +
                                        `*📝 ${args.join(' ')}*\n\n` +
                                        `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
                                mimetype: 'image/jpeg'
                            }, { quoted: msg });
                            
                            success = true;
                            break;
                        }
                    } catch (apiError) {
                        continue;
                    }
                }
                
                if (!success) {
                    throw new Error('All APIs failed');
                }
                
            } catch (backupError) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*❌ ꜰᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ɪᴍᴀɢᴇ!*\n\n` +
                    `*ᴇʀʀᴏʀ:* ${error.message}\n\n` +
                    `*ᴛʀʏ:*\n` +
                    `• ᴅɪꜰꜰᴇʀᴇɴᴛ ᴘʀᴏᴍᴘᴛ\n` +
                    `• ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ\n\n` +
                    `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
                    msg
                );
            }
        }
    }
};