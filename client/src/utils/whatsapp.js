// Opens WhatsApp with a pre-filled message. Used for the "chat with us" bubble
// and as a fallback if the checkout/enquiry API call fails.
export function waLink(number, text) {
  const num = (number || "").replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(number, text) {
  const url = waLink(number, text);
  const w = window.open(url, "_blank", "noopener");
  if (!w) window.location.href = url;
}
