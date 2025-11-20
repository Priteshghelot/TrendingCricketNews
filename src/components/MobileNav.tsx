'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button */}
            <button
                aria-label="Toggle navigation"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'none',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                }}
                className="mobile-menu-btn"
            >
                ☰
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        background: 'rgba(15, 23, 42, 0.98)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 2000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2.5rem',
                        animation: 'fadeIn 0.3s ease',
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        aria-label="Close menu"
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '2rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '2.5rem',
                            cursor: 'pointer',
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>

                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '2rem',
                            fontWeight: '600',
                            transition: 'color 0.3s',
                        }}
                    >
                        Home
                    </Link>

                    <Link
                        href="/live"
                        onClick={() => setIsOpen(false)}
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '2rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'color 0.3s',
                        }}
                    >
                        <span
                            style={{
                                width: '12px',
                                height: '12px',
                                background: '#ef4444',
                                borderRadius: '50%',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            }}
                        ></span>
                        Live
                    </Link>

                    <Link
                        href="/archive"
                        onClick={() => setIsOpen(false)}
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '2rem',
                            fontWeight: '600',
                            transition: 'color 0.3s',
                        }}
                    >
                        Archive
                    </Link>
                </div>
            )}

            <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
        </>
    );
}
