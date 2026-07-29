export default function ExperienceMenu({ t, onOpenProject }) {
  return (
    <div className="grid">
      <section className="card half" aria-labelledby="discord-title">
        <h2 id="discord-title">{t.discord.title}</h2>
        <div className="list">
          {t.discord.servers.map((s) => (
            <article className="item" key={s.name}>
              <div className="label"><span className="rank">{s.rank}</span>{s.label}</div>
              <div className="value">{s.name}</div>
              <p className="muted">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card half" aria-labelledby="stats-title">
        <h2 id="stats-title">{t.stats.title}</h2>
        <div className="stats">
          {t.stats.boxes.map((b) => (
            <div className="stat-box" key={b.label}>
              <div className="big-number">{b.number}</div>
              <p className="muted">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card full" aria-labelledby="developer-title">
        <h2 id="developer-title">{t.developer.title}</h2>
        <p>{t.developer.p1}</p>
        <p style={{ marginTop: '14px' }}>
          {t.developer.p2prefix}
          <span
            className="project-link"
            id="undergroveLink"
            role="button"
            tabIndex={0}
            onClick={onOpenProject}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenProject();
              }
            }}
          >
            {t.developer.undergroveLink}
          </span>
          {t.developer.p2suffix}
        </p>

        <div className="badges" style={{ marginTop: '20px' }}>
          {t.techBadges.map((badge) => (
            <span className="badge" key={badge}>{badge}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
