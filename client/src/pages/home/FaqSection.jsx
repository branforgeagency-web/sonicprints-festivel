import FaqAccordion from "../../components/FaqAccordion.jsx";
import { FAQ_ITEMS } from "../../data/content.js";
import { Reveal } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";

export default function FaqSection() {
  return (
    <section className="sec sec-cream" id="faq">
      <div className="wrap narrow">
        <div className="sec-head center">
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center">Good to know</div>
          </Reveal>
          <SplitText as="h2" text={"Questions, answered."} mode="char" stagger={0.03} />
        </div>
        <Reveal variant="fadeUp" delay={0.08}>
          <FaqAccordion items={FAQ_ITEMS} />
        </Reveal>
      </div>
    </section>
  );
}
