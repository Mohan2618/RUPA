import { useEffect, useState } from 'react';
import './Announcements.css';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');

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
      )}
    </section>
  );
}
