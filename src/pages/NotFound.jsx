import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="page page-head">
      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">{t.notFound.eyebrow}</span>
          <h1 className="display">{t.notFound.title}</h1>
          <p className="lead mt-2">{t.notFound.lead}</p>
          <div className="mt-4">
            <Link to="/" className="btn btn-primary">{t.common.backHome}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
