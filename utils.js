const axios = require('axios');
const config = require('./config');

// Define combined fakevCard with Christmas and regular version
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© SILA AI 🎅", // Christmas included
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SILA AI CHRISTMAS\nORG:SILA AI;\nTEL;type=CELL;type=VOICE;waid=255612491554:+255612491554\nEND:VCARD`
        }
    }
};

// Define WhatsApp Channel JID for forwarding
const whatsappChannelJid = "120363402325089913@newsletter"; // Your channel JID

module.exports = {
    // Christmas trees collection
    christmasTrees: [
        `        *
       ***
      *****
     *******
    *********
        🎅`,
        
        `        🎄
       🎄🎄🎄
      🎄🎄🎄🎄🎄
     🎄🎄🎄🎄🎄🎄🎄
        ✨`,
        
        `        ❄️
       🎄❄️🎄
      ❄️🎄❄️🎄❄️
     🎄❄️🎄❄️🎄❄️🎄
        ⛄`,
        
        `       🇹🇿
      🎄🇰🇪🎄
     🇺🇬🎄🇷🇼🎄🇿🇦
    🎄🇳🇬🎄🇪🇹🎄🇨🇩🎄
        🌍`,
        
        `        🌟
       🎄🔴🎄
      🟢🎄🎄🎄🟢
     🎄🔴🎄🎄🎄🔴🎄
        💫`
    ],

    // Get random Christmas tree
    getChristmasTree: function() {
        return this.christmasTrees[Math.floor(Math.random() * this.christmasTrees.length)];
    },

    // Send Christmas animation
    sendChristmasAnimation: async function(sock, jid, callback) {
        try {
            // Send tree first
            const randomTree = this.getChristmasTree();
            await sock.sendMessage(jid, {
                text: `🎅 *MERRY CHRISTMAS!* 🎄\n\n${randomTree}\n\n*Loading...*`
            }, { quoted: fakevCard });
            
            // Wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Execute callback if provided
            if (callback && typeof callback === 'function') {
                await callback();
            }
            
            return true;
        } catch (error) {
            console.error('Christmas animation error:', error);
            return false;
        }
    },

    // Create Christmas message
    createChristmasMessage: function(text, includeTree = true) {
        let messageText = '';
        if (includeTree) {
            const randomTree = this.getChristmasTree();
            messageText = `🎅 *MERRY CHRISTMAS!* 🎄\n\n${randomTree}\n\n${text}\n\n🎅 *Merry Christmas!*`;
        } else {
            messageText = text + "\n\n🎅 *Merry Christmas!*";
        }
        
        return {
            text: messageText,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '🎅SILA TECH🎅',
                    serverMessageId: Math.floor(Math.random() * 1000000)
                },
                isForwarded: true,
                forwardingScore: 999
            }
        };
    },

    // Send Christmas message
    sendChristmasMessage: async function(sock, jid, text, includeTree = true, quoted = fakevCard) {
        try {
            // Send typing indicator
            try {
                await sock.sendPresenceUpdate('composing', jid);
            } catch (e) {}
            
            await this.sleep(100);
            
            const message = this.createChristmasMessage(text, includeTree);
            
            await sock.sendMessage(jid, message, { 
                quoted: quoted || fakevCard,
                backgroundColor: '#006400', // Christmas green
                font: 2 // Bold font
            });
            
            // Stop typing
            try {
                await sock.sendPresenceUpdate('available', jid);
            } catch (e) {}
            
            return true;
        } catch (error) {
            console.error(`Christmas message send failed: ${error.message}`);
            
            // Fallback: Send normal message
            try {
                const randomTree = this.getChristmasTree();
                await sock.sendMessage(jid, { 
                    text: `🎅 *MERRY CHRISTMAS!* 🎄\n\n${randomTree}\n\n${text}\n\n🔵 SILA AI • Christmas Mode`
                }, { quoted: quoted || fakevCard });
                return true;
            } catch (fallbackError) {
                console.error(`Fallback also failed: ${fallbackError.message}`);
                return false;
            }
        }
    },

    // Create WhatsApp verified message with blue tick
    createBlueTickMessage: (text) => {
        return {
            text: text,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '🎅SILA TECH🎅',
                    serverMessageId: Math.floor(Math.random() * 1000000)
                },
                isForwarded: true,
                forwardingScore: 999
            }
        };
    },
    
    // Send blue tick message
    sendBlueTickMessage: async (sock, jid, text, quoted = fakevCard) => {
        try {
            // Send "typing" indicator
            try {
                await sock.sendPresenceUpdate('composing', jid);
            } catch (e) {}
            
            await module.exports.sleep(100);
            
            const message = module.exports.createBlueTickMessage(text);
            
            await sock.sendMessage(jid, message, { 
                quoted: quoted || fakevCard,
                backgroundColor: '#0066CC',
                font: 1
            });
            
            // Stop typing
            try {
                await sock.sendPresenceUpdate('available', jid);
            } catch (e) {}
            
            return true;
        } catch (error) {
            console.error(`Blue tick send failed: ${error.message}`);
            
            // Fallback: Send normal message
            try {
                await sock.sendMessage(jid, { 
                    text: `${text}\n\n🔵 SILA AI • WhatsApp Verified • Channel`
                }, { quoted: quoted || fakevCard });
                return true;
            } catch (fallbackError) {
                console.error(`Fallback also failed: ${fallbackError.message}`);
                return false;
            }
        }
    },

    // Create simple message with forwarding
    createSimpleMessage: (text) => {
        return {
            text: text,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: whatsappChannelJid,
                    newsletterName: 'SILA AI',
                    serverMessageId: Math.floor(Math.random() * 1000000)
                },
                isForwarded: true,
                forwardingScore: 500
            }
        };
    },

    // Get random item from array
    getRandom: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    // Sleep function with delay
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Format phone number to WhatsApp JID      
    formatNumber: (num) => {
        num = num.replace(/\D/g, ''); // Remove non-digits
        
        // Handle Tanzanian numbers
        if (num.startsWith('0')) {
            num = '255' + num.substring(1);
        }
        // Handle +255 numbers
        else if (num.startsWith('255')) {
            num = num;
        }
        // Handle 255 without +
        else if (num.length === 12 && num.startsWith('255')) {
            num = num;
        }
        // Default to 255 if no country code
        else if (num.length === 9) {
            num = '255' + num;
        }
        
        return num + '@s.whatsapp.net';
    },
    
    // Get random bot image from config
    getRandomBotImage: () => {
        if (config.BOT_IMAGES && config.BOT_IMAGES.length > 0) {
            return config.BOT_IMAGES[Math.floor(Math.random() * config.BOT_IMAGES.length)];
        }
        // Fallback images
        return 'https://files.catbox.moe/jwmx1j.jpg';
    },
    
    // Send simple message with fakevCard
    sendMessage: async (sock, jid, text, quoted = fakevCard) => {
        try {
            // Use createSimpleMessage for consistent formatting
            const message = module.exports.createSimpleMessage(text);
            
            await sock.sendMessage(jid, message, { 
                quoted: quoted || fakevCard
            });
            return true;
        } catch (error) {
            console.error(`Send message error: ${error.message}`);
            
            // Ultra simple fallback
            try {
                await sock.sendMessage(jid, { text }, { 
                    quoted: quoted || fakevCard 
                });
                return true;
            } catch (fallbackError) {
                return false;
            }
        }
    },
    
    // Send reaction to message
    sendReaction: async (sock, jid, msgKey, emoji = '❤️') => {
        try {
            await sock.sendMessage(jid, {
                react: { text: emoji, key: msgKey }
            });
            return true;
        } catch (error) {
            console.error(`Reaction failed: ${error.message}`);
            return false;
        }
    },
    
    // Download file from URL
    downloadFile: async (url, outputPath) => {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream',
                timeout: 30000
            });
            
            const writer = require('fs').createWriteStream(outputPath);
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    },
    
    // Download buffer from URL
    downloadBuffer: async (url) => {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            return Buffer.from(response.data);
        } catch (error) {
            throw new Error(`Buffer download failed: ${error.message}`);
        }
    },
    
    // Format bytes to readable size
    formatBytes: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    // Format time duration
    formatTime: (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
        
        return parts.join(' ');
    },
    
    // Generate random string
    randomString: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    },
    
    // Validate URL
    isValidUrl: (string) => {
        try {
            new URL(string);
            return true;
        } catch (err) {
            return false;
        }
    },
    
    // Extract URLs from text
    extractUrls: (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) || [];
    },
    
    // Parse mention from text
    parseMentions: (text) => {
        const mentionRegex = /@(\d+)/g;
        const mentions = [];
        let match;
        
        while ((match = mentionRegex.exec(text)) !== null) {
            mentions.push(match[1] + '@s.whatsapp.net');
        }
        
        return mentions;
    },
    
    // Check if user is bot owner
    isOwner: (userId) => {
        return userId === config.BOT_OWNER;
    },
    
    // Get current timestamp
    getTimestamp: () => {
        return Date.now();
    },
    
    // Format date
    formatDate: (timestamp = Date.now()) => {
        return new Date(timestamp).toLocaleString('en-US', {
            timeZone: 'Africa/Dar_es_Salaam',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },
    
    // Create progress bar
    createProgressBar: (current, total, size = 20) => {
        const percentage = current / total;
        const filled = Math.round(size * percentage);
        const empty = size - filled;
        
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        const percent = (percentage * 100).toFixed(1);
        
        return `[${bar}] ${percent}%`;
    },
    
    // Truncate text
    truncateText: (text, length = 100) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },
    
    // Capitalize first letter
    capitalize: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    
    // Remove emojis from text
    removeEmojis: (text) => {
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{FE00}-\u{FE0F}]/gu, '');
    },
    
    // Count words
    countWords: (text) => {
        return text.trim().split(/\s+/).length;
    },
    
    // Generate command usage help
    generateCommandHelp: (commandName, plugin) => {
        return `*${commandName.toUpperCase()} COMMAND*\n\n` +
               `📝 *Description:* ${plugin.description}\n` +
               `🎯 *Usage:* ${plugin.usage || `.${commandName}`}\n` +
               `📌 *Example:* ${plugin.example || `.${commandName}`}\n` +
               `🔤 *Aliases:* ${plugin.alias ? plugin.alias.map(a => `.${a}`).join(', ') : 'None'}\n` +
               `📂 *Category:* ${plugin.category || 'general'}\n\n` +
               `🔵 SILA AI • WhatsApp Verified`;
    },
    
    // Send typing indicator
    sendTyping: async (sock, jid, duration = 2000) => {
        try {
            await sock.sendPresenceUpdate('composing', jid);
            
            if (duration > 0) {
                setTimeout(async () => {
                    try {
                        await sock.sendPresenceUpdate('available', jid);
                    } catch (e) {}
                }, duration);
            }
        } catch (error) {
            // Ignore typing errors
        }
    },
    
    // Send read receipt
    sendReadReceipt: async (sock, messageKey) => {
        try {
            await sock.readMessages([messageKey]);
        } catch (error) {
            // Ignore read errors
        }
    },
    
    // Check if message contains media
    hasMedia: (message) => {
        return message.imageMessage || 
               message.videoMessage || 
               message.audioMessage || 
               message.documentMessage || 
               message.stickerMessage;
    },
    
    // Get media type
    getMediaType: (message) => {
        if (message.imageMessage) return 'image';
        if (message.videoMessage) return 'video';
        if (message.audioMessage) return 'audio';
        if (message.documentMessage) return 'document';
        if (message.stickerMessage) return 'sticker';
        return 'unknown';
    },
    
    // Clean temporary files
    cleanTempFiles: (dir = './temp', maxAge = 3600000) => {
        const fs = require('fs');
        const path = require('path');
        
        if (!fs.existsSync(dir)) return;
        
        const now = Date.now();
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtimeMs > maxAge) {
                fs.unlinkSync(filePath);
                console.log(`Cleaned temp file: ${file}`);
            }
        });
    },
    
    // Generate file name with timestamp
    generateFileName: (prefix = 'file', extension = '') => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${prefix}_${timestamp}_${random}${extension}`;
    },
    
    // Export fakevCard for external use
    fakevCard: fakevCard,
    whatsappChannelJid: whatsappChannelJid
};