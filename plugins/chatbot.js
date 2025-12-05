const utils = require('../utils');
const axios = require('axios');

// Store chatbot status per chat
const chatbotStatus = new Map();

module.exports = {
    name: 'chatbot',
    description: 'AI Chatbot with on/off control',
    category: 'ai',
    alias: ['ai', 'botchat', 'smartbot'],
    usage: '.chatbot [on/off]',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        const action = args[0]?.toLowerCase();
        
        if (action === 'on' || action === 'off') {
            if (isGroup && !isAdmin && !isOwner) {
                await utils.sendBlueTickMessage(sock, jid, '❌ Admin only!', msg);
                return;
            }
            
            chatbotStatus.set(jid, action === 'on');
            
            await utils.sendBlueTickMessage(sock, jid,
                `*🤖 CHATBOT ${action.toUpperCase()}*\n\n` +
                `AI Chatbot is now ${action === 'on' ? '✅ ACTIVE' : '❌ DISABLED'}\n\n` +
                `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
                msg
            );
            return;
        }
        
        // Show status
        const status = chatbotStatus.get(jid) !== false ? 'ON ✅' : 'OFF ❌';
        await utils.sendBlueTickMessage(sock, jid,
            `*🤖 AI CHATBOT*\n\n` +
            `*Status:* ${status}\n` +
            `*Usage:* .chatbot on/off\n\n` +
            `When ON, bot will reply to all messages.\n\n` +
            `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
            msg
        );
    }
};

// Function to handle chatbot replies
module.exports.handleChatbot = async (sock, jid, msg) => {
    try {
        // Check if chatbot is enabled for this chat
        if (chatbotStatus.get(jid) === false) return false;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || '';
        
        if (!text || text.startsWith(require('../config').PREFIX)) {
            return false;
        }
        
        // Don't reply to very short messages
        if (text.length < 2) return false;
        
        // Don't reply to commands
        if (text.match(/^[\.!#\/]/)) return false;
        
        // Get sender info for personalization
        const sender = msg.key.participant || jid;
        const senderNumber = sender.split('@')[0];
        
        // Send typing indicator
        try {
            await sock.sendPresenceUpdate('composing', jid);
        } catch (e) {}
        
        // Try multiple AI APIs
        const apis = [
            // Gemini API
            `https://api.ryzendesu.com/api/ai/gemini?text=${encodeURIComponent(text)}&key=gemini`,
            // ChatGPT API
            `https://api.nekolabs.my.id/api/ai/openai?text=${encodeURIComponent(text)}`,
            // Simple AI API
            `https://api.akuari.my.id/ai/gpt?chat=${encodeURIComponent(text)}`,
            // Alternative API
            `https://api.lolhuman.xyz/api/openai?apikey=YOUR_KEY&text=${encodeURIComponent(text)}`
        ];
        
        let aiResponse = null;
        
        for (const apiUrl of apis) {
            try {
                const response = await axios.get(apiUrl, { timeout: 15000 });
                
                if (response.data?.result || response.data?.response || response.data?.message) {
                    aiResponse = response.data.result || response.data.response || response.data.message;
                    break;
                }
            } catch (apiError) {
                continue;
            }
        }
        
        // If all APIs fail, use fallback responses
        if (!aiResponse) {
            const fallbackResponses = [
                `I understand you said: "${text}". How can I help you further?`,
                `Interesting point about "${text}". Can you tell me more?`,
                `Thanks for sharing that. What would you like to know?`,
                `I heard you mention "${text}". Is there anything specific you'd like to discuss?`,
                `Great input! How can I assist you with "${text}"?`
            ];
            
            aiResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
        
        // Personalize response
        const personalizedResponse = aiResponse
            .replace(/user/gi, `@${senderNumber}`)
            .replace(/you/gi, 'you')
            .replace(/\n\s*\n/g, '\n'); // Clean extra newlines
        
        // Send response
        await utils.sendBlueTickMessage(sock, jid,
            `*🤖 AI RESPONSE*\n\n` +
            `${personalizedResponse}\n\n` +
            `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱɪʟᴀ ᴛᴇᴄʜ*`,
            msg
        );
        
        // Stop typing
        try {
            await sock.sendPresenceUpdate('available', jid);
        } catch (e) {}
        
        return true;
        
    } catch (error) {
        console.error('Chatbot error:', error);
        return false;
    }
};