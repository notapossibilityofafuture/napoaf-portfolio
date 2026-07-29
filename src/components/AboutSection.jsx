export default function AboutSection({ t }) {
  return (
    <section className="grid" aria-label={t.lang === 'es' ? 'Sobre Pixter' : 'About Pixter'}>
      <article className="card reveal full">
        <h2>{t.about.title}</h2>
        <p style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: t.about.p1 }} />
        <p style={{ marginTop: '16px', fontSize: '18px' }}>{t.about.p2}</p>
        <p style={{ marginTop: '16px', fontSize: '18px' }}>{t.about.p3}</p>
      </article>
    </section>
  );
}
