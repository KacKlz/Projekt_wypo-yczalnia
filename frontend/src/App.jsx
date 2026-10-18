import React, { useState, useEffect } from 'react';
import Header from './Header';
import Login from './Login';
import Register from './Register';

function App() {
    const [widok, setWidok] = useState('login');
    const [uzytkownik, setUzytkownik] = useState(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    // After a page refresh, ask the backend who is logged in (based on the session cookie)
    useEffect(() => {
        fetch('/api/auth/me')
            .then((response) => (response.ok ? response.json() : null))
            .then((user) => setUzytkownik(user))
            .catch(() => setUzytkownik(null))
            .finally(() => setIsCheckingSession(false));
    }, []);

    const handleLoginSuccess = (user) => {
        setUzytkownik(user);
    };

    const handleWyloguj = async () => {
        try {
            // Remove the session cookie on the backend
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Log out in the app even if the server cannot be reached
        }
        setUzytkownik(null);
    };

    // Wait for the session check, so the login form does not flash for a logged-in user
    if (isCheckingSession) {
        return (
            <div className="aplikacja">
                <Header />
            </div>
        );
    }

    return (
        <div className="aplikacja">
            <Header />

            {uzytkownik ? (
                <div className="srodkowa-czesc-strony">
                    <div className="pudelko-formularza" style={{ textAlign: 'center' }}>
                        <h2>Cześć, {uzytkownik.imie || 'Użytkownik'}!</h2>
                        <p style={{ margin: '1rem 0', color: '#94a3b8' }}>
                            Twoja rola: <strong style={{ color: uzytkownik.role === 'admin' ? '#3b82f6' : '#10b981' }}>{uzytkownik.role}</strong>
                        </p>
                        <button className="przycisk-glowny" onClick={handleWyloguj}>
                            Wyloguj się
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {widok === 'login' ? (
                        <Login 
                            onSwitchToRegister={() => setWidok('register')}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <Register 
                            onSwitchToLogin={() => setWidok('login')}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;