'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Match {
    id: string;
    title: string;
    live: boolean;
    description: string;
}

export default function SidebarLiveWidget() {
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch('/api/live-scores');
                const data = await res.json();
                if (data.matches) {
                    setMatches(data.matches.slice(0, 5)); // Show top 5
                }
            } catch (error) {
                console.error('Error fetching sidebar scores:', error);
            }
        };

        fetchScores();
        const interval = setInterval(fetchScores, 60000);
        return () => clearInterval(interval);
    }, []);

    if (matches.length === 0) return null;

    return (
        <div className="sidebar-section">
            <h3 className="sidebar-title">Live Scores</h3>
            <div className="live-widget-list">
                {matches.map((match) => (
                    <Link key={match.id} href={`/live?matchId=${match.id}`} className="live-widget-item">
                        <div className="live-widget-header">
                            <span className={`live-dot ${match.live ? 'pulsing' : ''}`}></span>
                            <span className="live-widget-status">{match.live ? 'LIVE' : 'RECENT'}</span>
                        </div>
                        <div className="live-widget-title">{match.title}</div>
                    </Link>
                ))}
            </div>
            <style jsx>{`
                .live-widget-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .live-widget-item {
                    display: block;
                    padding: 0.8rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 3px solid #ccc;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.2s;
                }
                .live-widget-item:hover {
                    background: #fff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border-left-color: var(--primary-blue);
                }
                .live-widget-header {
                    display: flex;
                    align-items: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 0.3rem;
                    color: #e63946;
                }
                .live-dot {
                    width: 8px;
                    height: 8px;
                    background: #e63946;
                    border-radius: 50%;
                    margin-right: 6px;
                }
                .pulsing {
                    animation: pulse 1.5s infinite;
                }
                .live-widget-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    line-height: 1.3;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
