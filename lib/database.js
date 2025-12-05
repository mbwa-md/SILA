const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/store.json');
        this.data = this.loadData();
    }
    
    loadData() {
        try {
            if (fs.existsSync(this.dataPath)) {
                return JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
            }
        } catch (error) {
            console.error('Database load error:', error);
        }
        return {
            users: {},
            groups: {},
            settings: {},
            stats: {
                commands: 0,
                messages: 0,
                users: 0,
                groups: 0
            }
        };
    }
    
    saveData() {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
            return true;
        } catch (error) {
            console.error('Database save error:', error);
            return false;
        }
    }
    
    // User methods
    getUser(userId) {
        return this.data.users[userId] || null;
    }
    
    setUser(userId, data) {
        this.data.users[userId] = { 
            ...this.getUser(userId), 
            ...data,
            lastSeen: Date.now()
        };
        this.saveData();
        return true;
    }
    
    // Group methods
    getGroup(groupId) {
        return this.data.groups[groupId] || null;
    }
    
    setGroup(groupId, data) {
        this.data.groups[groupId] = { 
            ...this.getGroup(groupId), 
            ...data 
        };
        this.saveData();
        return true;
    }
    
    // Settings methods
    getSetting(key) {
        return this.data.settings[key];
    }
    
    setSetting(key, value) {
        this.data.settings[key] = value;
        this.saveData();
        return true;
    }
    
    // Stats methods
    incrementStat(stat, amount = 1) {
        if (this.data.stats[stat] !== undefined) {
            this.data.stats[stat] += amount;
            this.saveData();
        }
    }
    
    getStats() {
        return this.data.stats;
    }
}

module.exports = new Database();