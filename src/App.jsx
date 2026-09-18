import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import LaunchNotice from './components/LaunchNotice.jsx';
import MobileCta from './components/MobileCta.jsx';
import Footer from './components/Footer.jsx';
import PrivacyBanner from './components/PrivacyBanner.jsx';
import { useAuth } from './auth.jsx';
import { useI18n } from './i18n/index.jsx';

import Home from './pages/Home.jsx';
import Equipement from './pages/Equipement.jsx';
import Estimation from './pages/Estimation.jsx';
import Confirmation from './pages/Confirmation.jsx';
import About from './pages/About.jsx';
import Service from './pages/Service.jsx';
import Devis from './pages/Devis.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import Legal from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';

// Titre et description par page (application a page unique : on met a jour la
// balise <title>, la meta description et le lien canonique a chaque navigation,
// pour le referencement et le partage). Les textes sont dans src/i18n.
const BASE_URL = 'https://vitiaero.ch';

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

// Remet la page en haut, met a jour le titre, la description et le canonique.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { t } = useI18n();
  useEffect(() => {
    // Un lien vers une ancre (#reglementation, #rapport...) doit amener a la
    // section, pas en haut de la page.
    if (hash) {
      const goTo = () => document.getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (document.getElementById(hash.slice(1))) { goTo(); return undefined; }
      // La section vient d'une autre page : elle arrive au rendu suivant.
      const timer = setTimeout(goTo, 80);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  useEffect(() => {
    const pages = t.meta.pages;
    const meta = pages[pathname] || { title: t.meta.fallbackTitle, desc: pages['/'].desc };
    document.title = meta.title;
    setMeta('description', meta.desc);
    setLink('canonical', BASE_URL + (pathname === '/' ? '/' : pathname));
    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute('content', meta.title);
    const ogd = document.querySelector('meta[property="og:url"]');
    if (ogd) ogd.setAttribute('content', BASE_URL + (pathname === '/' ? '/' : pathname));
  }, [pathname, t]);
  return null;
}

// Protege une page : redirige vers la connexion si besoin, ou refuse si le
// role ne correspond pas.
function Protected({ children, role }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  if (loading) {
    return <div className="loading-block"><div className="spinner" /> {t.common.loading}</div>;
  }
  if (!user) return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { t } = useI18n();
  return (
    <>
      <ScrollToTop />
      <a href="#main" className="skip-link">{t.common.skip}</a>
      <LaunchNotice />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipement" element={<Equipement />} />
          <Route path="/estimation" element={<Estimation />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/le-service" element={<Service />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route
            path="/espace-client"
            element={<Protected><Account /></Protected>}
          />
          <Route
            path="/admin"
            element={<Protected role="admin"><Admin /></Protected>}
          />
          <Route path="/confidentialite" element={<Legal doc="confidentialite" />} />
          <Route path="/mentions-legales" element={<Legal doc="mentions" />} />
          <Route path="/conditions-generales" element={<Legal doc="cgv" />} />
          <Route path="/cookies" element={<Legal doc="cookies" />} />
          <Route path="/conditions" element={<Legal doc="conditions" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileCta />
      <PrivacyBanner />
    </>
  );
}
