import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';
import fr from './legal/fr.jsx';
import de from './legal/de.jsx';
import en from './legal/en.jsx';

// Pages légales, un fichier par langue dans ./legal. Textes MODÈLES adaptés au
// droit suisse : les champs entre crochets [ ] sont à compléter et l'ensemble
// est à faire relire par une personne compétente avant une mise en ligne réelle.
const DOCS = { fr, de, en };

export default function Legal({ doc }) {
  const { lang, t } = useI18n();
  const Doc = (DOCS[lang] || fr)[doc];
  return (
    <div className="page page-head">
      <section className="section">
        <div className="container">
          <div className="legal">
            {Doc && <Doc />}
            <div className="divider" />
            <Link to="/" className="btn btn-outline btn-sm">{t.common.backHome}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
