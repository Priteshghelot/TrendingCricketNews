'use client';

import { useState, useEffect } from 'react';
import { Score } from '@/lib/store';
import AdSense from '@/components/AdSense';

interface MatchPreview {
    title: string;
    status: string;
    isLive: boolean;
}

export default function Live() {
    const [score, setScore] = useState<Score | null>(null);
    const [upcomingMatches, setUpcomingMatches] = useState<MatchPreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await fetch('/api/scores');
                const data = await res.json();
                if (data && !data.error) {
                    setScore(data.score || data);
                }
            } catch (error) {
                console.error('Failed to fetch score', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUpcomingMatches = async () => {
            try {
                const Parser = (await import('rss-parser')).default;
                const parser = new Parser();
                const feed = await parser.parseURL('https://static.cricinfo.com/rss/livescores.xml');

                const matches: MatchPreview[] = feed.items.slice(0, 8).map(item => {
                    const title = item.title || '';
                    const description = item.contentSnippet || item.content || '';

                    const isLive = title.includes('*') ||
                        description.toLowerCase().includes('live') ||
                        description.toLowerCase().includes('innings') ||
                        description.toLowerCase().includes('overs');

                    const cleanTitle = title.replace(/\*/g, '').trim();

                    let status = description;
                    if (description.toLowerCase().includes('scheduled') ||
                        description.toLowerCase().includes('start') ||
                        description.toLowerCase().includes('today') ||
                        description.toLowerCase().includes('tomorrow')) {
                        status = description;
                    } else if (isLive) {
                        status = '🔴 Live Now';
                    } else if (description.length > 100) {
                        status = description.substring(0, 100) + '...';
                    }

                    return {
                        title: cleanTitle,
                        status: status,
                        isLive: isLive
                    };
                }).filter(match => match.title.length > 0);

                setUpcomingMatches(matches);
            } catch (error) {
                console.error('Failed to fetch upcoming matches', error);
            }
        };

        // Initial fetch
        fetchScore();
        fetchUpcomingMatches();

        // Auto-refresh every 10 seconds for live updates
        const scoreInterval = setInterval(fetchScore, 10000);
        const matchesInterval = setInterval(fetchUpcomingMatches, 30000); // Update match list every 30s

        return () => {
            clearInterval(scoreInterval);
            clearInterval(matchesInterval);
        };
    }, []);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading live matches...</div>;

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Live Score */}
                <div>
                    {score && Object.keys(score).length > 0 ? (
                        <div className="card animate-fade-in" style={{ padding: '2rem', background: 'linear-gradient(145deg, #1e293b, #0f172a)', marginBottom: '2rem' }}>
                            {/* Series & Venue */}
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <h4 style={{ color: '#94a3b8', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>
                                    {score.seriesName || score.matchTitle}
                                </h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                                    {score.matchLocation}
                                </p>
                            </div>

                            {/* Teams & Scores */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <h2 style={{ fontSize: '1.8rem', margin: 0, marginBottom: '0.5rem' }}>{score.teamA}</h2>
                                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--primary)' }}>
                                        {score.scoreA}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem' }}>
                                    <span style={{
                                        background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem',
                                        borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                                        boxShadow: '0 0 10px var(--primary)', marginBottom: '0.5rem',
                                        animation: 'pulse 2s infinite'
                                    }}>
                                        LIVE
                                    </span>
                                    <div style={{ fontSize: '1.5rem', color: '#64748b', fontWeight: 'bold' }}>VS</div>
                                </div>

                                <div style={{ textAlign: 'right', flex: 1 }}>
                                    <h2 style={{ fontSize: '1.8rem', margin: 0, marginBottom: '0.5rem' }}>{score.teamB}</h2>
                                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                                        {score.scoreB}
                                    </p>
                                </div>
                            </div>

                            {/* Match Status/Equation */}
                            <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                                <p style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                                    {score.equation || score.status}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No live match at the moment</p>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Check upcoming matches →</p>
                        </div>
                    )}

                    {/* Ad Below Live Scores */}
                    <AdSense
                        adSlot="1111111111"
                        adFormat="rectangle"
                        style={{ display: 'block', textAlign: 'center' }}
                    />
                </div>

                {/* Upcoming Matches Sidebar */}
                <div>
                    <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📅</span> Upcoming Matches
                        </h3>

                        {upcomingMatches.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {upcomingMatches.map((match, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '1rem',
                                            background: match.isLive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px',
                                            borderLeft: match.isLive ? '3px solid var(--primary)' : '3px solid #334155',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {match.isLive && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--primary)',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    background: 'var(--primary)',
                                                    borderRadius: '50%',
                                                    animation: 'pulse 2s infinite'
                                                }}></span>
                                                LIVE NOW
                                            </span>
                                        )}
                                        <p style={{
                                            fontSize: '0.9rem',
                                            fontWeight: match.isLive ? 'bold' : 'normal',
                                            margin: '0 0 0.5rem 0',
                                            color: match.isLive ? 'var(--primary)' : '#e2e8f0'
                                        }}>
                                            {match.title}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                                            {match.status}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No upcoming matches</p>
                        )}

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
                                Auto-updates every 10 seconds
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
