// utils.js au christmas.js
const ChristmasUtils = {
    // Christmas trees collection
    christmasTrees: [
        {
            name: "Classic Tree",
            pattern: `🎄 *Christmas Tree* 🎄
        *
       ***
      *****
     *******
    *********
        🎅`
        },
        {
            name: "Snowy Tree",
            pattern: `🎄 *Snowy Tree* 🎄
        ❄️
       🎄❄️🎄
      ❄️🎄❄️🎄❄️
     🎄❄️🎄❄️🎄❄️🎄
        ⛄`
        },
        {
            name: "African Tree",
            pattern: `🎄 *African Tree* 🎄
       🇹🇿
      🎄🇰🇪🎄
     🇺🇬🎄🇷🇼🎄🇿🇦
    🎄🇳🇬🎄🇪🇹🎄🇨🇩🎄
        🌍`
        },
        {
            name: "Festive Tree",
            pattern: `🎄 *Festive Tree* 🎄
        🎄
       🎄🎄🎄
      🎄🎄🎄🎄🎄
     🎄🎄🎄🎄🎄🎄🎄
        ✨`
        },
        {
            name: "Light Tree",
            pattern: `🎄 *Light Tree* 🎄
        🌟
       🎄🔴🎄
      🟢🎄🎄🎄🟢
     🎄🔴🎄🎄🎄🔴🎄
        💫`
        }
    ],

    // Christmas fakevCard
    christmasFakevCard: {
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
    },

    // Get random tree
    getRandomTree: function() {
        const trees = this.christmasTrees;
        return trees[Math.floor(Math.random() * trees.length)].pattern;
    },

    // Send Christmas animation
    sendChristmasAnimation: async function(sock, jid, callback) {
        try {
            // Send tree first
            await sock.sendMessage(jid, {
                text: this.getRandomTree()
            }, { quoted: this.christmasFakevCard });
            
            // Wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Execute callback (menu or other function)
            if (callback && typeof callback === 'function') {
                await callback();
            }
            
            return true;
        } catch (error) {
            console.error('Christmas animation error:', error);
            return false;
        }
    },

    // Simple function to get Christmas tree only
    getChristmasTree: function() {
        return this.getRandomTree();
    }
};

module.exports = ChristmasUtils;