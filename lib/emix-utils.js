const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    // Download file from URL
    downloadFile: async (url, outputPath) => {
        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(outputPath));
                writer.on('error', reject);
            });
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    },
    
    // Generate random string
    randomString: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    // Format bytes
    formatBytes: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    // Get file extension
    getFileExtension: (filename) => {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    
    // Sleep function
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Parse time
    parseTime: (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        return {
            days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        };
    },
    
    // Format time
    formatTime: (ms) => {
        const time = module.exports.parseTime(ms);
        const parts = [];
        
        if (time.days > 0) parts.push(`${time.days}d`);
        if (time.hours > 0) parts.push(`${time.hours}h`);
        if (time.minutes > 0) parts.push(`${time.minutes}m`);
        if (time.seconds > 0) parts.push(`${time.seconds}s`);
        
        return parts.join(' ') || '0s';
    }
};