export default function ProjectsSection({ t, onOpenProject }) {
  return (
    <section className="grid" id="projects" style={{ marginTop: '18px' }} aria-label={t.lang === 'es' ? 'Enfoque y proyectos' : 'Focus and projects'}>
      <article className="card reveal half">
        <h2>{t.currentFocus.title}</h2>
        <div className="badges" style={{ marginTop: '10px' }}>
          {t.currentFocus.badges.map((b) => (
            <span className="badge" key={b}>{b}</span>
          ))}
        </div>
      </article>

      <article className="card reveal half">
        <h2>{t.projects.title}</h2>
        <div className="list">
          {t.projects.items.map((p) => (
            <article className="item" key={p.name}>
              <div className="label">{t.projects.formerLabel}</div>
              <div className={`value color-${p.color}`}>{p.name}</div>
              <p className="muted">{p.desc}</p>
            </article>
          ))}

          <article
            className="item project-trigger"
            id="undergroveItem"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onClick={onOpenProject}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenProject();
              }
            }}
          >
            <div className="label">{t.projects.formerLabel}</div>
            <div className="value">{t.projects.undergrove.name}</div>
            <p className="muted">{t.projects.undergrove.desc}</p>
            <span className="view-hint">{t.projects.undergrove.hint}</span>
          </article>
        </div>
      </article>
    </section>
  );
}
