import './Announcements.css';

const announcements = [
  {
    id: 'gpt-5-launch',
    title: 'Introducing GPT-5',
    publisher: 'OpenAI',
    publishedAt: '2025-08-07',
    dateLabel: '7 Aug 2025',
    category: 'MODEL RELEASE',
    summary: 'OpenAI introduced GPT-5 as a unified AI system with fast responses and deeper reasoning for complex tasks.',
    url: 'https://openai.com/index/introducing-gpt-5/',
  },
  {
    id: 'gemini-2-5-launch',
    title: 'Introducing Gemini 2.5',
    publisher: 'Google',
    publishedAt: '2025-03-25',
    dateLabel: '25 Mar 2025',
    category: 'MODEL RELEASE',
    summary: 'Google introduced Gemini 2.5 Pro Experimental, emphasizing reasoning, coding, and long-context understanding.',
    url: 'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/',
  },
];

export default function Announcements() {
  return (
    <section className="announcements-section page-section" id="announcements" aria-labelledby="announcements-heading">
      <div className="section-heading">
        <p className="section-eyebrow">CURATED ANNOUNCEMENTS</p>
        <h2 id="announcements-heading">From the source.</h2>
        <p className="announcements-intro">
          Selected historical AI announcements, with publication dates and links to the original articles.
          This is a curated archive, not a live news feed.
        </p>
      </div>

      <div className="announcements-grid">
        {announcements.map((item) => (
          <article className="announcement-card" key={item.id}>
            <div className="announcement-meta">
              <span>{item.category}</span>
              <time dateTime={item.publishedAt}>{item.dateLabel}</time>
            </div>
            <h3>{item.title}</h3>
            <p className="announcement-publisher">Published by {item.publisher}</p>
            <p className="announcement-summary">{item.summary}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Read original announcement <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
