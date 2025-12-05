const { isJidGroup } = require('@whiskeysockets/baileys');
const utils = require('../utils');

module.exports = {
    // Handle group participants update
    handleGroupUpdate: async (sock, update) => {
        try {
            if (!update || !update.id || !update.participants) return;
            
            const isGroup = isJidGroup(update.id);
            if (!isGroup) return;

            const metadata = await sock.groupMetadata(update.id);
            const participants = update.participants;

            for (const num of participants) {
                const userName = num.split("@")[0];

                if (update.action === "add") {
                    // Welcome message - short with decoration
                    const welcomeText = `╭━━【 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 】━━━━━━━━╮\n` +
                                       `│ 👋 @${userName}\n` +
                                       `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                                       `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`;
                    
                    await sock.sendMessage(update.id, {
                        text: welcomeText,
                        mentions: [num]
                    }, { quoted: utils.fakevCard });

                } else if (update.action === "remove") {
                    // Goodbye message - short with decoration
                    const goodbyeText = `╭━━【 𝐆𝐎𝐎𝐃𝐁𝐘𝐄 】━━━━━━━━╮\n` +
                                       `│ 👋 @${userName}\n` +
                                       `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                                       `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`;
                    
                    await sock.sendMessage(update.id, {
                        text: goodbyeText,
                        mentions: [num]
                    }, { quoted: utils.fakevCard });

                } else if (update.action === "promote") {
                    // Promote message - short
                    const promoter = update.author?.split("@")[0] || "System";
                    const promoteText = `╭━━【 𝐏𝐑𝐎𝐌𝐎𝐓𝐄 】━━━━━━━━╮\n` +
                                       `│ ⬆️ @${userName}\n` +
                                       `│ 👑 By: @${promoter}\n` +
                                       `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                                       `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`;
                    
                    const mentions = update.author ? [update.author, num] : [num];
                    await sock.sendMessage(update.id, {
                        text: promoteText,
                        mentions: mentions
                    }, { quoted: utils.fakevCard });

                } else if (update.action === "demote") {
                    // Demote message - short
                    const demoter = update.author?.split("@")[0] || "System";
                    const demoteText = `╭━━【 𝐃𝐄𝐌𝐎𝐓𝐄 】━━━━━━━━╮\n` +
                                      `│ ⬇️ @${userName}\n` +
                                      `│ 👑 By: @${demoter}\n` +
                                      `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                                      `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`;
                    
                    const mentions = update.author ? [update.author, num] : [num];
                    await sock.sendMessage(update.id, {
                        text: demoteText,
                        mentions: mentions
                    }, { quoted: utils.fakevCard });
                }
            }
        } catch (err) {
            console.error('Group event error:', err);
        }
    },

    // Auto sticker replies
    autoStickerReply: async (sock, jid, text) => {
        try {
            const stickerMap = {
                'hi': 'hello',
                'hello': 'hello',
                'bye': 'bye',
                'thanks': 'thanks'
            };
            
            const lowerText = text.toLowerCase();
            for (const [word, sticker] of Object.entries(stickerMap)) {
                if (lowerText.includes(word)) {
                    const fs = require('fs');
                    const stickerPath = `./assets/autosticker/${sticker}.webp`;
                    
                    if (fs.existsSync(stickerPath)) {
                        const stickerBuffer = fs.readFileSync(stickerPath);
                        await sock.sendMessage(jid, { 
                            sticker: stickerBuffer
                        }, { quoted: utils.fakevCard });
                        return true;
                    }
                    break;
                }
            }
            return false;
        } catch (error) {
            console.error('Auto sticker error:', error);
            return false;
        }
    }
};