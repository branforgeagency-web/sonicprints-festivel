import { useState } from "react";

export default function FaqAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="faq rv">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div className={`q${open ? " open" : ""}`} key={i}>
            <button type="button" onClick={() => setOpenIdx(open ? null : i)}>
              <span>{item.q}</span>
              <span className="ic">{open ? "−" : "+"}</span>
            </button>
            <div className="a" style={{ maxHeight: open ? "600px" : undefined }}>
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
