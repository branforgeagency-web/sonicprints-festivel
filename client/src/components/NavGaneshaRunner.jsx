import { useCallback, useEffect, useRef, useState } from "react";
import useMotionProfile from "../anim/useMotionProfile.js";
import { assetUrl } from "../utils/assetHelper.js";

/* ============================================================
   NavGaneshaRunner
   Little Bal Ganesha and Mooshak run across the bottom edge of
   the navigation bar, left to right, and keep going.

   The characters themselves are a real 13-frame run cycle
   (an animated WebP cut from the source clip), so the arms
   swing and the bodies bob on their own. This component only
   has to carry them across the bar: one linear transform from
   off-stage left to off-stage right, a short breather, repeat.

   They sit *behind* the nav content, so nothing they do can
   swallow a click on a link or the cart button. Hovering holds
   them still where they are; tapping showers sparkles.
   ============================================================ */

const START_X = -14; // % of the bar — fully off-stage left
const END_X = 114; // % of the bar — fully off-stage right
const SPEED = 9; // % of the bar covered per second
const REST_BETWEEN_LAPS = 3800;
const FIRST_DELAY = 1200;

const CONFETTI = ["✨", "🌼", "🌸", "🪔", "🍬", "🌟"];

export default function NavGaneshaRunner() {
  const { reduced } = useMotionProfile();

  const [x, setX] = useState(START_X);
  const [dur, setDur] = useState(0);
  const [running, setRunning] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const stripRef = useRef(null);
  const pairRef = useRef(null);
  const xRef = useRef(START_X);
  const timers = useRef([]);
  const aliveRef = useRef(true);
  const heldRef = useRef(false);
  const crossRef = useRef(() => {});

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const moveTo = useCallback((next, ms) => {
    xRef.current = next;
    setDur(ms);
    setX(next);
  }, []);

  const popSparkles = useCallback(
    (count = 10) => {
      const batch = Array.from({ length: count }).map((_, i) => ({
        id: `${Date.now()}-${i}`,
        dx: (Math.random() - 0.5) * 84,
        dy: -(Math.random() * 30 + 18),
        size: Math.random() * 8 + 9,
        delay: Math.random() * 0.28,
        char: CONFETTI[Math.floor(Math.random() * CONFETTI.length)]
      }));
      setSparkles(batch);
      later(() => setSparkles([]), 1500);
    },
    [later]
  );

  /* ---- one crossing, left to right ----------------------------- */
  const cross = useCallback(() => {
    if (!aliveRef.current || heldRef.current) return;

    const travel = END_X - xRef.current;

    /* Already off-stage right (or nowhere to go): reset and wait. */
    if (travel <= 0.4) {
      setRunning(false);
      moveTo(START_X, 0);
      later(() => crossRef.current(), REST_BETWEEN_LAPS);
      return;
    }

    const runMs = Math.max(700, (travel / SPEED) * 1000);
    setRunning(true);
    moveTo(END_X, runMs);

    later(() => {
      if (!aliveRef.current || heldRef.current) return;
      setRunning(false);
      moveTo(START_X, 0);
      later(() => crossRef.current(), REST_BETWEEN_LAPS);
    }, runMs);
  }, [later, moveTo]);

  useEffect(() => {
    crossRef.current = cross;
  }, [cross]);

  useEffect(() => {
    if (reduced) return undefined;
    aliveRef.current = true;
    later(() => crossRef.current(), FIRST_DELAY);
    return () => {
      aliveRef.current = false;
      clearTimers();
    };
  }, [reduced, later, clearTimers]);

  /* Stop the parade while the tab is in the background — no point
     burning frames where nobody is watching. */
  useEffect(() => {
    if (reduced) return undefined;
    function onVis() {
      if (document.hidden) {
        aliveRef.current = false;
        clearTimers();
      } else if (!aliveRef.current) {
        aliveRef.current = true;
        moveTo(START_X, 0);
        later(() => crossRef.current(), 700);
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [reduced, clearTimers, later, moveTo]);

  /* ---- hover: hold them mid-stride ----------------------------- */
  function hold() {
    if (reduced || heldRef.current) return;
    const strip = stripRef.current;
    const pair = pairRef.current;
    if (!strip || !pair) return;

    const s = strip.getBoundingClientRect();
    const p = pair.getBoundingClientRect();
    if (!s.width) return;

    heldRef.current = true;
    clearTimers();
    moveTo(((p.left - s.left) / s.width) * 100, 0);
  }

  function release() {
    if (reduced || !heldRef.current) return;
    heldRef.current = false;
    later(() => crossRef.current(), 200);
  }

  function onPoke() {
    setCheer(true);
    popSparkles(14);
    later(() => setCheer(false), 900);
  }

  const sprite = assetUrl(reduced ? "/assets/img/nav-run-still.png" : "/assets/img/nav-run.webp");

  return (
    <div className="navrun" ref={stripRef} aria-hidden="true">
      <div
        ref={pairRef}
        className={`navrun-pair${running ? " is-running" : ""}${cheer ? " is-cheering" : ""}`}
        style={{ "--nr-x": `${x}%`, "--nr-dur": `${dur}ms` }}
        onMouseEnter={hold}
        onMouseLeave={release}
        onClick={onPoke}
      >
        <span className="navrun-shadow" />

        <span className="navrun-sprite">
          <img src={sprite} alt="" draggable="false" />
        </span>

        {sparkles.map((s) => (
          <span
            key={s.id}
            className="navrun-spark"
            style={{
              "--sx": `${s.dx}px`,
              "--sy": `${s.dy}px`,
              fontSize: `${s.size}px`,
              animationDelay: `${s.delay}s`
            }}
          >
            {s.char}
          </span>
        ))}
      </div>
    </div>
  );
}
