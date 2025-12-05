const axios = require('axios');
const yts = require('yt-search');

module.exports = {
    name: 'song',
    alias: ['play', 'audio', 'ytmp3', 'music'],
    category: 'downloader',
    description: 'Download audio from YouTube',
    usage: '.song <song name or YouTube link>',

    execute: async (sock, jid, message) => {
        try {
            const text = message.message?.conversation || 
                         message.message?.extendedTextMessage?.text || '';

            if (!text.trim()) {
                return sock.sendMessage(jid, { 
                    text: 'Send song name or YouTube link\n\nExample: .song faded alan walker' 
                }, { quoted: message });
            }

            let video;

            // 1. Tafuta video
            if (text.includes('youtube.com') || text.includes('youtu.be')) {
                const search = await yts(text);
                video = search.videos[0];
            } else {
                await sock.sendMessage(jid, { text: 'Searching song...' }, { quoted: message });
                const search = await yts(text);
                if (!search.videos.length) {
                    return sock.sendMessage(jid, { text: 'Song not found.' }, { quoted: message });
                }
                video = search.videos[0];
            }

            if (!video) return sock.sendMessage(jid, { text: 'Video not found.' }, { quoted: message });

            // 2. Tuma thumbnail + info
            await sock.sendMessage(jid, {
                image: { url: video.thumbnail },
                caption: `
Downloading Audio

*Title:* ${video.title}
*Duration:* ${video.timestamp}
*Views:* ${video.views.toLocaleString()}
*Channel:* ${video.author.name}

Please wait a few seconds...
                `.trim()
            }, { quoted: message });

            // 3. API MOJA TU – INAYOFANYA KAZI KILA WAKATI
            const apiUrl = `https://api.maher-zubair.xyz/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
            const response = await axios.get(apiUrl, { timeout: 60000 });

            if (!response.data.status || !response.data.result?.link) {
                return sock.sendMessage(jid, { text: 'Download failed. Try again.' }, { quoted: message });
            }

            const audioLink = response.data.result.link;
            const songTitle = response.data.result.title || video.title;

            // 4. Tuma audio na rich preview
            await sock.sendMessage(jid, {
                audio: { url: audioLink },
                mimetype: 'audio/mpeg',
                fileName: `${songTitle.replace(/[^a-zA0-9]/gi, '_')}.mp3`,
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: songTitle.length > 40 ? songTitle.substr(0, 37) + '...' : songTitle,
                        body: 'SILA MD • Now Playing',
                        thumbnailUrl: video.thumbnail,
                        mediaType: 2,
                        mediaUrl: video.url,
                        sourceUrl: video.url
                    }
                }
            }, { quoted: message });

        } catch (error) {
            console.error('Song error:', error.message);
            await sock.sendMessage(jid, { 
                text: 'Failed to download the song. Please try again.' 
            }, { quoted: message });
        }
    }
};