import React, { useState } from 'react';

function Login({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [haslo, setHaslo] = useState('');
    const [komunikat, setKomunikat] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setKomunikat(null);

        if (!email || !haslo) {
            setKomunikat({ typ: 'blad', tresc: 'Wypełnij pola email i hasło!' });
            return;
        }

        // Log in through the backend - on success it sets the session cookie
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, haslo })
            });
            const data = await response.json();

            if (response.status === 401) {
                // Blokada – użytkownik nie istnieje lub podał złe dane
                setKomunikat({ typ: 'blad', tresc: 'Nieprawidłowy adres email lub hasło!' });
                return;
            }

            if (!response.ok) {
                setKomunikat({ typ: 'blad', tresc: data.message });
                return;
            }

            if (onLoginSuccess) onLoginSuccess(data);
        } catch {
            setKomunikat({ typ: 'blad', tresc: 'Brak połączenia z serwerem!' });
        }
    };

    return (
        <div className="srodkowa-czesc-strony">
            <div className="pudelko-formularza">
                <div className="naglowek-formularza">
                    <h2>Zaloguj się</h2>
                    <p>Wprowadź swoje dane, aby uzyskać dostęp do floty</p>
                </div>

                {komunikat && (
                    <div className={komunikat.typ === 'blad' ? 'komunikat-blad' : 'komunikat-sukces'}>
                        {komunikat.tresc}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="pole-do-wpisania">
                        <label>Adres Email</label>
                        <input 
                            type="email" 
                            placeholder="jan.kowalski@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="pole-do-wpisania">
                        <label>Hasło</label>
                        <input 
                            type="password" 
                            placeholder="******"
                            value={haslo}
                            onChange={(e) => setHaslo(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="przycisk-glowny">Zaloguj się</button>
                </form>

                <div className="stopka-formularza">
                    <span>Nie masz konta? </span>
                    <button type="button" className="przycisk-link" onClick={onSwitchToRegister}>
                        Zarejestruj się
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;