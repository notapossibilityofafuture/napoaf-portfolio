import { useEffect, useRef } from 'react';
import { animate, stagger, spring } from 'animejs';

export default function ProjectModal({ t, open, onClose }) {
  const contentRef = useRef(null);
  const closeBtnRef = useRef(null);
  const iframeRef = useRef(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (open) {
      if (closeBtnRef.current) closeBtnRef.current.focus();
      if (!reduceMotion && contentRef.current) {
        animate(contentRef.current.children, {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 650,
          delay: stagger(90),
          ease: spring({ stiffness: 160, damping: 13 })
        });
      }
    } else if (iframeRef.current) {
      // reset the iframe so the video stops playing when closed
      const src = iframeRef.current.src;
      iframeRef.current.src = src;
    }
  }, [open]);

  return (
    <div
      className={`project-modal${open ? ' open' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="undergroveModalTitle"
    >
      <div className="project-modal-bg" style={{ backgroundImage: "url('/undrtownnight.png')" }}></div>
      <div className="project-modal-overlay"></div>
      <button
        type="button"
        className="project-modal-close"
        onClick={onClose}
        aria-label={t.modal.close}
        ref={closeBtnRef}
      >
        ✕
      </button>
      <div className="project-modal-content" ref={contentRef}>
        <div className="project-modal-header">
          <div className="kicker">{t.modal.kicker}</div>
          <img className="project-logo" src="/undrlogoextended.png" alt="The Undergrove" id="undergroveModalTitle" />
        </div>

        <div className="video-wrap">
          <iframe
            ref={iframeRef}
            src="https://www.youtube.com/embed/LZPRcpSDEyo"
            title="Undergrove Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        <div className="project-lore">
          <p>{t.modal.p1}</p>
          <p>{t.modal.p2}</p>
        </div>
      </div>
    </div>
  );
}
