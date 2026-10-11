import React, { useState } from 'react';

function Register({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [haslo, setHaslo] = useState('');
    const [powtorzHaslo, setPowtorzHaslo] = useState('');
    const [komunikat, setKomunikat] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setKomunikat(null);

        //sprawdzenie pustych pól
        if (!email || !haslo || !powtorzHaslo) {
            setKomunikat({ typ: 'blad', tresc: 'Wypełnij wszystkie pola!' });
            return;
        }

        //sprawdzenie zgodności haseł
        if (haslo !== powtorzHaslo) {
            setKomunikat({ typ: 'blad', tresc: 'Hasła nie są identyczne!' });
            return;
        }

        //walidacja wymogów bezpieczeństwa
        const maDuzaLitere = /[A-Z]/.test(haslo);
        const maZnakSpecjalny = /[^a-zA-Z0-9]/.test(haslo);

        if (!maDuzaLitere) {
            setKomunikat({ 
                typ: 'blad', 
                tresc: 'Hasło musi zawierać przynajmniej jedną dużą literę!' 
            });
            return;
        }

        if (!maZnakSpecjalny) {
            setKomunikat({ 
                typ: 'blad', 
                tresc: 'Hasło musi zawierać przynajmniej jeden znak specjalny (np. !, @, #)!' 
            });
            return;
        }

        //zapis nowego użytkownika do symulowanej bazy danych w localStorage
        const zarejestrowani = JSON.parse(localStorage.getItem('zarejestrowaniUzytkownicy') || '[]');

        if (zarejestrowani.some(u => u.email === email)) {
            setKomunikat({ typ: 'blad', tresc: 'Konto z tym adresem email już istnieje!' });
            return;
        }

        zarejestrowani.push({ email, haslo });
        localStorage.setItem('zarejestrowaniUzytkownicy', JSON.stringify(zarejestrowani));

        setKomunikat({ typ: 'sukces', tresc: 'Konto zostało pomyślnie utworzone! Możesz się teraz zalogować.' });
    };

    return (
        <div className="srodkowa-czesc-strony">
            <div className="pudelko-formularza">
                <div className="naglowek-formularza">
                    <h2>Zarejestruj się</h2>
                    <p>Utwórz konto, aby rezerwować samochody</p>
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

                    <div className="pole-do-wpisania">
                        <label>Powtórz Hasło</label>
                        <input 
                            type="password" 
                            placeholder="******"
                            value={powtorzHaslo}
                            onChange={(e) => setPowtorzHaslo(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="przycisk-glowny">Zarejestruj się</button>
                </form>

                <div className="stopka-formularza">
                    <span>Masz już konto? </span>
                    <button type="button" className="przycisk-link" onClick={onSwitchToLogin}>
                        Zaloguj się
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;