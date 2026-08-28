import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Smooth-scrolls to the element whose id matches the current URL hash
// (e.g. /#kits). Used on Home so header links like "Kits" / "Who It's For"
// work both from other pages and while already on Home.
export default function useHashScroll(ready = true) {
  const location = useLocation();

  useEffect(() => {
    if (!ready) return;
    const id = location.hash.replace(/^#/, "");
    if (!id) {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return () => clearTimeout(t);
    }
  }, [location.hash, ready]);
}
