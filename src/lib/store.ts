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
    body?: string; // Full article content for original reporting
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
    upcomingMatches?: MatchPreview[];
}

export interface MatchPreview {
    title: string;
    status: string;
    isLive: boolean;
    id?: string;
    startTime?: string;
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
        const parsed = JSON.parse(data);
        globalPosts = parsed.posts || [];
    }
} catch (error) {
    console.warn('File system not available or readable, using in-memory store:', error);
    isFsAvailable = false;
}

// Helper to save posts to file
function savePosts(posts: Post[]) {
    if (isFsAvailable) {
        try {
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const dataToSave = {
                posts: posts,
                score: globalScore
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
        } catch (error) {
            console.warn('Error saving posts to file (likely read-only FS), data will be lost on restart:', error);
            isFsAvailable = false;
        }
    }
    globalPosts = posts; // Always update in-memory store
}

export function getPosts(): Post[] {
    if (isFsAvailable) {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf-8');
                const parsed = JSON.parse(data);
                return parsed.posts || [];
            }
        } catch (error) {
            console.warn('Error reading posts file, returning in-memory:', error);
        }
    }
    return globalPosts;
}

// STRICT FILTER: Only return posts that are approved AND have original body content
export function getPublishedPosts(): Post[] {
    const posts = getPosts();
    return posts.filter(p => p.status === 'approved' && p.body && p.body.trim().length > 0);
}

export function getPostById(id: string): Post | undefined {
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    try {
        const logMessage = `[${new Date().toISOString()}] getPostById called with id: ${id}, Found: ${!!post}, Total posts: ${posts.length}\n`;
        fs.appendFileSync(path.join(process.cwd(), 'debug.log'), logMessage);
        if (!post && posts.length > 0) {
            fs.appendFileSync(path.join(process.cwd(), 'debug.log'), `First 5 IDs: ${posts.slice(0, 5).map(p => p.id).join(', ')}\n`);
        }
    } catch (e) {
        // Ignore logging errors
    }

    return post;
}

export function addPost(post: Post) {
    const posts = getPosts();
    // Check for duplicates
    if (!posts.some(p => p.id === post.id)) {
        posts.unshift(post);
        savePosts(posts);
    }
}

export function updatePostStatus(id: string, status: Post['status'], updateTimestamp: boolean = false, updates?: Partial<Post>) {
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);
    if (post) {
        post.status = status;
        // Update timestamp when approving so it appears first
        if (updateTimestamp) {
            post.timestamp = Date.now();
        }
        // Apply other updates if provided
        if (updates) {
            if (updates.content) post.content = updates.content;
            if (updates.highlights) post.highlights = updates.highlights;
            if (updates.body) post.body = updates.body;
            if (updates.imageUrl) post.imageUrl = updates.imageUrl;
        }
        savePosts(posts);
    }
}

export function deletePost(id: string) {
    const posts = getPosts();
    const newPosts = posts.filter(p => p.id !== id);
    if (newPosts.length !== posts.length) {
        savePosts(newPosts);
        return true;
    }
    return false;
}

export function updateScore(score: Score) {
    globalScore = score;
}

export function getScore(): Score {
    return globalScore;
}
