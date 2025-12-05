const utils = require('../utils');

module.exports = {
    name: 'speed',
    description: 'Test bot speed and performance',
    category: 'basic',
    react: '⚡',
    alias: ['performance', 'test'],
    usage: '.speed',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const start = Date.now();
        
        // Test 1: Message latency
        const msgStart = Date.now();
        await sock.sendPresenceUpdate('composing', jid);
        await sock.sendPresenceUpdate('available', jid);
        const msgLatency = Date.now() - msgStart;
        
        // Test 2: Processing speed
        let processing = 0;
        for (let i = 0; i < 1000; i++) processing += i;
        const processingTime = Date.now() - start;
        
        // Memory usage
        const memory = process.memoryUsage();
        const memoryUsage = (memory.heapUsed / 1024 / 1024).toFixed(2);
        
        const result = `*⚡ SPEED TEST RESULTS*\n\n` +
                      `*Message Latency:* ${msgLatency}ms\n` +
                      `*Processing Time:* ${processingTime}ms\n` +
                      `*Memory Usage:* ${memoryUsage} MB\n` +
                      `*Bot Status:* ✅ Active\n\n` +
                      `*🔋 Performance:* ${msgLatency < 100 ? 'Excellent' : msgLatency < 300 ? 'Good' : 'Fair'}`;
        
        await utils.sendBlueTickMessage(sock, jid, result, msg);
    }
};