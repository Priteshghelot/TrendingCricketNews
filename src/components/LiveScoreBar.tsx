'use client';

import { useEffect, useRef } from 'react';

const MOCK_SCORES = [
    { id: 1, team1: 'IND', team2: 'AUS', score1: '280/4', score2: '145/2', status: 'IND lead by 135 runs', live: true },
    { id: 2, team1: 'ENG', team2: 'SA', score1: '150/10', score2: '32/0', status: 'SA trail by 118 runs', live: true },
    { id: 3, team1: 'NZ', team2: 'PAK', score1: '320/5', score2: 'Yet to bat', status: 'Innings Break', live: false },
    { id: 4, team1: 'CSK', team2: 'MI', score1: '180/4', score2: '160/8', status: 'CSK won by 20 runs', live: false },
];

export default function LiveScoreBar() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="live-score-bar">
            <div className="container">
                <div className="score-strip" ref={scrollRef}>
                    {MOCK_SCORES.map((match) => (
                        <div key={match.id} className="score-card">
                            <div className="score-header">
                                <span className={`live-indicator ${match.live ? 'is-live' : ''}`}>
                                    {match.live ? 'LIVE' : 'RESULT'}
                                </span>
                                <span className="match-format">T20</span>
                            </div>
                            <div className="teams">
                                <div className="team-row">
                                    <span className="team-name">{match.team1}</span>
                                    <span className="team-score">{match.score1}</span>
                                </div>
                                <div className="team-row">
                                    <span className="team-name">{match.team2}</span>
                                    <span className="team-score">{match.score2}</span>
                                </div>
                            </div>
                            <div className="match-status">{match.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
