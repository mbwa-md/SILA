const utils = require('../utils');
const db = require('../lib/database');

module.exports = {
    name: 'welcome',
    description: 'Welcome message settings',
    category: 'group',
    react: '👋',
    alias: ['welcome', 'greet'],
    usage: '.welcome [on/off]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isGroup) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Group only command!', msg);
            return;
        }
        
        if (!isAdmin && !isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
            return;
        }
        
        const state = args[0]?.toLowerCase();
        
        if (state === 'on' || state === 'off') {
            db.setGroup(jid, { welcome: state === 'on' });
            await utils.sendBlueTickMessage(sock, jid, 
                `✅ Welcome messages *${state.toUpperCase()}*!`, 
                msg
            );
        } else {
            const group = db.getGroup(jid);
            const current = group?.welcome !== false ? 'ON ✅' : 'OFF ❌';
            await utils.sendBlueTickMessage(sock, jid, 
                `*👋 WELCOME MESSAGE*\n\n` +
                `*Current:* ${current}\n` +
                `*Usage:* .welcome on/off\n\n` +
                `Sends welcome message when new members join.`, 
                msg
            );
        }
    }
};