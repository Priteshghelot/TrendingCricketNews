import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://crictrend.vercel.app';

    // Get all approved posts
    const allPosts = await getPosts();
    const posts = allPosts.filter((p: any) => p.status === 'approved');

    // Create post entries
    const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${baseUrl}/#post-${post.id}`,
        lastModified: new Date(post.timestamp),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/live`,
            lastModified: new Date(),
            changeFrequency: 'always' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/archive`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        },
    ];

    return [...staticPages, ...postEntries];
}
