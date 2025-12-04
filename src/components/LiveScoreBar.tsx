'use client';

import { useEffect, useState } from 'react';

interface Match {
    id: string;
    title: string;
    link: string;
    live: boolean;
    description: string;
}

export default function LiveScoreBar() {
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        // Fetch live scores
        const fetchScores = async () => {
            try {
                const res = await fetch('/api/live-scores');
                const data = await res.json();
                setMatches(data.matches || []);
            } catch (error) {
                console.error('Error fetching live scores:', error);
            }
        };

        fetchScores();

        // Refresh every 60 seconds
        const interval = setInterval(fetchScores, 60000);

        return () => clearInterval(interval);
    }, []);

    if (matches.length === 0) {
        return (
            <div className="live-score-bar">
                <div className="container">
                    <div className="score-strip">
                        <div className="score-card">
                            <div className="match-status">Loading live scores...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="live-score-bar">
            <div className="container">
                <div className="score-strip">
                    {matches.map((match) => (
                        <a
                            key={match.id}
                            href={match.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="score-card"
                            style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="score-header">
                                <span className={`live-indicator ${match.live ? 'is-live' : ''}`}>
                                    {match.live ? 'LIVE' : 'RECENT'}
                                </span>
                            </div>
                            <div className="match-status">{match.title}</div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
