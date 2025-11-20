import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

export interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
    sourceUrl?: string;
    highlights?: string;
    keywords?: string[];
}

export interface Batsman {
    name: string;
    runs: string;
    balls: string;
    fours: string;
    sixes: string;
    sr: string;
}

export interface Bowler {
    name: string;
    overs: string;
    maidens: string;
    runs: string;
    wickets: string;
    economy: string;
    extras?: string;
}

export interface Score {
    teamA: string;
    teamB: string;
    scoreA: string;
    scoreB: string;
    status: string; // e.g. "Live", "Innings Break", "Result"
    matchTitle: string; // e.g. "IND vs AUS, 1st Test"
    seriesName?: string; // e.g. "Women's Big Bash League"
    matchLocation?: string; // e.g. "North Sydney Oval, Sydney"
    matchTime?: string; // e.g. "November 20, 2025 at 10:10 AM"
    equation?: string; // e.g. "Hobart Hurricanes Women need 122 runs..."
    commentary?: { ball: string; text: string; run: string }[];
    detailedScore?: {
        batters: Batsman[];
        bowlers: Bowler[];
        partnership: string;
        recentBalls: string[];
        matchInfo: string;
    };
}

// In-memory fallback for Vercel/Serverless environments where FS is read-only
let globalPosts: Post[] = [];
let globalScore: Score = {
    teamA: 'India',
    teamB: 'Australia',
    scoreA: '250/3',
    scoreB: 'Yet to Bat',
    status: 'Live - 1st Innings',
    matchTitle: 'Border-Gavaskar Trophy, 1st Test'
};
let isFsAvailable = true;

// Initialize by trying to read from file once
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        globalPosts = JSON.parse(data);
    }
} catch (error) {
    console.warn('File system not available or readable, using in-memory store:', error);
    isFsAvailable = false;
}

export function getPosts(): Post[] {
    if (isFsAvailable) {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn('Error reading posts file, returning in-memory:', error);
        }
    }
    return globalPosts;
}

export function savePosts(posts: Post[]) {
    // Always update in-memory
    globalPosts = posts;

    if (isFsAvailable) {
        try {
            // Ensure directory exists
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
        } catch (error) {
            console.warn('Error saving posts to file (likely read-only FS), data will be lost on restart:', error);
            // Disable FS for future writes to avoid error log spam
            isFsAvailable = false;
        }
    }
}

export function addPost(post: Post) {
    const posts = getPosts();
    // Check for duplicates
    if (!posts.some(p => p.id === post.id)) {
        posts.unshift(post);
        savePosts(posts);
    }
}

export function updatePostStatus(id: string, status: Post['status'], updateTimestamp: boolean = false) {
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);
    if (post) {
        post.status = status;
        // Update timestamp when approving so it appears first
        if (updateTimestamp) {
            post.timestamp = Date.now();
        }
        savePosts(posts);
    }
}

export function getScore(): Score {
    return globalScore;
}

export function updateScore(score: Score) {
    globalScore = score;
}
