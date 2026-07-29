import { Link } from 'react-router-dom';

export default function Header({ t, lang }) {
  return (
    <header className="topbar" aria-label={lang === 'es' ? 'Encabezado del sitio' : 'Site header'}>
      <div className="logo"><span className="logo-mark"></span> {t.logo}</div>
      <nav className="lang-switch" aria-label={lang === 'es' ? 'Selector de idioma' : 'Language selector'}>
        <Link to="/en" className={`button secondary${lang === 'en' ? ' active-lang' : ''}`}>English</Link>
        <Link to="/es" className={`button secondary${lang === 'es' ? ' active-lang' : ''}`}>Español</Link>
      </nav>
    </header>
  );
}
