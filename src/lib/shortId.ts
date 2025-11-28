// Generate short, URL-friendly IDs (6 characters)
export function generateShortId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Create a short ID from a long ID (deterministic)
export function createShortId(longId: string): string {
    // Simple hash-based shortening - take first 6 chars of base36 encoded timestamp
    const timestamp = longId.split('-')[0] || longId;
    const num = parseInt(timestamp) || Date.now();
    return num.toString(36).slice(-6);
}
