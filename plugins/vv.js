const utils = require('../utils');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'vv',
    description: 'Retrieve view once media (photo, video, audio)',
    category: 'media',
    alias: ['antivv', 'avv', 'viewonce', 'open', 'openphoto', 'openvideo', 'vvphoto', 'vvvideo'],
    usage: '.vv (reply to view once media)',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quoted) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*🔒 𝚅𝙸𝙴𝚆 𝙾𝙽𝙲𝙴 𝙼𝙴𝙳𝙸𝙰 𝚁𝙴𝚃𝚁𝙸𝙴𝚅𝙴𝚁*\n\n` +
                    `𝙷𝚊𝚜 𝚊𝚗𝚢𝚘𝚗𝚎 𝚜𝚎𝚗𝚝 𝚢𝚘𝚞 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚙𝚑𝚘𝚝𝚘, 𝚟𝚒𝚍𝚎𝚘 𝚘𝚛 𝚊𝚞𝚍𝚒𝚘?\n` +
                    `𝚃𝚑𝚎𝚗 𝚞𝚜𝚎 𝚕𝚒𝚔𝚎 𝚝𝚑𝚒𝚜:\n\n` +
                    `.𝚟𝚟 (𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚟𝚒𝚎𝚠 𝚘𝚗𝚌𝚎 𝚖𝚎𝚍𝚒𝚊)\n\n` +
                    `𝚃𝚑𝚎 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚖𝚎𝚍𝚒𝚊 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚛𝚎𝚝𝚛𝚒𝚎𝚟𝚎𝚍`,
                    msg
                );
                return;
            }
            
            let type = Object.keys(quoted)[0];
            if (!["imageMessage", "videoMessage", "audioMessage"].includes(type)) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*❌ 𝙸𝙽𝚅𝙰𝙻𝙸𝙳 𝙼𝙴𝙳𝙸𝙰*\n\n` +
                    `𝚈𝚘𝚞 𝚘𝚗𝚕𝚢 𝚗𝚎𝚎𝚍 𝚝𝚘 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚙𝚑𝚘𝚝𝚘, 𝚟𝚒𝚍𝚎𝚘 𝚘𝚛 𝚊𝚞𝚍𝚒𝚘`,
                    msg
                );
                return;
            }
            
            const stream = await downloadContentFromMessage(quoted[type], type.replace("Message", ""));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            let sendContent = {};
            if (type === "imageMessage") {
                sendContent = {
                    image: buffer,
                    caption: quoted[type]?.caption || "",
                    mimetype: quoted[type]?.mimetype || "image/jpeg"
                };
            } else if (type === "videoMessage") {
                sendContent = {
                    video: buffer,
                    caption: quoted[type]?.caption || "",
                    mimetype: quoted[type]?.mimetype || "video/mp4"
                };
            } else if (type === "audioMessage") {
                sendContent = {
                    audio: buffer,
                    mimetype: quoted[type]?.mimetype || "audio/mp4",
                    ptt: quoted[type]?.ptt || false
                };
            }
            
            await sock.sendMessage(jid, sendContent, { quoted: msg });
            
            await utils.sendBlueTickMessage(sock, jid,
                `*✅ 𝙼𝙴𝙳𝙸𝙰 𝚁𝙴𝚃𝚁𝙸𝙴𝚅𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈*`,
                msg
            );
            
        } catch (error) {
            console.error('ViewOnce error:', error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝚁𝙴𝚃𝚁𝙸𝙴𝚅𝙴 𝙼𝙴𝙳𝙸𝙰*\n\n` +
                `𝙴𝚛𝚛𝚘𝚛: ${error.message}\n\n` +
                `𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚠𝚒𝚝𝚑 .𝚟𝚟`,
                msg
            );
        }
    }
};