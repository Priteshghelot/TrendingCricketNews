'use client';

import { useEffect, useState } from 'react';
import { getFlagCode } from '@/lib/flags';

interface Match {
    id: string;
    title: string;
    link?: string;
    live?: boolean;
    status?: string;
    description?: string;
}

interface DashboardData {
    trending: Match | null;
    live: Match[];
    recent: Match[];
    upcoming: Match[];
}

interface TeamData {
    name: string;
    score: string;
    isBatting: boolean;
    flagCode: string;
}

interface Batsman {
    name: string;
    runs: string;
    balls: string;
    dismissal: string;
}

interface Bowler {
    name: string;
    overs: string;
    maidens: string;
    runs: string;
    wickets: string;
    economy: string;
}

interface MatchDetails {
    currentOvers?: string;
    batsmen: Batsman[];
    bowlers: Bowler[];
}

const parseMatchData = (title: string): { team1: TeamData, team2: TeamData, status: string } | null => {
    if (!title) return null;
    const parts = title.includes(' v ') ? title.split(' v ') : title.split(' vs ');
    if (parts.length !== 2) return null;

    const parseTeam = (str: string): TeamData => {
        const match = str.match(/^([a-zA-Z\s\(\)]+)(.*)$/);
        let name = str.trim();
        let score = '';
        if (match && match[2]) {
            name = match[1].trim();
            score = match[2].trim();
        }
        const isBatting = str.includes('*');
        score = score.replace('*', '').trim();
        name = name.replace(/\(winner\)/i, '').trim();
        return { name, score, isBatting, flagCode: getFlagCode(name) };
    };

    return {
        team1: parseTeam(parts[0]),
        team2: parseTeam(parts[1]),
        status: title.includes('*') ? 'LIVE' : 'RESULT'
    };
};

