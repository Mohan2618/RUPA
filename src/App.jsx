import { useState } from 'react';
import LogoIntro from './LogoIntro';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Brands from './Brands';
import Discover from './Discover';
import Announcements from './Announcements';
import ExplorePage from './ExplorePage';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';
import ContentMotion from './ContentMotion';
import './ContentMotion.css';

const INTRO_KEY = 'rupa-intro-completed';

function shouldShowIntro() {
  try {
    // Deep links should reach their destination immediately.
    return !window.location.hash && sessionStorage.getItem(INTRO_KEY) !== 'true';
  } catch {
    return !window.location.hash;
  }
}

const explorePaths = new Set(['/models', '/technology', '/learn', '/research', '/companies', '/rupa-models']);

export default function App() {
  const [introDone, setIntroDone] = useState(() => !shouldShowIntro());

  function finishIntro() {
    try {
      sessionStorage.setItem(INTRO_KEY, 'true');
    } catch {
      // Storage can be unavailable in restricted browsing modes.
    }
    setIntroDone(true);
  }
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  // Development-only dashboard path; not an authentication boundary.
  if (path === '/admin') {
    return <AdminDashboard />;
  }

  const isHome = path === '/';
  const isDiscover = path === '/discover';
  const isNews = path === '/news';
  const isExplore = explorePaths.has(path);

  return (
    <>
      {isHome && !introDone && <LogoIntro onDone={finishIntro} />}
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main
        id="main-content"
        tabIndex={-1}
        className="site-main"
        style={{
          opacity: isHome && !introDone ? 0 : 1,
          transition: 'opacity .8s ease',
        }}
      >
        <ContentMotion />
        <Navbar />
        {isHome ? (
          <>
            <Hero />
            <About />
            <Brands />
            <Announcements scope="rupa" />
          </>
        ) : isDiscover ? (
          <Discover />
        ) : isNews ? (
          <Announcements scope="external" />
        ) : isExplore ? (
          <ExplorePage path={path} />
        ) : (
          <section className="explore-page" style={{ minHeight: '75vh', padding: '160px 7% 90px' }}>
            <h1>Page not found</h1>
            <p>This RUPA page does not exist.</p>
            <a href="/">Back to RUPA home</a>
          </section>
        )}
        <Footer />
      </main>
    </>
  );
}
