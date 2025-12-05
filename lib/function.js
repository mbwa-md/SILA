const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getBinaryNodeChild } = require('@whiskeysockets/baileys');

module.exports = {
    // Load all plugins
    loadPlugins: () => {
        const plugins = {};
        const pluginsDir = path.join(__dirname, '../plugins');
        
        if (!fs.existsSync(pluginsDir)) {
            fs.mkdirSync(pluginsDir, { recursive: true });
            return plugins;
        }
        
        const pluginFiles = fs.readdirSync(pluginsDir).filter(file => 
            file.endsWith('.js') && file !== 'index.js'
        );
        
        for (const file of pluginFiles) {
            try {
                const plugin = require(path.join(pluginsDir, file));
                const commandName = path.basename(file, '.js');
                plugins[commandName] = plugin;
            } catch (error) {
                console.error(`Failed to load plugin ${file}:`, error);
            }
        }
        
        return plugins;
    },
    
    // Check if user is admin
    isAdmin: async (sock, jid, userId) => {
        try {
            const metadata = await sock.groupMetadata(jid);
            const participant = metadata.participants.find(p => p.id === userId);
            return participant ? participant.admin !== null : false;
        } catch (error) {
            return false;
        }
    },
    
    // Check if user is owner
    isOwner: (userId, config) => {
        return userId === config.BOT_OWNER;
    },
    
    // Download media
    downloadMedia: async (sock, message, type = 'image') => {
        try {
            const mediaTypeMap = {
                'image': 'imageMessage',
                'video': 'videoMessage',
                'audio': 'audioMessage',
                'sticker': 'stickerMessage',
                'document': 'documentMessage'
            };
            
            const mediaKey = mediaTypeMap[type];
            if (!message[mediaKey]) return null;
            
            const stream = await sock.downloadMediaMessage(message);
            let buffer = Buffer.from([]);
            
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            return buffer;
        } catch (error) {
            console.error('Download media error:', error);
            return null;
        }
    },
    
    // Parse mention
    parseMention: (text) => {
        const mentionRegex = /@(\d+)/g;
        const mentions = [];
        let match;
        
        while ((match = mentionRegex.exec(text)) !== null) {
            mentions.push(match[1] + '@s.whatsapp.net');
        }
        
        return mentions;
    },
    
    // Validate URL
    isValidUrl: (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },
    
    // Get command help
    getCommandHelp: (commandName, plugins) => {
        const plugin = plugins[commandName];
        if (!plugin) return null;
        
        return {
            name: plugin.name || commandName,
            description: plugin.description || 'No description',
            usage: plugin.usage || `.${commandName}`,
            example: plugin.example || `.${commandName}`,
            category: plugin.category || 'general'
        };
    },
    
    // Send typing indicator
    sendTyping: async (sock, jid, duration = 2000) => {
        try {
            await sock.sendPresenceUpdate('composing', jid);
            setTimeout(() => sock.sendPresenceUpdate('available', jid), duration);
        } catch (error) {
            // Ignore errors
        }
    },
    
    // Generate menu
    generateMenu: (plugins, config) => {
        const categories = {};
        
        // Categorize plugins
        for (const [name, plugin] of Object.entries(plugins)) {
            const category = plugin.category || 'general';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(name);
        }
        
        // Build menu
        let menu = '╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━━━━━━━╮\n';
        
        for (const [category, commands] of Object.entries(categories)) {
            menu += `\n╭━━〔 ${category.toUpperCase()} 〕━━━━━━━━╮\n`;
            commands.forEach(cmd => {
                menu += `│ • .${cmd}\n`;
            });
            menu += `╰━━━━━━━━━━━━━━━━━━━━━╯\n`;
        }
        
        menu += '\n━━━━━━━━━━━━━━━━━━━━━━━\n';    
        menu += `🔵 WhatsApp ‧ Verified\n`;
        menu += `🤖 ${Object.keys(plugins).length} Commands`;
        
        return menu;
    },
    
    // Get random bot image
    getRandomBotImage: () => {
        const config = require('../config');
        if (config.BOT_IMAGES && config.BOT_IMAGES.length > 0) {
            const randomIndex = Math.floor(Math.random() * config.BOT_IMAGES.length);
            return config.BOT_IMAGES[randomIndex];
        }
        return null;
    },
    
    // Send message with random bot image
    sendMessageWithImage: async (sock, jid, text, options = {}) => {
        try {
            const imageUrl = module.exports.getRandomBotImage();
            
            if (imageUrl) {
                await sock.sendMessage(jid, {
                    image: { url: imageUrl },
                    caption: text
                }, options.quoted ? { quoted: options.quoted } : {});
            } else {
                await sock.sendMessage(jid, { text }, options.quoted ? { quoted: options.quoted } : {});
            }
            
            return true;
        } catch (error) {
            console.error('Send message with image error:', error);
            return false;
        }
    }
};