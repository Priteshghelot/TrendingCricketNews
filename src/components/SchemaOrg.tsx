'use client';

import React from 'react';

interface SchemaOrgProps {
    type: 'Website' | 'NewsArticle' | 'Organization';
    data: any;
}

export default function SchemaOrg({ type, data }: SchemaOrgProps) {
    let schema = {};

    switch (type) {
        case 'Website':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: data.name || 'CricTrend',
                url: data.url || 'https://crictrend.vercel.app',
                description: data.description || 'Live cricket scores and latest cricket news',
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${data.url || 'https://crictrend.vercel.app'}/?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            };
            break;

        case 'Organization':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: data.name || 'CricTrend',
                url: data.url || 'https://crictrend.vercel.app',
                logo: `${data.url || 'https://crictrend.vercel.app'}/images/default-news.jpg`,
                description: data.description || 'Your source for live cricket scores and news',
            };
            break;

        case 'NewsArticle':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: data.headline,
                image: data.image || `${data.url || 'https://crictrend.vercel.app'}/images/default-news.jpg`,
                datePublished: data.datePublished,
                dateModified: data.dateModified || data.datePublished,
                author: {
                    '@type': 'Organization',
                    name: 'CricTrend',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'CricTrend',
                    logo: {
                        '@type': 'ImageObject',
                        url: `${data.url || 'https://crictrend.vercel.app'}/images/default-news.jpg`,
                    },
                },
                description: data.description,
            };
            break;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
