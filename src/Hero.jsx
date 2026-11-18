import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <p className="hero-eyebrow">BUILD · DISCOVER · LEARN</p>

      <h1>
        Ideas today.
        <br />
        Possibilities tomorrow.
      </h1>

      <p className="hero-description">
        RUPA is where we build our own technology and explore the ideas,
        products, and breakthroughs shaping what comes next.
      </p>

      <div className="hero-actions">
        <a href="#innovations" className="hero-button hero-button-primary">
          Explore our innovations <span aria-hidden="true">↗</span>
        </a>
        <a href="/discover" className="hero-button hero-button-secondary">
          Discover technology
        </a>
      </div>
      <span className="hero-scroll-note">SCROLL TO EXPLORE</span>
    </section>
  );
}
