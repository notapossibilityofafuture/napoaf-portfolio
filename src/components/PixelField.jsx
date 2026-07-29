import { useEffect, useRef } from 'react';

export default function PixelField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    const CELL = 26;
    let w, h, cols, rows, cells = [];
    let raf;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      cells = [];
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          if (Math.random() < 0.045) {
            cells.push({ x, y, life: 0, speed: 0.006 + Math.random() * 0.01, delay: Math.random() * 400 });
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      cells.forEach((c) => {
        if (c.delay > 0) { c.delay -= 1; return; }
        c.life += c.speed;
        const t = c.life % 2;
        const alpha = t < 1 ? t : 2 - t;
        if (alpha > 0.01) {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.055})`;
          ctx.fillRect(c.x * CELL, c.y * CELL, CELL - 3, CELL - 3);
        }
      });
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      draw();
    } else {
      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="pixelField" ref={canvasRef} aria-hidden="true"></canvas>;
}
