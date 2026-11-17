import { useState } from 'react';
import './Discover.css';

const discoveryAreas = [
  {
    number: '01',
    title: 'AI News & Updates',
    description: 'Announcements and important developments from official AI and technology sources.',
    tag: 'OFFICIAL SOURCES',
    details: 'This area will organize verified announcements, release notes, and technology updates, linking back to their original sources.',
  },
  {
    number: '02',
    title: 'Models & Products',
    description: 'Explore new AI models, tools, platforms, and the teams building them.',
    tag: 'EXPLORE THE ECOSYSTEM',
    details: 'This area will help visitors compare model capabilities, find official product pages, and understand practical use cases.',
  },
  {
    number: '03',
    title: 'Research & Learning',
    description: 'Understand research, emerging technologies, and concepts through accessible explanations.',
    tag: 'LEARN AND BUILD',
    details: 'This area will connect research publications with beginner-friendly explanations and practical learning resources.',
  },
];

const officialSources = [
  {
    name: 'OpenAI News',
    description: 'Official announcements and research updates from OpenAI.',
    url: 'https://openai.com/news/',
  },
  {
    name: 'Google DeepMind',
    description: 'Research and technology updates from Google DeepMind.',
    url: 'https://deepmind.google/discover/blog/',
  },
  {
    name: 'Hugging Face Blog',
    description: 'Updates on open models, datasets, and developer tools.',
    url: 'https://huggingface.co/blog',
  },
];

export default function Discover() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredAreas = discoveryAreas.filter((area) =>
    [area.title, area.description, area.tag, area.details]
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  );

  const filteredSources = officialSources.filter((source) =>
    [source.name, source.description]
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  );
  const noResults = filteredAreas.length === 0 && filteredSources.length === 0;

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

      <div className="discover-search">
        <label htmlFor="discover-search-input">Search discovery topics and resources</label>
        <input
          id="discover-search-input"
          type="search"
          placeholder="Search topics, publishers, and research..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {noResults && (
        <p className="discover-empty" role="status">
          No topics or resources match your search. Try a different keyword.
        </p>
      )}

      {filteredAreas.length > 0 && <div className="discover-grid">
        {filteredAreas.map((area) => {
          const expanded = selectedArea === area.number;

          return (
            <article className={`discover-card${expanded ? ' discover-card-active' : ''}`} key={area.number}>
              <span className="discover-number">{area.number}</span>
              <p className="discover-tag">{area.tag}</p>
              <h3>{area.title}</h3>
              <p className="discover-description">{area.description}</p>
              <span className="discover-status">CONTENT PIPELINE PLANNED</span>
              <button
                type="button"
                className="discover-details-toggle"
                aria-expanded={expanded}
                aria-controls={`discover-details-${area.number}`}
                onClick={() => setSelectedArea(expanded ? null : area.number)}
              >
                {expanded ? 'Show less' : 'Learn more'}
                <span aria-hidden="true">{expanded ? ' −' : ' +'}</span>
              </button>
              {expanded && (
                <p className="discover-details" id={`discover-details-${area.number}`}>
                  {area.details}
                </p>
              )}
            </article>
          );
        })}
      </div>}
      {filteredSources.length > 0 && <div className="discover-sources">
        <div className="discover-sources-heading">
          <p className="section-eyebrow">EXPLORE ORIGINAL SOURCES</p>
          <h3>Official resources</h3>
          <p>Visit these publishers directly for their announcements and research.</p>
        </div>
        <div className="discover-sources-grid">
          {filteredSources.map((source) => (
            <article className="discover-source" key={source.url}>
              <h4>{source.name}</h4>
              <p>{source.description}</p>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                Visit official website <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>}
    </section>
  );
}
