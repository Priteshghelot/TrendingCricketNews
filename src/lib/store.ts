// Simple in-memory store (Note: Data resets on server restart/redeploy)

export interface Post {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    status: 'pending' | 'approved';
    timestamp: number;
}

// Global variable to hold posts in memory
// In a serverless environment like Vercel, this might reset occasionally
// but it works for a simple demo without database setup.
let posts: Post[] = [];

// Get all posts
export async function getPosts(): Promise<Post[]> {
    return posts;
}

// Get approved posts only
export async function getApprovedPosts(): Promise<Post[]> {
    return posts
        .filter(p => p.status === 'approved')
        .sort((a, b) => b.timestamp - a.timestamp);
}

// Get post by ID
export async function getPostById(id: string): Promise<Post | null> {
    return posts.find(p => p.id === id) || null;
}

// Add a new post
export async function addPost(post: Post): Promise<void> {
    posts.unshift(post);
}

// Update post
export async function updatePost(id: string, updates: Partial<Post>): Promise<void> {
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...updates };
    }
}

// Delete post
export async function deletePost(id: string): Promise<void> {
    posts = posts.filter(p => p.id !== id);
}
