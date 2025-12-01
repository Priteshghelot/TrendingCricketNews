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
export async function getPosts(throwOnError: boolean = false): Promise<Post[]> {
    try {
        const posts = await kv.get<Post[]>(POSTS_KEY);
        return posts || [];
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
    const posts = await getPosts(false);
    return posts.find(p => p.id === id);
}

// Add a new post
export async function addPost(post: Post): Promise<void> {
    try {
        const posts = await getPosts(true);
        posts.unshift(post); // Add to beginning
        await kv.set(POSTS_KEY, posts);
    } catch (error) {
        console.error('Failed to add post:', error);
        throw error;
    }
}

// Update post status and content
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
        const posts = await getPosts(true);
        const index = posts.findIndex(p => p.id === id);

        if (index !== -1) {
            posts[index].status = status;

            if (updates) {
                if (updates.content !== undefined) posts[index].content = updates.content;
                if (updates.highlights !== undefined) posts[index].highlights = updates.highlights;
                if (updates.body !== undefined) posts[index].body = updates.body;
                if (updates.imageUrl !== undefined) posts[index].imageUrl = updates.imageUrl;
            }

            await kv.set(POSTS_KEY, posts);
        }
    } catch (error) {
        console.error('Failed to update post:', error);
        throw error;
    }
}

// Delete a post
export async function deletePost(id: string): Promise<void> {
    try {
        const posts = await getPosts(true);
        const filteredPosts = posts.filter(p => p.id !== id);
        await kv.set(POSTS_KEY, filteredPosts);
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
