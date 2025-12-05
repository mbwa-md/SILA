const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'pies',
    description: 'Get random images from various categories',
    category: 'download',
    alias: ['random', 'image', 'pic', 'img'],
    usage: '.pies [category]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const category = args[0]?.toLowerCase() || 'random';

            const categories = {
                'japan': '𝙹𝚊𝚙𝚊𝚗𝚎𝚜𝚎',
                'korea': '𝙺𝚘𝚛𝚎𝚊𝚗', 
                'china': '𝙲𝚑𝚒𝚗𝚎𝚜𝚎',
                'hijab': '𝙷𝚒𝚓𝚊𝚋',
                'indonesia': '𝙸𝚗𝚍𝚘𝚗𝚎𝚜𝚒𝚊𝚗',
                'malaysia': '𝙼𝚊𝚕𝚊𝚢𝚜𝚒𝚊𝚗',
                'thailand': '𝚃𝚑𝚊𝚒',
                'vietnam': '𝚅𝚒𝚎𝚝𝚗𝚊𝚖𝚎𝚜𝚎',
                'random': '𝚁𝚊𝚗𝚍𝚘𝚖'
            };

            if (!categories[category]) {
                const availableCats = Object.keys(categories).join(', ');
                await utils.sendBlueTickMessage(sock, jid,
                    `*🖼️ 𝚁𝙰𝙽𝙳𝙾𝙼 𝙸𝙼𝙰𝙶𝙴𝚂*\n\n` +
                    `𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚊𝚝𝚎𝚐𝚘𝚛𝚒𝚎𝚜:\n${availableCats}\n\n` +
                    `𝚄𝚜𝚊𝚐𝚎:\n` +
                    `.𝚙𝚒𝚎𝚜 𝚓𝚊𝚙𝚊𝚗\n` +
                    `.𝚙𝚒𝚎𝚜 𝚔𝚘𝚛𝚎𝚊\n` +
                    `.𝚙𝚒𝚎𝚜 𝚑𝚒𝚓𝚊𝚋\n` +
                    `.𝚙𝚒𝚎𝚜 𝚛𝚊𝚗𝚍𝚘𝚖`,
                    msg
                );
                return;
            }

            await utils.sendBlueTickMessage(sock, jid,
                `*🖼️ 𝙶𝙴𝚃𝚃𝙸𝙽𝙶 𝙸𝙼𝙰𝙶𝙴...*\n\n` +
                `📂 𝙲𝚊𝚝𝚎𝚐𝚘𝚛𝚢: ${categories[category]}\n` +
                `⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...`,
                msg
            );

            const apiUrl = `https://shizoapi.onrender.com/api/pies?type=${category}`;
            
            const response = await axios.get(apiUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });

            const imageBuffer = Buffer.from(response.data, 'binary');

            await sock.sendMessage(jid, {
                image: imageBuffer,
                caption: `*🖼️ 𝚁𝙰𝙽𝙳𝙾𝙼 𝙸𝙼𝙰𝙶𝙴*\n\n` +
                        `📂 𝙲𝚊𝚝𝚎𝚐𝚘𝚛𝚢: ${categories[category]}\n` +
                        `⚡ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰 𝙰𝙸`
            }, { quoted: msg });

        } catch (error) {
            console.error('PIES Error:', error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ 𝙸𝙼𝙰𝙶𝙴 𝙴𝚁𝚁𝙾𝚁*\n\n` +
                `𝙴𝚛𝚛𝚘𝚛: ${error.message}\n` +
                `𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚠𝚒𝚝𝚑 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚌𝚊𝚝𝚎𝚐𝚘𝚛𝚢`,
                msg
            );
        }
    }
};