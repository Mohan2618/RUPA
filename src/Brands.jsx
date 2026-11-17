
import './Brands.css';

const brands = [
  {
    name: 'Lumina',
    category: 'DIGITAL EXPERIENCES',
    description:
      'Thoughtful digital experiences designed to bring ideas to life.',
    link: 'https://lumina-fbhi.onrender.com',
    linkText: 'Explore Lumina',
  },
  {
    name: 'Orbit',
    category: 'COMING SOON',
    description:
      'A new venture from RUPA. More details coming soon.',
    link: null,
    linkText: 'Coming soon',
  },
];

export default function Brands() {
  return (
    <section className="brands" id="innovations">
      <p className="brands-eyebrow">BUILT WITHIN RUPA</p>

      <h2>Our innovations.</h2>

      <p className="brands-intro">
        Products and experiments created under the RUPA ecosystem. Each has its own purpose,
        with a shared ambition to make technology useful.
      </p>

      <div className="brands-grid">
        {brands.map((brand) => (
          <article className="brand-card" key={brand.name}>
            <p className="brand-category">{brand.category}</p>

            <h3>{brand.name}</h3>

            <p className="brand-description">
              {brand.description}
            </p>

            {brand.link ? (
              <a
                href={brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                {brand.linkText} <span>↗</span>
              </a>
            ) : (
              <span className="brand-link brand-link-disabled">
                {brand.linkText}
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
