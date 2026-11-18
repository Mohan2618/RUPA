import { useEffect, useState } from 'react';
import './Navbar.css';

const groups = [
  {
    label: 'Innovations',
    description: 'Explore what we build at RUPA.',
    links: [
      { label: 'Our products', href: '/#innovations', description: 'Lumina, Orbit, and our projects' },
      { label: 'RUPA models', href: '/rupa-models', description: 'Models developed in our ecosystem' },
      { label: 'RUPA announcements', href: '/#announcements', description: 'Official releases and updates' },
    ],
  },
  {
    label: 'Discover',
    description: 'Discover ideas beyond RUPA.',
    links: [
      { label: 'AI news', href: '/news', description: 'Announcements from other publishers' },
      { label: 'AI models', href: '/models', description: 'Explore model releases and capabilities' },
      { label: 'Technology', href: '/technology', description: 'Tools and emerging technology' },
      { label: 'Companies', href: '/companies', description: 'Organizations shaping AI' },
      { label: 'Explore resources', href: '/discover', description: 'Curated official resources' },
    ],
  },
  {
    label: 'Learn & Research',
    description: 'Find resources to learn and build.',
    links: [
      { label: 'Learning hub', href: '/learn', description: 'Tutorials and developer resources' },
      { label: 'Research', href: '/research', description: 'Papers and original publications' },
    ],
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [latestRupa, setLatestRupa] = useState([]);
  const [updatesStatus, setUpdatesStatus] = useState('loading');

  useEffect(() => {
    if (activeGroup !== 'Innovations') return;

    const controller = new AbortController();
    setUpdatesStatus('loading');

    async function loadRupaUpdates() {
      try {
        const response = await fetch('/api/announcements', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Announcements unavailable');
        const records = await response.json();
        if (!Array.isArray(records)) throw new Error('Unexpected announcement response');
        setLatestRupa(records
          .filter((item) => typeof item.publisher === 'string' && item.publisher.trim().toLowerCase() === 'rupa')
          .filter((item) => typeof item.title === 'string' && typeof item.id === 'string' && typeof item.publishedAt === 'string')
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id))
          .slice(0, 3));
        setUpdatesStatus('success');
      } catch (error) {
        if (!controller.signal.aborted) setUpdatesStatus('error');
      }
    }

    loadRupaUpdates();
    return () => controller.abort();
  }, [activeGroup]);
  const closeMenu = () => { setMenuOpen(false); setActiveGroup(null); };

  return (
    <nav
      className="navbar"
      aria-label="Main navigation"
      onMouseLeave={() => setActiveGroup(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setActiveGroup(null);
          event.currentTarget.querySelector('.navbar-group-toggle[aria-expanded="true"]')?.focus();
        }
      }}
    >
      <a href="/" className="navbar-logo" aria-label="RUPA home" onClick={closeMenu}>
        <img src="/Logo/rupa-emblem.png" alt="" className="navbar-emblem" />
        <span>RUPA</span>
      </a>

      <button
        type="button"
        className="navbar-menu-toggle"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="navbar-links"
        onClick={() => { setMenuOpen((open) => !open); setActiveGroup(null); }}
      >
        <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
      </button>

      <div id="navbar-links" className={`navbar-links${menuOpen ? ' navbar-links-open' : ''}`}>
        <a href="/" onMouseEnter={() => setActiveGroup(null)} onFocus={() => setActiveGroup(null)} onClick={closeMenu}>Home</a>
        {groups.map((group) => (
          <div
            className="navbar-group"
            key={group.label}
            onMouseEnter={(event) => {
              if (event.pointerType !== 'touch') setActiveGroup(group.label);
            }}
          >
            <button
              type="button"
              className="navbar-group-toggle"
              aria-expanded={activeGroup === group.label}
              aria-controls={`navbar-panel-${groups.indexOf(group)}`}
              onFocus={() => setActiveGroup(group.label)}
              onClick={() => setActiveGroup((current) => current === group.label ? null : group.label)}
            >
              {group.label} <span className="navbar-chevron" aria-hidden="true">⌄</span>
            </button>
          </div>
        ))}
        <a href="/#about" onMouseEnter={() => setActiveGroup(null)} onFocus={() => setActiveGroup(null)} onClick={closeMenu}>About</a>
      </div>

      <a href="/#innovations" className="navbar-cta" onMouseEnter={() => setActiveGroup(null)} onClick={closeMenu}>
        Explore RUPA <span aria-hidden="true">↗</span>
      </a>

      {groups.map((group, index) => (
        <div
          id={`navbar-panel-${index}`}
          key={group.label}
          className={`navbar-mega${activeGroup === group.label ? ' navbar-mega-open' : ''}`}
          hidden={activeGroup !== group.label}
        >
          <div className="navbar-mega-intro">
            <span className="navbar-mega-eyebrow">{group.label}</span>
            <h2>{group.description}</h2>
          </div>
          <div className="navbar-mega-links">
            {group.links.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </a>
            ))}
          </div>
          {group.label === 'Innovations' && (
            <div className="navbar-mega-updates">
              <h3>Latest RUPA updates</h3>
              {updatesStatus === 'loading' && <p>Loading updates…</p>}
              {updatesStatus === 'error' && <p>Updates unavailable. Start the Flask backend to load them.</p>}
              {updatesStatus === 'success' && latestRupa.length === 0 && <p>No RUPA announcements published yet.</p>}
              {updatesStatus === 'success' && latestRupa.map((item) => (
                <a href="/#announcements" key={item.id} onClick={closeMenu}>
                  <strong>{item.title}</strong>
                  <span>{item.dateLabel || item.publishedAt}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
