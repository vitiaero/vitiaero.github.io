import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useI18n } from '../i18n/index.jsx';
import LangSwitch from './LangSwitch.jsx';
import { asset } from '../config.js';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    return () => window.removeEventListener('resize', place);
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    await logout();
    navigate('/');
  };

  const navLinks = (
    <>
      <NavLink to="/" end onClick={close}>{t.nav.home}</NavLink>
      <NavLink to="/le-service" onClick={close}>{t.nav.service}</NavLink>
      <NavLink to="/estimation" onClick={close}>{t.nav.estimation}</NavLink>
      <NavLink to="/equipement" onClick={close}>{t.nav.equipment}</NavLink>
      <NavLink to="/a-propos" onClick={close}>{t.nav.about}</NavLink>
      <NavLink to="/contact" onClick={close}>{t.nav.contact}</NavLink>
      {user?.role === 'admin' && <NavLink to="/admin" onClick={close}>{t.nav.admin}</NavLink>}
      {user?.role === 'client' && <NavLink to="/espace-client" onClick={close}>{t.nav.account}</NavLink>}
    </>
  );

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`} ref={headerRef}>
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close} aria-label={t.nav.brandHome}>
          <img src={asset('/images/logo-vitiaero.png')} alt="VitiAero" className="brand-logo" />
        </Link>

        <nav className="nav">{navLinks}</nav>

        <div className="nav-actions">
          <LangSwitch />
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>{t.nav.logout}</button>
          ) : (
            <Link to="/connexion" className="btn btn-ghost btn-sm">{t.nav.login}</Link>
          )}
          <Link to="/estimation" className="btn btn-primary btn-sm">{t.common.requestEstimate}</Link>
        </div>

        <button
          className={`burger${open ? ' open' : ''}`}
          aria-label={t.nav.menu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-menu${open ? ' open' : ''}`} ref={menuRef} hidden={!open}>
        {navLinks}
        <LangSwitch variant="inline" />
        {user ? (
          <button className="btn btn-outline" onClick={handleLogout}>{t.nav.logout}</button>
        ) : (
          <Link to="/connexion" className="btn btn-outline" onClick={close}>{t.nav.login}</Link>
        )}
        <Link to="/estimation" className="btn btn-primary" onClick={close}>{t.common.requestEstimate}</Link>
      </div>
    </header>
  );
}
