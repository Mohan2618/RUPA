import { useEffect, useState } from 'react';
import './ExplorePage.css';
import './ModelExplorer.css';

export default function ModelExplorer() {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [publisher, setPublisher] = useState('all');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/announcements', { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load announcements');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid API response');
        setAnnouncements(data.filter((item) =>
          item.category?.trim().toUpperCase() === 'MODEL RELEASE' &&
          item.publisher?.trim().toLowerCase() !== 'rupa'
        ));
        setStatus('success');
      } catch (error) {
        if (!controller.signal.aborted) setStatus('error');
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const publishers = [...new Set(announcements.map((item) => item.publisher))].sort();
  const normalizedQuery = query.trim().toLowerCase();
  const visible = announcements.filter((item) =>
    (publisher === 'all' || item.publisher === publisher) &&
    [item.title, item.publisher, item.summary].some((value) =>
      String(value || '').toLowerCase().includes(normalizedQuery)
    )
  ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));

  return (
    <section className="explore-page" aria-labelledby="explore-page-title">
      <div className="explore-page-inner">
        <p className="explore-eyebrow">AI MODEL EXPLORER</p>
        <h1 id="explore-page-title">Explore AI model releases.</h1>
        <p className="explore-description">
          Browse curated model announcements from other organizations, with original sources.
          This is a release explorer, not a model benchmark or live ranking.
        </p>

        <div className="model-explorer-controls">
          <label>
            <span>Search model releases</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, publisher, or summary" />
          </label>
          <label>
            <span>Publisher</span>
            <select value={publisher} onChange={(event) => setPublisher(event.target.value)}>
              <option value="all">All publishers</option>
              {publishers.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>

        {status === 'loading' && <p className="model-explorer-message" role="status">Loading model releases…</p>}
        {status === 'error' && <p className="model-explorer-message" role="alert">Could not load model releases. Check that Flask is running.</p>}
        {status === 'success' && (
          <>
            <p className="model-explorer-count" role="status">{visible.length} matching model releases</p>
            {visible.length === 0 ? (
              <p className="model-explorer-message">No model releases match your filters yet.</p>
            ) : (
              <div className="model-explorer-grid">
                {visible.map((item) => (
                  <article key={item.id} className="model-explorer-card">
                    <span className="model-explorer-category">MODEL RELEASE</span>
                    <h2>{item.title}</h2>
                    <p className="model-explorer-meta">{item.publisher} · {item.dateLabel || item.publishedAt}</p>
                    <p className="model-explorer-summary">{item.summary}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">Original announcement <span aria-hidden="true">↗</span></a>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        <a className="explore-home" href="/discover">Back to Discover</a>
      </div>
    </section>
  );
}
