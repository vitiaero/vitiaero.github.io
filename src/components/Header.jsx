import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useI18n } from '../i18n/index.jsx';
import LangSwitch from './LangSwitch.jsx';
import { asset } from '../config.js';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, lang } = useI18n();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const indRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pastille claire qui glisse sous le lien de la page active. Elle est placee
  // en JavaScript (position et largeur du lien) ; sans JavaScript, le lien
  // actif garde son propre fond (classe .has-ind absente).
  const placeIndicator = useCallback((animate = true) => {
    const nav = navRef.current;
    const ind = indRef.current;
    if (!nav || !ind) return;
    const active = nav.querySelector('a.active');
    if (!active) { ind.style.opacity = '0'; return; }
    ind.classList.toggle('no-anim', !animate);
    ind.style.opacity = '1';
    ind.style.setProperty('--x', `${active.offsetLeft}px`);
    ind.style.setProperty('--w', `${active.offsetWidth}px`);
    nav.classList.add('has-ind');
  }, []);

  useLayoutEffect(() => { placeIndicator(true); }, [pathname, lang, user, placeIndicator]);
  useEffect(() => {
    const onResize = () => placeIndicator(false);
    window.addEventListener('resize', onResize);
    // Les largeurs changent quand la police est chargee.
    document.fonts?.ready?.then(() => placeIndicator(false));
    return () => window.removeEventListener('resize', onResize);
  }, [placeIndicator]);

  // Empeche le defilement de l'arriere-plan quand le menu mobile est ouvert.
  // La classe sur le corps de page sert aussi a masquer la barre fixe du bas,
  // qui recouvrait sinon le dernier bouton du menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('menu-open', open);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  // Le menu part du bas reel de l'en-tete. Une hauteur fixe ne suffit pas :
  // le bandeau de lancement pousse l'en-tete vers le bas, et le menu recouvrait
  // alors le logo. La valeur est remesuree si la fenetre change de taille.
  useEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom;
      if (bottom != null) menuRef.current?.style.setProperty('--menu-top', `${Math.max(0, Math.round(bottom))}px`);
    };
    place();
    window.addEventListener('resize', place);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', place);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    await logout();
    navigate('/');
  };

  const links = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/le-service', label: t.nav.service },
    { to: '/estimation', label: t.nav.estimation },
    { to: '/equipement', label: t.nav.equipment },
    { to: '/a-propos', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];
  if (user?.role === 'admin') links.push({ to: '/admin', label: t.nav.admin });
  if (user?.role === 'client') links.push({ to: '/espace-client', label: t.nav.account });

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`} ref={headerRef}>
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close} aria-label={t.nav.brandHome}>
          <img src={asset('/images/logo-vitiaero.png')} alt="VitiAero" className="brand-logo" width="120" height="40" />
        </Link>

        <nav className="nav" ref={navRef} aria-label={t.nav.menu}>
          <span className="nav-ind" ref={indRef} aria-hidden="true" />
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <LangSwitch />
          {user ? (
            <button type="button" className="nav-login" onClick={handleLogout}>{t.nav.logout}</button>
          ) : (
            <Link to="/connexion" className="nav-login">{t.nav.login}</Link>
          )}
          <Link to="/estimation" className="btn btn-outline btn-sm nav-cta">{t.common.requestEstimate}</Link>
        </div>

        <button
          type="button"
          className={`burger${open ? ' open' : ''}`}
          aria-label={t.nav.menu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu${open ? ' open' : ''}`} ref={menuRef} hidden={!open}>
        <nav className="mobile-links" aria-label={t.nav.menu}>
          {links.map((l, i) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close} style={{ '--i': i }}>{l.label}</NavLink>
          ))}
        </nav>
        <LangSwitch variant="inline" />
        {user ? (
          <button type="button" className="btn btn-outline" onClick={handleLogout}>{t.nav.logout}</button>
        ) : (
          <Link to="/connexion" className="btn btn-outline" onClick={close}>{t.nav.login}</Link>
        )}
        <Link to="/estimation" className="btn btn-primary" onClick={close}>{t.common.requestEstimate}</Link>
      </div>
    </header>
  );
}
