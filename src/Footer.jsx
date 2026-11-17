import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <a href="#home" className="footer-brand">RUPA<span>.</span></a>
      <p>Building, discovering, and sharing what’s next.</p>
      <a href="#home" className="back-to-top">Back to top ↑</a>
      <small>© {new Date().getFullYear()} RUPA. All rights reserved.</small>
    </footer>
  );
}
