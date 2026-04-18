import { useEffect } from 'react';

const SITE = 'Ilê Sàngó Aganjù e Oṣun Pandá';
const DEFAULT_DESC =
  'Casa espiritual em Caxias do Sul: calendário, catálogo e contato. Tradição, acolhimento e desenvolvimento mediúnico.';

export type PageMetaProps = {
  /** Parte após "Ilê | …" no <title> */
  title: string;
  description?: string;
  /** Caminho absoluto ou relativo para og:url (ex.: /sobre) */
  path?: string;
};

/**
 * Atualiza <title> e meta tags de SEO/OG por rota (SPA sem react-helmet).
 * Mantém uma única fonte de padrão para description e imagem OG.
 */
export function PageMeta({ title, description = DEFAULT_DESC, path = '' }: PageMetaProps) {
  useEffect(() => {
    document.title = `Ilê | ${title}`;

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = path ? `${base}${path.startsWith('/') ? path : `/${path}`}` : typeof window !== 'undefined' ? window.location.href : '';

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', `${SITE} — ${title}`);
    setMeta('property', 'og:description', description);
    const ogImg = `${base}/images/logo-ile.png`;
    setMeta('property', 'og:image', ogImg);
    if (url) setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', `${SITE} — ${title}`);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImg);
  }, [title, description, path]);

  return null;
}
