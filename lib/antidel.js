const deletedMessages = new Map();
const MAX_STORED = 100;

module.exports = {
    // Store deleted message
    storeDeleted: (msg) => {
        try {
            const key = msg.key.id;
            const data = {
                ...msg,
                timestamp: Date.now(),
                deletedAt: Date.now()
            };
            
            deletedMessages.set(key, data);
            
            // Clean old messages if exceed limit
            if (deletedMessages.size > MAX_STORED) {
                const oldestKey = Array.from(deletedMessages.keys())[0];
                deletedMessages.delete(oldestKey);
            }
            
            return key;
        } catch (error) {
            console.error('Store deleted error:', error);
            return null;
        }
    },
    
    // Get deleted message
    getDeleted: (messageId) => {
        return deletedMessages.get(messageId);
    },
    
    // Restore deleted message
    restoreDeleted: async (sock, jid, messageId) => {
        const deletedMsg = deletedMessages.get(messageId);
        if (!deletedMsg) return false;
        
        try {
            // Send the original message
            await sock.sendMessage(jid, deletedMsg.message);
            
            // Remove from storage
            deletedMessages.delete(messageId);
            
            return true;
        } catch (error) {
            console.error('Restore error:', error);
            return false;
        }
    },
    
    // Get all deleted messages for a chat
    getChatDeleted: (jid) => {
        const chatMessages = [];
        for (const [key, msg] of deletedMessages.entries()) {
            if (msg.key.remoteJid === jid) {
                chatMessages.push({ id: key, ...msg });
            }
        }
        return chatMessages;
    },
    
    // Clear old messages (older than 1 hour)
    clearOldMessages: () => {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        for (const [key, msg] of deletedMessages.entries()) {
            if (now - msg.timestamp > oneHour) {
                deletedMessages.delete(key);
            }
        }
    },
    
    // Get stats
    getStats: () => {
        return {
            total: deletedMessages.size,
            max: MAX_STORED
        };
    }
};