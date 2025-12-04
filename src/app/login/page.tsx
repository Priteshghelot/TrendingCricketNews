'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Store auth in localStorage
                localStorage.setItem('crictrend_auth', 'true');
                router.push('/admin');
            } else {
                setError('Wrong password');
            }
        } catch {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
        }}>
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    🔐 Admin Login
                </h1>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
