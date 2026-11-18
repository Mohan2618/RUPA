import { useEffect, useState } from 'react';
import './Announcements.css';

export default function Announcements({ scope = 'all' }) {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const scopedAnnouncements = announcements.filter((item) => {
    const isRupa = item.publisher.trim().toLowerCase() === 'rupa';
    return scope === 'rupa' ? isRupa : scope === 'external' ? !isRupa : true;
  });
  const categories = [...new Set(scopedAnnouncements.map((item) => item.category))].sort();
  const query = searchQuery.trim().toLowerCase();
  const filteredAnnouncements = scopedAnnouncements.filter((item) =>
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

  const totalPages = Math.max(1, Math.ceil(sortedAnnouncements.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const visibleAnnouncements = sortedAnnouncements.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  // A navbar link can target a card on any pagination page.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#announcement-') || status !== 'success') return;
    const targetId = decodeURIComponent(hash.slice('#announcement-'.length));
    const index = sortedAnnouncements.findIndex((item) => item.id === targetId);
    if (index < 0) return;
    setCurrentPage(Math.floor(index / pageSize) + 1);
  }, [status, announcements, pageSize]);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#announcement-')) return;
    const targetId = decodeURIComponent(hash.slice('#announcement-'.length));
    if (!visibleAnnouncements.some((item) => item.id === targetId)) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`announcement-${targetId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [status, currentPage, announcements, pageSize]);

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
        <p className="section-eyebrow">{scope === 'rupa' ? 'RUPA UPDATES' : 'CURATED ANNOUNCEMENTS'}</p>
        <h2 id="announcements-heading">{scope === 'rupa' ? 'Latest from RUPA.' : 'From the source.'}</h2>
        <p className="announcements-intro">
          {scope === 'rupa' ? 'Official announcements from RUPA and its products.' : 'Curated announcements from other publishers, with links to their original sources. This is not a live news feed.'}
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

      {status === 'success' && scopedAnnouncements.length === 0 && (
        <p className="announcements-message" role="status">No announcements available in this section yet.</p>
      )}

      {status === 'success' && scopedAnnouncements.length > 0 && (
        <>
          <div className="announcements-filters">
            <label>
              <span>Search announcements</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }}
                placeholder="Search titles, publishers, topics..."
              />
            </label>
            <label>
              <span>Category</span>
              <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setCurrentPage(1); }}>
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort by</span>
              <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setCurrentPage(1); }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
                <option value="publisher">Publisher A–Z</option>
              </select>
            </label>
            <label>
              <span>Per page</span>
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}>
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </label>
          </div>
          <p className="announcements-count" role="status">
            Showing {filteredAnnouncements.length === 0 ? 0 : (activePage - 1) * pageSize + 1}–{Math.min(activePage * pageSize, filteredAnnouncements.length)} of {filteredAnnouncements.length} matching announcements ({scopedAnnouncements.length} total)
          </p>
          {filteredAnnouncements.length === 0 ? (
            <p className="announcements-message">No announcements match your search or category.</p>
          ) : (
          <div className="announcements-grid">
          {visibleAnnouncements.map((item) => (
            <article className="announcement-card" id={`announcement-${item.id}`} key={item.id}>
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
          {filteredAnnouncements.length > 0 && (
            <nav className="announcements-pagination" aria-label="Announcement pages">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={activePage === 1}>Previous</button>
              <span>Page {activePage} of {totalPages}</span>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={activePage === totalPages}>Next</button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
