import { kv } from '@vercel/kv';

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

// Delete post
export async function deletePost(id: string): Promise<void> {
    const posts = await getPosts();
    const filtered = posts.filter(p => p.id !== id);
    await kv.set(POSTS_KEY, filtered);
}
