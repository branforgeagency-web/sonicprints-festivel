import { motion } from "framer-motion";
import { EASE_SILK, VARIANTS, REDUCED } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* ============================================================
   SplitText — elegant heading reveal
   Words (or characters, for very short headings) rise out from
   behind a mask, one after another. Use "\n" in the text for a
   deliberate line break. Never used on body paragraphs.
   ============================================================ */

export default function SplitText({
  as = "h2",
  text = "",
  mode = "word",
  delay = 0,
  stagger = 0.055,
  duration = 0.9,
  amount = 0.4,
  once = true,
  shimmer = [],
  className = "",
  ...rest
}) {
  const { reduced } = useMotionProfile();
  const Tag = motion[as] || motion.h2;
  const lines = String(text).split("\n");
  const shimmerSet = new Set(shimmer.map((w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")));

  /* Reduced motion: one quiet fade for the whole heading. */
  if (reduced) {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount }}
        variants={REDUCED}
        transition={{ duration: 0.25 }}
        style={{ display: "contents" }}
      >
        <Tag className={className} {...rest}>
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </Tag>
      </motion.div>
    );
  }

  let index = 0;

  return (
    <Tag
      className={`sp-split ${className}`.trim()}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } }
      }}
      {...rest}
    >
      {lines.map((line, li) => (
        <span className="sp-split-line" key={li}>
          {line.split(/(\s+)/).map((chunk, ci) => {
            if (!chunk.trim()) return <span key={ci}> </span>;
            const bare = chunk.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
            const isShimmer = shimmerSet.has(bare);
            const pieces = mode === "char" ? Array.from(chunk) : [chunk];
            return (
              <span className="sp-split-word" key={ci}>
                {pieces.map((piece, pi) => {
                  index += 1;
                  return (
                    <span className="sp-split-mask" key={pi}>
                      <motion.span
                        className={`sp-split-inner${isShimmer ? " sp-shimmer" : ""}`}
                        variants={VARIANTS.maskUp}
                        transition={{ duration, ease: EASE_SILK }}
                      >
                        {piece}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
