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
    crr?: string;
    statusText?: string;
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
                    <div style={{
                        background: '#ffffff',
                        color: '#212121',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0'
                    }}>
                        {/* Status Header */}
                        <div style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                            <span style={{
                                fontWeight: '700',
                                color: basicDetails.status === 'LIVE' ? 'var(--success)' : '#757575',
                                textTransform: 'uppercase',
                                fontSize: '0.9rem'
                            }}>
                                {basicDetails.status === 'LIVE' ? 'Live' : basicDetails.status}
                            </span>
                        </div>

                        {/* Teams & Scores Visual */}
                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            {/* Team 1 */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ width: '80px', height: '50px', margin: '0 auto 1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    {basicDetails.team1.flagCode !== 'un' ? (
                                        <img src={`https://flagcdn.com/w160/${basicDetails.team1.flagCode}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <div style={{ fontSize: '2rem', lineHeight: '50px', background: '#eee' }}>🏏</div>}
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>{basicDetails.team1.name}</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                                    {basicDetails.team1.score || '-'}
                                </div>
                                {basicDetails.team1.isBatting && details?.currentOvers && (
                                    <div style={{ color: '#757575', marginTop: '0.25rem' }}>({details.currentOvers})</div>
                                )}
                            </div>

                            {/* Center Info */}
                            <div style={{ textAlign: 'center', flex: 1.5, color: '#616161', fontSize: '0.95rem' }}>
                                <div style={{ marginBottom: '1rem', fontWeight: '500' }}>
                                    {details?.statusText || displayMatch.description || 'Match in progress'}
                                </div>
                                {details?.crr && (
                                    <div style={{ fontWeight: '700', color: '#212121' }}>
                                        CRR: {details.crr}
                                    </div>
                                )}
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                    ODI
                                </div>
                            </div>

                            {/* Team 2 */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ width: '80px', height: '50px', margin: '0 auto 1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    {basicDetails.team2.flagCode !== 'un' ? (
                                        <img src={`https://flagcdn.com/w160/${basicDetails.team2.flagCode}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <div style={{ fontSize: '2rem', lineHeight: '50px', background: '#eee' }}>🏏</div>}
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>{basicDetails.team2.name}</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                                    {basicDetails.team2.score || 'Yet to bat'}
                                </div>
                                {basicDetails.team2.isBatting && details?.currentOvers && (
                                    <div style={{ color: '#757575', marginTop: '0.25rem' }}>({details.currentOvers})</div>
                                )}
                            </div>
                        </div>

                        {/* DETAILED STATS (Batting/Bowling) */}
                        <div style={{ borderTop: '1px solid #e0e0e0', padding: '1.5rem', background: '#fafafa' }}>
                            {loadingDetails ? (
                                <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>Loading stats...</div>
                            ) : details ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                    {/* Batting */}
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#757575', marginBottom: '0.5rem' }}>BATTING</div>
                                        {details.batsmen.length > 0 ? details.batsmen.slice(0, 2).map((b, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                                <div>
                                                    <span style={{ fontWeight: '600' }}>{b.name}</span> <span style={{ color: 'var(--success)' }}>*</span>
                                                    <div style={{ fontSize: '0.8rem', color: '#757575' }}>{b.dismissal}</div>
                                                </div>
                                                <div style={{ fontWeight: '600' }}>{b.runs} <span style={{ fontWeight: '400', color: '#757575' }}>({b.balls})</span></div>
                                            </div>
                                        )) : <div style={{ color: '#999' }}>--</div>}
                                    </div>

                                    {/* Bowling */}
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#757575', marginBottom: '0.5rem' }}>BOWLING</div>
                                        {details.bowlers.length > 0 ? details.bowlers.slice(0, 2).map((b, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                                <div style={{ fontWeight: '600' }}>{b.name}</div>
                                                <div>
                                                    <span style={{ fontWeight: '600' }}>{b.wickets}/{b.runs}</span> <span style={{ fontWeight: '400', color: '#757575' }}>({b.overs})</span> <span style={{ color: 'var(--primary-blue)', fontSize: '1.2em' }}>•</span>
                                                </div>
                                            </div>
                                        )) : <div style={{ color: '#999' }}>--</div>}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* WIN PROBABILITY */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                            <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', color: '#424242' }}>
                                Live Win Probability
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>
                                <span>{basicDetails.team1.name} <span style={{ color: 'var(--success)' }}>{basicDetails.team1.isBatting ? '40%' : '60%'}</span></span>
                                <span>{basicDetails.team2.name} <span style={{ color: 'var(--primary-blue)' }}>{basicDetails.team2.isBatting ? '40%' : '60%'}</span></span>
                            </div>
                            <div style={{ height: '8px', width: '100%', background: '#eee', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: '60%', background: 'var(--success)' }}></div>
                                <div style={{ width: '40%', background: 'var(--primary-blue)' }}></div>
                            </div>
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
