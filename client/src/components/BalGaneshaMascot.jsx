import { useState, useEffect } from "react";

const QUOTES = [
  "Jai Ganesh! 🐘✨ Welcome to Sonic Prints!",
  "Let's color & make Bappa together! 🎨💛",
  "Tap me to rain festive sparkles! ✨🌸",
  "Did you know? Modak is my favorite sweet! 🍬😋",
  "May Little Bappa bring big joy to your home! 🙏✨",
  "Check out the kids activity kit below! 📦🎁"
];

export default function BalGaneshaMascot() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [isWiggling, setIsWiggling] = useState(false);
  const [magicMode, setMagicMode] = useState(true);
  const [entered, setEntered] = useState(false);

  // Little entrance hop the first time Bappa mounts, so he feels like he
  // "arrives" on the page rather than just appearing.
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Auto speech bubble popups for kids — tapers off after a handful of
  // cycles so Bappa doesn't keep chattering at someone browsing for a while.
  // A tap on him (triggerSparkles) resets the count, so he's never fully mute.
  const AUTO_POP_LIMIT = 4;
  const [autoPopsLeft, setAutoPopsLeft] = useState(AUTO_POP_LIMIT);

  useEffect(() => {
    if (autoPopsLeft <= 0) return undefined;
    const speechInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
      setShowSpeech(true);
      setAutoPopsLeft((n) => n - 1);
      setTimeout(() => setShowSpeech(false), 4500);
    }, 9000);

    return () => clearInterval(speechInterval);
  }, [autoPopsLeft > 0]);

  const triggerSparkles = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);

    setShowSpeech(true);
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    setAutoPopsLeft(AUTO_POP_LIMIT);

    // Create burst of sparkles
    const newSparkles = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 260,
      y: -Math.random() * 200 - 30,
      size: Math.random() * 18 + 12,
      emoji: ["✨", "🌸", "🌼", "🌺", "🍬", "🌟", "🪔"][Math.floor(Math.random() * 7)],
      duration: Math.random() * 0.8 + 0.7
    }));

    setSparkles(newSparkles);

    setTimeout(() => {
      setSparkles([]);
    }, 1500);
  };

  return (
    <div className={`ganesha-mascot-wrapper${entered ? " entered" : ""}`}>
      {/* Speech Bubble */}
      <div
        className={`ganesha-speech-bubble ${showSpeech ? "active" : ""}`}
        role="status"
        aria-live="polite"
      >
        <p>{QUOTES[quoteIndex]}</p>
        <button
          className="speech-close"
          aria-label="Dismiss message"
          onClick={(e) => {
            e.stopPropagation();
            setShowSpeech(false);
          }}
        >
          ×
        </button>
      </div>

      {/* Sparkles Particle Burst */}
      <div aria-hidden="true">
      {sparkles.map((sp) => (
        <span
          key={sp.id}
          className="mascot-sparkle-item"
          style={{
            transform: `translate(${sp.x}px, ${sp.y}px)`,
            fontSize: `${sp.size}px`,
            animationDuration: `${sp.duration}s`
          }}
        >
          {sp.emoji}
        </span>
      ))}
      </div>

      {/* Animated Cute Bal Ganesha Character Button */}
      <button
        className={`ganesha-mascot-btn ${isWiggling ? "wiggle-anim" : ""}`}
        onClick={triggerSparkles}
        aria-label="Interactive Little Bal Ganesha Companion"
        title="Tap Bal Ganesha for Magic!"
      >
        <svg
          viewBox="0 0 120 120"
          className="ganesha-svg-avatar"
          width="90"
          height="90"
        >
          <defs>
            <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="dhotiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Glowing Aura Halo */}
          <circle cx="60" cy="55" r="48" fill="url(#auraGlow)" className="halo-pulse" />

          {/* Ears */}
          <ellipse cx="28" cy="55" rx="16" ry="22" fill="#fde68a" className="ear-left" />
          <ellipse cx="28" cy="55" rx="10" ry="15" fill="#fbcfe8" />
          <ellipse cx="92" cy="55" rx="16" ry="22" fill="#fde68a" className="ear-right" />
          <ellipse cx="92" cy="55" rx="10" ry="15" fill="#fbcfe8" />

          {/* Head & Body */}
          <ellipse cx="60" cy="58" rx="28" ry="26" fill="url(#bodyGrad)" />

          {/* Cute Big Eyes (gentle periodic blink) */}
          <g className="ganesha-eyes-blink">
            <circle cx="48" cy="50" r="5.5" fill="#1e293b" />
            <circle cx="46.5" cy="48.5" r="2" fill="#ffffff" />
            <circle cx="72" cy="50" r="5.5" fill="#1e293b" />
            <circle cx="70.5" cy="48.5" r="2" fill="#ffffff" />
          </g>

          {/* Tilak / Chandan on forehead */}
          <path d="M 57 38 Q 60 32 63 38 Q 60 42 57 38 Z" fill="#dc2626" />
          <circle cx="60" cy="43" r="2" fill="#fbbf24" />

          {/* Cute Trunk with Modak */}
          <path
            d="M 60 56 Q 60 74 72 74 Q 78 74 76 68 Q 72 68 68 70"
            fill="none"
            stroke="#fde68a"
            strokeWidth="8"
            strokeLinecap="round"
            className="trunk-wave"
          />
          {/* Golden Modak on Trunk Tip */}
          <path d="M 76 64 L 79 70 L 73 70 Z" fill="#fbbf24" className="modak-sparkle" />

          {/* Dhoti & Crown */}
          <path d="M 38 78 Q 60 72 82 78 L 78 96 Q 60 102 42 96 Z" fill="url(#dhotiGrad)" />
          {/* Golden Mukut (Crown) */}
          <path d="M 42 36 L 60 14 L 78 36 Q 60 32 42 36 Z" fill="url(#crownGrad)" />
          <circle cx="60" cy="24" r="3.5" fill="#dc2626" />
          <circle cx="50" cy="30" r="2" fill="#ffffff" />
          <circle cx="70" cy="30" r="2" fill="#ffffff" />

          {/* Mouse Friend Mooshak on side */}
          <g transform="translate(86, 76) scale(0.65)" className="mooshak-bounce">
            <ellipse cx="15" cy="18" rx="10" ry="8" fill="#94a3b8" />
            <circle cx="10" cy="12" r="5" fill="#cbd5e1" />
            <circle cx="10" cy="12" r="3" fill="#f472b6" />
            <circle cx="21" cy="16" r="1.5" fill="#0f172a" />
            <path d="M 24 18 Q 28 22 25 25" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        </svg>

        <span className="mascot-label">Tap Bappa! ✨</span>
      </button>
    </div>
  );
}
