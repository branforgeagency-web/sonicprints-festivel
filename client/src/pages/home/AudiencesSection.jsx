import { Link } from "react-router-dom";
import { AUDIENCES } from "../../data/content.js";
import Icon from "../../components/Icon.jsx";
import { Reveal, RevealGroup, RevealItem } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import { SectionAura } from "../../components/fx/Decor.jsx";
import { motion } from "framer-motion";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* Features-style reveal: each card's icon pops in first, then its copy. */
export default function AudiencesSection() {
  const { reduced } = useMotionProfile();

  return (
    <section className="sec sec-dark on-dark" id="audiences">
      <SectionAura tone="dark" />
      <div className="wrap">
        <div className="sec-head center">
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center light">Built for six kinds of buyers</div>
          </Reveal>
          <SplitText
            as="h2"
            text={"Tell us who you are.\nWe will build the festival around you."}
            shimmer={["festival"]}
          />
          <Reveal variant="fadeUp" delay={0.18} as="p" duration={0.7}>
            Every segment gets its own kit mix, its own branding options, its own price slab and its own delivery plan.
          </Reveal>
        </div>

        <RevealGroup className="auds" stagger={0.1} amount={0.1}>
          {AUDIENCES.map((a) => (
            <RevealItem
              key={a.title}
              as={Link}
              variant="cardIn"
              className="aud"
              to="/bulk"
              whileHover={reduced ? undefined : { y: -8 }}
              transition={{ duration: 0.7, ease: EASE_SILK }}
            >
              <motion.div
                className="aud-ic"
                initial={reduced ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              >
                <Icon name={a.icon} />
              </motion.div>
              <h3>{a.title}</h3>
              <div className="line">{a.line}</div>
              <p>{a.text}</p>
              <ul>{a.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              <span className="go">Get a quote <Icon name="arrow" /></span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
