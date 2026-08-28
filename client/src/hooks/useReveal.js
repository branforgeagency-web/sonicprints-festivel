import { useEffect } from "react";

// Ports the original site's scroll-reveal behaviour: any element with the
// class "rv" fades/slides in once it enters the viewport (class "in" added).
// A MutationObserver keeps watching new elements as React renders them
// (route changes, async data arriving, accordions opening, etc).
export default function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    function observeAll() {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    }

    observeAll();
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: reveal anything still hidden after 4s (matches the
    // original static site's fallback behaviour).
    const fallback = setTimeout(() => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => el.classList.add("in"));
    }, 4000);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}
