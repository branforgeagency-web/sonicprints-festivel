import { useEffect, useState } from "react";

export default function Countdown({ iso }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!iso) return null;
  const target = new Date(iso).getTime();
  const d = target - now;

  if (d <= 0) return <span className="cd"><b>Ganpati Bappa Morya</b></span>;

  const day = Math.floor(d / 864e5);
  const hr = Math.floor(d / 36e5) % 24;
  const mn = Math.floor(d / 6e4) % 60;
  const sc = Math.floor(d / 1e3) % 60;
  const pad = (n) => String(n).padStart(2, "0");

  // The exact festival date is already spelled out in plain text right next
  // to this in the topbar, so the fast-ticking seconds are hidden from
  // screen readers rather than being announced (or re-announced) every tick.
  return (
    <span className="cd" aria-hidden="true">
      <b>{day}d</b>
      <b>{pad(hr)}h</b>
      <b>{pad(mn)}m</b>
      <b>{pad(sc)}s</b>
    </span>
  );
}
