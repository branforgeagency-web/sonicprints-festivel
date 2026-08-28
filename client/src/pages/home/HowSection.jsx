import { motion } from "framer-motion";
import { HOW_STEPS } from "../../data/content.js";
import { Reveal, RevealGroup, RevealItem } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* Process steps count themselves in — the big numeral scales up first,
   the copy follows. */
export default function HowSection() {
  const { reduced } = useMotionProfile();

  return (
    <section className="sec" id="how">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center">How a bulk order works</div>
          </Reveal>
          <SplitText as="h2" text={"Four steps. Nineteen days."} mode="word" shimmer={["Nineteen"]} />
          <Reveal variant="fadeUp" delay={0.16} as="p" duration={0.75}>
            From first call to delivered boxes — the same process whether you need twenty-five kits or twenty-five thousand.
          </Reveal>
        </div>

        <RevealGroup className="steps4" stagger={0.1} amount={0.15}>
          {HOW_STEPS.map((s, i) => (
            <RevealItem
              key={s.title}
              className="st"
              variant="cardIn"
              whileHover={reduced ? undefined : { y: -6 }}
            >
              <motion.div
                className="big"
                initial={reduced ? false : { opacity: 0, scale: 0.6, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.08 + i * 0.05 }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.div>
              <motion.h4
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: 0.16 + i * 0.05, ease: EASE_SILK }}
              >
                {s.title}
              </motion.h4>
              <p>{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
