const songPlugin = require('./song');

module.exports = {
    name: 'play',
    description: 'Download YouTube song (Audio) - Alias for song',
    category: 'download',
    react: '🎧',
    alias: ['song', 'mp3', 'audio', 'music'],
    usage: '.play <song name>',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        await songPlugin.execute(sock, jid, msg, args, isGroup, isAdmin, isOwner);
    }
};