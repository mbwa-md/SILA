const axios = require('axios');
const mumaker = require('mumaker');

// Base channel info template
const channelInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363402325089913@newsletter',
        newsletterName: 'SILA AI',
        serverMessageId: -1
    }
};

// Reusable message templates
const messageTemplates = {
    error: (message) => ({
        text: message,
        contextInfo: channelInfo
    }),
    success: (text, imageUrl) => ({
        image: { url: imageUrl },
        caption: "╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 】━━━━━━━━╮\n│ 🎨 LOGO GENERATED\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n📝 *Text:* " + text + "\n\n👑 Owner: +255612491556\n🔵 WhatsApp ‧ Verified",
        contextInfo: channelInfo
    })
};

async function logoCommand(sock, chatId, message, q, type) {
    try {
        if (!q) {
            const helpText = `╭━━【 𝐋𝐎𝐆𝐎 】━━━━━━━━╮
│ 🎨 Logo Generator
╰━━━━━━━━━━━━━━━━━━━━╯

📝 *Usage:* .<style> [text]

🎯 *Available Styles:*
• .metallic • .ice • .snow
• .impressive • .matrix • .light
• .neon • .devil • .purple
• .thunder • .leaves • .1917
• .arena • .hacker • .sand
• .blackpink • .glitch • .fire

📌 *Example:* .metallic SILA
*Example:* .neon AI BOT

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified`;
            
            return await sock.sendMessage(chatId, {
                text: helpText,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        // Extract text
        const text = q.split(' ').slice(1).join(' ');

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: '╭━━【 𝐋𝐎𝐆𝐎 】━━━━━━━━╮\n│ ❌ Missing Text\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n📝 Please provide text to generate\n\n📌 *Example:* .metallic SILA AI\n📌 *Example:* .neon BOT',
                contextInfo: channelInfo
            }, { quoted: message });
        }

        try {
            let result;
            switch (type) {
                case 'metallic':
                    result = await mumaker.ephoto("https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html", text);
                    break;
                case 'ice':
                    result = await mumaker.ephoto("https://en.ephoto360.com/ice-text-effect-online-101.html", text);
                    break;
                case 'snow':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html", text);
                    break;
                case 'impressive':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html", text);
                    break;
                case 'matrix':
                    result = await mumaker.ephoto("https://en.ephoto360.com/matrix-text-effect-154.html", text);
                    break;
                case 'light':
                    result = await mumaker.ephoto("https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html", text);
                    break;
                case 'neon':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html", text);
                    break;
                case 'devil':
                    result = await mumaker.ephoto("https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html", text);
                    break;
                case 'purple':
                    result = await mumaker.ephoto("https://en.ephoto360.com/purple-text-effect-online-100.html", text);
                    break;
                case 'thunder':
                    result = await mumaker.ephoto("https://en.ephoto360.com/thunder-text-effect-online-97.html", text);
                    break;
                case 'leaves':
                    result = await mumaker.ephoto("https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html", text);
                    break;
                case '1917':
                    result = await mumaker.ephoto("https://en.ephoto360.com/1917-style-text-effect-523.html", text);
                    break;
                case 'arena':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html", text);
                    break;
                case 'hacker':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html", text);
                    break;
                case 'sand':
                    result = await mumaker.ephoto("https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html", text);
                    break;
                case 'blackpink':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html", text);
                    break;
                case 'glitch':
                    result = await mumaker.ephoto("https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html", text);
                    break;
                case 'fire':
                    result = await mumaker.ephoto("https://en.ephoto360.com/flame-lettering-effect-372.html", text);
                    break;
                default:
                    return await sock.sendMessage(chatId, {
                        text: '╭━━【 𝐋𝐎𝐆𝐎 】━━━━━━━━╮\n│ ❌ Invalid Style\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n⚠️ Invalid logo generator type\n\n📌 Use: .logo for available styles',
                        contextInfo: channelInfo
                    }, { quoted: message });
            }

            if (!result || !result.image) {
                throw new Error('No image URL received from API');
            }

            // Send success message
            await sock.sendMessage(chatId, {
                image: { url: result.image },
                caption: `╭━━【 𝐒𝐈𝐋𝐀 𝐀𝐈 】━━━━━━━━╮\n│ ✅ LOGO GENERATED\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n🎨 *Style:* ${type.toUpperCase()}\n📝 *Text:* ${text}\n\n🔧 *Generated using:* ephoto360\n✨ *Quality:* High Definition\n\n👑 Owner: +255612491556\n🔵 WhatsApp ‧ Verified`,
                contextInfo: channelInfo
            }, { quoted: message });

        } catch (error) {
            console.error('Error in logo generator:', error);
            
            await sock.sendMessage(chatId, {
                text: `╭━━【 𝐋𝐎𝐆𝐎 】━━━━━━━━╮\n│ ❌ Generation Failed\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n⚠️ *Error:* ${error.message}\n\n🔧 *Possible reasons:*\n• API server busy\n• Text too long\n• Invalid characters\n\n📌 *Try:*\n• Shorter text\n• Different style\n• Wait a minute`,
                contextInfo: channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in logo command:', error);
        
        await sock.sendMessage(chatId, {
            text: '╭━━【 𝐋𝐎𝐆𝐎 】━━━━━━━━╮\n│ ❌ System Error\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n⚠️ An error occurred. Please try again later.\n\n👑 Owner: +255612491556',
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = logoCommand;