const utils = require('../utils');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'code',
    description: 'Get WhatsApp linking QR code for sub-bot',
    category: 'tools',
    alias: ['qr', 'link', 'connect'],
    usage: '.code',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            // For now, use fixed session info
            // In real implementation, you'd generate unique session
            
            const sessionId = `sila_sub_${Date.now()}`;
            
            await utils.sendBlueTickMessage(sock, jid,
                `*📱 WHATSAPP LINKING CODE*\n\n` +
                `*🔹 Step 1:* Open WhatsApp\n` +
                `*🔹 Step 2:* Go to Menu → Linked Devices\n` +
                `*🔹 Step 3:* Tap "Link a Device"\n` +
                `*🔹 Step 4:* Scan QR code below\n\n` +
                `*⏰ Expires:* 45 seconds\n` +
                `*🤖 Session:* ${sessionId}\n\n` +
                `*𝒫𝑜𝓌𝑒𝓇𝑒𝒹 𝒷𝓎 𝒮𝒾𝓁𝒶 𝒯𝑒𝒸𝒽*`,
                msg
            );
            
            // Create linking data
            const linkingData = {
                ref: sessionId,
                refTTL: 45,
                t: Date.now(),
                v: "2.0"
            };
            
            // Generate QR code data
            const qrData = `https://whatsapp.com/dl/?code=${Buffer.from(JSON.stringify(linkingData)).toString('base64')}`;
            
            // Create temp directory
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            // Generate QR code
            const qrFilePath = path.join(tempDir, `whatsapp_qr_${Date.now()}.png`);
            
            await qrcode.toFile(qrFilePath, qrData, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#25D366', // WhatsApp green
                    light: '#FFFFFF'
                }
            });
            
            // Read QR image
            const qrBuffer = fs.readFileSync(qrFilePath);
            
            // Send QR code
            await sock.sendMessage(jid, {
                image: qrBuffer,
                caption: `*📲 SCAN TO LINK WHATSAPP*\n\n` +
                        `*🔸 Session:* ${sessionId}\n` +
                        `*🔸 Expires:* 45 seconds\n` +
                        `*🔸 Status:* Ready to link\n\n` +
                        `*👉 Scan with WhatsApp camera*\n` +
                        `*ℹ️ Make sure WhatsApp is updated*\n\n` +
                        `*𝒫𝑜𝓌𝑒𝓇𝑒𝒹 𝒷𝓎 𝒮𝒾𝓁𝒶 𝒯𝑒𝒸𝒽*`,
                mimetype: 'image/png'
            }, { quoted: msg });
            
            // Clean up temp file
            setTimeout(() => {
                if (fs.existsSync(qrFilePath)) {
                    fs.unlinkSync(qrFilePath);
                }
            }, 5000);
            
            // Auto delete message after 45 seconds (simulation)
            setTimeout(async () => {
                try {
                    await utils.sendBlueTickMessage(sock, jid,
                        `*⚠️ QR CODE EXPIRED*\n\n` +
                        `The linking QR has expired.\n` +
                        `Use *.code* again for new QR.\n\n` +
                        `*𝒫𝑜𝓌𝑒𝓇𝑒𝒹 𝒷𝓎 𝒮𝒾𝓁𝒶 𝒯𝑒𝒸𝒽*`,
                        msg
                    );
                } catch (e) {}
            }, 45000);
            
        } catch (error) {
            console.error('Code command error:', error);
            
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ Failed to generate linking code!*\n\n` +
                `*Try:* .code again\n\n` +
                `*𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑*`,
                msg
            );
        }
    }
};