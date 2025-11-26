'use client';

import { useEffect, useState } from 'react';

interface AnalyticsStats {
    activeUsers?: number;
    error?: string;
}

export default function AnalyticsViewer() {
    const [stats, setStats] = useState<AnalyticsStats>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if gtag is available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            setStats({});
            setLoading(false);
        } else {
            setStats({ error: 'Google Analytics not loaded' });
            setLoading(false);
        }
    }, []);

    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const propertyId = '13053021021'; // GA4 Property ID (Stream ID)

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Analytics Dashboard</h2>

            {loading ? (
                <div className="text-gray-600">Loading analytics...</div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Google Analytics Property</p>
                                <p className="text-lg font-mono font-semibold text-gray-800">
                                    {measurementId || 'G-DWLSVY6BXK'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Property ID: {propertyId}</p>
                            </div>
                            <div className="text-4xl">📈</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href={`https://analytics.google.com/analytics/web/#/p${propertyId}/realtime/overview`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Real-time Users</p>
                                    <p className="text-2xl font-bold text-green-700">View Live →</p>
                                    <p className="text-xs text-gray-500 mt-1">See who's on your site now</p>
                                </div>
                                <div className="text-3xl">👥</div>
                            </div>
                        </a>

                        <a
                            href={`https://analytics.google.com/analytics/web/#/p${propertyId}/reports/intelligenthome`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Today's Visitors</p>
                                    <p className="text-2xl font-bold text-purple-700">View Report →</p>
                                    <p className="text-xs text-gray-500 mt-1">See today's visitor count</p>
                                </div>
                                <div className="text-3xl">📊</div>
                            </div>
                        </a>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">💡</div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800 mb-1">Quick Access</p>
                                <p className="text-sm text-gray-600">
                                    Click <strong>"Real-time Users"</strong> to see who's currently on your site, or
                                    <strong> "Today's Visitors"</strong> to see total visitors for today.
                                    Change the date range in GA4 to view different time periods.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-2">📌 Key Metrics in Google Analytics:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• <strong>Users:</strong> Total unique visitors to your site</li>
                            <li>• <strong>Sessions:</strong> Total visits (a user can have multiple sessions)</li>
                            <li>• <strong>Page Views:</strong> Total number of pages viewed</li>
                            <li>• <strong>Engagement Rate:</strong> % of engaged sessions</li>
                            <li>• <strong>Avg Session Duration:</strong> Average time spent on site</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
