const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const utils = require('../utils');

module.exports = {
    name: 'sticker',
    description: 'Convert image/video to sticker',
    category: 'media',
    alias: ['s', 'stiker', 'stick'],
    usage: '.sticker [reply to image/video]',

    execute: async (sock, jid, msg, args) => {
        try {
            let targetMessage = msg;
            
            // If message is a reply, use quoted message
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quotedInfo = msg.message.extendedTextMessage.contextInfo;
                targetMessage = {
                    key: {
                        remoteJid: jid,
                        id: quotedInfo.stanzaId,
                        participant: quotedInfo.participant
                    },
                    message: quotedInfo.quotedMessage
                };
            }

            const mediaMessage = targetMessage.message?.imageMessage || 
                               targetMessage.message?.videoMessage || 
                               targetMessage.message?.documentMessage;

            if (!mediaMessage) {
                await utils.sendBlueTickMessage(sock, jid,
                    `╭━━【 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 】━━━━━━━━╮
│ 🖼️ Image/Video to Sticker
╰━━━━━━━━━━━━━━━━━━━━╯

📝 *Usage:* Reply to image/video with .sticker

📌 *Supported:*
• Images (JPG, PNG)
• Videos (MP4, GIF)
• Animated stickers

🔧 *Features:*
• Auto resize 512x512
• High quality
• Animated support

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified`,
                    msg
                );
                return;
            }

            // Send processing message
            await sock.sendMessage(jid, {
                text: `╭━━【 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 】━━━━━━━━╮
│ 🔄 Creating sticker...
╰━━━━━━━━━━━━━━━━━━━━╯`
            }, { quoted: msg });

            const mediaBuffer = await downloadMediaMessage(targetMessage, 'buffer', {}, { 
                logger: undefined, 
                reuploadRequest: sock.updateMediaMessage 
            });

            if (!mediaBuffer) {
                await utils.sendBlueTickMessage(sock, jid,
                    `╭━━【 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 】━━━━━━━━╮
│ ❌ Download Failed
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ Failed to download media

🔧 *Try:*
1. Resend the media
2. Check file size
3. Wait a moment

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556`,
                    msg
                );
                return;
            }

            // Create temp directory
            const tmpDir = path.join(process.cwd(), 'tmp');
            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }

            // Generate temp file paths
            const tempInput = path.join(tmpDir, `temp_${Date.now()}`);
            const tempOutput = path.join(tmpDir, `sticker_${Date.now()}.webp`);

            // Write media to temp file
            fs.writeFileSync(tempInput, mediaBuffer);

            // Check if media is animated
            const isAnimated = mediaMessage.mimetype?.includes('gif') || 
                              mediaMessage.mimetype?.includes('video') || 
                              mediaMessage.seconds > 0;

            // Convert to WebP using ffmpeg
            const ffmpegCommand = isAnimated
                ? `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`
                : `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

            await new Promise((resolve, reject) => {
                exec(ffmpegCommand, (error) => {
                    if (error) {
                        console.error('FFmpeg error:', error);
                        reject(error);
                    } else resolve();
                });
            });

            // Read the WebP file
            let webpBuffer = fs.readFileSync(tempOutput);

            // If animated and too large, re-encode
            if (isAnimated && webpBuffer.length > 1000 * 1024) {
                try {
                    const tempOutput2 = path.join(tmpDir, `sticker_fallback_${Date.now()}.webp`);
                    const fileSizeKB = mediaBuffer.length / 1024;
                    const isLargeFile = fileSizeKB > 5000;
                    const fallbackCmd = isLargeFile
                        ? `ffmpeg -y -i "${tempInput}" -t 2 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=8,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 30 -compression_level 6 -b:v 100k -max_muxing_queue_size 1024 "${tempOutput2}"`
                        : `ffmpeg -y -i "${tempInput}" -t 3 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=12,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 45 -compression_level 6 -b:v 150k -max_muxing_queue_size 1024 "${tempOutput2}"`;
                    await new Promise((resolve, reject) => {
                        exec(fallbackCmd, (error) => error ? reject(error) : resolve());
                    });
                    if (fs.existsSync(tempOutput2)) {
                        webpBuffer = fs.readFileSync(tempOutput2);
                        try { fs.unlinkSync(tempOutput2); } catch {}
                    }
                } catch {}
            }

            // Add metadata
            const img = new webp.Image();
            await img.load(webpBuffer);

            const json = {
                'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                'sticker-pack-name': 'SILA AI',
                'sticker-pack-publisher': '+255612491556',
                'emojis': ['🤖']
            };

            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
            const exif = Buffer.concat([exifAttr, jsonBuffer]);
            exif.writeUIntLE(jsonBuffer.length, 14, 4);

            img.exif = exif;
            let finalBuffer = await img.save(null);

            // Final safety for large files
            if (isAnimated && finalBuffer.length > 900 * 1024) {
                try {
                    const tempOutput3 = path.join(tmpDir, `sticker_small_${Date.now()}.webp`);
                    const smallCmd = `ffmpeg -y -i "${tempInput}" -t 2 -vf "scale=320:320:force_original_aspect_ratio=decrease,fps=8,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 30 -compression_level 6 -b:v 80k -max_muxing_queue_size 1024 "${tempOutput3}"`;
                    await new Promise((resolve, reject) => {
                        exec(smallCmd, (error) => error ? reject(error) : resolve());
                    });
                    if (fs.existsSync(tempOutput3)) {
                        const smallWebp = fs.readFileSync(tempOutput3);
                        const img2 = new webp.Image();
                        await img2.load(smallWebp);
                        img2.exif = exif;
                        finalBuffer = await img2.save(null);
                        try { fs.unlinkSync(tempOutput3); } catch {}
                    }
                } catch {}
            }

            // Send the sticker
            await sock.sendMessage(jid, { 
                sticker: finalBuffer
            }, { quoted: msg });

            // Send success message
            await sock.sendMessage(jid, {
                text: `╭━━【 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 】━━━━━━━━╮
│ ✅ Sticker Created
╰━━━━━━━━━━━━━━━━━━━━╯

✨ *Successfully converted to sticker*

🔧 *Details:*
• Size: 512x512 pixels
• Type: ${isAnimated ? 'Animated' : 'Static'}
• Quality: High
• Status: ✅ Ready

📌 *Features:*
• Auto resizing
• Transparent background
• WhatsApp optimized

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified
🤖 SILA AI Sticker Maker`
            });

            // Cleanup
            try {
                fs.unlinkSync(tempInput);
                fs.unlinkSync(tempOutput);
            } catch (err) {}

        } catch (error) {
            console.error('Sticker command error:', error);
            
            await utils.sendBlueTickMessage(sock, jid,
                `╭━━【 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 】━━━━━━━━╮
│ ❌ Conversion Failed
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *Error:* Failed to create sticker

🔧 *Possible Issues:*
• Media too large
• Invalid format
• FFmpeg error

🔄 *Try:*
1. Smaller file size
2. Image format (JPG/PNG)
3. Shorter video (<10s)

📌 *Supported formats:*
• Images: JPG, PNG
• Videos: MP4, GIF (<10s)

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified`,
                msg
            );
        }
    }
};