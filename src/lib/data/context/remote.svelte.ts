'use server';

const users = new Map();
const messages = [];

export async function greet(name: string) {
    const timestamp = new Date().toLocaleString();
    const greetings = `Hello, ${name}! (at ${timestamp})`;
    messages.push({ type: 'greet', name, timestamp });
    return greetings;
}

export async function registerUser(username: string, email: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (users.has(username)) {
        throw new Error(`Username "${username}" is already taken.`);
    }

    const user = {
        id: crypto.randomUUID(),
        username,
        email,
        createdAt: new Date().toISOString(),
        visits: 0,
    };
    users.set(username, user);
    return { success: true, user };
}

export async function trackVisit(username: string) {
    const user = users.get(username);
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    user.visits++;
    return { success: true, visits: user.visits };
}

export async function fetchServerStats() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
        totalUsers: users.size,
        totalMessages: messages.length,
        serverUptime: process.uptime?.() ?? 'N/A',
        memoryUsage: process.memoryUsage?.()?.heapUsed ?? 'N/A',
        timestamp: new Date().toISOString(),
    };
}

export async function searchUsers(query: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const results = [];
    for (const [username, user] of users) {
        if (username.toLowerCase().includes(query.toLowerCase())) {
            results.push(user);
        }
    }
    return results;
}
