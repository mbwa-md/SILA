const fs = require('fs');
const path = require('path');

class Store {
    constructor() {
        this.filePath = path.join(__dirname, 'store.json');
        this.data = this.load();
    }
    
    load() {
        try {
            if (fs.existsSync(this.filePath)) {
                return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            }
        } catch (error) {
            console.error('Store load error:', error);
        }
        return {};
    }
    
    save() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
            return true;
        } catch (error) {
            console.error('Store save error:', error);
            return false;
        }
    }
    
    get(key) {
        return this.data[key];
    }
    
    set(key, value) {
        this.data[key] = value;
        this.save();
        return true;
    }
    
    delete(key) {
        delete this.data[key];
        this.save();
        return true;
    }
    
    has(key) {
        return key in this.data;
    }
    
    keys() {
        return Object.keys(this.data);
    }
    
    values() {
        return Object.values(this.data);
    }
    
    entries() {
        return Object.entries(this.data);
    }
    
    clear() {
        this.data = {};
        this.save();
        return true;
    }
    
    size() {
        return Object.keys(this.data).length;
    }
}

module.exports = new Store();