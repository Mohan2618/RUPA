import { useState } from 'react';
import './Navbar.css';

const groups = [
  {
    label: 'Innovations',
    links: [
      { label: 'Our products', href: '/#innovations' },
      { label: 'RUPA models', href: '/rupa-models' },
      { label: 'RUPA announcements', href: '/#announcements' },
    ],
  },
  {
    label: 'Discover',
    links: [
      { label: 'AI news', href: '/news' },
      { label: 'AI models', href: '/models' },
      { label: 'Technology', href: '/technology' },
      { label: 'Companies', href: '/companies' },
      { label: 'Explore resources', href: '/discover' },
    ],
  },
  {
    label: 'Learn & Research',
    links: [
      { label: 'Learning hub', href: '/learn' },
      { label: 'Research', href: '/research' },
    ],
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const closeMenu = () => { setMenuOpen(false); setActiveGroup(null); };

  return (
    <nav className="navbar" aria-label="Main navigation">
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
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
      </button>

      <div id="navbar-links" className={`navbar-links${menuOpen ? ' navbar-links-open' : ''}`}>
        <a href="/" onClick={closeMenu}>Home</a>
        {groups.map((group) => (
          <div className="navbar-group" key={group.label}>
            <button
              type="button"
              className="navbar-group-toggle"
              aria-expanded={activeGroup === group.label}
              onClick={() => setActiveGroup((current) => current === group.label ? null : group.label)}
            >
              {group.label} <span aria-hidden="true">⌄</span>
            </button>
            {activeGroup === group.label && (
              <div className="navbar-dropdown">
                {group.links.map((link) => (
                  <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="/#about" onClick={closeMenu}>About</a>
      </div>

      <a href="/#innovations" className="navbar-cta" onClick={closeMenu}>
        Explore RUPA <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}
