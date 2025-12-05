const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'slide',
    description: 'Show slide right menu',
    category: 'basic',
    alias: ['menu2', 'slide-right', 'carousel'],
    usage: '.slide',

    execute: async (sock, jid, msg, args) => {
        try {
            await sendSlideRightMenu(sock, jid, msg);
        } catch (error) {
            console.error('Slide command error:', error);
            
            // Fallback simple message
            await sock.sendMessage(jid, {
                text: '🔵 *SILA AI SLIDE MENU*\n\n' +
                      '🤖 AI: .ai .gpt .imagine\n' +
                      '🔍 Search: .google .youtube\n' +
                      '⚙️ Settings: .autoreact .status\n' +
                      '👑 Admin: .bc .restart .block\n\n' +
                      '👑 Owner: +255612491556'
            }, { quoted: msg });
        }
    }
};

async function sendSlideRightMenu(sock, jid, msg) {
    try {
        // Create carousel cards
        const cards = [];
        
        // Card 1 - AI & Chat
        cards.push({
            header: {
                title: "🤖 AI & CHAT",
                subtitle: "SILA AI BOT",
                hasMediaAttachment: false
            },
            body: {
                text: `╭━━〔 𝐀𝐈 & 𝐂𝐇𝐀𝐓 〕━━━━━━━━╮
│ • .ai — AI conversational mode
│ • .gpt — GPT model response
│ • .gemini — Gemini AI model
│ • .bard — Bard AI assistant
│ • .ask — Smart answer system
│ • .chatbot — Auto AI replies
│ • .sora — AI video generator
╰━━━━━━━━━━━━━━━━━━━━━╯

📌 *Examples:*
• .ai What is AI?
• .gpt Explain quantum computing
• .imagine sunset beach`
            },
            nativeFlowMessage: {
                buttons: [{
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🔵 View AI Commands",
                        id: "view_ai"
                    })
                }]
            }
        });
        
        // Card 2 - Search
        cards.push({
            header: {
                title: "🔍 SEARCH",
                subtitle: "SILA AI BOT",
                hasMediaAttachment: false
            },
            body: {
                text: `╭━━〔 𝐒𝐄𝐀𝐑𝐂𝐇 〕━━━━━━━━╮
│ • .google — Google search
│ • .youtube — YouTube search
│ • .wikipedia — Wiki information
│ • .imdb — Movie details
│ • .lyrics — Song lyrics
╰━━━━━━━━━━━━━━━━━━━━━╯

📌 *Examples:*
• .google latest technology
• .youtube music video
• .lyrics Shape of You`
            },
            nativeFlowMessage: {
                buttons: [{
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🔵 View Search Commands",
                        id: "view_search"
                    })
                }]
            }
        });
        
        // Card 3 - Settings
        cards.push({
            header: {
                title: "⚙️ SETTINGS",
                subtitle: "SILA AI BOT",
                hasMediaAttachment: false
            },
            body: {
                text: `╭━━〔 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 〕━━━━━━━━╮
│ • .autoreact — Auto reactions
│ • .channel — Newsletter join
│ • .status — Status viewer
╰━━━━━━━━━━━━━━━━━━━━━━╯

✨ *Features:*
• Status auto-view: ✅
• Status auto-like: ✅
• Auto join channels: ✅
• Auto join groups: ✅`
            },
            nativeFlowMessage: {
                buttons: [{
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🔵 View Settings",
                        id: "view_settings"
                    })
                }]
            }
        });
        
        // Card 4 - Admin
        cards.push({
            header: {
                title: "👑 ADMIN",
                subtitle: "SILA AI BOT",
                hasMediaAttachment: false
            },
            body: {
                text: `╭━━〔 𝐀𝐃𝐌𝐈𝐍 〕━━━━━━━━╮
│ • .bc — Broadcast message
│ • .restart — Restart bot
│ • .block — Block user
│ • .unblock — Unblock user
│ • .reload — Reload plugins
│ • .backup — Backup data
╰━━━━━━━━━━━━━━━━━━━━━━╯

📊 *Bot Stats:*
• Commands: 82 total
• Status: ✅ Online
• Owner: +255612491556
• Verified: 🔵 WhatsApp`
            },
            nativeFlowMessage: {
                buttons: [{
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🔵 View Admin Commands",
                        id: "view_admin"
                    })
                }]
            }
        });
        
        // Create the carousel message
        const carouselMessage = generateWAMessageFromContent(
            jid,
            {
                interactiveMessage: {
                    body: { 
                        text: "*╭━━【 𝐒𝐋𝐈𝐃𝐄 𝐑𝐈𝐆𝐇𝐓 】━━━━━━━━╮*\n*│ 🔵 SILA AI MENU │*\n*╰━━━━━━━━━━━━━━━━━━━━╯*" 
                    },
                    footer: { text: "👑 Owner: +255612491556 • 🔵 WhatsApp ‧ Verified" },
                    carouselMessage: { 
                        cards, 
                        messageVersion: 1 
                    },
                    contextInfo: { 
                        forwardingScore: 999, 
                        isForwarded: true,
                        externalAdReply: {
                            title: 'SILA AI',
                            body: 'WhatsApp ‧ Verified',
                            thumbnailUrl: 'https://i.ibb.co/0jqWZzK/verified-bot.png',
                            sourceUrl: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02'
                        }
                    }
                }
            },
            { quoted: msg }
        );
        
        // Send the message
        await sock.relayMessage(jid, carouselMessage.message, {
            messageId: carouselMessage.key.id
        });
        
        // Setup button listener
        setupButtonListener(sock, jid, carouselMessage.key.id);
        
    } catch (error) {
        console.error('Slide right menu error:', error);
        throw error;
    }
}

