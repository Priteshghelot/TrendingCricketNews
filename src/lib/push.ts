// Push notification helper functions

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// Show a notification
export function showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            icon: '/images/cricket-icon.png',
            badge: '/images/cricket-badge.png',
            ...options,
        });

        // Close notification after 10 seconds
        setTimeout(() => notification.close(), 10000);

        return notification;
    }
    return null;
}

// Show notification for new cricket news
export function notifyNewCricketNews(newsTitle: string, newsId: string, imageUrl?: string) {
    if (Notification.permission !== 'granted') return;

    const notification = showNotification('🏏 New Cricket News!', {
        body: newsTitle,
        icon: imageUrl || '/images/default-news.jpg',
        badge: '/images/cricket-badge.png',
        tag: newsId, // Prevent duplicate notifications
        requireInteraction: false,
        data: {
            url: `${window.location.origin}/news/${newsId}`,
            newsId,
        },
    });

    // Handle notification click
    if (notification) {
        notification.onclick = function (event) {
            event.preventDefault();
            window.focus();
            window.location.href = `/news/${newsId}`;
            notification.close();
        };
    }
}

// Check if notifications are supported
export function areNotificationsSupported(): boolean {
    return 'Notification' in window;
}

// Get current permission status
export function getNotificationPermission(): NotificationPermission {
    if (!areNotificationsSupported()) return 'denied';
    return Notification.permission;
}
