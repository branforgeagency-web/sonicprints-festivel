import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMotionProfile from "../../anim/useMotionProfile.js";
import { EASE_SILK } from "../../anim/tokens.js";

/* ============================================================
   Opening moment
   A short, branded curtain: the Sonic Prints mark settles, a
   golden glow forms behind it, a few motes rise, and the site
   is revealed. Roughly 1.2s, once per browser session, and
   skipped entirely for reduced motion. Everything downstream
   can read `ready` to time its own entrance.
   ============================================================ */

const SESSION_KEY = "sp-intro-seen-2026";
const IntroContext = createContext({ ready: true });

export function useIntro() {
  return useContext(IntroContext);
}

function seenThisSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function IntroProvider({ children }) {
  const { reduced } = useMotionProfile();
  const [show, setShow] = useState(() => !seenThisSession());
  const [ready, setReady] = useState(() => seenThisSession());

  useEffect(() => {
    if (!show) return undefined;
    if (reduced) {
      setShow(false);
      setReady(true);
      return undefined;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const done = setTimeout(() => {
      setShow(false);
      setReady(true);
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* private mode — just replay next time */ }
    }, 1150);

    /* safety net: never let the curtain trap the page */
    const failsafe = setTimeout(() => {
      setShow(false);
      setReady(true);
    }, 2600);

    return () => {
      clearTimeout(done);
      clearTimeout(failsafe);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, reduced]);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  const value = useMemo(() => ({ ready }), [ready]);

  return (
    <IntroContext.Provider value={value}>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fx-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: EASE_SILK } }}
            aria-hidden="true"
          >
            <motion.div
              className="fx-intro-stage"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 1.14, opacity: 0, transition: { duration: 0.55, ease: EASE_SILK } }}
              transition={{ duration: 0.6, ease: EASE_SILK }}
            >
              <motion.span
                className="fx-intro-glow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.85, 0.6], scale: [0.5, 1.15, 1] }}
                transition={{ duration: 1.1, ease: EASE_SILK, times: [0, 0.6, 1] }}
              />
              <motion.span
                className="fx-intro-ring"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.5, 1.9] }}
                transition={{ duration: 1.3, ease: EASE_SILK }}
              />
              <span className="fx-intro-mark"><span>ॐ</span></span>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.span
                  key={i}
                  className="fx-intro-mote"
                  style={{ left: `${18 + i * 13}%` }}
                  initial={{ opacity: 0, y: 26, scale: 0.4 }}
                  animate={{ opacity: [0, 0.9, 0], y: -46, scale: 1 }}
                  transition={{ duration: 1.15, delay: 0.16 + i * 0.07, ease: "easeOut" }}
                />
              ))}
            </motion.div>
            <motion.div
              className="fx-intro-word"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE_SILK }}
            >
              <b>Sonic Prints</b>
              <i>Festival Collection</i>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}

export default IntroProvider;
