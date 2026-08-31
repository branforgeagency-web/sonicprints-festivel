import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "../context/SiteContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Countdown from "./Countdown.jsx";
import Icon from "./Icon.jsx";
import Magnetic from "./fx/Magnetic.jsx";
import { useIntro } from "./fx/Intro.jsx";
import { EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";

const NAV_LINKS = [
  { label: "Kits", fullLabel: "Festival Kits & Mandap", hash: "kits", icon: "📦" },
  { label: "Who It's For", fullLabel: "Who It's For", hash: "audiences", icon: "👥" },
  { label: "Kids", fullLabel: "Bal Ganesh Kids Kit", hash: "kids", icon: "🎨" },
  { label: "Rotating Chakra", fullLabel: "Rotating Chakra Backdrop", hash: "chakra", icon: "☸" }
];

export default function Header() {
  const { config } = useSite();
  const { cartCount, openCart } = useCart();
  const [mobOpen, setMobOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { ready } = useIntro();
  const { reduced } = useMotionProfile();

  const showSetupBar = !config.whatsapp || config.whatsapp === "916382718655";

  /* Compact the bar once the reader has moved past the top of the page. */
  useEffect(() => {
    let frame = 0;
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setStuck(window.scrollY > 28);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* ScrollSpy: Track active homepage section as visitor scrolls */
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = NAV_LINKS.map((l) => l.hash);

    function checkActiveSection() {
      const scrollPosition = window.scrollY + 140;
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    }

    checkActiveSection();
    window.addEventListener("scroll", checkActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", checkActiveSection);
  }, [location.pathname]);

  useEffect(() => {
    /* Close mobile menu on Escape key & lock scroll */
    function onKeyDown(e) {
      if (e.key === "Escape") setMobOpen(false);
    }
    if (mobOpen) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobOpen]);

  /* Close mobile nav on route change */
  useEffect(() => {
    setMobOpen(false);
  }, [location.pathname]);

  function goToSection(hash) {
    setMobOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `/#${hash}`);
        return;
      }
    }
    navigate(`/#${hash}`);
  }

  return (
    <>
      {showSetupBar && (
        <div className="setupbar">
          <div className="wrap">
            <b>⚙ Setup required</b>
            <span>
              This site is running with placeholder contact details. Set them from the admin panel (or
              server/.env) — this bar disappears automatically once a real WhatsApp number is saved.
            </span>
          </div>
        </div>
      )}

      <div className="topbar">
        <div className="wrap">
          <span>Ganesh Chaturthi · Monday, 14 September 2026</span>
          <span className="sep">|</span>
          <Countdown iso={config.festivalDateISO} />
          <span className="sep">|</span>
          <span>{config.orderCutoffLabel}</span>
        </div>
      </div>

      <motion.nav
        className={`nav${stuck ? " is-stuck" : ""}${mobOpen ? " is-open" : ""}`}
        initial={reduced ? false : { y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: EASE_SILK, delay: reduced ? 0 : ready ? 0.05 : 0.85 }}
      >
        <div className="wrap">
          <Link className="logo" to="/" onClick={() => setMobOpen(false)}>
            <span className="mark"><span>ॐ</span></span>
            <span><b>Sonic Prints</b><i>Festival Collection</i></span>
          </Link>
          <div className="navlinks">
            {NAV_LINKS.map((l) => {
              const isCurrent = location.pathname === "/" && activeSection === l.hash;
              return (
                <a
                  key={l.hash}
                  href={`/#${l.hash}`}
                  className={isCurrent ? "on active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    goToSection(l.hash);
                  }}
                >
                  {l.label}
                </a>
              );
            })}
            <Link
              to="/bulk"
              className={location.pathname === "/bulk" ? "on active" : ""}
            >
              Bulk &amp; Dealers
            </Link>
          </div>
          <div className="navact">
            <Magnetic strength={0.24} cap={5} radius={70} className="fx-magnetic-cart">
              <button className="btn btn-gold btn-sm cartbtn" onClick={openCart} aria-label="Open cart">
                <Icon name="cart" size={20} /> <span className="cartbtn-label">Cart</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    className="cnt"
                    key={cartCount}
                    initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  >
                    {cartCount}
                  </motion.span>
                </AnimatePresence>
              </button>
            </Magnetic>
            <button
              className={`burger${mobOpen ? " open" : ""}`}
              aria-label={mobOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setMobOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobOpen && (
            <>
              <motion.div
                className="mob-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                id="mobile-nav-menu"
                className="mob"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mob-inner">
                  <div className="mob-links">
                    {NAV_LINKS.map((l) => {
                      const isCurrent = location.pathname === "/" && activeSection === l.hash;
                      return (
                        <a
                          key={l.hash}
                          href={`/#${l.hash}`}
                          className={`mob-item${isCurrent ? " on active" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            goToSection(l.hash);
                          }}
                        >
                          <div className="mob-item-left">
                            <span className="mob-item-icon">{l.icon}</span>
                            <span className="mob-item-text">{l.fullLabel || l.label}</span>
                          </div>
                          <span className="mob-arr">→</span>
                        </a>
                      );
                    })}
                    <Link
                      to="/bulk"
                      className={`mob-item mob-item-highlight${location.pathname === "/bulk" ? " on active" : ""}`}
                      onClick={() => setMobOpen(false)}
                    >
                      <div className="mob-item-left">
                        <span className="mob-item-icon">🏢</span>
                        <span className="mob-item-text">Bulk &amp; Corporate Orders</span>
                      </div>
                      <span className="mob-arr">→</span>
                    </Link>
                  </div>

                  <div className="mob-footer">
                    <span>✨ 100% Eco-friendly Ganesh Chaturthi 2026</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
