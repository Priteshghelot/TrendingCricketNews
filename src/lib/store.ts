import Redis from 'ioredis';

const redis = new Redis(process.env.KV_URL || process.env.REDIS_URL || '');

// Wrapper to match kv interface
const kv = {
    async get<T>(key: string): Promise<T | null> {
        const value = await redis.get(key);
        if (!value) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as T;
        }
    },
    async set(key: string, value: any): Promise<void> {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        await redis.set(key, serialized);
    },
};

export interface Post {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    status: 'pending' | 'approved';
    timestamp: number;
}

const POSTS_KEY = 'crictrend:posts';

// Get all posts
export async function getPosts(): Promise<Post[]> {
    try {
        const posts = await kv.get<Post[]>(POSTS_KEY);
        // Robustness check: Ensure we actually got an array
        if (!Array.isArray(posts)) {
            return [];
        }
        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        return [];
    }
}

// Get approved posts only
export async function getApprovedPosts(): Promise<Post[]> {
    const posts = await getPosts();
    return posts
        .filter(p => p.status === 'approved')
        .sort((a, b) => b.timestamp - a.timestamp);
}

// Get post by ID
export async function getPostById(id: string): Promise<Post | null> {
    const posts = await getPosts();
    return posts.find(p => p.id === id) || null;
}

// Add a new post
export async function addPost(post: Post): Promise<void> {
    const posts = await getPosts();
    posts.unshift(post);
    await kv.set(POSTS_KEY, posts);
}

// Update post
export async function updatePost(id: string, updates: Partial<Post>): Promise<void> {
    const posts = await getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...updates };
        await kv.set(POSTS_KEY, posts);
    }
}

// Comments Interface
export interface Comment {
    id: string;
    postId: string;
    author: string;
    text: string;
    timestamp: number;
}

const COMMENTS_PREFIX = 'crictrend:comments:';

// Get comments for a post
export async function getComments(postId: string): Promise<Comment[]> {
    try {
        const key = `${COMMENTS_PREFIX}${postId}`;
        const comments = await kv.get<Comment[]>(key);
        if (!Array.isArray(comments)) return [];
        return comments.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

// Add a comment
export async function addComment(comment: Comment): Promise<void> {
    const key = `${COMMENTS_PREFIX}${comment.postId}`;
    const comments = await getComments(comment.postId);
    comments.unshift(comment);
    // Limit to last 50 comments per post to save space
    if (comments.length > 50) comments.pop();
    await kv.set(key, comments);
}

// Delete post (updated to delete comments too - optional but good practice)
export async function deletePost(id: string): Promise<void> {
    const posts = await getPosts();
    const filtered = posts.filter(p => p.id !== id);
    await kv.set(POSTS_KEY, filtered);
    // Note: We leave comments orphaned or could delete them here if we had a delete key method exposed
}
