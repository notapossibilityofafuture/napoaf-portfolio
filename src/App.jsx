import { useEffect, useRef, useState } from 'react';
import { content } from './data/content.js';
import PixelField from './components/PixelField.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import AboutSection from './components/AboutSection.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Footer from './components/Footer.jsx';
import { useMotionLayer } from './hooks/useMotionLayer.js';

export default function App({ lang }) {
  const t = content[lang];
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const experienceRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.pageTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.metaDescription);
  }, [lang, t]);

  // Handle experience menu open/close animation (max-height + opacity)
  useEffect(() => {
    const menu = experienceRef.current;
    if (!menu) return;
    if (experienceOpen) {
      menu.style.display = 'block';
      requestAnimationFrame(() => {
        menu.style.maxHeight = menu.scrollHeight + 'px';
        menu.style.opacity = '1';
      });
      const timer = setTimeout(() => {
        menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => clearTimeout(timer);
    } else {
      menu.style.maxHeight = '0px';
      menu.style.opacity = '0';
      const timer = setTimeout(() => {
        menu.style.display = 'none';
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [experienceOpen]);

  function openProject() {
    lastFocused.current = document.activeElement;
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    setModalOpen(false);
    document.body.style.overflow = '';
    if (lastFocused.current) lastFocused.current.focus();
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && modalOpen) closeProject();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  // All the anime.js motion (typing, reveals, magnetic buttons, particles, counters, scramble)
  useMotionLayer({ lang, experienceOpen, modalOpen });

  return (
    <>
      <PixelField />
      <div className="container">
        <Header t={t} lang={lang} />

        <main>
          <Hero
            t={t}
            experienceOpen={experienceOpen}
            onToggleExperience={() => setExperienceOpen((v) => !v)}
            onOpenProject={openProject}
            experienceRef={experienceRef}
          />

          <AboutSection t={t} />

          <ProjectsSection t={t} onOpenProject={openProject} />
        </main>

        <Footer t={t} />
      </div>

      <ProjectModal t={t} open={modalOpen} onClose={closeProject} />
    </>
  );
}
