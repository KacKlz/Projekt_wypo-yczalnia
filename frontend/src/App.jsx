import React, { useState } from 'react';
import Header from './Header';
import Login from './Login';
import Register from './Register';

function App() {
    const [widok, setWidok] = useState('login');
    const [uzytkownik, setUzytkownik] = useState(null);

    const handleLoginSuccess = (user) => {
        setUzytkownik(user);
    };

    const handleWyloguj = () => {
        setUzytkownik(null);
        localStorage.removeItem('zalogowanyUzytkownik');
    };

    return (
        <div className="aplikacja">
            <Header />

            {uzytkownik ? (
                <div className="srodkowa-czesc-strony">
                    <div className="pudelko-formularza" style={{ textAlign: 'center' }}>
                        <h2>Cześć, {uzytkownik.imie}!</h2>
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