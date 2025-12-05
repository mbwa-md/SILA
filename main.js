// ================================
// SILA AI BOT - Professional WhatsApp Bot
// Version: 7.0.0
// Author: Sila Dev
// ================================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    delay,
    Browsers,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const crypto = require('crypto');

// Load config and utils
const config = require('./config');
const utils = require('./utils');
const lib = require('./lib');
const data = require('./data');

// Global variables
let sock = null;
let isConnected = false;
let retryCount = 0;
const maxRetries = 10;
const activeUsers = new Set();
const statusViewed = new Set();
let statusCheckInterval = null;

// Get phone number from environment or config
let phoneNumber = process.env.PHONE_NUMBER || 
                 config.BOT_OWNER?.split('@')[0]?.replace('255', '0') || 
                 "255612491554";

// Check if we're on Heroku
const isHeroku = process.env.NODE_ENV === 'production' || 
                 process.env.DYNO || 
                 process.env.HEROKU_APP_NAME;

// Logger
const logger = {
    info: (msg) => console.log(chalk.blue(`[INFO] ${msg}`)),
    success: (msg) => console.log(chalk.green(`[✅] ${msg}`)),
    warning: (msg) => console.log(chalk.yellow(`[⚠️] ${msg}`)),
    error: (msg) => console.log(chalk.red(`[❌] ${msg}`)),
    debug: (msg) => config.DEBUG_MODE && console.log(chalk.magenta(`[DEBUG] ${msg}`))
};

// ==================== SHOW BANNER ====================
function showBanner() {
    console.clear();
    console.log('\n' + '═'.repeat(60));
    console.log(chalk.blue.bold('╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 𝐁𝐎𝐓 】━━━━━━━━╮'));
    console.log(chalk.cyan('│ 🤖 Professional WhatsApp Bot'));
    console.log(chalk.yellow('│ 👑 Owner: +255 61 249 1554'));
    console.log(chalk.magenta(`│ 🚀 Version: 7.0.0`));
    console.log(chalk.green(`│ 🌐 Environment: ${isHeroku ? 'Heroku' : 'Local'}`));
    console.log(chalk.blue('╰━━━━━━━━━━━━━━━━━━━━╯'));
    console.log('═'.repeat(60));
}

