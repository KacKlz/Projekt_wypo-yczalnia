import '../../styles/home/HomeHero.css';

function HomeHero() {
    return (
        <section className="home-hero">
            <h1 className="home-hero-title">
                Your next adventure starts <span className="home-hero-highlight">behind the wheel</span>
            </h1>
            <p className="home-hero-subtitle">
                Pick a car you love and hit the road whenever you are ready.
            </p>
        </section>
    );
}

export default HomeHero;
