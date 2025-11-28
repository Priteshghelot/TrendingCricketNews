import { redirect } from 'next/navigation';
import { getPosts } from '@/lib/store';
import { createShortId } from '@/lib/shortId';

interface Props {
    params: Promise<{
        shortId: string;
    }>;
}

// Find the full ID from short ID
function findPostByShortId(shortId: string): string | null {
    const posts = getPosts();
    for (const post of posts) {
        if (createShortId(post.id) === shortId) {
            return post.id;
        }
    }
    return null;
}

export default async function ShortLinkPage({ params }: Props) {
    const { shortId } = await params;

    // Find the full post ID
    const fullId = findPostByShortId(shortId);

    if (fullId) {
        // Redirect to full news page
        redirect(`/news/${fullId}`);
    } else {
        // Post not found, redirect to homepage
        redirect('/');
    }
}

// Generate static params for recent posts
export async function generateStaticParams() {
    const posts = getPosts();
    const recentPosts = posts
        .filter(p => p.status === 'approved')
        .slice(0, 200);

    return recentPosts.map((post) => ({
        shortId: createShortId(post.id),
    }));
}

export const dynamicParams = true;
