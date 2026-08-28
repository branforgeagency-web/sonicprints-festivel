import { useEffect, useRef } from "react";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* ============================================================
   Festive Falling Flowers & Petals Animation
   High-performance 60fps single-canvas atmosphere featuring
   vibrant Marigolds (Genda phool), Rose Petals (Gulab),
   Jasmine blossoms (Mogra), and fluttering flower petals.

   - Can be scoped to a parent section (e.g. Hero banner)
   - Flowers drift & tumble in 3D air currents
   - Pointer interaction gently sways flowers away
   - Scroll nudges falling speed smoothly
   - Optimized offscreen sprite caching for ultra-smooth rendering
   ============================================================ */

function createMarigoldSprite(primaryColor, secondaryColor, centerColor) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  // Outer petal layer (10 scalloped petals)
  ctx.fillStyle = primaryColor;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI * 2) / 10;
    const px = cx + Math.cos(angle) * 16;
    const py = cy + Math.sin(angle) * 16;
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner petal layer (8 petals)
  ctx.fillStyle = secondaryColor;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
    const px = cx + Math.cos(angle) * 10;
    const py = cy + Math.sin(angle) * 10;
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center core
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FFEE55";
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

function createRosePetalSprite() {
  const size = 48;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  const grad = ctx.createLinearGradient(-12, -18, 12, 18);
  grad.addColorStop(0, "#FF1744");
  grad.addColorStop(0.6, "#D50000");
  grad.addColorStop(1, "#880015");
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(16, -18, 20, 4, 0, 20);
  ctx.bezierCurveTo(-20, 4, -16, -18, 0, -18);
  ctx.closePath();
  ctx.fill();

  // Soft petal highlight
  ctx.fillStyle = "rgba(255, 210, 225, 0.4)";
  ctx.beginPath();
  ctx.ellipse(-4, -6, 5, 9, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  return c;
}

function createJasmineSprite() {
  const size = 48;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  // 5 white-cream petals
  ctx.fillStyle = "#FFFDF0";
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -12, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Yellow center
  ctx.fillStyle = "#FFC107";
  ctx.beginPath();
  ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

function createMarigoldPetalSprite() {
  const size = 36;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  const grad = ctx.createLinearGradient(-8, -12, 8, 12);
  grad.addColorStop(0, "#FFC107");
  grad.addColorStop(0.6, "#FF6D00");
  grad.addColorStop(1, "#E65100");
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 14, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  return c;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function FestiveParticles({ opacity = 0.95, scoped = false }) {
  const canvasRef = useRef(null);
  const { allowParticles, light } = useMotionProfile();

  useEffect(() => {
    if (!allowParticles) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const parent = scoped ? canvas.parentElement : null;

    // Cache pre-rendered flower sprites
    const sprites = {
      marigold_orange: createMarigoldSprite("#FF6D00", "#FFA000", "#BF360C"),
      marigold_yellow: createMarigoldSprite("#FFB300", "#FFEE55", "#E65100"),
      rose_petal: createRosePetalSprite(),
      jasmine: createJasmineSprite(),
      marigold_petal: createMarigoldPetalSprite()
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let raf = 0;
    let running = true;
    let lastScroll = window.scrollY;
    let scrollPush = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    function makeFlower(seedTop) {
      const depth = rand(0.45, 1.0);
      const types = ["marigold_orange", "marigold_yellow", "rose_petal", "jasmine", "marigold_petal"];
      const weights = [0.25, 0.25, 0.25, 0.15, 0.10];

      let roll = Math.random();
      let type = types[0];
      let acc = 0;
      for (let i = 0; i < types.length; i++) {
        acc += weights[i];
        if (roll < acc) {
          type = types[i];
          break;
        }
      }

      const isPetal = type === "rose_petal" || type === "marigold_petal";
      const baseSize = type.startsWith("marigold_") && !isPetal
        ? rand(20, 36)
        : type === "jasmine"
        ? rand(18, 28)
        : rand(16, 26);

      const size = baseSize * depth;

      return {
        type,
        depth,
        size,
        x: rand(0, width),
        y: seedTop ? rand(-height * 0.3, -30) : rand(-40, height),
        vy: (isPetal ? rand(0.6, 1.3) : rand(0.45, 1.0)) * depth,
        sway: rand(0, Math.PI * 2),
        swaySpeed: rand(0.008, 0.022),
        swayAmp: rand(14, 42) * depth,
        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.025, 0.025),
        tumble: rand(0, Math.PI * 2),
        tumbleSpeed: isPetal ? rand(0.02, 0.045) : rand(0.008, 0.02),
        alpha: rand(0.72, 0.98),
        ox: 0,
        oy: 0
      };
    }

    function build() {
      const area = width * height;
      const scale = light ? 0.5 : 1;
      const count = Math.round(Math.min(65, Math.max(18, area / 22000)) * scale);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(makeFlower(false));
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      const scrollDrift = scrollPush;
      scrollPush *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.sway += p.swaySpeed;
        p.rot += p.rotSpeed;
        p.tumble += p.tumbleSpeed;

        p.y += p.vy + scrollDrift * p.depth * 0.4;
        p.x += Math.sin(p.sway) * 0.45;

        // Pointer reaction: gentle displacement when mouse gets near
        if (pointer.active) {
          const parentOffsetLeft = parent ? parent.getBoundingClientRect().left : 0;
          const parentOffsetTop = parent ? parent.getBoundingClientRect().top : 0;
          const px = pointer.x - parentOffsetLeft;
          const py = pointer.y - parentOffsetTop;

          const dx = p.x + p.ox - px;
          const dy = p.y + p.oy - py;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 22500 && dist2 > 1) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / 150) * 1.8;
            p.ox += (dx / dist) * force;
            p.oy += (dy / dist) * force;
          }
        }

        p.ox *= 0.94;
        p.oy *= 0.94;

        const x = p.x + p.ox + Math.sin(p.sway) * p.swayAmp * 0.15;
        const y = p.y + p.oy;

        // Wrap particles when falling past bottom of container
        if (y > height + p.size + 20) {
          p.y = -p.size - 20;
          p.x = rand(0, width);
          p.ox = 0;
          p.oy = 0;
        }

        if (x < -60) p.x = width + 40;
        if (x > width + 60) p.x = -40;

        const tumbleScaleY = Math.cos(p.tumble);
        const spriteImg = sprites[p.type];

        if (spriteImg) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.rot);
          ctx.scale(1, tumbleScaleY);
          ctx.globalAlpha = p.alpha;
          ctx.drawImage(spriteImg, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function onPointerMove(e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }
    function onScroll() {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      scrollPush = Math.max(-8, Math.min(8, scrollPush + delta * 0.04));
    }
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }

    let resizeTimer = 0;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [allowParticles, light, scoped]);

  if (!allowParticles) return null;

  const canvasStyle = scoped
    ? { opacity, position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }
    : { opacity };

  return <canvas ref={canvasRef} className={scoped ? "fx-particles-scoped" : "fx-particles"} style={canvasStyle} aria-hidden="true" />;
}
