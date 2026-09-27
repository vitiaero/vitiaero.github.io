import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Header from './components/Header.jsx';
import LaunchNotice from './components/LaunchNotice.jsx';
import LangSuggest from './components/LangSuggest.jsx';
import MobileCta from './components/MobileCta.jsx';
import Footer from './components/Footer.jsx';
import PrivacyBanner from './components/PrivacyBanner.jsx';
import { useAuth } from './auth.jsx';
import { useI18n } from './i18n/index.jsx';
import { LAUNCH, business } from './launch.js';
import { isPrivateRoute } from '../shared/security.js';
import Home from './pages/Home.jsx';

// Pages chargees a la demande : la carte (Leaflet) et l'administration ne
// pesent pas sur le premier affichage de l'accueil.
const Equipement = lazy(() => import('./pages/Equipement.jsx'));
const Estimation = lazy(() => import('./pages/Estimation.jsx'));
const Confirmation = lazy(() => import('./pages/Confirmation.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Service = lazy(() => import('./pages/Service.jsx'));
const Devis = lazy(() => import('./pages/Devis.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const SITE_URL = business.site.url.replace(/\/$/, '');

function setMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

// Remet la page en haut (ou sur l'ancre demandee) et met a jour titre,
// description, adresse canonique et consigne d'indexation. Les memes balises
// sont ecrites a la compilation dans chaque page HTML (vite.config.js).
function PageMeta() {
  const { pathname, hash } = useLocation();
  const { t } = useI18n();
  useEffect(() => {
    if (hash) {
      const goTo = () => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
      if (document.getElementById(hash.slice(1))) { goTo(); return undefined; }
      const timer = setTimeout(goTo, 150); // section d'une page chargee a la demande
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  useEffect(() => {
    const pages = t.meta.pages;
    const known = Object.hasOwn(pages, pathname);
    const meta = known ? pages[pathname] : { title: t.meta.fallbackTitle, desc: pages['/'].desc };
    document.title = meta.title;
    setMeta('name', 'description', meta.desc);
    const url = SITE_URL + (pathname === '/' ? '/' : pathname);
    setLink('canonical', url);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.desc);
    setMeta('property', 'og:url', url);
    setMeta('name', 'robots', !LAUNCH.ready || isPrivateRoute(pathname) || !known ? 'noindex, nofollow' : 'index, follow');
  }, [pathname, t]);
  return null;
}

function Loading() {
  const { t } = useI18n();
  return <div className="loading-block" role="status"><div className="spinner" aria-hidden="true" /> {t.common.loading}</div>;
}

// Protege une page : redirige vers la connexion si besoin, ou refuse si le
// role ne correspond pas.
function Protected({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { t } = useI18n();
  return (
    <>
      <PageMeta />
      <a href="#main" className="skip-link">{t.common.skip}</a>
      <LaunchNotice />
      <LangSuggest />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<Loading />}>
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
            <Route path="/espace-client" element={<Protected><Account /></Protected>} />
            <Route path="/admin" element={<Protected role="admin"><Admin /></Protected>} />
            <Route path="/confidentialite" element={<Legal doc="privacy" />} />
            <Route path="/mentions-legales" element={<Legal doc="mentions" />} />
            <Route path="/conditions-generales" element={<Legal doc="cgv" />} />
            <Route path="/cookies" element={<Legal doc="cookies" />} />
            <Route path="/conditions" element={<Legal doc="terms" />} />
            <Route path="/credits" element={<Legal doc="credits" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileCta />
      <PrivacyBanner />
    </>
  );
}
