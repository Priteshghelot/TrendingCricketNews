'use client';

import { useState, useEffect } from 'react';
import { Score } from '@/lib/store';

export default function Live() {
    const [score, setScore] = useState<Score | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'live' | 'scorecard' | 'info'>('scorecard');

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

        fetchScore();
        const interval = setInterval(fetchScore, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading live match...</div>;
    if (!score || Object.keys(score).length === 0) return <div style={{ padding: '4rem', textAlign: 'center' }}>No live match data available.</div>;

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            {/* Live Match Card */}
            <div className="card animate-fade-in" style={{ padding: '2rem', background: 'linear-gradient(145deg, #1e293b, #0f172a)' }}>
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
                            boxShadow: '0 0 10px var(--primary)', marginBottom: '0.5rem'
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
        </div>
    );
}
