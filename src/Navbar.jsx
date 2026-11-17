import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Innovations', href: '#innovations' },
  { label: 'Discover', href: '#discover' },
];

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a href="#home" className="navbar-logo" aria-label="RUPA home">
        <img src="/Logo/rupa-emblem.png" alt="" className="navbar-emblem" />
        <span>RUPA</span>
      </a>

      <div className="navbar-links">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </div>

      <a href="#discover" className="navbar-cta">
        Explore RUPA <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}
