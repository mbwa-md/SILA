const fs = require('fs');
const path = require('path');
const utils = require('../utils');

module.exports = {
    name: 'setprefix',
    description: 'Set bot command prefix',
    category: 'owner',
    alias: ['prefix', 'setp'],
    usage: '.setprefix [new_prefix]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            // Check if user is bot owner
            const userId = msg.key.participant || msg.key.remoteJid;
            const isOwner = utils.isOwner(userId.replace('@s.whatsapp.net', ''));
            
            if (!isOwner) {
                await utils.sendMessage(sock, jid, 
                    `╭━━【 𝐏𝐑𝐄𝐅𝐈𝐗 】━━━━━━━━╮
│ ❌ Owner Only
╰━━━━━━━━━━━━━━━━━━━━╯`,
                    utils.fakevCard
                );
                return;
            }

            // Get new prefix from args
            let newPrefix = '';
            
            if (args) {
                if (typeof args === 'string') {
                    newPrefix = args.trim();
                } else if (Array.isArray(args)) {
                    newPrefix = args.join(' ').trim();
                } else {
                    newPrefix = String(args).trim();
                }
            }
            
            // If no prefix provided, show current prefix
            if (!newPrefix) {
                const config = require('../config');
                const currentPrefix = config.PREFIX || '.';
                
                await utils.sendMessage(sock, jid, 
                    `╭━━【 𝐏𝐑𝐄𝐅𝐈𝐗 】━━━━━━━━╮
│ 📝 Current: "${currentPrefix}"
│ 📝 Usage: .setprefix [new]
╰━━━━━━━━━━━━━━━━━━━━╯`,
                    utils.fakevCard
                );
                return;
            }

            // Validate prefix (1-3 characters)
            if (newPrefix.length > 3) {
                await utils.sendMessage(sock, jid, 
                    `╭━━【 𝐏𝐑𝐄𝐅𝐈𝐗 】━━━━━━━━╮
│ ❌ Max 3 chars
╰━━━━━━━━━━━━━━━━━━━━╯`,
                    utils.fakevCard
                );
                return;
            }

            // Update config file
            const configPath = path.join(__dirname, '../config.js');
            
            if (!fs.existsSync(configPath)) {
                await utils.sendMessage(sock, jid, 
                    `╭━━【 𝐏𝐑𝐄𝐅𝐈𝐗 】━━━━━━━━╮
│ ❌ Config not found
╰━━━━━━━━━━━━━━━━━━━━╯`,
                    utils.fakevCard
                );
                return;
            }

            // Read current config
            let configContent = fs.readFileSync(configPath, 'utf8');
            
            // Update PREFIX in config
            const prefixRegex = /PREFIX\s*:\s*['"`][^'"`]*['"`]/;
            if (prefixRegex.test(configContent)) {
                configContent = configContent.replace(
                    prefixRegex,
                    `PREFIX: '${newPrefix}'`
                );
            } else {
                // Add PREFIX if not exists
                configContent = configContent.replace(
                    /module.exports\s*=\s*{/,
                    `module.exports = {\n  PREFIX: '${newPrefix}',`
                );
            }

            // Write updated config
            fs.writeFileSync(configPath, configContent, 'utf8');
            
            // Send success message
            await utils.sendMessage(sock, jid, 
                `╭━━【 𝐏𝐑𝐄𝐅𝐈𝐗 】━━━━━━━━╮
│ ✅ Updated: "${newPrefix}"
╰━━━━━━━━━━━━━━━━━━━━╯`,
                utils.fakevCard
            );

            console.log(`Prefix updated to: ${newPrefix} by ${userId}`);

        } catch (error) {
            console.error('Setprefix command error:', error);
            
            await utils.sendMessage(sock, jid, 
                `╭━━【 𝐏𝐑𝐄𝐅𝐈𝐗 】━━━━━━━━╮
│ ❌ Failed
╰━━━━━━━━━━━━━━━━━━━━╯`,
                utils.fakevCard
            );
        }
    }
};