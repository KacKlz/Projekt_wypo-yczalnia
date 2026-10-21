import { useState, useEffect } from 'react';
import Header from './Header';
import Login from './Login';
import Register from './Register';

function App() {
    const [view, setView] = useState('login');
    const [user, setUser] = useState(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    // After a page refresh, ask the backend who is logged in (based on the session cookie)
    useEffect(() => {
        fetch('/api/auth/me')
            .then((response) => (response.ok ? response.json() : null))
            .then((userData) => setUser(userData))
            .catch(() => setUser(null))
            .finally(() => setIsCheckingSession(false));
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = async () => {
        try {
            // Remove the session cookie on the backend
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Log out in the app even if the server cannot be reached
        }
        setUser(null);
    };

    // Wait for the session check, so the login form does not flash for a logged-in user
    if (isCheckingSession) {
        return (
            <div className="app">
                <Header />
            </div>
        );
    }

    return (
        <div className="app">
            <Header />

            {user ? (
                <div className="main-content">
                    <div className="form-box" style={{ textAlign: 'center' }}>
                        <h2>Hello, {user.imie || 'User'}!</h2>
                        <p style={{ margin: '1rem 0', color: '#94a3b8' }}>
                            Your role: <strong style={{ color: user.role === 'admin' ? '#3b82f6' : '#10b981' }}>{user.role}</strong>
                        </p>
                        <button className="btn-primary" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {view === 'login' ? (
                        <Login 
                            onSwitchToRegister={() => setView('register')}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <Register 
                            onSwitchToLogin={() => setView('login')}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
