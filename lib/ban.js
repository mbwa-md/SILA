const bannedUsers = new Set();
const bannedGroups = new Set();

module.exports = {
    // Ban user
    banUser: (jid) => {
        bannedUsers.add(jid);
        return true;
    },
    
    // Unban user
    unbanUser: (jid) => {
        bannedUsers.delete(jid);
        return true;
    },
    
    // Ban group
    banGroup: (jid) => {
        bannedGroups.add(jid);
        return true;
    },
    
    // Unban group
    unbanGroup: (jid) => {
        bannedGroups.delete(jid);
        return true;
    },
    
    // Check if user is banned
    isUserBanned: (jid) => {
        return bannedUsers.has(jid);
    },
    
    // Check if group is banned
    isGroupBanned: (jid) => {
        return bannedGroups.has(jid);
    },
    
    // Get all banned users
    getBannedUsers: () => {
        return Array.from(bannedUsers);
    },
    
    // Get all banned groups
    getBannedGroups: () => {
        return Array.from(bannedGroups);
    }
};