import { useSite } from "../context/SiteContext.jsx";
import { waLink } from "../utils/whatsapp.js";
import Icon from "./Icon.jsx";

export default function WhatsAppFab() {
  const { config } = useSite();
  const href = waLink(config.whatsapp, "Namaste Sonic Prints, I have a question about the Ganesh Festival Collection 2026.");
  return (
    <a className="fab" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <Icon name="whatsapp" />
    </a>
  );
}
