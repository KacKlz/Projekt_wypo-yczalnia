import logoImage from './assets/CarLogo.png';

function Header() {
    return (
        <header className="header-bar">
            <div className="logo-container">
                <img 
                    src={logoImage} 
                    alt="Car Rental Logo" 
                    className="logo-image" 
                />
                <h1 className="title-text">Cars-rent.pl</h1>
            </div>
        </header>
    );
}

export default Header;
