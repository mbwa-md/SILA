const utils = require('../utils');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'attp',
    description: 'Create animated text sticker with blinking colors',
    category: 'media',
    alias: ['textsticker', 'blinktext', 'rainbowtext'],
    usage: '.attp <text>',
    example: '.attp Hello World',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const text = args.join(' ').trim();
            
            if (!text) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*✨ 𝐀𝐓𝐓𝐏 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐎𝐑*\n\n` +
                    `*𝚄𝚜𝚊𝚐𝚎:* .attp <text>\n` +
                    `*𝙴𝚡𝚊𝚖𝚙𝚕𝚎:* .attp Hello World\n\n` +
                    `*✨ 𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜:*\n` +
                    `• 𝙱𝚕𝚒𝚗𝚔𝚒𝚗𝚐 𝚌𝚘𝚕𝚘𝚛𝚜 (𝚁𝙶𝙱)\n` +
                    `• 𝙰𝚗𝚒𝚖𝚊𝚝𝚎𝚍 𝚝𝚎𝚡𝚝\n` +
                    `• 𝚃𝚛𝚊𝚗𝚜𝚙𝚊𝚛𝚎𝚗𝚝 𝚋𝚊𝚌𝚔𝚐𝚛𝚘𝚞𝚗𝚍\n` +
                    `• 𝙱𝚘𝚛𝚍𝚎𝚛𝚎𝚍 𝚝𝚎𝚡𝚝\n\n` +
                    `*⚡ 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍 𝚋𝚢:* 𝚂𝙸𝙻𝙰 𝙰𝙸`,
                    msg
                );
                return;
            }
            
            // Check text length
            if (text.length > 50) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*⚠️ 𝚃𝙴𝚇𝚃 𝚃𝙾𝙾 𝙻𝙾𝙽𝙶*\n\n` +
                    `𝙼𝚊𝚡𝚒𝚖𝚞𝚖: 𝟻𝟶 𝚌𝚑𝚊𝚛𝚊𝚌𝚝𝚎𝚛𝚜\n` +
                    `𝚈𝚘𝚞𝚛 𝚝𝚎𝚡𝚝: ${text.length} 𝚌𝚑𝚊𝚛𝚊𝚌𝚝𝚎𝚛𝚜\n\n` +
                    `*𝚃𝚛𝚢 𝚜𝚑𝚘𝚛𝚝𝚎𝚛 𝚝𝚎𝚡𝚝*`,
                    msg
                );
                return;
            }
            
            await utils.sendBlueTickMessage(sock, jid,
                `*🔄 𝙲𝚁𝙴𝙰𝚃𝙸𝙽𝙶 𝙰𝙽𝙸𝙼𝙰𝚃𝙴𝙳 𝚂𝚃𝙸𝙲𝙺𝙴𝚁...*\n` +
                `"${text}"\n` +
                `*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝟷𝟶-𝟸𝟶 𝚜𝚎𝚌𝚘𝚗𝚍𝚜*`,
                msg
            );
            
            // Generate animated sticker
            try {
                const mp4Buffer = await renderBlinkingVideoWithFfmpeg(text);
                
                // Create temp directory
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                
                // Save video temporarily
                const tempVideoPath = path.join(tempDir, `attp_${Date.now()}.mp4`);
                fs.writeFileSync(tempVideoPath, mp4Buffer);
                
                // Send as sticker
                await sock.sendMessage(jid, {
                    sticker: fs.readFileSync(tempVideoPath),
                    mimetype: 'video/mp4'
                }, { quoted: msg });
                
                // Clean up
                fs.unlinkSync(tempVideoPath);
                
            } catch (ffmpegError) {
                console.error('FFmpeg error:', ffmpegError);
                
                // Fallback: Send text sticker
                await utils.sendBlueTickMessage(sock, jid,
                    `*⚠️ 𝙵𝙵𝙼𝙿𝙴𝙶 𝙽𝙾𝚃 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴*\n\n` +
                    `*𝚄𝚜𝚒𝚗𝚐 𝚝𝚎𝚡𝚝 𝚜𝚝𝚒𝚌𝚔𝚎𝚛 𝚏𝚊𝚕𝚕𝚋𝚊𝚌𝚔...*`,
                    msg
                );
                
                // Simple text sticker
                await sock.sendMessage(jid, {
                    sticker: {
                        url: `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(text)}&format=png`
                    },
                    mimetype: 'image/png'
                }, { quoted: msg });
            }
            
        } catch (error) {
            console.error('ATTP command error:', error);
            
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝙲𝚁𝙴𝙰𝚃𝙴 𝚂𝚃𝙸𝙲𝙺𝙴𝚁*\n\n` +
                `*𝙴𝚛𝚛𝚘𝚛:* ${error.message}\n\n` +
                `*𝚃𝚛𝚢:*\n` +
                `• 𝚂𝚑𝚘𝚛𝚝𝚎𝚛 𝚝𝚎𝚡𝚝\n` +
                `• 𝙰𝚟𝚘𝚒𝚍 𝚜𝚙𝚎𝚌𝚒𝚊𝚕 𝚌𝚑𝚊𝚛𝚊𝚌𝚝𝚎𝚛𝚜\n` +
                `• 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛`,
                msg
            );
        }
    }
};

// Function to render blinking video with ffmpeg
function renderBlinkingVideoWithFfmpeg(text) {
    return new Promise((resolve, reject) => {
        try {
            // Font path based on OS
            const fontPath = process.platform === 'win32'
                ? 'C:/Windows/Fonts/arialbd.ttf'
                : '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
            
            // Escape text for ffmpeg
            const escapeDrawtextText = (s) => s
                .replace(/\\/g, '\\\\')
                .replace(/:/g, '\\:')
                .replace(/,/g, '\\,')
                .replace(/'/g, "\\'")
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/%/g, '\\%');
            
            const safeText = escapeDrawtextText(text);
            const safeFontPath = process.platform === 'win32'
                ? fontPath.replace(/\\/g, '/').replace(':', '\\:')
                : fontPath;
            
            // Animation settings
            const cycle = 0.3; // Blink cycle length in seconds
            const duration = 1.8; // Total duration
            
            // Create color filters
            const drawRed = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=red:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='lt(mod(t\\,${cycle})\\,0.1)'`;
            const drawBlue = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=blue:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(mod(t\\,${cycle})\\,0.1\\,0.2)'`;
            const drawGreen = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=green:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='gte(mod(t\\,${cycle})\\,0.2)'`;
            
            const filter = `${drawRed},${drawBlue},${drawGreen}`;
            
            const args = [
                '-y',
                '-f', 'lavfi',
                '-i', `color=c=black:s=512x512:d=${duration}:r=20`,
                '-vf', filter,
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',
                '-t', String(duration),
                '-f', 'mp4',
                'pipe:1'
            ];
            
            // Spawn ffmpeg process
            const ffmpeg = spawn('ffmpeg', args);
            const chunks = [];
            const errors = [];
            
            ffmpeg.stdout.on('data', (data) => chunks.push(data));
            ffmpeg.stderr.on('data', (data) => errors.push(data));
            
            ffmpeg.on('error', (error) => {
                reject(new Error(`FFmpeg spawn error: ${error.message}`));
            });
            
            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve(Buffer.concat(chunks));
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}: ${Buffer.concat(errors).toString()}`));
                }
            });
            
        } catch (error) {
            reject(error);
        }
    });
}