function setupButtonListener(sock, chatId, messageId) {
    const listener = async (m) => {
        try {
            const mek = m.messages?.[0];
            if (!mek?.message) return;
            
            const from = mek.key.remoteJid;
            if (from !== chatId) return;
            
            // Check if it's a reply to our slide message
            const isReply = mek.message?.extendedTextMessage?.contextInfo?.stanzaId === messageId;
            if (!isReply) return;
            
            // Get button text
            const text = mek.message?.conversation || 
                         mek.message?.extendedTextMessage?.text || '';
            
            // Send reaction
            try {
                await sock.sendMessage(from, {
                    react: { text: '✅', key: mek.key }
                });
            } catch (e) {}
            
            // Handle button clicks
            if (text.includes('view_ai')) {
                await sock.sendMessage(from, {
                    text: `🤖 *SILA AI - AI COMMANDS*\n\n` +
                          `╭━━〔 𝐀𝐈 & 𝐂𝐇𝐀𝐓 〕━━━━━━━━╮\n` +
                          `│ • .ai — AI conversational mode\n` +
                          `│ • .gpt — GPT model response\n` +
                          `│ • .gemini — Gemini AI model\n` +
                          `│ • .bard — Bard AI assistant\n` +
                          `│ • .ask — Smart answer system\n` +
                          `│ • .chatbot — Auto AI replies\n` +
                          `│ • .sora — AI video generator\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                          `📌 *Examples:*\n` +
                          `• .ai What is artificial intelligence?\n` +
                          `• .gpt Explain quantum computing\n` +
                          `• .imagine beautiful sunset`
                }, { quoted: mek });
            }
            else if (text.includes('view_search')) {
                await sock.sendMessage(from, {
                    text: `🔍 *SILA AI - SEARCH COMMANDS*\n\n` +
                          `╭━━〔 𝐒𝐄𝐀𝐑𝐂𝐇 〕━━━━━━━━╮\n` +
                          `│ • .google — Google search\n` +
                          `│ • .youtube — YouTube search\n` +
                          `│ • .wikipedia — Wiki information\n` +
                          `│ • .imdb — Movie details\n` +
                          `│ • .lyrics — Song lyrics\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                          `📌 *Examples:*\n` +
                          `• .google latest technology news\n` +
                          `• .youtube music videos 2024\n` +
                          `• .lyrics Shape of You`
                }, { quoted: mek });
            }
            else if (text.includes('view_settings')) {
                await sock.sendMessage(from, {
                    text: `⚙️ *SILA AI - SETTINGS*\n\n` +
                          `╭━━〔 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 〕━━━━━━━━╮\n` +
                          `│ • .autoreact — Auto reactions\n` +
                          `│ • .channel — Newsletter join\n` +
                          `│ • .status — Status viewer\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                          `✨ *Auto Features:*\n` +
                          `• Status auto-view: ✅ Active\n` +
                          `• Status auto-like: ✅ Active\n` +
                          `• Auto join channels: ✅ Active\n` +
                          `• Auto join groups: ✅ Active\n\n` +
                          `👑 Owner: +255612491556`
                }, { quoted: mek });
            }
            else if (text.includes('view_admin')) {
                await sock.sendMessage(from, {
                    text: `👑 *SILA AI - ADMIN COMMANDS*\n\n` +
                          `╭━━〔 𝐀𝐃𝐌𝐈𝐍 〕━━━━━━━━╮\n` +
                          `│ • .bc — Broadcast message\n` +
                          `│ • .restart — Restart bot\n` +
                          `│ • .block — Block user\n` +
                          `│ • .unblock — Unblock user\n` +
                          `│ • .reload — Reload plugins\n` +
                          `│ • .backup — Backup data\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                          `📊 *Bot Stats:*\n` +
                          `• Commands: 82 total\n` +
                          `• Status: ✅ Online\n` +
                          `• Uptime: Active\n` +
                          `• Verified: 🔵 WhatsApp\n\n` +
                          `👑 Owner: +255612491556`
                }, { quoted: mek });
            }
            
        } catch (error) {
            console.error('Button listener error:', error);
        }
    };
    
    // Add listener
    sock.ev.on('messages.upsert', listener);
    
    // Auto remove listener after 2 minutes
    setTimeout(() => {
        sock.ev.off('messages.upsert', listener);
    }, 1000);
}

