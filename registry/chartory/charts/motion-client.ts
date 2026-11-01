// Client-side motion shared by <ChartMotion> and the interactive Hearth widget: the morph from one server-rendered
// state to the next, and the entrance + hover hook. A plain module (no "use client"): only client components import it.
import { useEffect, useRef, type RefObject } from "react";

const DRAWN = "path, rect, ellipse, text";
const leaves = (svg: SVGSVGElement) =>
  Array.from(svg.querySelectorAll<SVGElement>(DRAWN)).filter((e) => !e.closest("defs, clipPath, title, desc") && !(e.tagName === "path" && e.parentElement?.tagName === "clipPath"));
const cmds = (d: string | null) => (d ?? "").replace(/[^MLCAZ]/gi, "");

/** Replace `cur` with a copy of `next` and morph every mark from its old geometry. */
export function morph(cur: SVGSVGElement, next: SVGSVGElement, reduce: boolean): SVGSVGElement {
  const fresh = next.cloneNode(true) as SVGSVGElement;
  const A = leaves(cur);
  // colours resolve from tokens, so read them while the old state is still in the document
  const fillsA = A.map((a) => getComputedStyle(a).fill);
  cur.replaceWith(fresh);
  // the new state is already played: no entrance again
  fresh.querySelectorAll(".cm").forEach((e) => ((e as SVGElement).style.animation = "none"));
  if (reduce) return fresh;
  const B = leaves(fresh);
  const css = getComputedStyle(fresh);
  const opts: KeyframeAnimationOptions = {
    duration: parseFloat(css.getPropertyValue("--chartory-motion-update")) || 500,
    easing: css.getPropertyValue("--chartory-ease-settle").trim() || "ease-out",
  };
  if (A.length !== B.length || A.some((a, i) => a.tagName !== B[i].tagName)) {
    fresh.animate([{ opacity: 0.4 }, { opacity: 1 }], opts);
    return fresh;
  }
  B.forEach((b, i) => {
    const a = A[i];
    const num = (e: Element, k: string) => parseFloat(e.getAttribute(k) ?? "0");
    const fb = getComputedStyle(b).fill;
    if (fillsA[i] !== fb && !fb.startsWith("url") && !fillsA[i].startsWith("url")) b.animate([{ fill: fillsA[i] }, { fill: fb }], opts);
    switch (b.tagName) {
      case "path": {
        const da = a.getAttribute("d"), db = b.getAttribute("d");
        if (da === db) break;
        if (cmds(da) === cmds(db)) b.animate([{ d: `path("${da}")` }, { d: `path("${db}")` }] as Keyframe[], opts);
        else b.animate([{ opacity: 0 }, { opacity: 1 }], opts);
        break;
      }
      case "rect":
        if (["x", "y", "width", "height"].some((k) => num(a, k) !== num(b, k)))
          b.animate([Object.fromEntries(["x", "y", "width", "height"].map((k) => [k, num(a, k) + "px"])), Object.fromEntries(["x", "y", "width", "height"].map((k) => [k, num(b, k) + "px"]))] as Keyframe[], opts);
        break;
      case "ellipse":
        if (["cx", "cy", "rx", "ry"].some((k) => num(a, k) !== num(b, k)))
          b.animate([Object.fromEntries(["cx", "cy", "rx", "ry"].map((k) => [k, num(a, k) + "px"])), Object.fromEntries(["cx", "cy", "rx", "ry"].map((k) => [k, num(b, k) + "px"]))] as Keyframe[], opts);
        break;
      case "text": {
        const p = (e: Element) => { const t = e.querySelector("tspan") ?? e; return [num(t, "x"), num(t, "y")]; };
        const [ax, ay] = p(a), [bx, by] = p(b);
        const frames: Keyframe[] = [{ transform: `translate(${ax - bx}px, ${ay - by}px)` }, { transform: "translate(0, 0)" }];
        if (a.textContent !== b.textContent) { frames[0].opacity = 0.3; frames[1].opacity = 1; }
        if (ax !== bx || ay !== by || a.textContent !== b.textContent) b.animate(frames, opts);
        break;
      }
    }
  });
  return fresh;
}

/** Entrance (once, in view) and hover (the datum under the pointer stays, the rest steps back) on a root whose
 *  direct child is the chart's svg. `onGroup` hears the hovered group (null on leave) and the mark under the pointer. */
export function useEntranceHover(ref: RefObject<HTMLElement | null>, onGroup?: (g: string | null, el: SVGElement | null) => void) {
  const cb = useRef(onGroup);
  useEffect(() => { cb.current = onGroup; });
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;
    if (!reduce) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { root.classList.add("cm-play"); io?.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(root);
    } else root.classList.add("cm-play");
    const svgOf = () => root.querySelector(":scope > svg") as SVGSVGElement | null;
    const over = (e: PointerEvent) => {
      const svg = svgOf();
      const el = (e.target as Element).closest<SVGElement>(".cm");
      const g = el?.style.getPropertyValue("--g");
      if (!svg) return;
      svg.querySelectorAll(".cm-on").forEach((x) => x.classList.remove("cm-on"));
      if (!g) { svg.classList.remove("cm-hl"); cb.current?.(null, null); return; }
      svg.querySelectorAll<SVGElement>(".cm").forEach((x) => { if (x.style.getPropertyValue("--g") === g) x.classList.add("cm-on"); });
      svg.classList.add("cm-hl");
      cb.current?.(g, el ?? null);
    };
    const out = () => { const svg = svgOf(); svg?.classList.remove("cm-hl"); svg?.querySelectorAll(".cm-on").forEach((x) => x.classList.remove("cm-on")); cb.current?.(null, null); };
    root.addEventListener("pointerover", over);
    root.addEventListener("pointerleave", out);
    return () => { io?.disconnect(); root.removeEventListener("pointerover", over); root.removeEventListener("pointerleave", out); };
  }, [ref]);
}

