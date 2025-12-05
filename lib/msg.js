const utils = require('../utils');
const config = require('../config');
const func = require('./function');
const ban = require('./ban');
const antidel = require('./antidel');

module.exports = {
    // Handle incoming message
    handleMessage: async (sock, msg) => {
        try {
            if (!msg.message || msg.key.fromMe) return;
            
            const jid = msg.key.remoteJid;
            const isGroup = jid.endsWith('@g.us');
            
            // Check if banned ONLY
            if (ban.isUserBanned(msg.key.participant || jid) || 
                (isGroup && ban.isGroupBanned(jid))) {
                return;
            }
            
            // Auto read
            if (config.AUTO_READ) {
                try {
                    await sock.readMessages([msg.key]);
                } catch (e) {}
            }
            
            // Auto typing
            if (config.AUTO_TYPING) {
                await func.sendTyping(sock, jid);
            }
            
            // Auto react
            if (config.AUTO_REACT && !isGroup) {
                await module.exports.autoReact(sock, jid, msg);
            }
            
            // Get message text
            const text = msg.message.conversation || 
                         msg.message.extendedTextMessage?.text || 
                         msg.message.imageMessage?.caption || '';
            
            // Auto sticker reply for specific words
            if (text) {
                const groupevents = require('./groupevents');
                await groupevents.autoStickerReply(sock, jid, text);
            }
            
            // Handle commands
            if (text.startsWith(config.PREFIX)) {
                await module.exports.handleCommand(sock, jid, msg, text, isGroup);
                return;
            }
            
            // Anti-link in groups
            if (isGroup && config.ANTI_LINK) {
                await module.exports.checkAntiLink(sock, jid, msg, text);
            }
            
        } catch (error) {
            console.error('Message handler error:', error);
        }
    },
    
    // Handle command
    handleCommand: async (sock, jid, msg, text, isGroup) => {
        try {
            const args = text.slice(config.PREFIX.length).trim().split(' ');
            const command = args.shift().toLowerCase();
            
            // Load plugins
            const plugins = func.loadPlugins();
            const plugin = plugins[command];
            
            // No "unknown command" message
            if (!plugin) return;
            
            // PUBLIC BOT - WATU WOTE WANAWEZA TUMIA
            // No permission check for most commands
            
            // Send command reaction
            const commandReactions = {
                'ping': '🏓',
                'menu': '📱',
                'owner': '👑',
                'speed': '⚡',
                'status': '📊',
                'autoreact': '🤖',
                'channel': '📢',
                'song': '🎵',
                'chatbot': '🤖',
                'play': '🎧',
                'video': '🎬',
                'imagine': '🖼️',
                'tagall': '🏷️',
                'groupinfo': '👥',
                'sticker': '🖼️',
                'bc': '📢',
                'antilink': '🔗',
                'promote': '👑',
                'demote': '⬇️',
                'kick': '👢',
                'add': '➕',
                'text2img': '🎨',
                'qr': '📱',
                'qrread': '🔍',
                'welcome': '👋',
                'bye': '👋',
                'quote': '💭',
                'joke': '😂',
                'fact': '📚',
                'dice': '🎲',
                'coin': '🪙',
                'flux': '🎨',
                'flux2': '🎨',
                'alive': '🤖',
                'restart': '🔄',
                'block': '🚫',
                'unblock': '✅',
                'botinfo': '🤖',
                'stats': '📊',
                'userinfo': '👤',
                'ai': '🤖',
                'gpt': '🤖',
                'gemini': '🤖',
                'menu2': '🕒',
                'ask': '🤖',
                'tiktok': '📱',
                'ig': '📸',
                'fb': '📘',
                'dalle': '🎨',
                'yt': '▶️',
                'translate': '🌐',
                'calc': '🧮',
                'weather': '⛅',
                'time': '🕒',
                'currency': '💱',
                'google': '🔍',
                'youtube': '▶️',
                'wikipedia': '📚',
                'imdb': '🎬',
                'lyrics': '🎶',
                'toimg': '🖼️',
                's': '🖼️',
                'gcname': '📝',
                'gcdesc': '📝',
                'runtime': '⏰',
                'source': '📁',
                'list': '📋',
                
                // NEW COMMANDS ADDED:
                'vv': '🔓',
                'antivv': '🔓',
                'avv': '🔓',
                'viewonce': '🔓',
                'open': '🔓',
                'openphoto': '🔓',
                'openvideo': '🔓',
                'vvphoto': '🔓',
                'vvvideo': '🔓',
                
                'ytmp4': '🎬',
                'mp4': '🎬',
                'ytv': '🎬',
                'vi': '🎬',
                'v': '🎬',
                'vid': '🎬',
                'vide': '🎬',
                'videos': '🎬',
                'ytvi': '🎬',
                'ytvid': '🎬',
                'ytvide': '🎬',
                'ytvideos': '🎬',
                'searchyt': '🎬',
                'download': '🎬',
                'get': '🎬',
                'need': '🎬',
                'search': '🎬',
                
                'sora': '🎥',
                'aivideo': '🎥',
                'videogen': '🎥',
                'text2video': '🎥',
                'genvideo': '🎥',
                
                'pies': '🖼️',
                'random': '🖼️',
                'image': '🖼️',
                'pic': '🖼️',
                'img': '🖼️',
                
                'jid': '🔍',
                'userid': '🔍',
                'id': '🔍',
                'setprefix': '🔍',
                
                'girl': '🔥',
                'uptime': '🔥',
                'randomgirl': '🔥',
                'girls': '🔥',
                'girlvideo': '🔥',
                
                'apk': '📱',
                'app': '📱',
                'apps': '📱',
                'application': '📱',
                'ap': '📱',
                
                // ALIASES FOR EXISTING COMMANDS:
                'dev': '👑',
                'creator': '👑',
                'developer': '👑',
                'silas': '👑',
                
                'pong': '🏓',
                'speedtest': '🏓',
                
                'mp3': '🎵',
                'music': '🎵',
                
                'vid': '🎬',
                'ytvideo': '🎬',
                
                'aiimg': '🎨',
                'aimage': '🎨',
                'aipic': '🎨',
                
                'everyone': '🏷️',
                'all': '🏷️',
                
                'scan': '📱',
                'link': '📱',
                'qrcode': '📱',
                
                'readqr': '🔍',
                'scanqr': '🔍',
                'qrcodescan': '🔍',
                
                'online': '🤖',
                'bot': '🤖',
                'check': '🔍',
                
                'imagine2': '🎨',
                'aiimg2': '🎨',
                'gen2': '🎨',
                
                'attp': '✨',
                'textsticker': '✨',
                'blinktext': '✨',
                'rainbowtext': '✨'
            };
            
            const reactionEmoji = commandReactions[command] || '✅';
            
            try {
                await sock.sendMessage(jid, {
                    react: { text: reactionEmoji, key: msg.key }
                });
            } catch (reactionError) {
                console.log(`Reaction failed for ${command}:`, reactionError.message);
            }
            
            // PUBLIC BOT - Watu wote wanaweza tumia commands
            const userId = msg.key.participant || jid;
            const isAdmin = isGroup ? await func.isAdmin(sock, jid, userId) : false;
            const isOwner = func.isOwner(userId, config);
            
            // Execute plugin with random bot image if needed
            if (plugin.execute) {
                // Pass additional helper functions
                const enhancedArgs = {
                    args,
                    isGroup,
                    isAdmin,
                    isOwner,
                    getRandomBotImage: () => {
                        if (config.BOT_IMAGES && config.BOT_IMAGES.length > 0) {
                            const randomIndex = Math.floor(Math.random() * config.BOT_IMAGES.length);
                            return config.BOT_IMAGES[randomIndex];
                        }
                        return 'B4https://d.uguu.se/UBGWjyMj.jpg'; // fallback
                    }
                };
                
                await plugin.execute(sock, jid, msg, enhancedArgs);
            }
            
        } catch (error) {
            console.error('Command error:', error);
        }
    },
    
    // Auto react to messages
    autoReact: async (sock, jid, msg) => {
        try {
            const reactions = ['❤️', '👍', '🔥', '🎉', '😂'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            
            await sock.sendMessage(jid, {
                react: { text: randomReaction, key: msg.key }
            });
        } catch (error) {
            // Ignore react errors
        }
    },
    
    // Check and delete links
    checkAntiLink: async (sock, jid, msg, text) => {
        try {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            if (text.match(urlRegex)) {
                // Get group settings
                const db = require('./database');
                const groupSettings = db.getGroup(jid);
                
                // Check if anti-link is enabled for this group
                if (!groupSettings || groupSettings.antilink !== false) {
                    // Store message before deleting (for possible restore)
                    antidel.storeDeleted(msg);
                    
                    // Delete the message
                    await sock.sendMessage(jid, {
                        delete: msg.key
                    });
                    
                    // Get random bot image for warning message
                    const randomImage = config.BOT_IMAGES && config.BOT_IMAGES.length > 0 
                        ? config.BOT_IMAGES[Math.floor(Math.random() * config.BOT_IMAGES.length)]
                        : null;
                    
                    // Warn user with blue tick message
                    const warning = `⚠️ *LINK REMOVED!*\n\nLinks are not allowed in this group.`;
                    
                    await utils.sendBlueTickMessage(sock, jid, warning, msg);
                    
                    console.log(`Deleted link message from ${jid}`);
                }
            }
        } catch (error) {
            console.error('Anti-link error:', error);
        }
    },
    
    // Handle deleted messages
    handleDeleted: async (sock, deleteData) => {
        try {
            if (deleteData.keys) {
                for (const key of deleteData.keys) {
                    antidel.storeDeleted({ key: key, message: null });
                }
            }
        } catch (error) {
            console.error('Handle deleted error:', error);
        }
    },
    
    // Helper function to send message with random bot image
    sendWithBotImage: async (sock, jid, text, options = {}) => {
        try {
            // Get random bot image
            let imageUrl = null;
            if (config.BOT_IMAGES && config.BOT_IMAGES.length > 0) {
                const randomIndex = Math.floor(Math.random() * config.BOT_IMAGES.length);
                imageUrl = config.BOT_IMAGES[randomIndex];
                
                // Send image first
                try {
                    await sock.sendMessage(jid, {
                        image: { url: imageUrl },
                        caption: '🔵 SILA AI'
                    });
                    
                    // Wait a bit before sending text
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (imgError) {
                    console.log('Failed to send bot image:', imgError.message);
                }
            }
            
            // Send the main text message
            if (options.quoted) {
                await sock.sendMessage(jid, { text }, { quoted: options.quoted });
            } else {
                await sock.sendMessage(jid, { text });
            }
            
            return true;
        } catch (error) {
            console.error('Send with bot image error:', error);
            // Fallback to normal message
            try {
                if (options.quoted) {
                    await sock.sendMessage(jid, { text }, { quoted: options.quoted });
                } else {
                    await sock.sendMessage(jid, { text });
                }
                return true;
            } catch (e) {
                console.error('Fallback also failed:', e);
                return false;
            }
        }
    }
};