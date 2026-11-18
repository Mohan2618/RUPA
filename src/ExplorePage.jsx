import './ExplorePage.css';
import ModelExplorer from './ModelExplorer';

const pages = {
  '/models': {
    eyebrow: 'AI MODEL EXPLORER',
    title: 'Explore AI models.',
    description: 'A dedicated space for discovering AI models, capabilities, and official release information. A searchable model catalog is planned.',
    links: [{ label: 'Hugging Face models', url: 'https://huggingface.co/models' }, { label: 'OpenAI models', url: 'https://platform.openai.com/docs/models' }],
  },
  '/technology': {
    eyebrow: 'TECHNOLOGY',
    title: 'Technology worth exploring.',
    description: 'A future home for emerging tools, platforms, and important technology developments. For now, explore the official resources below.',
    links: [{ label: 'Google Developers', url: 'https://developers.googleblog.com/' }, { label: 'GitHub Blog', url: 'https://github.blog/' }],
  },
  '/learn': {
    eyebrow: 'LEARN & BUILD',
    title: 'Keep learning.',
    description: 'Practical guides and explainers are planned for this section. Start with these established learning resources.',
    links: [{ label: 'Python documentation', url: 'https://docs.python.org/3/tutorial/' }, { label: 'PyTorch tutorials', url: 'https://docs.pytorch.org/tutorials/' }],
  },
  '/research': {
    eyebrow: 'RESEARCH',
    title: 'Explore research.',
    description: 'Research papers and accessible explanations will live here. Explore original publications using the resources below.',
    links: [{ label: 'arXiv AI research', url: 'https://arxiv.org/list/cs.AI/recent' }, { label: 'Google DeepMind publications', url: 'https://deepmind.google/research/publications/' }],
  },
  '/companies': {
    eyebrow: 'AI ECOSYSTEM',
    title: 'Meet the ecosystem.',
    description: 'Discover the organizations building AI products and technology. Company profiles are planned.',
    links: [{ label: 'OpenAI', url: 'https://openai.com/' }, { label: 'Google DeepMind', url: 'https://deepmind.google/' }, { label: 'Hugging Face', url: 'https://huggingface.co/' }],
  },
  '/rupa-models': {
    eyebrow: 'RUPA INNOVATIONS',
    title: 'Models from RUPA.',
    description: 'This page will showcase models developed within RUPA. No model release has been published here yet.',
    links: [],
  },
};

export default function ExplorePage({ path }) {
  if (path === '/models') return <ModelExplorer />;
  const page = pages[path];
  if (!page) return null;

  return (
    <section className="explore-page" aria-labelledby="explore-page-title">
      <div className="explore-page-inner">
        <p className="explore-eyebrow">{page.eyebrow}</p>
        <h1 id="explore-page-title">{page.title}</h1>
        <p className="explore-description">{page.description}</p>
        {page.links.length > 0 && (
          <div className="explore-resources">
            <h2>Official resources</h2>
            <div className="explore-resource-grid">
              {page.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <a className="explore-home" href="/">Back to RUPA home</a>
      </div>
    </section>
  );
}
