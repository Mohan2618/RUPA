import './Discover.css';

const discoveryAreas = [
  {
    number: '01',
    title: 'AI News & Updates',
    description: 'Announcements and important developments from official AI and technology sources.',
    tag: 'OFFICIAL SOURCES',
  },
  {
    number: '02',
    title: 'Models & Products',
    description: 'Explore new AI models, tools, platforms, and the teams building them.',
    tag: 'EXPLORE THE ECOSYSTEM',
  },
  {
    number: '03',
    title: 'Research & Learning',
    description: 'Understand research, emerging technologies, and concepts through accessible explanations.',
    tag: 'LEARN AND BUILD',
  },
];

export default function Discover() {
  return (
    <section className="discover-section page-section" id="discover">
      <div className="section-heading">
        <p className="section-eyebrow">BEYOND OUR OWN PRODUCTS</p>
        <h2>Stay curious about what’s next.</h2>
        <p className="discover-intro">
          A growing space for important developments across artificial intelligence
          and technology, with original sources and explanations that make them useful.
        </p>
      </div>

      <div className="discover-grid">
        {discoveryAreas.map((area) => (
          <article className="discover-card" key={area.number}>
            <span className="discover-number">{area.number}</span>
            <p className="discover-tag">{area.tag}</p>
            <h3>{area.title}</h3>
            <p className="discover-description">{area.description}</p>
            <span className="discover-status">CONTENT PIPELINE PLANNED</span>
          </article>
        ))}
      </div>
    </section>
  );
}
