// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
"use client";

// The thin client layer of a chart (brief §3, §4). No layout code: every SVG comes rendered from the server.
// - entrance: once, when the chart scrolls into view (motion.css plays on .cm-play);
// - hover: the datum under the pointer stays, the rest steps back;
// - update / live: with more than one state, the next server-rendered state replaces the current one and every mark
//   morphs from its old geometry to its new one (paths by their d, rects by x / y / size, ellipses by centre and
//   radii, texts by position, fills by colour); marks that do not pair up cross-fade. Live states advance on an interval while the
//   chart is in view; update states advance on demand (the lab's button).
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { morph, useEntranceHover } from "./motion-client";

export function ChartMotion({ children, states, interval, controls }: { children: ReactNode; states?: ReactNode; interval?: number; controls?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const store = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const count = Children.count(states) + 1;
  useEntranceHover(ref);

  // live: advance on an interval while in view
  useEffect(() => {
    if (!interval || count < 2) return;
    const root = ref.current!;
    let visible = false;
    const io = new IntersectionObserver((e) => { visible = e.some((x) => x.isIntersecting); });
    io.observe(root);
    const t = setInterval(() => { if (visible && document.visibilityState === "visible") setStep((s) => s + 1); }, interval);
    return () => { clearInterval(t); io.disconnect(); };
  }, [interval, count]);

  // swap to the step's state
  useEffect(() => {
    if (step === 0 || !ref.current || !store.current) return;
    // the store holds states 1 … n − 1, then state 0 last
    const idx = step % count;
    const cur = ref.current.querySelector(":scope > svg") as SVGSVGElement | null;
    const target = store.current.children[idx === 0 ? count - 1 : idx - 1]?.querySelector("svg") as SVGSVGElement | null;
    if (cur && target) morph(cur, target, matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [step, count]);

  return (
    <>
      <div ref={ref} className="cm-root">
        {children}
      </div>
      {count > 1 && (
        <>
          <div ref={store} hidden>
            {Children.map(states, (s, i) => <div key={i}>{s}</div>)}
            <div>{children}</div>
          </div>
          {controls && !interval && (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="type-label-sm mt-2 rounded-md border border-(--chartory-stroke-input) px-3 py-1 text-(--chartory-text-primary)">
              Update data
            </button>
          )}
        </>
      )}
    </>
  );
}
