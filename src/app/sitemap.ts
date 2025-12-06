import { MetadataRoute } from 'next';
import { getApprovedPosts } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://crictrend.vercel.app';

    // Get all approved posts
    const posts = await getApprovedPosts();

    // Create sitemap entries for posts
    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/news/${post.id}`,
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
            priority: 1.0,
        },
        {
            url: `${baseUrl}/live`,
            lastModified: new Date(),
            changeFrequency: 'always' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/teams`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
    ];

    return [...staticPages, ...postEntries];
}
