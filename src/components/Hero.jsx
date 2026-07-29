import { useState } from 'react';
import ExperienceMenu from './ExperienceMenu.jsx';

export default function Hero({ t, experienceOpen, onToggleExperience, onOpenProject, experienceRef }) {
  const [copied, setCopied] = useState(false);

  function copyDiscord() {
    const username = 'notapossibilityofafuture';
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(username).then(done).catch(done);
    } else {
      done();
    }
  }

  return (
    <section className="hero" aria-labelledby="main-title">
      <div className="hero-content">
        <div className="kicker">{t.kicker}</div>

        <div className="profile-row">
          <img className="avatar" src="/pixter.gif" alt={t.lang === 'es' ? 'Avatar de Pixter' : 'Pixter avatar'} loading="eager" />
          <div className="status"><span className="status-dot"></span> {t.status}</div>
        </div>

        <h1 id="main-title"><span className="typing" id="typing" aria-label="pixter"></span></h1>

        <p className="hero-text" dangerouslySetInnerHTML={{ __html: t.heroText }} />

        <div className="actions">
          <button
            className="button"
            type="button"
            onClick={onToggleExperience}
            id="experienceButton"
            aria-expanded={experienceOpen}
            aria-controls="experienceMenu"
          >
            {experienceOpen ? t.hideExperience : t.viewExperience}
          </button>
          <a className="button secondary" href="#projects">{t.viewProjects}</a>
        </div>

        <div className="socials" aria-label={t.lang === 'es' ? 'Redes y enlaces' : 'Social links'}>
          <a href="https://guns.lol/napoaf" target="_blank" rel="noopener noreferrer">Guns.lol</a>
          <a href="https://github.com/notapossibilityofafuture" target="_blank" rel="noopener noreferrer">GitHub</a>
          <button type="button" className="discord-copy" onClick={copyDiscord} aria-label={t.socials.copyDiscordLabel}>
            {copied ? t.socials.copied : 'Discord'}
          </button>
          <a href="https://www.youtube.com/@napoaf" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>

        <div className="badges" aria-label={t.lang === 'es' ? 'Habilidades principales' : 'Key skills'}>
          {t.topSkills.map((skill) => (
            <span className="badge" key={skill}>{skill}</span>
          ))}
        </div>

        <div id="experienceMenu" ref={experienceRef}>
          <ExperienceMenu t={t} onOpenProject={onOpenProject} />
        </div>
      </div>
    </section>
  );
}
