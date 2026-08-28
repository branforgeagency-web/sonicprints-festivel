import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* ============================================================
   Product detail reveal
   Clicking a kit doesn't just swap pages: the photo you clicked
   lifts off the card, the page behind it dims, and the photo
   travels into place as the product page's hero image. The
   product page registers where its gallery landed, so the two
   images meet exactly; if it is still loading, the flight ends
   at a sensible centred position instead.
   ============================================================ */

const Ctx = createContext({
  begin: () => {},
  registerTarget: () => {},
  active: false
});

export function useProductTransition() {
  return useContext(Ctx);
}

function fallbackTarget() {
  const w = Math.min(560, window.innerWidth * 0.72);
  const top = Math.min(window.innerHeight * 0.22, 200);
  return { left: (window.innerWidth - w) / 2, top, width: w, height: w };
}

export function ProductTransitionProvider({ children }) {
  const { reduced } = useMotionProfile();
  const [flight, setFlight] = useState(null); // { src, alt, from, to }
  const [phase, setPhase] = useState("idle"); // idle | flying | landing
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setFlight(null);
  }, [clearTimers]);

  const begin = useCallback(
    (imgEl, alt) => {
      if (reduced || !imgEl) return;
      const rect = imgEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      clearTimers();
      setFlight({
        src: imgEl.currentSrc || imgEl.src,
        alt: alt || "",
        from: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        to: null
      });
      setPhase("flying");

      /* if the product page hasn't reported its gallery in time,
         land on a sensible centred position anyway */
      timers.current.push(
        setTimeout(() => {
          setFlight((f) => (f && !f.to ? { ...f, to: fallbackTarget() } : f));
        }, 620)
      );
      /* hard stop — the overlay can never outstay its welcome */
      timers.current.push(setTimeout(finish, 2200));
    },
    [reduced, clearTimers, finish]
  );

  const registerTarget = useCallback((el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    setFlight((f) =>
      f && !f.to
        ? { ...f, to: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } }
        : f
    );
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /* once a destination exists, hold briefly then hand over */
  useEffect(() => {
    if (!flight?.to) return undefined;
    const t = setTimeout(() => setPhase("landing"), 480);
    const t2 = setTimeout(finish, 900);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [flight?.to, finish]);

  const value = useMemo(() => ({ begin, registerTarget, active: phase !== "idle" }), [begin, registerTarget, phase]);

  let transform = { x: 0, y: 0, scale: 1 };
  if (flight?.to) {
    const s = flight.to.width / flight.from.width;
    const fromCx = flight.from.left + (flight.from.width * s) / 2;
    const fromCy = flight.from.top + (flight.from.height * s) / 2;
    transform = {
      x: flight.to.left + flight.to.width / 2 - fromCx,
      y: flight.to.top + flight.to.height / 2 - fromCy,
      scale: s
    };
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {flight && (
          <motion.div className="fx-flight" key="flight" aria-hidden="true">
            <motion.div
              className="fx-flight-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "landing" ? 0 : 0.62 }}
              exit={{ opacity: 0 }}
              transition={{ duration: phase === "landing" ? 0.4 : 0.3, ease: EASE_SILK }}
            />
            <motion.img
              className="fx-flight-img"
              src={flight.src}
              alt=""
              style={{
                left: flight.from.left,
                top: flight.from.top,
                width: flight.from.width,
                height: flight.from.height,
                transformOrigin: "top left"
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, borderRadius: 24 }}
              animate={{
                x: transform.x,
                y: transform.y,
                scale: transform.scale,
                opacity: phase === "landing" ? 0 : 1,
                borderRadius: flight.to ? 30 : 24
              }}
              exit={{ opacity: 0 }}
              transition={{
                x: { duration: 0.62, ease: EASE_SILK },
                y: { duration: 0.62, ease: EASE_SILK },
                scale: { duration: 0.62, ease: EASE_SILK },
                borderRadius: { duration: 0.62, ease: EASE_SILK },
                opacity: { duration: phase === "landing" ? 0.38 : 0.2, ease: EASE_SILK }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export default ProductTransitionProvider;
