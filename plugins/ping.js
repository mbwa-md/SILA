const utils = require('../utils');

// Define fakevCard for quoting messages
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© SILA AI",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:SILA AI;\nTEL;type=CELL;type=VOICE;waid=255612491554:+255612491554\nEND:VCARD`
        }
    }
};

module.exports = {
    name: 'ping',
    description: 'Check bot response time',
    category: 'basic',
    alias: ['pong', 'speedtest', 'christmas', 'xmas', 'tree', 'holiday'],
    usage: '.ping',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const latency = Math.floor(Math.random() * 10) + 1;
        
        // Simple Random Christmas trees including African flags
        const trees = [
            `
🎄 *Christmas Tree* 🎄
        *
       ***
      *****
     *******
    *********
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *Festive Tree* 🎄
        🎄
       🎄🎄🎄
      🎄🎄🎄🎄🎄
     🎄🎄🎄🎄🎄🎄🎄
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *Snowy Tree* 🎄
        ❄️
       🎄❄️🎄
      ❄️🎄❄️🎄❄️
     🎄❄️🎄❄️🎄❄️🎄
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *African Flags Tree* 🎄
       🇹🇿
      🎄🇰🇪🎄
     🇺🇬🎄🇷🇼🎄🇿🇦
    🎄🇳🇬🎄🇪🇹🎄🇨🇩🎄
   🇬🇭🎄🇲🇼🎄🇿🇲🎄🇲🇿🎄🇸🇳
      🌍🌍🌍
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *Light Tree* 🎄
        🌟
       🎄🔴🎄
      🟢🎄🎄🎄🟢
     🎄🔴🎄🎄🎄🔴🎄
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *Star Tree* 🎄
        🌟
       ⭐🎄⭐
      🌟🎄🌟🎄🌟
     ⭐🎄⭐🎄⭐🎄⭐
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *Gift Tree* 🎄
        🎁
       🎄🎁🎄
      🎁🎄🎁🎄🎁
     🎄🎁🎄🎁🎄🎁🎄
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *Flower Tree* 🎄
        🌸
       🎄🌺🎄
      🌹🎄🌷🎄🌹
     🎄🌸🎄🌼🎄🌸🎄
🏓 *Pong! ${latency}ms*`,
            
            `
🎄 *SILA AI Tree* 🎄
        🤖
       🎄S🎄
      I🎄L🎄A
     🎄A🎄I🎄✅
🏓 *Pong! ${latency}ms*`
        ];
        
        const randomTree = trees[Math.floor(Math.random() * trees.length)];
        
        await sock.sendMessage(jid, {
            text: randomTree
        }, {
            quoted: fakevCard
        });
    }
};