const utils = require('../utils');
const func = require('../lib/function');
const config = require('../config');

// Define fakevCard for Christmas menu
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© SILA AI 🎅",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SILA AI CHRISTMAS\nORG:SILA AI;\nTEL;type=CELL;type=VOICE;waid=255612491554:+255612491554\nEND:VCARD`
        }
    }
};

module.exports = {
    name: 'menu',
    description: 'Show all commands menu',
    category: 'basic',
    alias: ['help', 'cmd', 'commands', 'christmas', 'xmas'],
    usage: '.menu',

    execute: async (sock, jid, msg, args) => {
        try {
            // First send Christmas tree animation
            const christmasTrees = [
                `🎄 *CHRISTMAS TREE* 🎄
        *
       ***
      *****
     *******
    *********
        🎅`,
                
                `🎄 *FESTIVE TREE* 🎄
        🎄
       🎄🎄🎄
      🎄🎄🎄🎄🎄
     🎄🎄🎄🎄🎄🎄🎄
        ✨`,
                
                `🎄 *SNOWY TREE* 🎄
        ❄️
       🎄❄️🎄
      ❄️🎄❄️🎄❄️
     🎄❄️🎄❄️🎄❄️🎄
        ⛄`,
                
                `🎄 *AFRICAN TREE* 🎄
       🇹🇿
      🎄🇰🇪🎄
     🇺🇬🎄🇷🇼🎄🇿🇦
    🎄🇳🇬🎄🇪🇹🎄🇨🇩🎄
        🌍`,
                
                `🎄 *LIGHT TREE* 🎄
        🌟
       🎄🔴🎄
      🟢🎄🎄🎄🟢
     🎄🔴🎄🎄🎄🔴🎄
        💫`
            ];
            
            const randomTree = christmasTrees[Math.floor(Math.random() * christmasTrees.length)];
            
            // Send Christmas tree first
            await sock.sendMessage(jid, {
                text: `🎅 *MERRY CHRISTMAS!* 🎄\n\n${randomTree}\n\n*Loading SILA AI Menu...*`
            }, { quoted: fakevCard });
            
            // Wait 1.5 seconds
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Then send the main menu
            const getRandomImage = () => {
                if (config.BOT_IMAGES && config.BOT_IMAGES.length > 0) {
                    const randomIndex = Math.floor(Math.random() * config.BOT_IMAGES.length);
                    return config.BOT_IMAGES[randomIndex];
                }
                return null;
            };
            
            const randomImage = getRandomImage();
            const mainMenu = `
╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━━━━━━━╮
│ Ultra Fast • Stable • AI Powered
│ Downloader • Tools • Automation
│ Elite WhatsApp Multi-Device Bot
╰━━━━━━━━━━━━━━━━━━━━╯


╭━━〔 𝐁𝐀𝐒𝐈𝐂 〕━━━━━━━━╮
│ • .ping — Check bot latency
│ • .menu — Display menu
│ • .owner — Owner information
│ • .speed — Speed benchmark
│ • .runtime — Uptime status
│ • .alive — Check bot status
│ • .botinfo — Bot information
│ • .stats — Bot statistics
│ • .userinfo — User information
│ • .source — Source code info
│ • .list — Commands list
╰━━━━━━━━━━━━━━━━━━━╯


╭━━〔 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 〕━━━━━━━━╮
│ • .song — Download MP3 music
│ • .play — Auto-search audio
│ • .video — HD video download
│ • .tiktok — TikTok No-WM
│ • .ig — Instagram media DL
│ • .fb — Facebook downloader
│ • .yt — YouTube downloader
│ • .apk — Download APK files
│ • .girl — Random girl videos
╰━━━━━━━━━━━━━━━━━━━━╯


╭━━〔 𝐌𝐄𝐃𝐈𝐀 〕━━━━━━━━╮
│ • .sticker — Image → Sticker
│ • .s — Quick sticker
│ • .toimg — Sticker → Image
│ • .aiimg — AI image generator
│ • .imagine — Make artwork
│ • .flux — Flux AI images
│ • .flux2 — Enhanced AI images
│ • .dalle — DALL-E AI images
│ • .text2img — Text to image
│ • .pies — Random images
│ • .attp — Animated text sticker
│ • .vv — View once media
╰━━━━━━━━━━━━━━━━━━━━━╯


╭━━〔 𝐆𝐑𝐎𝐔𝐏 〕━━━━━━━━╮
│ • .tagall — Mention all
│ • .promote — Make admin
│ • .demote — Remove admin
│ • .kick — Remove member
│ • .add — Add member
│ • .antilink — Anti-group links
│ • .welcome — Welcome message
│ • .bye — Goodbye message
│ • .gcname — Change group name
│ • .gcdesc — Change group desc
│ • .groupinfo — Group info
╰━━━━━━━━━━━━━━━━━━━━━╯


╭━━〔 𝐅𝐔𝐍 〕━━━━━━━━╮
│ • .joke — Random joke
│ • .fact — Crazy world facts
│ • .quote — Inspirational quotes
│ • .meme — Meme generator
│ • .truth — Truth game
│ • .dare — Dare challenge
│ • .dice — Roll dice
│ • .coin — Flip coin
╰━━━━━━━━━━━━━━━━━━━━━╯


╭━━〔 𝐓𝐎𝐎𝐋𝐒 〕━━━━━━━━╮
│ • .qr — Create QR code
│ • .code — WhatsApp linking
│ • .qrread — Read QR code
│ • .translate — Translate text
│ • .calc — Calculator
│ • .weather — Weather info
│ • .time — World time
│ • .currency — Currency convert
│ • .jid — Get JID information
╰━━━━━━━━━━━━━━━━━━━━━╯

━━━━━━━━━━━━━━━━━━━━━━━
🎅 *Merry Christmas from SILA AI!*
📌 *Type .menu2 for more commands*
📞 *Contact: +255612491554*
━━━━━━━━━━━━━━━━━━━━━━━`;
            
            if (randomImage) {
                await sock.sendMessage(jid, {
                    image: { url: randomImage },
                    caption: mainMenu
                });
            } else {
                await sock.sendMessage(jid, {
                    text: mainMenu
                });
            }
            
        } catch (error) {
            console.error('Menu command error:', error);
            
            await sock.sendMessage(jid, {
                text: '🎄 *SILA AI CHRISTMAS EDITION*\n\n' +
                '📱 Main Commands:\n' +
                '• .ping - Check bot\n' +
                '• .song - Download music\n' +
                '• .video - Download video\n' +
                '• .sticker - Make sticker\n' +
                '• .imagine - AI image\n\n' +
                '🎅 Merry Christmas!\n' +
                '👑 Owner: +255612491556'
            }, { quoted: fakevCard });
        }
    }
};