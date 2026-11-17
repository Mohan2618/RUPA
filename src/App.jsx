import { useState } from 'react';
import LogoIntro from './LogoIntro';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Brands from './Brands';
import Discover from './Discover';
import Announcements from './Announcements';
import Footer from './Footer';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <LogoIntro onDone={() => setIntroDone(true)} />}

      <a className="skip-link" href="#main-content">Skip to main content</a>

      <main
        id="main-content"
        tabIndex={-1}
        className="site-main"
        style={{
          opacity: introDone ? 1 : 0,
          transition: 'opacity .8s ease',
        }}
      >
        <Navbar />
        <Hero />
        <About />
        <Brands />
        <Discover />
        <Announcements />
        <Footer />
      </main>
    </>
  );
}
