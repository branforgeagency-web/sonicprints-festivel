import { Link } from "react-router-dom";
import { imgUrl } from "../../context/SiteContext.jsx";
import { DEALER_CARDS } from "../../data/content.js";
import { Reveal, RevealGroup, RevealItem } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Magnetic from "../../components/fx/Magnetic.jsx";
import Tilt from "../../components/fx/Tilt.jsx";
import { SectionAura } from "../../components/fx/Decor.jsx";
import useMotionProfile from "../../anim/useMotionProfile.js";

export default function RetailSection() {
  const { reduced } = useMotionProfile();

  return (
    <section className="sec sec-cream" id="retail">
      <SectionAura tone="gold" mandala={false} />
      <div className="wrap">
        <div className="sec-head center">
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center">Retail &amp; dealer programme</div>
          </Reveal>
          <SplitText as="h2" text={"A festival counter,\nready to open."} shimmer={["counter,"]} />
          <Reveal variant="fadeUp" delay={0.16} as="p" duration={0.75}>
            Shelf-ready boxes with printed MRP, plus a branded Sonic Prints display stand that turns two
            square feet of a shop into a festival destination. Available to stationery shops, gift stores,
            dealers and distributors.
          </Reveal>
        </div>

        <RevealGroup className="dealer" stagger={0.12} amount={0.12}>
          {DEALER_CARDS.map((c) => (
            <RevealItem
              key={c.title}
              className="dcard"
              variant="cardIn"
              whileHover={reduced ? undefined : { y: -8 }}
            >
              <Tilt max={4} className="dcard-tilt">
                <div className="fx-sweep dcard-media">
                  <img src={imgUrl(c.img)} alt={c.title} loading="lazy" />
                </div>
              </Tilt>
              <div><h4>{c.title}</h4><p>{c.text}</p></div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal variant="fadeUp" delay={0.1} style={{ textAlign: "center", marginTop: 34 }}>
          <Magnetic>
            <Link to="/bulk" className="btn btn-gold btn-lg">Become a stockist or dealer</Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
