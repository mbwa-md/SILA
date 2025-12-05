const store = require('./store');
const converter = require('./converter');

module.exports = {
    // Update user data
    updateUser: (userId, data) => {
        const users = store.get('users') || {};
        users[userId] = { 
            ...users[userId], 
            ...data,
            lastUpdated: Date.now()
        };
        store.set('users', users);
        return true;
    },
    
    // Get user data
    getUser: (userId) => {
        const users = store.get('users') || {};
        return users[userId] || null;
    },
    
    // Update group data
    updateGroup: (groupId, data) => {
        const groups = store.get('groups') || {};
        groups[groupId] = { 
            ...groups[groupId], 
            ...data,
            lastUpdated: Date.now()
        };
        store.set('groups', groups);
        return true;
    },
    
    // Get group data
    getGroup: (groupId) => {
        const groups = store.get('groups') || {};
        return groups[groupId] || null;
    },
    
    // Increment command count
    incrementCommand: (userId, command) => {
        const user = module.exports.getUser(userId);
        if (!user) {
            module.exports.updateUser(userId, {
                commands: { [command]: 1 },
                totalCommands: 1
            });
        } else {
            const commands = user.commands || {};
            commands[command] = (commands[command] || 0) + 1;
            
            module.exports.updateUser(userId, {
                commands: commands,
                totalCommands: (user.totalCommands || 0) + 1
            });
        }
    },
    
    // Get command stats
    getCommandStats: () => {
        const users = store.get('users') || {};
        const stats = {
            totalCommands: 0,
            popularCommands: {},
            activeUsers: 0
        };
        
        Object.values(users).forEach(user => {
            stats.totalCommands += user.totalCommands || 0;
            
            if (user.commands) {
                Object.entries(user.commands).forEach(([cmd, count]) => {
                    stats.popularCommands[cmd] = (stats.popularCommands[cmd] || 0) + count;
                });
            }
            
            if (user.lastSeen && Date.now() - user.lastSeen < 24 * 60 * 60 * 1000) {
                stats.activeUsers++;
            }
        });
        
        // Sort popular commands
        stats.popularCommands = Object.entries(stats.popularCommands)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
        
        return stats;
    },
    
    // Clean old data (older than 30 days)
    cleanOldData: () => {
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const users = store.get('users') || {};
        const groups = store.get('groups') || {};
        
        // Clean old users
        const newUsers = {};
        Object.entries(users).forEach(([userId, user]) => {
            if (!user.lastSeen || now - user.lastSeen < thirtyDays) {
                newUsers[userId] = user;
            }
        });
        
        // Clean old groups
        const newGroups = {};
        Object.entries(groups).forEach(([groupId, group]) => {
            if (!group.lastUpdated || now - group.lastUpdated < thirtyDays) {
                newGroups[groupId] = group;
            }
        });
        
        store.set('users', newUsers);
        store.set('groups', newGroups);
        
        return {
            usersRemoved: Object.keys(users).length - Object.keys(newUsers).length,
            groupsRemoved: Object.keys(groups).length - Object.keys(newGroups).length
        };
    },
    
    // Backup data
    backup: () => {
        const backup = {
            data: store.data,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        
        const backups = store.get('backups') || [];
        backups.push(backup);
        
        // Keep only last 10 backups
        if (backups.length > 10) {
            backups.shift();
        }
        
        store.set('backups', backups);
        return backup;
    },
    
    // Get backups
    getBackups: () => {
        return store.get('backups') || [];
    }
};