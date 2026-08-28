// Small inline-SVG icon set, ported 1:1 from the original static site (stroke icons, 24x24 viewBox).
const PATHS = {
  office: (
    <>
      <path d="M3 21h18M5 21V6l7-3 7 3v15" />
      <path d="M9 21v-5h6v5M9 9h.01M12 9h.01M15 9h.01M9 12.5h.01M12 12.5h.01M15 12.5h.01" />
    </>
  ),
  school: (
    <>
      <path d="M12 3 2 8l10 5 10-5-10-5z" />
      <path d="M6 10.4V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.6" />
      <path d="M21 8.5V14" />
    </>
  ),
  college: (
    <>
      <path d="M3 21h18M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6M10 11h4" />
    </>
  ),
  shop: (
    <>
      <path d="M3 9h18l-1 11a1.6 1.6 0 0 1-1.6 1.4H5.6A1.6 1.6 0 0 1 4 20L3 9z" />
      <path d="M3 9 5 3h14l2 6" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </>
  ),
  dealer: (
    <>
      <path d="M2 7h11v10H2zM13 10h4.6l3.4 3.2V17h-8z" />
      <circle cx="6.5" cy="18.5" r="1.6" />
      <circle cx="17" cy="18.5" r="1.6" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
  check: <polyline points="20 6 9 17 4 12" />,
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2.4 12.1a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  whatsapp: (
    <>
      <path
        fill="currentColor"
        stroke="none"
        d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.9 5.2.8.3 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.8 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.1-.3-.2-.6-.4z"
      />
      <path
        fill="currentColor"
        stroke="none"
        d="M12 2A10 10 0 0 0 3.5 17.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-2.9.9.9-2.8-.2-.3a8.2 8.2 0 1 1 6.9 3.6z"
      />
    </>
  )
};

export default function Icon({ name, size = 24, className = "" }) {
  const body = PATHS[name];
  if (!body) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {body}
    </svg>
  );
}
