const utils = require('../utils');
const axios = require('axios');

module.exports = {
    name: 'apk',
    description: 'Download APK from Aptoide',
    category: 'download',
    alias: ['app', 'apps', 'application', 'ap'],
    usage: '.apk <app name>',
    
    execute: async (sock, jid, msg, args, isGroup, isAdmin, isOwner) => {
        try {
            const q = args.join(' ').trim();
            
            if (!q) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*📱 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁*\n\n` +
                    `𝙸𝚏 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚊𝚗𝚢 𝚊𝚙𝚙,\n` +
                    `𝚝𝚑𝚎𝚗 𝚠𝚛𝚒𝚝𝚎 𝚕𝚒𝚔𝚎 𝚝𝚑𝚒𝚜:\n\n` +
                    `.𝚊𝚙𝚔 <𝚢𝚘𝚞𝚛 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎>\n\n` +
                    `𝚃𝚑𝚎𝚗 𝚢𝚘𝚞𝚛 𝚊𝚙𝚙𝚕𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚍 𝚊𝚗𝚍 𝚜𝚎𝚗𝚝 𝚑𝚎𝚛𝚎`,
                    msg
                );
                return;
            }

            await utils.sendBlueTickMessage(sock, jid,
                `*📥 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙰𝙿𝙺...*\n"${q}"\n⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚊 𝚖𝚘𝚖𝚎𝚗𝚝...`,
                msg
            );

            const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || !data.datalist || !data.datalist.list.length) {
                await utils.sendBlueTickMessage(sock, jid,
                    `*❌ 𝙰𝙿𝙺 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳*\n\n` +
                    `𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚏𝚒𝚗𝚍 𝙰𝙿𝙺 𝚏𝚘𝚛: "${q}"`,
                    msg
                );
                return;
            }

            const app = data.datalist.list[0];
            const appSize = (app.size / 1048576).toFixed(2);

            await sock.sendMessage(jid, {
                document: { url: app.file.path_alt },
                fileName: `${app.name}.apk`,
                mimetype: "application/vnd.android.package-archive",
                caption: `*📱 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳*\n\n` +
                        `*📦 𝙽𝚊𝚖𝚎:* ${app.name}\n` +
                        `*💾 𝚂𝚒𝚣𝚎:* ${appSize} 𝙼𝙱\n` +
                        `*⚡ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢:* 𝚂𝙸𝙻𝙰 𝙰𝙸`
            }, { quoted: msg });

            await utils.sendBlueTickMessage(sock, jid,
                `*✅ 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴*`,
                msg
            );

        } catch (error) {
            console.error("APK download error:", error);
            await utils.sendBlueTickMessage(sock, jid,
                `*❌ 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙵𝙰𝙸𝙻𝙴𝙳*\n\n` +
                `𝙴𝚛𝚛𝚘𝚛: ${error.message}\n\n` +
                `𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚠𝚒𝚝𝚑 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎`,
                msg
            );
        }
    }
};