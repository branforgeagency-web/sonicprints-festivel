import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite } from "../../context/SiteContext.jsx";
import { waLink } from "../../utils/whatsapp.js";
import SplitText from "../../components/fx/SplitText.jsx";
import { Reveal } from "../../components/fx/Reveal.jsx";
import Magnetic from "../../components/fx/Magnetic.jsx";
import { Petals } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* The finale: the glow opens outward, the words arrive, the button lands
   last and throws a small spark when you reach for it. */
const BURST = Array.from({ length: 10 }).map((_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return { bx: `${Math.cos(angle) * 62}px`, by: `${Math.sin(angle) * 62}px`, delay: i * 0.02 };
});

export default function ContactCta() {
  const { config } = useSite();
  const { reduced } = useMotionProfile();

  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <motion.div
          className="cta"
          initial={reduced ? false : { opacity: 0, scale: 0.965, y: 26 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.95, ease: EASE_SILK }}
        >
          <motion.span
            className="cta-glow"
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: EASE_SILK }}
          />
          <Petals count={3} />
          <div>
            <Reveal variant="fadeUp" delay={0.15} duration={0.6}>
              <div className="eyebrow light">Corporates · Schools · Colleges · Shops · Dealers · Communities</div>
            </Reveal>
            <SplitText as="h2" text={"Need 50, 500 or 5,000 kits?"} delay={0.22} shimmer={["5,000"]} />
            <Reveal variant="fadeUp" delay={0.42} as="p" duration={0.7}>
              Custom sleeves, company or school branding, employee greeting cards, certificates,
              dealer-ready displays and city-wise bulk supply. Tell us your audience and budget — we will
              send a rate card the same working day.
            </Reveal>
          </div>
          <Reveal variant="fadeUp" delay={0.62} className="cta-acts" duration={0.7}>
            <span className="cta-primary">
              {!reduced && (
                <span className="cta-burst" aria-hidden="true">
                  {BURST.map((b, i) => (
                    <span key={i} style={{ "--bx": b.bx, "--by": b.by, animationDelay: `${b.delay}s` }} />
                  ))}
                </span>
              )}
              <Magnetic strength={0.36} cap={9} radius={110}>
                <Link to="/bulk" className="btn btn-gold btn-lg">Request a quote</Link>
              </Magnetic>
            </span>
            <Magnetic strength={0.36} cap={9} radius={110}>
              <a
                className="btn btn-ghost btn-lg"
                href={waLink(config.whatsapp, "Namaste Sonic Prints, I have a question about the Ganesh Festival Collection 2026.")}
                target="_blank" rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
            </Magnetic>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