export default function LiveDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    // Detailed stats state
    const [details, setDetails] = useState<MatchDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Fetch dashboard data
    const fetchScores = async () => {
        try {
            const res = await fetch('/api/live-scores');
            const json = await res.json();
            if (json.dashboard) {
                setData(json.dashboard);
                if (!selectedMatch && json.dashboard.trending) {
                    setSelectedMatch(json.dashboard.trending);
                } else if (selectedMatch) {
                    const allMatches = [json.dashboard.trending, ...json.dashboard.live, ...json.dashboard.recent, ...json.dashboard.upcoming];
                    const updated = allMatches.find((m: Match) => m && m.id === selectedMatch.id);
                    if (updated) setSelectedMatch(updated);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch details when selected match changes
    useEffect(() => {
        if (selectedMatch && selectedMatch.link) {
            setLoadingDetails(true);
            setDetails(null);
            fetch(`/api/match-details?url=${encodeURIComponent(selectedMatch.link)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.batsmen) {
                        setDetails(data);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingDetails(false));
        } else {
            setDetails(null);
        }
    }, [selectedMatch?.id]);

    useEffect(() => {
        fetchScores();
        const interval = setInterval(fetchScores, 15000);
        return () => clearInterval(interval);
    }, []);

    const displayMatch = selectedMatch || data?.trending;
    const basicDetails = displayMatch ? parseMatchData(displayMatch.title) : null;

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading match center...</div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>

            {/* MATCH CENTER */}
            {displayMatch && basicDetails && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                        <span style={{ color: 'var(--danger)' }}>🔥</span> Match Center
                    </h2>

                    <div style={{
                        background: 'linear-gradient(135deg, #1e1e1e 0%, #111 100%)',
                        color: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        border: '1px solid #333'
                    }}>
                        {/* Header */}
                        <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid #333', fontSize: '1.1rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{basicDetails.team1.name} <span style={{ opacity: 0.6 }}>vs</span> {basicDetails.team2.name}</span>
                            <span style={{ color: basicDetails.status === 'LIVE' ? '#ff5252' : '#aaa', fontSize: '0.9rem' }}>
                                {basicDetails.status === 'LIVE' ? '🔴 LIVE' : 'RESULT'}
                            </span>
                        </div>

                        {/* Visual Summary */}
                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            {/* Team 1 */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ width: '60px', height: '40px', margin: '0 auto 0.5rem', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                                    {basicDetails.team1.flagCode !== 'un' ? (
                                        <img src={`https://flagcdn.com/w80/${basicDetails.team1.flagCode}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <div style={{ fontSize: '1.5rem' }}>🏏</div>}
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: basicDetails.team1.isBatting ? '#fff' : '#888' }}>
                                    {basicDetails.team1.score}
                                </div>
                                {basicDetails.team1.isBatting && details?.currentOvers && (
                                    <div style={{ fontSize: '1rem', color: '#ff5252', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                        ({details.currentOvers})
                                    </div>
                                )}
                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ccc', marginTop: '0.5rem' }}>{basicDetails.team1.name}</div>
                            </div>

                            <div style={{ fontSize: '1.5rem', fontWeight: '900', opacity: 0.3 }}>VS</div>

                            {/* Team 2 */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ width: '60px', height: '40px', margin: '0 auto 0.5rem', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                                    {basicDetails.team2.flagCode !== 'un' ? (
                                        <img src={`https://flagcdn.com/w80/${basicDetails.team2.flagCode}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <div style={{ fontSize: '1.5rem' }}>🏏</div>}
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: basicDetails.team2.isBatting ? '#fff' : '#888' }}>
                                    {basicDetails.team2.score}
                                </div>
                                {basicDetails.team2.isBatting && details?.currentOvers && (
                                    <div style={{ fontSize: '1rem', color: '#ff5252', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                        ({details.currentOvers})
                                    </div>
                                )}
                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ccc', marginTop: '0.5rem' }}>{basicDetails.team2.name}</div>
                            </div>
                        </div>

                        {/* DETAILED SCORECARD SECTION */}
                        <div style={{ borderTop: '1px solid #333', padding: '1.5rem', background: '#151515' }}>
                            {loadingDetails ? (
                                <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                                    Fetching full scorecard details...
                                </div>
                            ) : details ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                                    {/* Batting */}
                                    <div>
                                        <h4 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Batting</h4>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: '#666', borderBottom: '1px solid #333' }}>
                                                    <th style={{ padding: '0.5rem 0' }}>Batter</th>
                                                    <th style={{ textAlign: 'right' }}>R</th>
                                                    <th style={{ textAlign: 'right' }}>B</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.batsmen.length > 0 ? details.batsmen.map((b, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                                        <td style={{ padding: '0.5rem 0' }}>
                                                            <div style={{ fontWeight: 'bold', color: i < 2 ? '#fff' : '#ccc' }}>{b.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{b.dismissal}</div>
                                                        </td>
                                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>{b.runs}</td>
                                                        <td style={{ textAlign: 'right', color: '#888' }}>{b.balls}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#555' }}>No batting data available</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Bowling */}
                                    <div>
                                        <h4 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bowling</h4>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: '#666', borderBottom: '1px solid #333' }}>
                                                    <th style={{ padding: '0.5rem 0' }}>Bowler</th>
                                                    <th style={{ textAlign: 'right' }}>O</th>
                                                    <th style={{ textAlign: 'right' }}>W</th>
                                                    <th style={{ textAlign: 'right' }}>Econ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.bowlers.length > 0 ? details.bowlers.map((b, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                                        <td style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>{b.name}</td>
                                                        <td style={{ textAlign: 'right', color: '#ccc' }}>{b.overs}</td>
                                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--danger)' }}>{b.wickets}</td>
                                                        <td style={{ textAlign: 'right', color: '#888' }}>{b.economy}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#555' }}>No bowling data available</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666' }}>
                                    Select a match to view details (Data provided by external feed)
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Live Matches List */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', borderLeft: '4px solid var(--danger)', paddingLeft: '0.75rem' }}>
                        Live Matches
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.live.map(match => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                isSelected={displayMatch?.id === match.id}
                                onClick={() => setSelectedMatch(match)}
                            />
                        ))}
                        {data.trending && data.trending.id !== displayMatch?.id && (
                            <MatchCard
                                key={data.trending.id}
                                match={data.trending}
                                isSelected={false}
                                onClick={() => setSelectedMatch(data.trending)}
                            />
                        )}
                        {data.live.length === 0 && !data.trending && <p style={{ color: '#666' }}>No live matches</p>}
                    </div>
                </div>

                {/* Upcoming Matches List */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', borderLeft: '4px solid var(--primary-blue)', paddingLeft: '0.75rem' }}>
                        Upcoming Matches
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.upcoming.map(match => (
                            <MatchCard key={match.id} match={match} isUpcoming />
                        ))}
                        {data.upcoming.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>No upcoming matches scheduled in feed</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MatchCard({ match, isUpcoming = false, isSelected = false, onClick }: { match: Match; isUpcoming?: boolean; isSelected?: boolean; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                background: isSelected ? 'rgba(3, 169, 244, 0.1)' : 'var(--bg-card)',
                border: isSelected ? '2px solid var(--primary-blue)' : '1px solid var(--border)',
                padding: '1.25rem',
                borderRadius: '12px',
                boxShadow: isSelected ? '0 0 10px rgba(3, 169, 244, 0.2)' : 'var(--shadow-sm)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.02)' : 'none'
            }}
            className="match-card-hover"
        >
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {match.title}
            </h4>
            <div style={{
                fontSize: '0.9rem',
                color: isUpcoming ? 'var(--primary-blue)' : 'var(--danger)',
                fontWeight: '500'
            }}>
                {isUpcoming ? `📅 ${match.status}` : `🔴 ${match.description || 'Live Score'}`}
            </div>
        </div>
    );
}
