import { useEffect, useRef, useCallback } from "react";
import useMotionProfile from "../anim/useMotionProfile.js";

/* ============================================================
   NavbarFirecrackers (Slow Motion Edition)
   Festive dual-corner firecracker blast animation for the navbar.
   Features graceful slow-motion firecracker bursts, floating golden
   embers, softly expanding shockwave halos, and glowing spark
   trails from both left and right corners of the navigation bar.
   ============================================================ */

const FESTIVE_COLORS = [
  "#FFD700", // Bright Gold
  "#FFA000", // Warm Amber
  "#FF6D00", // Festival Saffron
  "#FF1744", // Crimson Red
  "#00E676", // Emerald Green
  "#00E5FF", // Electric Cyan
  "#FF4081", // Radiant Pink
  "#FFF9C4", // Sparkling White-Gold
  "#FFEA00"  // Solar Yellow
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function NavbarFirecrackers() {
  const canvasRef = useRef(null);
  const { reduced } = useMotionProfile();

  const launchExplosion = useCallback((x, y, options = {}) => {
    const {
      count = rand(28, 42),
      speed = rand(1.2, 2.6), // Slow-motion burst velocity
      colorPalette = FESTIVE_COLORS,
      spreadAngle = Math.PI * 1.3,
      baseAngle = 0
    } = options;

    const particles = [];
    const mainColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spreadAngle;
      const vel = rand(0.5, speed);
      const color = Math.random() > 0.3 ? mainColor : colorPalette[Math.floor(Math.random() * colorPalette.length)];
      const size = rand(2.2, 4.8);
      const maxLife = rand(80, 130); // Extended slow-motion float duration

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        color,
        size,
        alpha: 1,
        life: 0,
        maxLife,
        gravity: rand(0.015, 0.035), // Gentle float gravity
        drag: rand(0.978, 0.992),    // Smooth air resistance
        twinkle: Math.random() > 0.25,
        twinkleSpeed: rand(0.08, 0.18)
      });
    }

    // Slow expanding shockwave halo
    const shockwave = {
      x,
      y,
      radius: 1,
      maxRadius: rand(28, 48),
      color: mainColor,
      alpha: 0.75
    };

    return { particles, shockwave };
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let activeParticles = [];
    let activeShockwaves = [];
    let fountainFlares = [];
    let raf = 0;
    let running = true;
    let blastTimer = 0;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createCornerBlast(corner = "left", intensity = "normal") {
      const isLeft = corner === "left";
      // Position emitter right at outer corners
      const originX = isLeft ? rand(2, 16) : rand(width - 16, width - 2);
      const originY = rand(height * 0.2, height * 0.8);

      const baseAngle = isLeft ? rand(0.1, 0.85) : rand(Math.PI - 0.85, Math.PI - 0.1);
      const count = intensity === "grand" ? rand(45, 65) : rand(24, 38);
      const speed = intensity === "grand" ? rand(1.8, 3.2) : rand(1.1, 2.3);

      const { particles, shockwave } = launchExplosion(originX, originY, {
        count,
        speed,
        baseAngle,
        spreadAngle: Math.PI * 1.35
      });

      activeParticles.push(...particles);
      activeShockwaves.push(shockwave);

      // Slow-motion golden fountain sparkles
      for (let s = 0; s < 6; s++) {
        fountainFlares.push({
          x: originX,
          y: originY,
          vx: isLeft ? rand(0.4, 1.8) : rand(-1.8, -0.4),
          vy: rand(-1.5, 0.4),
          color: FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)],
          alpha: 1,
          size: rand(1.6, 3.4),
          life: 0,
          maxLife: rand(55, 90)
        });
      }
    }

    // Schedule relaxed, graceful slow-motion firecracker bursts
    let cycle = 0;
    function scheduleNextBlast() {
      if (!running) return;
      cycle++;
      const isGrand = cycle % 4 === 0;

      if (isGrand) {
        // Dual simultaneous blast from both corners
        createCornerBlast("left", "grand");
        createCornerBlast("right", "grand");
      } else if (cycle % 2 === 0) {
        createCornerBlast("left", "normal");
      } else {
        createCornerBlast("right", "normal");
      }

      // Relaxed interval for slow-motion observation (2.5s - 4.2s)
      const nextInterval = isGrand ? rand(3200, 4400) : rand(2200, 3400);
      blastTimer = setTimeout(scheduleNextBlast, nextInterval);
    }

    function render() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Slow expanding shockwave rings
      for (let w = activeShockwaves.length - 1; w >= 0; w--) {
        const sw = activeShockwaves[w];
        sw.radius += (sw.maxRadius - sw.radius) * 0.05 + 0.3;
        sw.alpha *= 0.94;

        if (sw.alpha > 0.02) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.globalAlpha = sw.alpha * 0.6;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.restore();
        } else {
          activeShockwaves.splice(w, 1);
        }
      }

      // 2. Slow floating fountain flares
      for (let f = fountainFlares.length - 1; f >= 0; f--) {
        const flare = fountainFlares[f];
        flare.life++;
        flare.x += flare.vx;
        flare.y += flare.vy;
        flare.vy += 0.022; // Low slow-mo gravity
        flare.alpha = 1 - flare.life / flare.maxLife;

        if (flare.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = flare.alpha;
          ctx.fillStyle = flare.color;
          ctx.beginPath();
          ctx.arc(flare.x, flare.y, flare.size * flare.alpha, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          fountainFlares.splice(f, 1);
        }
      }

      // 3. Slow-motion Main Blast Particles & Floating Embers
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.life++;
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.alpha > 0) {
          ctx.save();
          const currentAlpha = p.twinkle ? p.alpha * (0.4 + Math.sin(p.life * p.twinkleSpeed) * 0.6) : p.alpha;
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;

          // Spark head
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.7, p.size * p.alpha), 0, Math.PI * 2);
          ctx.fill();

          // Soft comet tail
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2.8, p.y - p.vy * 2.8);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(0.4, p.size * 0.45 * p.alpha);
          ctx.stroke();

          ctx.restore();
        } else {
          activeParticles.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(render);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
        clearTimeout(blastTimer);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
        scheduleNextBlast();
      }
    }

    let resizeTimer = 0;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }

    resize();
    render();
    // Initial gentle burst right after load
    setTimeout(() => {
      createCornerBlast("left", "grand");
      setTimeout(() => createCornerBlast("right", "grand"), 300);
    }, 500);
    blastTimer = setTimeout(scheduleNextBlast, 1800);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(blastTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, launchExplosion]);

  if (reduced) return null;

  return (
    <div className="nav-firecrackers-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="nav-firecrackers-canvas" />
    </div>
  );
}
