import { useEffect, useRef } from 'react';

// Living dimensional backdrop: a slow particle/energy field on canvas with a
// cursor-reactive parallax glow. Pauses when the tab is hidden. Pure decoration.
export default function DimensionalBackground({ intensity = 'full' }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (intensity === 'reduced') return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf;
    let running = true;

    const count = intensity === 'calm' ? 36 : 70;
    let particles = [];
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.6 + 0.4,
        hue: Math.random() > 0.5 ? 276 : 190,
      }));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const dxm = a.x - mx;
        const dym = a.y - my;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 160) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.16 * (1 - dm / 160)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(109, 40, 217, ${0.18 * (1 - d / 110)})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle =
          p.hue === 276 ? 'rgba(167, 139, 220, 0.7)' : 'rgba(34, 211, 238, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      mouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    }
    function onVis() {
      running = !document.hidden;
      if (running) draw();
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 dimensional-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
