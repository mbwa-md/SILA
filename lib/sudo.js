const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
    // Reload plugins
    reloadPlugins: () => {
        try {
            // Clear require cache for plugins
            const pluginsDir = path.join(__dirname, '../plugins');
            const pluginFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
            
            for (const file of pluginFiles) {
                const pluginPath = path.join(pluginsDir, file);
                delete require.cache[require.resolve(pluginPath)];
            }
            
            return { success: true, message: `Reloaded ${pluginFiles.length} plugins` };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    
    // Execute shell command
    execCommand: (command) => {
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                resolve({
                    error: error ? error.message : null,
                    stdout: stdout || '',
                    stderr: stderr || ''
                });
            });
        });
    },
    
    // Get system info
    getSystemInfo: () => {
        return {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cwd: process.cwd(),
            pid: process.pid,
            versions: process.versions
        };
    },
    
    // Get bot stats
    getBotStats: (activeUsers, groupSettings, plugins) => {
        return {
            activeUsers: activeUsers.size,
            groups: groupSettings.size,
            plugins: Object.keys(plugins).length,
            uptime: process.uptime(),
            memory: {
                rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
                heap: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            }
        };
    },
    
    // Backup data
    backupData: () => {
        try {
            const dataDir = path.join(__dirname, '../data');
            const backupDir = path.join(__dirname, '../backups');
            
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
            
            const data = {
                store: require('./database').data,
                timestamp: new Date().toISOString()
            };
            
            fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
            
            return { success: true, file: backupFile };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    
    // Restore data
    restoreData: (backupFile) => {
        try {
            if (!fs.existsSync(backupFile)) {
                return { success: false, message: 'Backup file not found' };
            }
            
            const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
            const db = require('./database');
            
            db.data = backupData.store;
            db.saveData();
            
            return { success: true, message: 'Data restored successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    
    // List backups
    listBackups: () => {
        try {
            const backupDir = path.join(__dirname, '../backups');
            
            if (!fs.existsSync(backupDir)) {
                return [];
            }
            
            const backups = fs.readdirSync(backupDir)
                .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
                .map(file => ({
                    name: file,
                    path: path.join(backupDir, file),
                    size: fs.statSync(path.join(backupDir, file)).size
                }));
            
            return backups;
        } catch (error) {
            console.error('List backups error:', error);
            return [];
        }
    }
};