import logoObrazek from './assets/CarLogo.png';

function Header() {
    return (
        <header className="pasek-naglowka">
            <div className="kontener-logo">
                <img 
                    src={logoObrazek} 
                    alt="Logo Wypożyczalnia Samochodów" 
                    className="ikona-logo-obrazek" 
                />
                <h1 className="napis-tytul">Cars-rent.pl</h1>
            </div>
        </header>
    );
}

export default Header;