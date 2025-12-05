const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'sora',
    description: 'Generate AI videos from text prompts',
    category: 'ai',
    alias: ['aivideo', 'videogen', 'text2video', 'genvideo'],
    usage: '.sora <prompt>',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const text = args.join(' ').trim();
            
            if (!text) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*🎥 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙾𝚁*\n\n` +
                    `𝙲𝚛𝚎𝚊𝚝𝚎 𝙰𝙸 𝚟𝚒𝚍𝚎𝚘𝚜 𝚏𝚛𝚘𝚖 𝚝𝚎𝚡𝚝\n` +
                    `𝚆𝚛𝚒𝚝𝚎 𝚕𝚒𝚔𝚎 𝚝𝚑𝚒𝚜:\n\n` +
                    `.𝚜𝚘𝚛𝚊 <𝚢𝚘𝚞𝚛 𝚟𝚒𝚍𝚎𝚘 𝚙𝚛𝚘𝚖𝚙𝚝>\n\n` +
                    `𝙴𝚡𝚊𝚖𝚙𝚕𝚎𝚜:\n` +
                    `.𝚜𝚘𝚛𝚊 𝚊 𝚌𝚊𝚝 𝚙𝚕𝚊𝚢𝚒𝚗𝚐 𝚙𝚒𝚊𝚗𝚘\n` +
                    `.𝚜𝚘𝚛𝚊 𝚜𝚞𝚗𝚜𝚎𝚝 𝚘𝚟𝚎𝚛 𝚖𝚘𝚞𝚗𝚝𝚊𝚒𝚗𝚜\n` +
                    `.𝚜𝚘𝚛𝚊 𝚏𝚞𝚝𝚞𝚛𝚒𝚜𝚝𝚒𝚌 𝚌𝚒𝚝𝚢 𝚠𝚒𝚝𝚑 𝚏𝚕𝚢𝚒𝚗𝚐 𝚌𝚊𝚛𝚜\n\n` +
                    `𝙰𝙸 𝚠𝚒𝚕𝚕 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎 𝚊 𝚟𝚒𝚍𝚎𝚘 𝚏𝚘𝚛 𝚢𝚘𝚞`,
                    msg
                );
                return;
            }

            await utils.sendBlueTickMessage(sock, jid,
                `*🎬 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾...*\n\n` +
                `📝 𝙿𝚛𝚘𝚖𝚙𝚝: ${text}\n` +
                `⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝚝𝚑𝚒𝚜 𝚖𝚊𝚢 𝚝𝚊𝚔𝚎 𝚊 𝚏𝚎𝚠 𝚖𝚒𝚗𝚞𝚝𝚎𝚜...`,
                msg
            );

            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl, { 
                responseType: 'arraybuffer',
                timeout: 120000 
            });

            const videoBuffer = Buffer.from(response.data, 'binary');

            await sock.sendMessage(jid, {
                video: videoBuffer,
                caption: `*🎥 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳*\n\n` +
                        `📝 𝙿𝚛𝚘𝚖𝚙𝚝: ${text}\n` +
                        `🤖 𝙼𝚘𝚍𝚎𝚕: 𝚂𝙾𝚁𝙰 𝙰𝙸\n` +
                        `⚡ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰 𝙰𝙸`
            }, { quoted: msg });

        } catch (error) {
            console.error('SORA Error:', error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ 𝚅𝙸𝙳𝙴𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙾𝙽 𝙵𝙰𝙸𝙻𝙴𝙳*\n\n` +
                `𝙴𝚛𝚛𝚘𝚛: ${error.message}\n` +
                `𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚠𝚒𝚝𝚑 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚙𝚛𝚘𝚖𝚙𝚝`,
                msg
            );
        }
    }
};