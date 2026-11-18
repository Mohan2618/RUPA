import { useState } from 'react';
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
        </div>
      ))}
    </nav>
  );
}
