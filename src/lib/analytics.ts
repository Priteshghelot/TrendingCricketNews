// Google Analytics helper functions

// Track page views
export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track social shares
export const trackShare = (platform: string, articleTitle: string) => {
    trackEvent('share', 'Social', `${platform}: ${articleTitle}`);
};

// Track modal opens
export const trackModalOpen = (articleTitle: string) => {
    trackEvent('modal_open', 'Engagement', articleTitle);
};

// Track external link clicks
export const trackExternalLink = (url: string) => {
    trackEvent('click', 'External Link', url);
};
