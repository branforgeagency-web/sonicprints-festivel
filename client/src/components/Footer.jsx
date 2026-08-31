import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite } from "../context/SiteContext.jsx";
import { waLink } from "../utils/whatsapp.js";
import { RevealGroup, RevealItem } from "./fx/Reveal.jsx";
import { EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";

/* The footer assembles itself: decoration, then the mark, then each
   column's links one after another. */
function LinkColumn({ title, children, delay = 0 }) {
  return (
    <RevealItem variant="fadeUp" transition={{ duration: 0.6, delay, ease: EASE_SILK }}>
      <h5>{title}</h5>
      {children}
    </RevealItem>
  );
}

export default function Footer() {
  const { config, products } = useSite();
  const { reduced } = useMotionProfile();

  const stagger = (i) => ({
    initial: reduced ? false : { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.45, delay: 0.06 * i, ease: EASE_SILK }
  });

  return (
    <footer>
      <span className="footer-aura" aria-hidden="true" />
      <div className="wrap">
        <RevealGroup className="fgrid" stagger={0.09} amount={0.1}>
          <RevealItem variant="fadeUp">
            <Link className="logo" to="/" style={{ color: "#fff" }}>
              <span className="mark"><span>ॐ</span></span>
              <span><b>Sonic Prints</b><i>Festival Collection</i></span>
            </Link>
            <p className="about">
              Complete Printing · Packaging · Festival Experiences. We design, print, pack and deliver
              complete festival experiences — for homes, schools, offices and retail counters across South India.
            </p>
          </RevealItem>

          <LinkColumn title="The Collection">
            {products.map((p, i) => (
              <motion.span key={p.id} style={{ display: "block" }} {...stagger(i)}>
                <Link to={`/kit/${p.slug}`}>{p.name}</Link>
              </motion.span>
            ))}
          </LinkColumn>

          <LinkColumn title="Buy in Bulk">
            {[
              "Corporates & Offices",
              "Schools",
              "Colleges & Academies",
              "Stationery & Gift Shops",
              "Dealers & Distributors"
            ].map((label, i) => (
              <motion.span key={label} style={{ display: "block" }} {...stagger(i)}>
                <Link to="/bulk">{label}</Link>
              </motion.span>
            ))}
          </LinkColumn>

          <LinkColumn title="Talk to us">
            {[
              <Link key="track" to="/track" style={{ color: "#F3D085", fontWeight: 600 }}>📦 Track Your Order</Link>,
              <a key="tel" href={`tel:${config.phoneHref}`}><span>{config.phone}</span></a>,
              <a key="mail" href={`mailto:${config.email}`}><span>{config.email}</span></a>,
              <a key="wa" href={waLink(config.whatsapp, "Namaste Sonic Prints, I have a question about the Ganesh Festival Collection 2026.")} target="_blank" rel="noopener noreferrer">WhatsApp us</a>,
              <a key="ig" href={config.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            ].map((node, i) => (
              <motion.span key={node.key} style={{ display: "block" }} {...stagger(i)}>
                {node}
              </motion.span>
            ))}
            <p className="about" style={{ marginTop: 10 }}>
              <span>{config.city}</span><br />Serving Tamil Nadu · Andhra Pradesh · Telangana · Karnataka · Maharashtra
            </p>
          </LinkColumn>
        </RevealGroup>

        <motion.div
          className="fbot"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_SILK }}
        >
          <span>© 2026 Sonic Prints. All rights reserved.</span>
          <span>Natural clay idols · Sealed prasadam · GST inclusive</span>
          <Link to="/admin" style={{ color: "rgba(239, 209, 153, 0.75)", textDecoration: "none", fontSize: "12px" }} title="Shortcut: Ctrl+Shift+A or Alt+A">
            ✦ Admin Suite <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 4, fontFamily: "sans-serif" }}>Ctrl+Shift+A</kbd>
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
