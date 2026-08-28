/* ============================================================
   Sonic Prints — motion design tokens
   One vocabulary of easings, durations and variants so every
   animation on the site feels like it came from the same hand.
   ============================================================ */

/* Easings. "silk" is the house curve: a long, soft deceleration
   that reads as expensive rather than bouncy. */
export const EASE_SILK = [0.16, 1, 0.3, 1];
export const EASE_SOFT = [0.22, 0.61, 0.36, 1];
export const EASE_INOUT = [0.65, 0, 0.35, 1];
export const EASE_OUT = [0.33, 1, 0.68, 1];

export const SPRING_SOFT = { type: "spring", stiffness: 150, damping: 22, mass: 0.9 };
export const SPRING_SNAP = { type: "spring", stiffness: 340, damping: 30, mass: 0.6 };
export const SPRING_MAGNET = { type: "spring", stiffness: 190, damping: 15, mass: 0.35 };
export const SPRING_CURSOR = { type: "spring", stiffness: 500, damping: 38, mass: 0.35 };

export const DUR = { xs: 0.32, sm: 0.5, md: 0.72, lg: 0.95, xl: 1.25 };

/* Reveal variants. Every entrance on the site is one of these,
   so sections differ in character without drifting in style. */
export const VARIANTS = {
  fade:      { hidden: { opacity: 0 },                              show: { opacity: 1 } },
  fadeUp:    { hidden: { opacity: 0, y: 30 },                       show: { opacity: 1, y: 0 } },
  fadeDown:  { hidden: { opacity: 0, y: -22 },                      show: { opacity: 1, y: 0 } },
  fromLeft:  { hidden: { opacity: 0, x: -46 },                      show: { opacity: 1, x: 0 } },
  fromRight: { hidden: { opacity: 0, x: 46 },                       show: { opacity: 1, x: 0 } },
  zoomIn:    { hidden: { opacity: 0, scale: 0.94 },                 show: { opacity: 1, scale: 1 } },
  cardIn:    { hidden: { opacity: 0, y: 38, scale: 0.97 },          show: { opacity: 1, y: 0, scale: 1 } },
  iconPop:   { hidden: { opacity: 0, scale: 0.72, y: 14 },          show: { opacity: 1, scale: 1, y: 0 } },
  lineUp:    { hidden: { opacity: 0, y: 18 },                       show: { opacity: 1, y: 0 } },
  maskUp:    { hidden: { y: "115%" },                               show: { y: "0%" } },
  frameIn:   { hidden: { opacity: 0, scale: 1.05, filter: "blur(8px)" }, show: { opacity: 1, scale: 1, filter: "blur(0px)" } }
};

/* Reduced motion collapses everything to a plain, quick fade. */
export const REDUCED = { hidden: { opacity: 0 }, show: { opacity: 1 } };

export function revealTransition(duration = DUR.md, delay = 0, ease = EASE_SILK) {
  return { duration, delay, ease };
}
