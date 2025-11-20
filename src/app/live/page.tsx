'use client';

import { useState, useEffect } from 'react';
import { Score, MatchPreview } from '@/lib/store';
import AdSense from '@/components/AdSense';

export default function Live() {
    const [score, setScore] = useState<Score | null>(null);
    const [upcomingMatches, setUpcomingMatches] = useState<MatchPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    const fetchData = async (matchId?: string) => {
        try {
            const url = matchId ? `/api/scores?id=${encodeURIComponent(matchId)}` : '/api/scores';
            const res = await fetch(url);
            const data = await res.json();
            if (data && !data.error) {
                setScore(data);
                if (data.upcomingMatches) {
                    setUpcomingMatches(data.upcomingMatches);
                }
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchData(selectedMatchId || undefined);

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchData(selectedMatchId || undefined);
        }, 10000);

        return () => clearInterval(interval);
    }, [selectedMatchId]);

    const handleMatchClick = (match: MatchPreview) => {
        if (match.isLive && match.id) {
            setSelectedMatchId(match.id);
            setLoading(true);
            // Immediate fetch for the new match
            fetchData(match.id);
        }
    };

    if (loading && !score) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading live matches...</div>;

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Live Score */}
                <div>
                    {score && (score.status || score.matchTitle) ? (
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

                    {/* Detailed Scoreboard */}
                    {score && score.detailedScore && (
                        <div className="card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e2e8f0', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                                Detailed Scorecard
                            </h3>

                            {/* Partnership Info */}
                            {score.detailedScore.partnership && (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.1))',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    borderLeft: '3px solid var(--primary)'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Current Partnership</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#e2e8f0' }}>{score.detailedScore.partnership}</div>
                                </div>
                            )}

                            {/* Batting */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                                    <span>Batter</span>
                                    <span style={{ textAlign: 'right' }}>R</span>
                                    <span style={{ textAlign: 'right' }}>B</span>
                                    <span style={{ textAlign: 'right' }}>4s</span>
                                    <span style={{ textAlign: 'right' }}>6s</span>
                                    <span style={{ textAlign: 'right' }}>SR</span>
                                </div>
                                {score.detailedScore.batters.map((batter, idx) => {
                                    // First 2 batters are usually current players at crease
                                    const isCurrentBatter = idx < 2 && !batter.name.includes('*') && batter.runs !== '0';
                                    return (
                                        <div key={idx} style={{
                                            display: 'grid',
                                            gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            padding: '0.5rem',
                                            background: isCurrentBatter ? 'rgba(56, 189, 248, 0.1)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'),
                                            borderRadius: '4px',
                                            borderLeft: isCurrentBatter ? '2px solid var(--primary)' : 'none',
                                            position: 'relative'
                                        }}>
                                            <span style={{ color: '#e2e8f0', fontWeight: isCurrentBatter ? 'bold' : '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {batter.name}
                                                {isCurrentBatter && <span style={{ fontSize: '0.65rem', color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.2)', padding: '2px 6px', borderRadius: '10px' }}>BATTING</span>}
                                            </span>
                                            <span style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>{batter.runs}</span>
                                            <span style={{ textAlign: 'right' }}>{batter.balls}</span>
                                            <span style={{ textAlign: 'right' }}>{batter.fours}</span>
                                            <span style={{ textAlign: 'right' }}>{batter.sixes}</span>
                                            <span style={{ textAlign: 'right' }}>{batter.sr}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bowling */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                                    <span>Bowler</span>
                                    <span style={{ textAlign: 'right' }}>O</span>
                                    <span style={{ textAlign: 'right' }}>M</span>
                                    <span style={{ textAlign: 'right' }}>R</span>
                                    <span style={{ textAlign: 'right' }}>W</span>
                                    <span style={{ textAlign: 'right' }}>ECO</span>
                                </div>
                                {score.detailedScore.bowlers.map((bowler, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', padding: '0.5rem', background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderRadius: '4px' }}>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{bowler.name}</span>
                                        <span style={{ textAlign: 'right' }}>{bowler.overs}</span>
                                        <span style={{ textAlign: 'right' }}>{bowler.maidens}</span>
                                        <span style={{ textAlign: 'right' }}>{bowler.runs}</span>
                                        <span style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>{bowler.wickets}</span>
                                        <span style={{ textAlign: 'right' }}>{bowler.economy}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Balls */}
                            {score.detailedScore.recentBalls.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Recent Balls</div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {score.detailedScore.recentBalls.map((ball, idx) => (
                                            <span key={idx} style={{
                                                width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '50%', fontSize: '0.75rem', fontWeight: 'bold',
                                                background: ball.includes('W') ? '#ef4444' : (ball.includes('4') || ball.includes('6') ? 'var(--primary)' : '#334155'),
                                                color: 'white'
                                            }}>
                                                {ball}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                        onClick={() => handleMatchClick(match)}
                                        style={{
                                            padding: '1rem',
                                            background: selectedMatchId === match.id ? 'rgba(56, 189, 248, 0.2)' : (match.isLive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.03)'),
                                            borderRadius: '8px',
                                            borderLeft: match.isLive ? '3px solid var(--primary)' : '3px solid #334155',
                                            cursor: match.isLive ? 'pointer' : 'default',
                                            transition: 'all 0.3s',
                                            transform: selectedMatchId === match.id ? 'scale(1.02)' : 'none'
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
                                                {selectedMatchId === match.id ? 'WATCHING NOW' : 'LIVE NOW'}
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
                                Click on a live match to view details
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
