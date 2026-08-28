import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/* ============================================================
   Motion profile
   One place that answers: how much motion may this device take?
   - reduced : the visitor asked for less motion (OS setting)
   - fine    : a real mouse is present (tilt / magnet / cursor)
   - light   : phone, small screen or weak CPU — fewer particles,
               no 3D tilt, gentler parallax
   ============================================================ */

function readProfile() {
  if (typeof window === "undefined") {
    return { fine: false, light: true, width: 1200 };
  }
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const light = !fine || width < 900 || cores <= 4 || mem <= 4;
  return { fine, light, width };
}

export default function useMotionProfile() {
  const reduced = useReducedMotion();
  const [profile, setProfile] = useState(readProfile);

  useEffect(() => {
    let frame = 0;
    function onResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setProfile(readProfile()));
    }
    window.addEventListener("resize", onResize, { passive: true });
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setProfile(readProfile());
    mq.addEventListener?.("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  return {
    reduced: !!reduced,
    fine: profile.fine && !reduced,
    light: profile.light,
    width: profile.width,
    /* convenience gates used all over the site */
    allowTilt: profile.fine && !reduced,
    allowCursor: profile.fine && !reduced,
    allowParticles: !reduced,
    parallaxScale: reduced ? 0 : profile.light ? 0.45 : 1
  };
}
