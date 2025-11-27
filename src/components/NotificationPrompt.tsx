'use client';

import React, { useState, useEffect } from 'react';
import { requestNotificationPermission, areNotificationsSupported, getNotificationPermission } from '@/lib/push';

export default function NotificationPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Check if notifications are supported
        if (!areNotificationsSupported()) return;

        // Check if user previously dismissed the prompt
        const wasDismissed = localStorage.getItem('notification-prompt-dismissed');
        if (wasDismissed === 'true') return;

        // Get current permission
        const currentPermission = getNotificationPermission();
        setPermission(currentPermission);

        // Show prompt after 3 seconds if permission not yet granted/denied
        if (currentPermission === 'default') {
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setPermission('granted');
            setShowPrompt(false);

            // Show a test notification
            if (Notification.permission === 'granted') {
                new Notification('🏏 Notifications Enabled!', {
                    body: 'You\'ll now receive alerts for new cricket news',
                    icon: '/images/default-news.jpg',
                });
            }
        } else {
            setPermission('denied');
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Remember dismissal in localStorage
        localStorage.setItem('notification-prompt-dismissed', 'true');
    };

    // Don't show if already granted, denied, or user dismissed
    if (!showPrompt || permission !== 'default') return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '1.5rem',
                maxWidth: '400px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                zIndex: 1000,
                animation: 'slideInUp 0.5s ease',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Bell Icon */}
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        Stay Updated! 🏏
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                        Get instant notifications when new cricket news is published
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button
                            onClick={handleEnableNotifications}
                            style={{
                                flex: 1,
                                padding: '0.6rem 1rem',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                transition: 'transform 0.2s ease, opacity 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.opacity = '0.9';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            Enable
                        </button>

                        <button
                            onClick={handleDismiss}
                            style={{
                                padding: '0.6rem 1rem',
                                background: 'transparent',
                                color: '#94a3b8',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#475569';
                                e.currentTarget.style.color = '#cbd5e1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#334155';
                                e.currentTarget.style.color = '#94a3b8';
                            }}
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
