import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext.jsx";
import KitCard from "../../components/KitCard.jsx";
import Icon from "../../components/Icon.jsx";
import { Reveal, RevealGroup } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Magnetic from "../../components/fx/Magnetic.jsx";
import { SectionAura, Petals } from "../../components/fx/Decor.jsx";

export default function KitsSection() {
  const { products, loading, error } = useSite();

  return (
    <section className="sec sec-collection" id="kits">
      <SectionAura tone="gold" />
      <Petals count={4} />
      <div className="wrap">
        <div className="sec-head-row">
          <div className="sec-head">
            <Reveal variant="fadeUp" duration={0.6}>
              <div className="eyebrow">The Sonic Festival Store</div>
            </Reveal>
            <SplitText as="h2" text={"Six kits.\nEvery kind of celebration."} shimmer={["kits."]} />
            <Reveal variant="fadeUp" delay={0.18} as="p" duration={0.7}>
              One design system, six audiences — a hostel room, a corporate floor, a classroom, a child&apos;s
              afternoon, a family living room and a shop counter that needs to look magnificent.
            </Reveal>
          </div>
          <Reveal variant="fadeUp" delay={0.24}>
            <Magnetic>
              <Link to="/bulk" className="btn btn-line">
                Buying 25 or more? <Icon name="arrow" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        {loading && <p style={{ color: "var(--muted)" }}>Loading the collection…</p>}
        {error && <p style={{ color: "var(--muted)" }}>{error}</p>}

        <RevealGroup className="kits" stagger={0.12} amount={0.08}>
          {products.map((p, i) => (
            <KitCard key={p.id} product={p} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
