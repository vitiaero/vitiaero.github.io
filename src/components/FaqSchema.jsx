import { useEffect } from 'react';
import { useI18n } from '../i18n/index.jsx';

// Donnees structurees FAQPage, construites a partir des questions reellement
// affichees sur la page. Rien n'est invente : si la FAQ change, le balisage
// suit. Le script est retire quand on quitte la page d'accueil.
const ID = 'faq-schema';

export default function FaqSchema() {
  const { t } = useI18n();
  const groups = t.home.faq.groups;

  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: groups.flatMap((g) => g.items).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };
    let el = document.getElementById(ID);
    if (!el) {
      el = document.createElement('script');
      el.id = ID;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => { document.getElementById(ID)?.remove(); };
  }, [groups]);

  return null;
}
