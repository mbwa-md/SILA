const utils = require('../utils');
const config = require('../config');

module.exports = {
    name: 'owner',
    description: 'Show bot owner information with vCard',
    category: 'basic',
    react: '👑',
    alias: ['dev', 'creator', 'developer', 'sila'],
    usage: '.owner',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            // Owner information with vCard
            const ownerInfo = `*👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽*\n\n` +
                            `*📛 𝙽𝚊𝚖𝚎:* 𝚂𝚒𝚕𝚊\n` +
                            `*📱 𝙽𝚞𝚖𝚋𝚎𝚛:* +𝟸𝟻𝟻 𝟼𝟷 𝟸𝟺𝟿 𝟷𝟻𝟻𝟺\n` +
                            `*🤖 𝙱𝚘𝚝 𝙽𝚊𝚖𝚎:* ${config.BOT_NAME}\n` +
                            `*⚡ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗:* 1.𝟶.𝟶\n` +
                            `*🔵 𝚂𝚝𝚊𝚝𝚞𝚜:* 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 ‧ 𝚅𝚎𝚛𝚒𝚏𝚒𝚎𝚍\n\n` +
                            `*𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝙾𝚠𝚗𝚎𝚛:*\n` +
                            `• 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙: 𝚠𝚊.𝚖𝚎/+𝟸𝟻𝟻𝟼𝟷𝟸𝟺𝟿𝟷𝟻𝟻𝟺\n` +
                            `• 𝙼𝚎𝚜𝚜𝚊𝚐𝚎: 𝙷𝚎𝚕𝚕𝚘 𝚂𝚒𝚕𝚊! 𝙸 𝚗𝚎𝚎𝚍 𝚑𝚎𝚕𝚙.\n\n` +
                            `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`;
            
            await utils.sendBlueTickMessage(sock, jid, ownerInfo, msg);
            
            // Send vCard contact
            const vCard = `BEGIN:VCARD
VERSION:3.0
FN:Silas (Bot Owner)
N:Silas;;;;
TEL;type=CELL;type=VOICE;waid=255612491554:+255 61 249 1554
EMAIL:owner@sila-tech.com
ORG:SILA TECH;
TITLE:Bot Developer & Owner
URL:https://wa.me/255612491554
NOTE:WhatsApp Bot Developer - SILA AI Creator
X-ABUID:255612491554@s.whatsapp.net
END:VCARD`;
            
            // Send vCard
            await sock.sendMessage(jid, {
                contacts: {
                    displayName: '*Sila*',
                    contacts: [{
                        vcard: vCard
                    }]
                }
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Owner command error:', error);
            
            // Fallback without vCard
            await utils.sendBlueTickMessage(sock, jid,
                `*👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁*\n\n` +
                `*𝙽𝚊𝚖𝚎:* 𝚂𝚒𝚕𝚊\n` +
                `*𝙽𝚞𝚖𝚋𝚎𝚛:* +𝟸𝟻𝟻 𝟼𝟷 𝟸𝟺𝟿 𝟷𝟻𝟻𝟺\n` +
                `*𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙:* 𝚠𝚊.𝚖𝚎/𝟸𝟻𝟻𝟼𝟷𝟸𝟺𝟿𝟷𝟻𝟻𝟺\n\n` +
                `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`,
                msg
            );
        }
    }
};
 