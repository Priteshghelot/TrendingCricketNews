import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/store';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getPosts();
    const baseUrl = 'https://crictrend.vercel.app';

    // Static routes
    const routes = [
        '',
        '/live',
        '/archive',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes for posts
    const postRoutes = posts
        .filter((post) => post.status === 'approved')
        .map((post) => ({
            url: `${baseUrl}/news/${post.id}`,
            lastModified: new Date(post.timestamp).toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

    return [...routes, ...postRoutes];
}
