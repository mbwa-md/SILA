const utils = require('../utils');
const db = require('../lib/database');

module.exports = {
    name: 'antilink',
    description: 'Control anti-link feature in groups',
    category: 'group',
    usage: '.antilink [on/off]',
    example: '.antilink on',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isGroup) {
            await utils.sendBlueTickMessage(sock, jid, '❌ This command only works in groups!', msg);
            return;
        }
        
        if (!isAdmin && !isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
            return;
        }
        
        const state = args[0]?.toLowerCase();
        
        if (state === 'on' || state === 'off') {
            db.setGroup(jid, { antilink: state === 'on' });
            await utils.sendBlueTickMessage(sock, jid, 
                `✅ Anti-link turned *${state.toUpperCase()}*!`, 
                msg
            );
        } else {
            const group = db.getGroup(jid);
            const current = group?.antilink !== false ? 'ON' : 'OFF';
            await utils.sendBlueTickMessage(sock, jid, 
                `⚙️ Anti-link is *${current}*\nUse: .antilink on/off`, 
                msg
            );
        }
    }
};