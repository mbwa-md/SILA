const utils = require('../utils');

module.exports = {
    name: 'jid',
    description: 'Get WhatsApp JID information',
    category: 'utility',
    alias: ['userid', 'id', 'infojid'],
    usage: '.jid [reply/mention]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const from = msg.key.remoteJid;
            const sender = msg.key.participant || from;
            const pushname = msg.pushName || "𝚄𝚜𝚎𝚛";
            
            let targetJid;
            let targetName;
            let targetType;

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
                targetName = "𝙼𝚎𝚗𝚝𝚒𝚘𝚗𝚎𝚍 𝚄𝚜𝚎𝚛";
                targetType = "𝚄𝚜𝚎𝚛";
            } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                targetJid = msg.message.extendedTextMessage.contextInfo.participant;
                targetName = "𝚀𝚞𝚘𝚝𝚎𝚍 𝚄𝚜𝚎𝚛";
                targetType = "𝚄𝚜𝚎𝚛";
            } else if (from.endsWith('@g.us')) {
                const metadata = await sock.groupMetadata(from);
                targetJid = from;
                targetName = metadata.subject || "𝙶𝚛𝚘𝚞𝚙";
                targetType = "𝙶𝚛𝚘𝚞𝚙";
            } else if (from.endsWith('@newsletter')) {
                targetJid = from;
                targetName = "𝙲𝚑𝚊𝚗𝚗𝚎𝚕";
                targetType = "𝙲𝚑𝚊𝚗𝚗𝚎𝚕";
            } else {
                targetJid = sender;
                targetName = pushname;
                targetType = "𝚄𝚜𝚎𝚛";
            }

            const caption = `
*🔍 𝙹𝙸𝙳 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽*

🆔 𝙹𝙸𝙳 : ${targetJid}
📛 𝙽𝚊𝚖𝚎 : ${targetName}
📋 𝚃𝚢𝚙𝚎 : ${targetType}
👤 𝚁𝚎𝚚𝚞𝚎𝚜𝚝𝚎𝚍 𝚋𝚢 : ${pushname}
⚡ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰 𝙰𝙸`;

            await sock.sendMessage(jid, {
                text: caption,
                mentions: [targetJid]
            }, { quoted: msg });

        } catch (error) {
            console.error("JID Command Error:", error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ 𝙹𝙸𝙳 𝙴𝚁𝚁𝙾𝚁*\n\n` +
                `𝙴𝚛𝚛𝚘𝚛: ${error.message}\n\n` +
                `𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗:\n` +
                `• 𝙼𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚢𝚘𝚞'𝚛𝚎 𝚛𝚎𝚙𝚕𝚢𝚒𝚗𝚐 𝚝𝚘 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎\n` +
                `• 𝙲𝚑𝚎𝚌𝚔 𝚒𝚏 𝚝𝚑𝚎 𝚞𝚜𝚎𝚛 𝚒𝚜 𝚜𝚝𝚒𝚕𝚕 𝚒𝚗 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙`,
                msg
            );
        }
    }
};