import { getFlagCode } from '@/lib/flags';
import Image from 'next/image';

const teamGroups = [
    {
        name: 'Full Members',
        teams: [
            'India', 'Australia', 'England', 'South Africa', 'New Zealand',
            'Pakistan', 'Sri Lanka', 'Bangladesh', 'West Indies',
            'Afghanistan', 'Zimbabwe', 'Ireland'
        ]
    },
    {
        name: 'Associate Members',
        teams: [
            'Nepal', 'Netherlands', 'Namibia', 'Scotland', 'UAE',
            'USA', 'Oman', 'Papua New Guinea', 'Canada', 'Hong Kong',
            'Kenya', 'Uganda', 'Jersey', 'Kuwait', 'Malaysia'
        ]
    }
];

export default function TeamsPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 className="article-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Cricket Teams
            </h1>

            {teamGroups.map((group) => (
                <div key={group.name} style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        borderLeft: '4px solid var(--primary-blue)',
                        paddingLeft: '1rem'
                    }}>
                        {group.name}
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {group.teams.map((team) => {
                            const flagCode = getFlagCode(team);
                            return (
                                <div key={team} style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'transform 0.2s',
                                    cursor: 'default'
                                }} className="hover:scale-105">
                                    <div style={{
                                        width: '80px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                        background: '#000'
                                    }}>
                                        <img
                                            src={`https://flagcdn.com/w160/${flagCode}.png`}
                                            alt={team}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {team}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
