const axios = require('axios');
const yts = require('yt-search');
const utils = require('../utils');

// Izumi API configuration
const izumi = {
    baseURL: "https://izumiiiiiiii.dpdns.org"
};

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

async function tryRequest(getter, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter();
        } catch (err) {
            lastError = err;
            if (attempt < attempts) {
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
    }
    throw lastError;
}

async function getIzumiVideoByUrl(youtubeUrl) {
    const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=720`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.download) return res.data.result;
    throw new Error('Izumi video api returned no download');
}

async function getOkatsuVideoByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.mp4) {
        return { download: res.data.result.mp4, title: res.data.result.title };
    }
    throw new Error('Okatsu ytmp4 returned no mp4');
}

module.exports = {
    name: 'video',
    description: 'Download YouTube video',
    category: 'download',
    alias: ['ytv', 'ytvideo', 'vid', 'mp4'],
    usage: '.video [query or url]',

    execute: async (sock, jid, msg, args) => {
        try {
            const searchQuery = args.join(' ').trim();
            
            if (!searchQuery) {
                await utils.sendBlueTickMessage(sock, jid,
                    `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮
│ 🎬 YouTube Downloader
╰━━━━━━━━━━━━━━━━━━━━╯

📝 *Usage:* .video [query or url]

📌 *Examples:*
• .video song name
• .video https://youtube.com/...
• .video https://youtu.be/...

🔧 *Features:*
• HD 720p quality
• Fast download
• Direct MP4 format
• Auto search

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified`,
                    msg
                );
                return;
            }

            // Determine if input is a YouTube link
            let videoUrl = '';
            let videoTitle = '';
            let videoThumbnail = '';
            
            if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {
                videoUrl = searchQuery;
                await sock.sendMessage(jid, {
                    text: '╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮\n│ 🔄 Processing URL...\n╰━━━━━━━━━━━━━━━━━━━━╯'
                }, { quoted: msg });
            } else {
                // Search YouTube for the video
                await sock.sendMessage(jid, {
                    text: `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮\n│ 🔍 Searching: ${searchQuery.substring(0, 30)}${searchQuery.length > 30 ? '...' : ''}\n╰━━━━━━━━━━━━━━━━━━━━╯`
                }, { quoted: msg });
                
                const { videos } = await yts(searchQuery);
                if (!videos || videos.length === 0) {
                    await utils.sendBlueTickMessage(sock, jid,
                        `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮
│ ❌ No Videos Found
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *Search Query:* ${searchQuery}

🔧 *Suggestions:*
• Check spelling
• Try different keywords
• Use specific title

📌 *Examples:*
• .video music
• .video tutorial
• .video funny clips

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556`,
                        msg
                    );
                    return;
                }
                videoUrl = videos[0].url;
                videoTitle = videos[0].title;
                videoThumbnail = videos[0].thumbnail;
            }

            // Send processing message
            await sock.sendMessage(jid, {
                text: `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮
│ ⏬ Downloading Video...
│ 📝 ${videoTitle || 'YouTube Video'}
╰━━━━━━━━━━━━━━━━━━━━╯`
            });

            // Validate YouTube URL
            let urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
            if (!urls) {
                await utils.sendBlueTickMessage(sock, jid,
                    `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮
│ ❌ Invalid YouTube Link
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *URL Provided:* ${videoUrl.substring(0, 50)}...

🔧 *Valid YouTube URLs:*
• https://youtube.com/watch?v=...
• https://youtu.be/...
• https://youtube.com/shorts/...

📌 *Example Valid URL:*
https://youtu.be/dQw4w9WgXcQ

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556`,
                    msg
                );
                return;
            }

            // Get video: try Izumi first, then Okatsu fallback
            let videoData;
            try {
                videoData = await getIzumiVideoByUrl(videoUrl);
            } catch (e1) {
                videoData = await getOkatsuVideoByUrl(videoUrl);
            }

            // Send video directly using the download URL
            await sock.sendMessage(jid, {
                video: { url: videoData.download },
                mimetype: 'video/mp4',
                fileName: `${videoData.title || videoTitle || 'sila_video'}.mp4`,
                caption: `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮
│ ✅ DOWNLOAD SUCCESSFUL
╰━━━━━━━━━━━━━━━━━━━━╯

📺 *Title:* ${videoData.title || videoTitle || 'YouTube Video'}

🔧 *Details:*
• Quality: HD 720p
• Format: MP4
• Size: Compressed
• Status: ✅ Ready

📌 *Features:*
• Fast download
• High quality
• Direct play
• No watermark

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified
🎬 SILA AI Downloader`
            });

        } catch (error) {
            console.error('[VIDEO] Command Error:', error?.message || error);
            
            await utils.sendBlueTickMessage(sock, jid,
                `╭━━【 𝐕𝐈𝐃𝐄𝐎 】━━━━━━━━╮
│ ❌ DOWNLOAD FAILED
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *Error:* ${error?.message || 'Unknown error'}

🔧 *Possible Issues:*
• Video is private/restricted
• Server timeout
• Network problem
• Invalid video format

🔄 *Solutions:*
1. Try different video
2. Check video availability
3. Wait a few minutes
4. Use direct YouTube link

📌 *Example Working Link:*
https://youtu.be/dQw4w9WgXcQ

━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +255612491556
🔵 WhatsApp ‧ Verified`,
                msg
            );
        }
    }
};