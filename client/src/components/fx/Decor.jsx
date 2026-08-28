import { motion } from "framer-motion";
import useMotionProfile from "../../anim/useMotionProfile.js";
import { EASE_INOUT, EASE_SILK } from "../../anim/tokens.js";

/* ============================================================
   Festive decoration
   Ambient pieces that give a section depth without competing
   with the products: soft radial light, blurred shapes, a very
   faint mandala, drifting petals, a diya whose flame breathes.
   Never all moving at once — each piece has its own slow tempo.
   ============================================================ */

/* --- soft light + mandala behind a section ------------------ */
export function SectionAura({ tone = "gold", mandala = true, className = "" }) {
  const { reduced } = useMotionProfile();

  return (
    <div className={`fx-aura fx-aura-${tone} ${className}`.trim()} aria-hidden="true">
      <motion.span
        className="fx-aura-blob fx-aura-blob-a"
        animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 13, repeat: Infinity, ease: EASE_INOUT }}
      />
      <motion.span
        className="fx-aura-blob fx-aura-blob-b"
        animate={reduced ? undefined : { scale: [1.08, 1, 1.08], opacity: [0.4, 0.62, 0.4] }}
        transition={{ duration: 17, repeat: Infinity, ease: EASE_INOUT }}
      />
      {mandala && (
        <motion.svg
          className="fx-aura-mandala"
          viewBox="0 0 200 200"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="100"
              rx="86"
              ry="26"
              transform={`rotate(${(i * 180) / 24} 100 100)`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
          <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="100" cy="100" r="28" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </motion.svg>
      )}
    </div>
  );
}

/* --- a small number of petals drifting through a section ---- */
const PETAL_SEEDS = [
  { left: 6, delay: 0, dur: 17, size: 15, drift: 34 },
  { left: 21, delay: 4.5, dur: 21, size: 11, drift: -28 },
  { left: 39, delay: 9, dur: 19, size: 17, drift: 40 },
  { left: 58, delay: 2.2, dur: 23, size: 12, drift: -36 },
  { left: 74, delay: 12, dur: 18, size: 14, drift: 26 },
  { left: 90, delay: 6.5, dur: 25, size: 10, drift: -22 }
];

export function Petals({ count = 6, className = "" }) {
  const { reduced, light } = useMotionProfile();
  if (reduced) return null;
  const seeds = PETAL_SEEDS.slice(0, light ? Math.min(3, count) : count);

  return (
    <div className={`fx-petals ${className}`.trim()} aria-hidden="true">
      {seeds.map((s, i) => (
        <span
          key={i}
          className="fx-petal"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size * 0.62,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            "--fx-drift": `${s.drift}px`
          }}
        />
      ))}
    </div>
  );
}

/* --- diya with a live flame -------------------------------- */
export function Diya({ size = 46, className = "", style }) {
  const { reduced } = useMotionProfile();

  return (
    <div className={`fx-diya ${className}`.trim()} style={{ width: size, ...style }} aria-hidden="true">
      <motion.span
        className="fx-diya-halo"
        animate={reduced ? undefined : { opacity: [0.45, 0.85, 0.55, 0.9, 0.45], scale: [1, 1.14, 1.04, 1.18, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: EASE_INOUT }}
      />
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <motion.path
          d="M32 12c4.6 5.4 7 9.4 7 13.2C39 29.6 36 32 32 32s-7-2.4-7-6.8C25 21.4 27.4 17.4 32 12Z"
          fill="url(#fx-flame)"
          style={{ transformOrigin: "32px 30px" }}
          animate={reduced ? undefined : { scaleY: [1, 1.12, 0.96, 1.08, 1], scaleX: [1, 0.94, 1.04, 0.97, 1] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: EASE_INOUT }}
        />
        <path d="M12 38h40c0 8-9 13-20 13s-20-5-20-13Z" fill="url(#fx-clay)" />
        <path d="M12 38h40" stroke="rgba(255,236,199,.5)" strokeWidth="1.4" />
        <defs>
          <linearGradient id="fx-flame" x1="32" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF2C4" />
            <stop offset="0.5" stopColor="#F9C25A" />
            <stop offset="1" stopColor="#E1742A" />
          </linearGradient>
          <linearGradient id="fx-clay" x1="12" y1="38" x2="52" y2="51" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C86B32" />
            <stop offset="1" stopColor="#8E4415" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* --- floating ornament wrapper (gentle breathing + drift) --- */
export function Float({ children, amplitude = 10, duration = 6, delay = 0, rotate = 0, className = "", style }) {
  const { reduced } = useMotionProfile();
  if (reduced) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={style}
      animate={{
        y: [0, -amplitude, 0],
        rotate: rotate ? [-rotate, rotate, -rotate] : 0
      }}
      transition={{ duration, repeat: Infinity, ease: EASE_INOUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/* --- "keep going" cue between hero and the collection ------- */
export function ScrollCue({ label = "Discover the collection", onClick }) {
  const { reduced } = useMotionProfile();

  return (
    <motion.button
      type="button"
      className="fx-scrollcue"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.1, ease: EASE_SILK }}
      aria-label={label}
    >
      <span>{label}</span>
      <motion.span
        className="fx-scrollcue-arrow"
        animate={reduced ? undefined : { y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: EASE_INOUT }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </motion.span>
    </motion.button>
  );
}
