import { useEffect } from 'react';

export default function ContentMotion() {
  useEffect(() => {
    const selector = [
      '.brands-eyebrow', '.brands h2', '.brands-intro', '.brand-card',
      '.announcements-section .section-heading', '.announcements-filters',
      '.announcement-card', '.explore-eyebrow', '.explore-page h1',
      '.explore-description', '.explore-resource-grid a',
      '.model-explorer-controls', '.model-explorer-card',
      '.discover-section .section-heading', '.discover-card', '.discover-source',
      '.about-section .section-heading',
    ].join(', ');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const observed = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    function register() {
      document.querySelectorAll(selector).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        const rect = element.getBoundingClientRect();
        // Never hide content that is already in view.
        if (rect.top < window.innerHeight && rect.bottom > 0) return;
        element.classList.add('motion-pending');
        if (element.matches('.brand-card, .announcement-card, .model-explorer-card, .discover-card, .discover-source')) {
          const siblings = [...element.parentElement.children];
          element.style.setProperty('--motion-delay', `${Math.min(siblings.indexOf(element) % 4, 3) * 75}ms`);
        }
        observer.observe(element);
      });
    }

    register();
    const mutationObserver = new MutationObserver(register);
    mutationObserver.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });

    const onReduceChange = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      mutationObserver.disconnect();
      document.querySelectorAll('.motion-pending').forEach((element) => {
        element.classList.remove('motion-pending');
        element.classList.add('motion-visible');
      });
    };
    reducedMotion.addEventListener('change', onReduceChange);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      reducedMotion.removeEventListener('change', onReduceChange);
      document.querySelectorAll('.motion-pending').forEach((element) => {
        element.classList.remove('motion-pending');
        element.style.removeProperty('--motion-delay');
      });
    };
  }, []);

  return null;
}
