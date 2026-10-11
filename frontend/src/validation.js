// Sprawdzamy czy wpisany tekst w polu email zawiera znak '@'
export const sprawdzCzyEmailMaMalpe = (wpisanyEmail) => {
    if (!wpisanyEmail.includes('@')) {
        return "Adres email musi zawierać znak '@'.";
    }
    return null;
};

// Sprawdzamy czy haslo zawiera znak specjalny oraz duza literke
export const sprawdzWymogiHasla = (wpisaneHaslo) => {
    const czyMaDuzaLitere = /[A-Z]/.test(wpisaneHaslo);
    const czyMaZnakSpecjalny = /[!@#$%^&*(),.?":{}|<>]/.test(wpisaneHaslo);

    if (!czyMaDuzaLitere || !czyMaZnakSpecjalny) {
        return "Hasło musi zawierać co najmniej jedną wielką literę i jeden znak specjalny.";
    }
    return null;
};