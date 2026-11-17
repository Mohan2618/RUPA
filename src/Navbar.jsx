import { useState } from 'react';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Innovations', href: '#innovations' },
  { label: 'Discover', href: '#discover' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <a href="#home" className="navbar-logo" aria-label="RUPA home" onClick={closeMenu}>
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
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
        ))}
      </div>

      <a href="#discover" className="navbar-cta" onClick={closeMenu}>
        Explore RUPA <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}
