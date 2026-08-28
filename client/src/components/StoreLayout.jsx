import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "./CartDrawer.jsx";
import WhatsAppFab from "./WhatsAppFab.jsx";
import { CartProvider } from "../context/CartContext.jsx";

import { IntroProvider } from "./fx/Intro.jsx";
import { ProductTransitionProvider } from "./fx/ProductTransition.jsx";
import CursorFx from "./fx/CursorFx.jsx";
import PageTransition from "./fx/PageTransition.jsx";

export default function StoreLayout() {
  return (
    <CartProvider>
      <IntroProvider>
        <ProductTransitionProvider>
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <CursorFx />
          <Header />
          <main id="main-content">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </ProductTransitionProvider>
      </IntroProvider>
    </CartProvider>
  );
}