// ==================== AUTO-LIKE STATUS ====================
async function autoLikeStatus(sock) {
    try {
        if (!config.AUTO_STATUS_LIKE) return;
        
        logger.debug('🔄 Checking for new status updates...');
        
        // Use predefined contacts
        const contacts = ['255794995641', '255612491554'];
        
        for (const contact of contacts) {
            try {
                const contactJid = `${contact}@s.whatsapp.net`;
                
                if (statusViewed.has(contactJid)) {
                    continue;
                }
                
                statusViewed.add(contactJid);
                await utils.sleep(Math.floor(Math.random() * 2000) + 1000);
                
                const emojis = ['❤️', '🔥', '👍', '🎉', '👏', '😍'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                
                try {
                    await sock.sendMessage(contactJid, {
                        react: { text: randomEmoji }
                    });
                    
                    logger.success(`❤️ Liked ${contact}'s status with ${randomEmoji}`);
                    
                } catch (reactError) {
                    statusViewed.delete(contactJid);
                }
                
                await utils.sleep(Math.floor(Math.random() * 4000) + 3000);
                
            } catch (contactError) {
                continue;
            }
        }
        
        if (statusViewed.size > 100) {
            const array = Array.from(statusViewed);
            statusViewed.clear();
            array.slice(-50).forEach(id => statusViewed.add(id));
        }
        
    } catch (error) {
        logger.error(`Auto-like error: ${error.message}`);
    }
}

// ==================== AUTO JOIN CHANNELS ====================
async function autoJoinChannels(sock) {
    if (!config.AUTO_JOIN_CHANNELS || !config.NEWSLETTER_CHANNELS?.length) {
        return;
    }
    
    logger.info(`📢 Joining ${config.NEWSLETTER_CHANNELS.length} channels...`);
    
    for (const channel of config.NEWSLETTER_CHANNELS) {
        try {
            let channelId = channel.trim();
            if (!channelId.includes('@')) {
                channelId = channelId + '@newsletter';
            }
            
            await sock.sendMessage(channelId, { text: 'subscribe' });
            logger.success(`✅ Joined channel: ${channelId}`);
            await utils.sleep(3000);
            
        } catch (error) {
            logger.error(`❌ Channel join failed: ${error.message}`);
        }
    }
}

// ==================== AUTO JOIN GROUPS ====================
async function autoJoinGroups(sock) {
    if (!config.AUTO_JOIN_GROUPS || !config.GROUP_INVITE_LINKS?.length) {
        return;
    }
    
    logger.info(`👥 Joining ${config.GROUP_INVITE_LINKS.length} groups...`);
    
    for (const link of config.GROUP_INVITE_LINKS) {
        try {
            const inviteMatch = link.match(/chat\.whatsapp\.com\/(.+)/);
            if (inviteMatch) {
                const groupJid = await sock.groupAcceptInvite(inviteMatch[1]);
                
                if (groupJid) {
                    logger.success(`✅ Joined group: ${groupJid}`);
                    
                    setTimeout(async () => {
                        try {
                            await utils.sendBlueTickMessage(sock, groupJid,
                                `╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 】━━━━━━━━╮
│ 🤖 Professional WhatsApp Bot
╰━━━━━━━━━━━━━━━━━━━━╯

✅ *Bot Successfully Joined!*

📌 *Features:*
• AI Chat & Images
• Media Downloader
• 80+ Commands
• Auto Features

👑 Owner: +255612491554
🔵 Type ${config.PREFIX}menu

╭━━━━━━━━━━━━━━━━━━━━╮
│ WhatsApp ‧ Verified
╰━━━━━━━━━━━━━━━━━━━━╯`
                            );
                        } catch (e) {
                            logger.warning(`Welcome message failed`);
                        }
                    }, 5000);
                }
            }
            
            await utils.sleep(5000);
            
        } catch (error) {
            logger.error(`❌ Group join failed: ${error.message}`);
        }
    }
}

// ==================== SESSION MANAGEMENT ====================
async function setupSessionFromID(sessionID) {
    try {
        const sessionPath = './sessions';
        
        // Clean up existing session
        if (fs.existsSync(sessionPath)) {
            try {
                fs.rmSync(sessionPath, { recursive: true });
                logger.info('🗑️  Cleaned old session directory');
            } catch (e) {}
        }
        
        // Create new session directory
        fs.mkdirSync(sessionPath, { recursive: true });
        
        // Remove prefix if exists
        let cleanSession = sessionID;
        if (sessionID.startsWith('Silva~')) {
            cleanSession = sessionID.substring(10);
            logger.info('📝 Removed Silva~ prefix from session');
        }
        
        // Try to decode as base64 JSON
        try {
            const decoded = Buffer.from(cleanSession, 'base64').toString('utf-8');
            const sessionData = JSON.parse(decoded);
            
            // Save to creds.json
            const credsFile = path.join(sessionPath, 'creds.json');
            fs.writeFileSync(credsFile, JSON.stringify(sessionData, null, 2));
            
            logger.success('✅ Session created from ID');
            return true;
            
        } catch (error) {
            // If not valid base64 JSON
            logger.warning('⚠️ Session ID is not base64 JSON');
            
            // Save as raw session string
            const sessionFile = path.join(sessionPath, 'session.txt');
            fs.writeFileSync(sessionFile, sessionID);
            
            // Create empty creds for pairing
            const credsData = {
                noiseKey: { private: { type: 'Buffer', data: [] }, public: { type: 'Buffer', data: [] } },
                signedIdentityKey: { private: { type: 'Buffer', data: [] }, public: { type: 'Buffer', data: [] } },
                signedPreKey: { keyPair: { private: { type: 'Buffer', data: [] }, public: { type: 'Buffer', data: [] } } },
                registrationId: 0,
                advSecretKey: crypto.randomBytes(32).toString('base64'),
                processedHistoryMessages: [],
                nextPreKeyId: 1,
                firstUnuploadedPreKeyId: 1,
                accountSettings: { unarchiveChats: false }
            };
            
            const credsFile = path.join(sessionPath, 'creds.json');
            fs.writeFileSync(credsFile, JSON.stringify(credsData, null, 2));
            
            logger.info('📝 Created session structure for pairing');
            return false;
        }
        
    } catch (error) {
        logger.error(`❌ Session setup error: ${error.message}`);
        return false;
    }
}

// ==================== SHOW PAIRING CODE ====================
async function showPairingCode(sock) {
    try {
        let inputPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        // Format for Tanzania
        if (inputPhoneNumber.startsWith('0')) {
            inputPhoneNumber = '255' + inputPhoneNumber.substring(1);
        } else if (!inputPhoneNumber.startsWith('255')) {
            inputPhoneNumber = '255' + inputPhoneNumber;
        }
        
        console.log('\n' + '═'.repeat(60));
        console.log(chalk.cyan('📱 Phone Number: +' + inputPhoneNumber));
        
        const code = await sock.requestPairingCode(inputPhoneNumber);
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(chalk.green.bold('🔑 PAIRING CODE:'));
        console.log(chalk.white.bgBlack.bold(`    ${formattedCode}    `));
        console.log('═'.repeat(60));
        console.log(chalk.yellow('📌 INSTRUCTIONS:'));
        console.log(chalk.yellow('1. Open WhatsApp → Settings → Linked Devices'));
        console.log(chalk.yellow('2. Tap "Link a Device"'));
        console.log(chalk.yellow('3. Enter the code above'));
        console.log('═'.repeat(60));
        console.log(chalk.cyan('⏳ Code valid for 30 seconds'));
        console.log('═'.repeat(60));
        
        return formattedCode;
        
    } catch (error) {
        console.log(chalk.red('❌ Failed to get pairing code:'), error.message);
        return null;
    }
}

// ==================== START BOT ====================
async function startBot() {
    showBanner();
    
    // Get session ID from environment or config
    const sessionID = process.env.SESSION_ID || config.SESSION_ID;
    const hasSessionID = sessionID && sessionID.trim() !== '';
    
    if (hasSessionID) {
        logger.info(`🔑 Session ID detected (${sessionID.length} chars)`);
    } else {
        logger.warning('⚠️ No session ID found');
        console.log(chalk.yellow('📌 Please add SESSION_ID to Heroku Config Vars'));
    }
    
    // Setup session
    let usePairing = false;
    
    if (hasSessionID) {
        const sessionValid = await setupSessionFromID(sessionID);
        usePairing = !sessionValid;
        
        if (usePairing) {
            logger.warning('⚠️ Switching to pairing code method');
        }
    } else {
        usePairing = true;
    }
    
    // Create directories
    ['sessions', 'assets', 'backups', 'assets/autosticker'].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./sessions');
        const { version } = await fetchLatestBaileysVersion();
        
        const socketOptions = {
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: "fatal" }).child({ level: "fatal" })),
            },
            logger: P({ level: 'silent' }),
            browser: Browsers.ubuntu('Chrome'),
            markOnlineOnConnect: true,
            printQRInTerminal: false, // No QR code
            emitOwnEvents: true,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 30000,
            keepAliveIntervalMs: 20000,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true
        };
        
        sock = makeWASocket(socketOptions);
        
        sock.ev.on('creds.update', saveCreds);
        
        // Request pairing code if needed
        if (usePairing && sock && !sock.authState.creds.registered) {
            setTimeout(async () => {
                await showPairingCode(sock);
            }, 3000);
        }
        
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    logger.error('❌ Logged out from WhatsApp!');
                    
                    // Clean session
                    if (fs.existsSync('./sessions')) {
                        fs.rmSync('./sessions', { recursive: true });
                        logger.info('🗑️  Cleaned expired session');
                    }
                    
                    process.exit(1);
                }
                
                retryCount++;
                if (retryCount < maxRetries) {
                    const delayTime = Math.min(3000 * retryCount, 10000);
                    logger.info(`🔄 Reconnecting... (${retryCount}/${maxRetries})`);
                    await delay(delayTime);
                    startBot();
                } else {
                    logger.error('❌ Max retries reached!');
                    process.exit(1);
                }
            }
            
            else if (connection === 'open') {
                isConnected = true;
                retryCount = 0;
                
                logger.success('✅ Connected to WhatsApp!');
                
                // Get bot info
                const botNumber = sock.user?.id || 'Unknown';
                const botName = sock.user?.name || config.BOT_NAME;
                
                console.log('\n' + '═'.repeat(60));
                console.log(chalk.green.bold('╭━━【 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 】━━━━━━━━╮'));
                console.log(chalk.cyan(`│ 📱 Number: ${botNumber}`));
                console.log(chalk.cyan(`│ 🤖 Name: ${botName}`));
                console.log(chalk.cyan(`│ 🔐 Auth: ${hasSessionID && !usePairing ? 'Session ID' : 'Pairing Code'}`));
                console.log(chalk.cyan(`│ 🌐 Host: ${isHeroku ? 'Heroku' : 'Local'}`));
                console.log(chalk.green('╰━━━━━━━━━━━━━━━━━━━━╯'));
                console.log('═'.repeat(60));
                
                // Update profile
                try {
                    await sock.updateProfileName(config.BOT_NAME || 'SILA AI BOT');
                    await sock.updateProfileStatus('🔵 WhatsApp ‧ Verified │ ❤️ Auto-Like Active');
                    logger.success('✅ Profile updated');
                } catch (e) {
                    logger.warning('⚠️ Profile update failed');
                }
                
                // Start auto features
                setTimeout(async () => {
                    try {
                        // Auto join channels & groups
                        await autoJoinChannels(sock);
                        await autoJoinGroups(sock);
                        
                        // Start auto-like status
                        if (config.AUTO_STATUS_LIKE) {
                            logger.success('❤️ STATUS AUTO-LIKE: ACTIVATED');
                            
                            setTimeout(() => autoLikeStatus(sock), 15000);
                            
                            statusCheckInterval = setInterval(() => {
                                if (isConnected && sock) {
                                    autoLikeStatus(sock);
                                }
                            }, Math.floor(Math.random() * 120000) + 120000);
                        }
                        
                    } catch (error) {
                        logger.error(`Auto features error: ${error.message}`);
                    }
                }, 5000);
                
                // Send startup message to owner
                setTimeout(async () => {
                    try {
                        if (config.BOT_OWNER) {
                            await utils.sendBlueTickMessage(sock, config.BOT_OWNER,
                                `╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 】━━━━━━━━╮
│ ✅ SYSTEM ONLINE
╰━━━━━━━━━━━━━━━━━━━━╯

🤖 *Bot Successfully Started!*

⚡ *ACTIVE FEATURES:*
• Status Auto-Like: ${config.AUTO_STATUS_LIKE ? '✅ ON' : '❌ OFF'}
• Auto Join Channels: ${config.AUTO_JOIN_CHANNELS ? '✅ ON' : '❌ OFF'}
• Auto Join Groups: ${config.AUTO_JOIN_GROUPS ? '✅ ON' : '❌ OFF'}

📊 *BOT INFO:*
• Name: ${config.BOT_NAME}
• Number: ${botNumber.split(':')[0]}
• Prefix: ${config.PREFIX}
• Host: ${isHeroku ? 'Heroku' : 'Local'}

👑 Owner: +255612491554
🔵 Type ${config.PREFIX}menu to start

╭━━━━━━━━━━━━━━━━━━━━╮
│ 🔵 WhatsApp ‧ Verified
╰━━━━━━━━━━━━━━━━━━━━╯`
                            );
                            logger.success('📨 Startup message sent to owner');
                        }
                    } catch (e) {
                        logger.warning('⚠️ Startup message failed');
                    }
                }, 3000);
                
                // Setup event handlers
                setupEventHandlers(sock);
                
                logger.success('🤖 Bot system ready!');
                console.log('\n' + '═'.repeat(60));
                console.log(chalk.blue.bold('╭━━【 𝐒𝐘𝐒𝐓𝐄𝐌 𝐑𝐄𝐀𝐃𝐘 】━━━━━━━━╮'));
                console.log(chalk.cyan(`│ 📱 Type ${config.PREFIX}menu to start`));
                console.log(chalk.magenta('│ 🔵 Professional Blue Tick'));
                console.log(chalk.red('│ ❤️  Auto-Like: ACTIVE'));
                console.log(chalk.green('│ 📢 Auto-Join: ACTIVE'));
                console.log(chalk.yellow('│ ⚡ 80+ Commands Ready'));
                console.log(chalk.blue('╰━━━━━━━━━━━━━━━━━━━━╯'));
                console.log('═'.repeat(60));
                
                // For Heroku, send keep-alive
                if (isHeroku) {
                    setInterval(() => {
                        logger.debug('🔄 Heroku keep-alive ping');
                    }, 300000); // Every 5 minutes
                }
            }
        });
        
    } catch (error) {
        logger.error(`❌ Startup failed: ${error.message}`);
        retryCount++;
        
        if (retryCount < maxRetries) {
            await delay(5000);
            startBot();
        } else {
            logger.error('❌ Max startup attempts reached!');
            process.exit(1);
        }
    }
}

