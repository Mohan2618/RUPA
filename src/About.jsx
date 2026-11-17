import './About.css';

export default function About() {
  return (
    <section className="about-section page-section" id="about">
      <div className="section-heading">
        <p className="section-eyebrow">WHAT WE BELIEVE</p>
        <h2>Ideas deserve a place to grow.</h2>
      </div>

      <p className="about-copy">
        RUPA is a home for building, discovering, and sharing technology.
        We create our own products and experiments, while bringing together
        important developments from across the AI and technology ecosystem.
      </p>

      <div className="about-pillars">
        <article className="about-pillar">
          <span className="pillar-number">01</span>
          <h3>Build</h3>
          <p>Develop useful products, software, and ideas under the RUPA ecosystem.</p>
        </article>
        <article className="about-pillar">
          <span className="pillar-number">02</span>
          <h3>Discover</h3>
          <p>Follow meaningful launches, AI models, research, and technology updates.</p>
        </article>
        <article className="about-pillar">
          <span className="pillar-number">03</span>
          <h3>Learn</h3>
          <p>Make complex developments easier to understand and explore.</p>
        </article>
      </div>
    </section>
  );
}
