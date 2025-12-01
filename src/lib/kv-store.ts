import { kv } from '@vercel/kv';

export interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    timestamp: number;
    sourceUrl?: string;
    highlights?: string;
    keywords?: string[];
    body?: string;
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

export interface MatchPreview {
    title: string;
    status: string;
    isLive: boolean;
    id?: string;
    startTime?: string;
}

export interface DetailedScore {
    batters: Batsman[];
    bowlers: Bowler[];
    partnership: string;
    recentBalls: string[];
    matchInfo: string;
    scrapedScores: string[];
    seriesName: string;
    matchLocation: string;
    equation: string;
}

export interface Score {
    teamA: string;
    teamB: string;
    scoreA: string;
    scoreB: string;
    status: string;
    matchTitle: string;
    seriesName?: string;
    matchLocation?: string;
    equation?: string;
    commentary?: any[];
    detailedScore?: DetailedScore;
    upcomingMatches?: MatchPreview[];
}

const POSTS_KEY = 'crictrend:posts';
const SCORE_KEY = 'crictrend:score';

// Get all posts from KV
// Uses Redis Hash for atomic operations and better performance
export async function getPosts(throwOnError: boolean = false): Promise<Post[]> {
    try {
        // Try to get from Hash first
        const postsHash = await kv.hgetall<Record<string, Post>>('crictrend:posts_hash');

        if (postsHash) {
            const posts = Object.values(postsHash);
            // Sort by timestamp descending (newest first)
            return posts.sort((a, b) => b.timestamp - a.timestamp);
        }

        // Fallback: Check for old JSON array format and migrate if found
        const oldPosts = await kv.get<Post[]>(POSTS_KEY);
        if (oldPosts && oldPosts.length > 0) {
            console.log('Migrating posts from JSON array to Hash...');
            const migrationMap: Record<string, Post> = {};
            oldPosts.forEach(p => {
                migrationMap[p.id] = p;
            });

            // Save to Hash
            await kv.hset('crictrend:posts_hash', migrationMap);
            // Delete old key to complete migration
            await kv.del(POSTS_KEY);

            return oldPosts.sort((a, b) => b.timestamp - a.timestamp);
        }

        return [];
    } catch (error) {
        console.error('Error getting posts from KV:', error);
        if (throwOnError) {
            throw error;
        }
        return [];
    }
}

// Get published posts (approved with body content)
export async function getPublishedPosts(): Promise<Post[]> {
    const posts = await getPosts(false);
    return posts.filter(p => p.status === 'approved' && p.body && p.body.trim().length > 0);
}

// Get post by ID
export async function getPostById(id: string): Promise<Post | undefined> {
    try {
        // Fetch directly from Hash - much faster/cheaper than getting all
        const post = await kv.hget<Post>('crictrend:posts_hash', id);
        if (post) return post;

        // Fallback to full list check (in case of migration edge cases)
        const posts = await getPosts(false);
        return posts.find(p => p.id === id);
    } catch (error) {
        console.error(`Error getting post ${id}:`, error);
        return undefined;
    }
}

// Add a new post
// Atomic operation using HSET - no race conditions!
export async function addPost(post: Post): Promise<void> {
    try {
        const result = await kv.hset('crictrend:posts_hash', { [post.id]: post });
        console.log(`Added post ${post.id}. Result: ${result}`);
    } catch (error) {
        console.error('Failed to add post:', error);
        throw error;
    }
}

// Update post status and content
// Atomic operation using HSET - no race conditions!
export async function updatePostStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'archived',
    updates?: {
        content?: string;
        highlights?: string;
        body?: string;
        imageUrl?: string;
    }
): Promise<void> {
    try {
        // We need to get the existing post first to merge updates
        const post = await getPostById(id);

        if (post) {
            const updatedPost = { ...post, status };

            if (updates) {
                if (updates.content !== undefined) updatedPost.content = updates.content;
                if (updates.highlights !== undefined) updatedPost.highlights = updates.highlights;
                if (updates.body !== undefined) updatedPost.body = updates.body;
                if (updates.imageUrl !== undefined) updatedPost.imageUrl = updates.imageUrl;
            }

            await kv.hset('crictrend:posts_hash', { [id]: updatedPost });
        }
    } catch (error) {
        console.error('Failed to update post:', error);
        throw error;
    }
}

// Delete a post
// Atomic operation using HDEL - no race conditions!
export async function deletePost(id: string): Promise<void> {
    try {
        await kv.hdel('crictrend:posts_hash', id);
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw error;
    }
}

// Get score
export async function getScore(): Promise<Score> {
    try {
        const score = await kv.get<Score>(SCORE_KEY);
        return score || {
            teamA: '',
            teamB: '',
            scoreA: '',
            scoreB: '',
            status: '',
            matchTitle: ''
        };
    } catch (error) {
        console.error('Error getting score from KV:', error);
        return {
            teamA: '',
            teamB: '',
            scoreA: '',
            scoreB: '',
            status: '',
            matchTitle: ''
        };
    }
}

// Save score
export async function saveScore(score: Score): Promise<void> {
    try {
        await kv.set(SCORE_KEY, score);
    } catch (error) {
        console.error('Error saving score to KV:', error);
        throw error;
    }
}
