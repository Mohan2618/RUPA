import { useState } from 'react';
import LogoIntro from './LogoIntro';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Brands from './Brands';
import Discover from './Discover';
import Footer from './Footer';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <LogoIntro onDone={() => setIntroDone(true)} />}

      <main
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
        <Footer />
      </main>
    </>
  );
}
