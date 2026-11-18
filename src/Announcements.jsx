import { useEffect, useState } from 'react';
import './Announcements.css';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const categories = [...new Set(announcements.map((item) => item.category))].sort();
  const query = searchQuery.trim().toLowerCase();
  const filteredAnnouncements = announcements.filter((item) =>
    (categoryFilter === 'all' || item.category === categoryFilter) &&
    [item.title, item.publisher, item.category, item.summary]
      .some((value) => String(value).toLowerCase().includes(query))
  );


  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return a.publishedAt.localeCompare(b.publishedAt) || a.id.localeCompare(b.id);
      case 'title':
        return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
      case 'publisher':
        return a.publisher.localeCompare(b.publisher) || a.id.localeCompare(b.id);
      default:
        return b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id);
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnnouncements() {
      try {
        const response = await fetch('/api/announcements', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Could not load announcements');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected announcements response');
        }

        setAnnouncements(data);
        setStatus('success');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Announcements request failed:', error);
          setStatus('error');
        }
      }
    }

    loadAnnouncements();
    return () => controller.abort();
  }, []);

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

      {status === 'loading' && (
        <p className="announcements-message" role="status">Loading announcements…</p>
      )}

      {status === 'error' && (
        <p className="announcements-message" role="alert">
          Announcements are unavailable. Make sure the RUPA Flask backend is running, then refresh the page.
        </p>
      )}

      {status === 'success' && announcements.length === 0 && (
        <p className="announcements-message" role="status">No announcements available yet.</p>
      )}

      {status === 'success' && announcements.length > 0 && (
        <>
          <div className="announcements-filters">
            <label>
              <span>Search announcements</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search titles, publishers, topics..."
              />
            </label>
            <label>
              <span>Category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort by</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
                <option value="publisher">Publisher A–Z</option>
              </select>
            </label>
          </div>
          <p className="announcements-count" role="status">
            Showing {filteredAnnouncements.length} of {announcements.length} announcements
          </p>
          {filteredAnnouncements.length === 0 ? (
            <p className="announcements-message">No announcements match your search or category.</p>
          ) : (
          <div className="announcements-grid">
          {sortedAnnouncements.map((item) => (
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
          )}
        </>
      )}
    </section>
  );
}
