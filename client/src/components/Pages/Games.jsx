import React, { useState } from 'react';
import './Games.css';

const GAMES_CATALOG = [
    { id: 'smashkarts', title: 'Smash Karts', url: 'https://smashkarts.io/' },
    { id: 'krunker', title: 'Krunker.io', url: 'https://krunker.io/' },
    { id: 'voxiom', title: 'Voxiom.io', url: 'https://voxiom.io/' },
    { id: 'zombsroyale', title: 'Zombs Royale', url: 'https://zombsroyale.io/' },
    { id: 'skribbl', title: 'Skribbl.io', url: 'https://skribbl.io/' },
    { id: 'vengeio', title: 'Venge.io', url: 'https://venge.io/' },
    { id: 'diepio', title: 'Diep.io', url: 'https://diep.io/' },
    { id: 'slitherio', title: 'Slither.io', url: 'https://slither.io/' },
    { id: 'shellshockers', title: 'Shell Shockers', url: 'https://shellshock.io/' },
    { id: 'moomooio', title: 'MooMoo.io', url: 'https://moomoo.io/' },
    { id: 'gartic', title: 'Gartic.io', url: 'https://gartic.io/' },
    { id: 'buildroyale', title: 'BuildRoyale.io', url: 'https://buildroyale.io/' }
];

const Games = () => {
    const [activeGame, setActiveGame] = useState(null);

    return (
        <div className="games-db-container">
            {/* Header */}
            <div className="games-db-header">
                <div>
                    <h1 className="games-db-title">GAMES_DATABASE</h1>
                    <p className="games-db-subtitle">ACCESS ENTERTAINMENT PROTOCOLS</p>
                </div>
                {activeGame && (
                    <button
                        className="games-db-back-btn"
                        onClick={() => setActiveGame(null)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        BACK TO CATALOG
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="games-db-content">
                {activeGame ? (
                    <div className="games-db-player-container">
                        <iframe
                            src={activeGame.url}
                            title={activeGame.title}
                            className="games-db-iframe"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="games-db-grid">
                        {GAMES_CATALOG.map(game => (
                            <div
                                key={game.id}
                                className="games-db-card"
                                onClick={() => setActiveGame(game)}
                            >
                                <div className="games-db-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                        <line x1="6" y1="12" x2="10" y2="12"></line>
                                        <line x1="8" y1="10" x2="8" y2="14"></line>
                                        <line x1="15" y1="13" x2="15.01" y2="13"></line>
                                        <line x1="18" y1="11" x2="18.01" y2="11"></line>
                                    </svg>
                                </div>
                                <h3 className="games-db-card-title">{game.title}</h3>
                                <div className="games-db-card-action">INITIALIZE SEQUENCE</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;