async function sendSimpleSlide(sock, jid, msg) {
    const simpleSlide = `╭━━【 𝐒𝐋𝐈𝐃𝐄 𝐑𝐈𝐆𝐇𝐓 】━━━━━━━━╮
│ 🔵 SILA AI COMMAND MENU
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 𝐀𝐈 & 𝐂𝐇𝐀𝐓 〕━━━━━━━━╮
│ • .ai — AI conversational mode
│ • .gpt — GPT model response
│ • .gemini — Gemini AI model
│ • .bard — Bard AI assistant
│ • .ask — Smart answer system
│ • .chatbot — Auto AI replies
│ • .sora — AI video generator
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 𝐒𝐄𝐀𝐑𝐂𝐇 〕━━━━━━━━╮
│ • .google — Google search
│ • .youtube — YouTube search
│ • .wikipedia — Wiki information
│ • .imdb — Movie details
│ • .lyrics — Song lyrics
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 〕━━━━━━━━╮
│ • .autoreact — Auto reactions
│ • .channel — Newsletter join
│ • .status — Status viewer
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 𝐀𝐃𝐌𝐈𝐍 〕━━━━━━━━╮
│ • .bc — Broadcast message
│ • .restart — Restart bot
│ • .block — Block user
│ • .unblock — Unblock user
│ • .reload — Reload plugins
│ • .backup — Backup data
╰━━━━━━━━━━━━━━━━━━━━━━╯

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified
🤖 SILA AI BOT`;
    
    await sock.sendMessage(jid, { text: simpleSlide }, { quoted: msg });
}