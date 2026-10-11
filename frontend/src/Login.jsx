import React, { useState } from 'react';

function Login({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [haslo, setHaslo] = useState('');
    const [komunikat, setKomunikat] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setKomunikat(null);

        if (!email || !haslo) {
            setKomunikat({ typ: 'blad', tresc: 'Wypełnij pola email i hasło!' });
            return;
        }

        // 1. Sprawdzenie logowania na konto Admina
        if (email === 'admin@gmail.com' && haslo === '123') {
            const uzytkownik = {
                email: email,
                imie: 'Administrator',
                role: 'admin'
            };
            localStorage.setItem('zalogowanyUzytkownik', JSON.stringify(uzytkownik));
            if (onLoginSuccess) onLoginSuccess(uzytkownik);
            return;
        }

        // 2. Pobranie bazy zarejestrowanych użytkowników z localStorage
        const zarejestrowani = JSON.parse(localStorage.getItem('zarejestrowaniUzytkownicy') || '[]');
        
        // Szukamy użytkownika o podanym emailu i haśle
        const znaleziony = zarejestrowani.find(u => u.email === email && u.haslo === haslo);

        if (znaleziony) {
            const uzytkownik = {
                email: znaleziony.email,
                imie: 'Użytkownik',
                role: 'user'
            };
            localStorage.setItem('zalogowanyUzytkownik', JSON.stringify(uzytkownik));
            if (onLoginSuccess) onLoginSuccess(uzytkownik);
        } else {
            // Blokada – użytkownik nie istnieje lub podał złe dane
            setKomunikat({ typ: 'blad', tresc: 'Nieprawidłowy adres email lub hasło!' });
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