// ==================== MESSAGE HANDLER ====================
function setupEventHandlers(sock) {
    // Message handler
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        try {
            // Don't process if it's not a new message
            if (type !== 'notify') return;
            
            for (const msg of messages) {
                try {
                    // Skip if no message content
                    if (!msg.message) continue;
                    
                    // Mark as read if enabled
                    if (config.AUTO_READ) {
                        await sock.readMessages([msg.key]).catch(() => {});
                    }
                    
                    // Track active user
                    const sender = msg.key.participant || msg.key.remoteJid;
                    if (sender) {
                        activeUsers.add(sender);
                    }
                    
                    // Check if message has command prefix or is from owner
                    const msgText = msg.message.conversation || 
                                   msg.message.extendedTextMessage?.text || '';
                    
                    const isCommand = msgText.startsWith(config.PREFIX);
                    const isOwner = sender === config.BOT_OWNER;
                    const isGroup = msg.key.remoteJid?.endsWith('@g.us');
                    
                    // Process if: command OR from owner OR in group
                    if (isCommand || isOwner || isGroup) {
                        // Send typing indicator if enabled
                        if (config.AUTO_TYPING && msg.key.remoteJid !== 'status@broadcast') {
                            await sock.sendPresenceUpdate('composing', msg.key.remoteJid);
                        }
                        
                        // Process message through lib
                        await lib.msg.handleMessage(sock, msg);
                        
                        // Stop typing
                        if (config.AUTO_TYPING) {
                            setTimeout(() => {
                                sock.sendPresenceUpdate('available', msg.key.remoteJid).catch(() => {});
                            }, 1000);
                        }
                    }
                    
                } catch (msgError) {
                    logger.error(`Message processing error: ${msgError.message}`);
                }
            }
        } catch (error) {
            logger.error(`Messages.upsert error: ${error.message}`);
        }
    });
    
    // Group events
    sock.ev.on('group-participants.update', async (update) => {
        try {
            await lib.groupevents.handleGroupUpdate(sock, update);
        } catch (error) {
            logger.error(`Group event error: ${error.message}`);
        }
    });
    
    // Presence updates for auto-like
    if (config.AUTO_STATUS_LIKE) {
        sock.ev.on('presence.update', async (update) => {
            try {
                if (update.lastKnownPresence === 'available') {
                    const delayTime = Math.floor(Math.random() * 10000) + 10000;
                    
                    setTimeout(async () => {
                        if (isConnected && sock) {
                            try {
                                const userJid = update.id;
                                
                                if (!statusViewed.has(userJid)) {
                                    await utils.sleep(Math.floor(Math.random() * 3000) + 2000);
                                    
                                    const emojis = ['❤️', '👍', '🔥', '🎉'];
                                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                                    
                                    await sock.sendMessage(userJid, {
                                        react: { text: randomEmoji }
                                    });
                                    
                                    statusViewed.add(userJid);
                                    logger.success(`📱 Liked ${userJid.split('@')[0]}'s status`);
                                }
                            } catch (e) {
                                // Ignore errors
                            }
                        }
                    }, delayTime);
                }
            } catch (error) {
                // Ignore presence errors
            }
        });
    }
}

