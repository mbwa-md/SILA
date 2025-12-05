module.exports = {
    // Bot Identity
    BOT_NAME: "SILA AI",
    BOT_OWNER: "255788313105@s.whatsapp.net",
    PREFIX: ".",
    
    // 🔐 SESSION ID - IMPORTANT FOR HEROKU/DEPLOYMENT
    // Weka session ID yako hapa kama una
    // Acha tupu kama unatumia pairing code
    SESSION_ID: process.env.SESSION_ID || "", // Ina-read kutoka environment variable
    
    // Bot Images - Random between these five
    BOT_IMAGES: [
        "https://files.catbox.moe/3rxk07.jpg",  // B1
        "https://files.catbox.moe/qi3kij.jpg"   // B5
    ],
    
    // Newsletter Channels
    NEWSLETTER_CHANNELS: [
        "120363402325089913@newsletter",
        "0029VbBG4gfISTkCpKxyMH02@newsletter",
        "0029Vb7CLKM5vKAHHK9sR02z@newsletter",
        "0029VbBmFT430LKO7Ch9C80X@newsletter"
    ],
    
    // Group Invite Links
    GROUP_INVITE_LINKS: [
        "https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks",
        "https://chat.whatsapp.com/C03aOCLQeRUH821jWqRPC6"
    ],
    
    // Features
    AUTO_READ: false,
    AUTO_REACT: false,
    AUTO_TYPING: true,
    AUTO_STATUS_VIEW: true,
    AUTO_STATUS_LIKE: true,
    AUTO_STATUS_REACT: true,
    AUTO_JOIN_CHANNELS: true,
    AUTO_JOIN_GROUPS: true,
    WELCOME_MESSAGE: true,
    GOODBYE_MESSAGE: true,
    ANTI_LINK: true,
    
    // API Keys
    IZUMI_API: "https://izumiiiiiiii.dpdns.org",
    FLUX_API: "https://shizoapi.onrender.com/api/ai/imagine",
    
    // Debug Mode (for troubleshooting)
    DEBUG_MODE: false,
    
    // Auto Backup Settings
    AUTO_BACKUP: true,
    BACKUP_INTERVAL: 3600000, // 1 hour in milliseconds
    
    // Database Settings
    DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/sila_Web",
    
    // Memory Management
    MAX_MEMORY_USAGE: 500, // MB
    AUTO_RESTART_ON_HIGH_MEMORY: true,
    
    // Heroku/Deployment Specific
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "production"
};