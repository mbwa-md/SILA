const utils = require('../utils');
const config = require('../config');

module.exports = {
    name: 'status',
    description: 'Status viewer settings',
    category: 'settings',
    react: '📊',
    alias: ['statusview', 'statusviewer'],
    usage: '.status [on/off]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        if (!isOwner) {
            await utils.sendBlueTickMessage(sock, jid, '❌ Owner only command!', msg);
            return;
        }
        
        const state = args[0]?.toLowerCase();
        
        if (state === 'on' || state === 'off') {
            // Here you would update config
            await utils.sendBlueTickMessage(sock, jid, 
                `✅ Status viewer turned *${state.toUpperCase()}*`, 
                msg
            );
        } else {
            const current = config.AUTO_STATUS_VIEW ? 'ON' : 'OFF';
            await utils.sendBlueTickMessage(sock, jid, 
                `*📊 STATUS VIEWER*\n\n` +
                `*Current:* ${current}\n` +
                `*Usage:* .status on/off\n\n` +
                `Auto-view and react to status updates.`, 
                msg
            );
        }
    }
};