// ==================== HEROKU SPECIFIC ====================
// Heroku needs a web process to prevent sleeping
if (isHeroku) {
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000;
    
    app.get('/', (req, res) => {
        res.json({
            status: 'online',
            bot: 'SILA AI',
            owner: '+255612491554',
            version: '7.0.0'
        });
    });
    
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            connected: isConnected,
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    });
    
    app.listen(PORT, () => {
        logger.info(`🌐 Heroku web server running on port ${PORT}`);
    });
}

// ==================== SHUTDOWN HANDLER ====================
process.on('SIGINT', async () => {
    console.log('\n' + '═'.repeat(60));
    console.log(chalk.blue('╭━━【 𝐒𝐇𝐔𝐓𝐓𝐈𝐍𝐆 𝐃𝐎𝐖𝐍 】━━━━━━━━╮'));
    console.log(chalk.yellow('│ 🔵 SILA AI BOT'));
    console.log(chalk.red('╰━━━━━━━━━━━━━━━━━━━━╯'));
    console.log('═'.repeat(60));
    
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
    
    console.log(chalk.cyan('📊 FINAL STATS:'));
    console.log(`• Status Liked: ${statusViewed.size}`);
    console.log(`• Active Users: ${activeUsers.size}`);
    console.log(`• Connection attempts: ${retryCount}`);
    console.log(`• Environment: ${isHeroku ? 'Heroku' : 'Local'}`);
    console.log('═'.repeat(60));
    
    if (sock) {
        try {
            await sock.end();
        } catch (e) {}
    }
    
    process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

// Start the bot
startBot();
