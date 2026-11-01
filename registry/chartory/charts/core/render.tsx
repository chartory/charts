// Scene → SVG, on the server. Colours are tokens only (var(--chartory-…) in style, so the theme and the chart colour
// on any ancestor restyle every mark); no layer names, no data-* attributes, no comments in the output (brief §5).
// Geometry is the scene's: rects and texts on whole pixels, path data at Figma's precision (≤ 2 decimals).
import { cloneElement, type CSSProperties, type ReactElement } from "react";
import { SHELL_PAIRS } from "./effect-geometry";
import { polygonPoints, type Clip, type Gradient, type Mark, type Paint, type Radius } from "./node";
import { baseline, runWidth, style as styleOf, truncate, wrapLines } from "./text";

/** A token's CSS variable: Foundations → --chartory-…, the Signal collection's ("signal:…") → --signal-…. */
export const cssVar = (tok: string) => (tok.startsWith("signal:") ? `var(--signal-${tok.slice(7).replace(/[/\s.]+/g, "-").toLowerCase()})` : `var(--chartory-${tok.replace(/[/\s.]+/g, "-").toLowerCase()})`);
const n = (v: number) => +v.toFixed(2);

/** Figma corner radii: clamped to half the shorter side; per-corner radii scale down together when two on one side
 *  would overlap. */
function corners(r: Radius, w: number, h: number): [number, number, number, number] {
  const c: [number, number, number, number] = typeof r === "number" ? [r, r, r, r] : [...r];
  const lim = Math.min(w, h) / 2;
  for (let i = 0; i < 4; i++) c[i] = Math.min(c[i], lim);
  const f = Math.min(1, w / Math.max(c[0] + c[1], 1e-9), w / Math.max(c[3] + c[2], 1e-9), h / Math.max(c[0] + c[3], 1e-9), h / Math.max(c[1] + c[2], 1e-9));
  return c.map((v) => v * f) as [number, number, number, number];
}
function roundRect(x: number, y: number, w: number, h: number, r: Radius): string {
  const [tl, tr, br, bl] = corners(r, w, h);
  return [
    `M${n(x + tl)} ${n(y)}H${n(x + w - tr)}`, tr ? `A${n(tr)} ${n(tr)} 0 0 1 ${n(x + w)} ${n(y + tr)}` : "",
    `V${n(y + h - br)}`, br ? `A${n(br)} ${n(br)} 0 0 1 ${n(x + w - br)} ${n(y + h)}` : "",
    `H${n(x + bl)}`, bl ? `A${n(bl)} ${n(bl)} 0 0 1 ${n(x)} ${n(y + h - bl)}` : "",
    `V${n(y + tl)}`, tl ? `A${n(tl)} ${n(tl)} 0 0 1 ${n(x + tl)} ${n(y)}` : "", "Z",
  ].join("");
}
/** Move absolute path data (M L C Z with absolute numbers, as the builders write it) by (dx, dy). */
function movePath(d: string, dx: number, dy: number): string {
  if (!dx && !dy) return d.replace(/\s*([MLCZ])\s*/g, "$1").trim();
  let i = 0;
  return d
    .replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (v) => String(n(+v + (i++ % 2 ? dy : dx))))
    .replace(/\s*([MLCZ])\s*/g, "$1")
    .trim();
}
/** Ellipse arc sector (Figma arcData: angles in radians, clockwise from 3 o'clock; inner = ratio of the radius). */
function arcPath(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, inner: number): string {
  const pt = (a: number, k: number) => `${n(cx + Math.cos(a) * rx * k)} ${n(cy + Math.sin(a) * ry * k)}`;
  // a full turn: two half arcs (an SVG arc whose ends meet draws nothing), with the inner ring as a hole
  if (Math.abs(a1 - a0) >= 2 * Math.PI - 1e-6) {
    const ring = (k: number, sweep: 0 | 1) => `M${pt(a0, k)}A${n(rx * k)} ${n(ry * k)} 0 1 ${sweep} ${pt(a0 + Math.PI, k)}A${n(rx * k)} ${n(ry * k)} 0 1 ${sweep} ${pt(a0, k)}Z`;
    return inner ? ring(1, 1) + ring(inner, 0) : ring(1, 1);
  }
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const outer = `M${pt(a0, 1)}A${n(rx)} ${n(ry)} 0 ${large} 1 ${pt(a1, 1)}`;
  if (!inner) return `${outer}L${n(cx)} ${n(cy)}Z`;
  return `${outer}L${pt(a1, inner)}A${n(rx * inner)} ${n(ry * inner)} 0 ${large} 0 ${pt(a0, inner)}Z`;
}

/** Length of path data (absolute M / L / C / Z, as the builders write it); curves by 32-step sampling. */
function pathLength(d: string): number {
  const t = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  let i = 0, len = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = "";
  const num = () => Number(t[i++]);
  while (i < t.length) {
    if (/[MLCZ]/.test(t[i])) cmd = t[i++];
    if (cmd === "M") { x = sx = num(); y = sy = num(); cmd = "L"; continue; }
    if (cmd === "L") { const nx = num(), ny = num(); len += Math.hypot(nx - x, ny - y); x = nx; y = ny; continue; }
    if (cmd === "C") {
      const c = [num(), num(), num(), num(), num(), num()];
      let px = x, py = y;
      for (let k = 1; k <= 32; k++) {
        const s = k / 32, u = 1 - s;
        const qx = u * u * u * x + 3 * u * u * s * c[0] + 3 * u * s * s * c[2] + s * s * s * c[4];
        const qy = u * u * u * y + 3 * u * u * s * c[1] + 3 * u * s * s * c[3] + s * s * s * c[5];
        len += Math.hypot(qx - px, qy - py); px = qx; py = qy;
      }
      x = c[4]; y = c[5]; continue;
    }
    if (cmd === "Z") { len += Math.hypot(sx - x, sy - y); x = sx; y = sy; cmd = ""; continue; }
    i++;
  }
  return len;
}
/** Figma fits a dash pattern to an open path: the length becomes a whole number of periods and the path starts and
 *  ends on half a dash (measured on the Figma exports: 400 px of [3, 3] = 67 periods ×0.995, half dashes at both ends). */
function fitDash(dash: [number, number], len: number): string {
  const [d, g] = dash;
  const n = Math.max(1, Math.round(len / (d + g)));
  const k = len / (n * (d + g));
  return `stroke-dasharray:${n2(d * k)} ${n2(g * k)};stroke-dashoffset:${n2((d * k) / 2)}`;
}
const n2 = (v: number) => +v.toFixed(3);

/** Split path data (absolute M / L / C / Z) into one "M … <segment>" path per segment; Z adds the closing segment. */
function segments(d: string): string[] {
  const t = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const out: string[] = [];
  let i = 0, x = "0", y = "0", sx = "0", sy = "0", cmd = "";
  while (i < t.length) {
    if (/[MLCZ]/.test(t[i])) cmd = t[i++];
    if (cmd === "Z") { if (+x !== +sx || +y !== +sy) out.push(`M ${x} ${y} L ${sx} ${sy}`); x = sx; y = sy; cmd = ""; continue; }
    if (cmd === "M") { x = sx = t[i++]; y = sy = t[i++]; cmd = "L"; continue; }
    if (cmd === "L") { const nx = t[i++], ny = t[i++]; out.push(`M ${x} ${y} L ${nx} ${ny}`); x = nx; y = ny; continue; }
    if (cmd === "C") { const c = t.slice(i, i + 6); i += 6; out.push(`M ${x} ${y} C ${c.join(" ")}`); x = c[4]; y = c[5]; continue; }
    i++;
  }
  return out;
}

type Defs = { id: string; g?: Gradient; filter?: { blur: number }; inner?: { shape: string; dx: number; dy: number } }[];
const fillOf = (f: Paint | Gradient | undefined, defs: Defs, idBase: string): string => {
  if (!f) return "fill:none";
  if ("tok" in f) return `fill:${cssVar(f.tok)}${f.opacity != null && f.opacity !== 1 ? `;fill-opacity:${f.opacity}` : ""}`;
  const id = `${idBase}g${defs.length}`;
  defs.push({ id, g: f });
  return `fill:url(#${id})`;
};
const strokeOf = (s: Paint | undefined, sw: number | undefined) => (s && sw ? `;stroke:${cssVar(s.tok)};stroke-width:${sw}` : "");

/** Motion hooks on a data mark: neutral class names and two custom properties (order, hover group); no data-*. */
function withMotion(el: ReactElement | null, m: Mark): ReactElement | null {
  if (!el || !m.motion) return el;
  const mo = m.motion;
  const props = el.props as { style?: CSSProperties };
  const cls = ["cm", `cm-${mo.kind}`, mo.origin === "top" ? "cm-top" : mo.origin === "left" ? "cm-left" : mo.origin === "right" ? "cm-right" : "", mo.after ? "cm-after" : ""].filter(Boolean).join(" ");
  const style = { ...(props.style ?? {}), "--o": mo.order, ...(mo.group != null ? { "--g": mo.group } : {}) } as CSSProperties;
  return cloneElement(el as ReactElement<Record<string, unknown>>, { className: cls, style, ...(mo.kind === "draw" || mo.kind === "sweep" ? { pathLength: 1 } : {}) });
}

function markEl(m: Mark, k: number, defs: Defs, idBase: string): ReactElement | null {
  const el = withMotion(markShape(m, k, defs, idBase), m);
  if (!el || !m.cls) return el;
  const props = el.props as { className?: string };
  return cloneElement(el as ReactElement<Record<string, unknown>>, { className: [props.className, m.cls].filter(Boolean).join(" ") });
}

function markShape(m: Mark, k: number, defs: Defs, idBase: string): ReactElement | null {
  const op = m.opacity != null && m.opacity !== 1 ? m.opacity : undefined;
  switch (m.kind) {
    case "frame": {
      // the card (fill + 0.5 px ring inside) and list rows (one side stroke inside)
      const els: ReactElement[] = [];
      const fx = m.effects ?? [];
      const shape = roundRect(m.ax, m.ay, m.w, m.h, m.radius ?? 0);
      // drop shadows under the frame: the frame's shape, offset / blurred / spread, in the effect token
      // the shell shadow's y / blur are theme tokens; an SVG blur cannot read a CSS variable, so it is drawn once per
      // pair the themes use and each shows through its theme's display variable (tokens.css --chartory-fx-shell-*)
      fx.filter((e) => e.type === "drop").forEach((e, j) => {
        const geos = e.shell ? SHELL_PAIRS.map(([y, blur]) => ({ ...e, y, blur, show: `display:var(--chartory-fx-shell-${y}-${blur})` })) : [{ ...e, show: "" }];
        geos.forEach((g, v) => {
          const id = `${idBase}f${k}d${j}${e.shell ? "s" + v : ""}`;
          defs.push({ id, filter: { blur: g.blur } });
          els.push(<path key={`d${j}${v}`} d={roundRect(m.ax + g.x - g.spread, m.ay + g.y - g.spread, m.w + 2 * g.spread, m.h + 2 * g.spread, typeof m.radius === "number" ? m.radius + g.spread : m.radius ?? 0)} style={css(`fill:${cssVar(e.tok)}${g.show ? ";" + g.show : ""}`)} filter={g.blur ? `url(#${id})` : undefined} />);
        });
      });
      if (m.fill || (m.stroke && typeof m.sw === "number" && m.sw > 0)) {
        const sw = typeof m.sw === "number" ? m.sw : 0;
        const inset = m.stroke && m.align === "inside" ? sw / 2 : m.stroke && m.align === "outside" ? -sw / 2 : 0;
        const r = m.radius ?? 0;
        els.push(<path key="b" d={roundRect(m.ax + inset, m.ay + inset, m.w - 2 * inset, m.h - 2 * inset, typeof r === "number" ? Math.max(0, r - inset) : r)} style={css(fillOf(m.fill, defs, idBase) + strokeOf(m.stroke, sw))} />);
      }
      // inner shadows (Figma's 1 px top highlight): the shape minus the shape moved by the offset, inside the shape
      fx.filter((e) => e.type === "inner").forEach((e, j) => {
        const id = `${idBase}f${k}i${j}`;
        defs.push({ id, inner: { shape, dx: e.x, dy: e.y } });
        els.push(<path key={`i${j}`} d={shape} style={css(`fill:${cssVar(e.tok)}`)} mask={`url(#${id})`} />);
      });
      if (m.stroke && Array.isArray(m.sw) && m.radius) {
        // per-side inside strokes on a rounded frame follow the corners (Figma): the shape minus the shape inset by the
        // side weights, so a top-only edge tapers to nothing along the corner arcs
        const [t, r, b, l] = m.sw, rr = typeof m.radius === "number" ? m.radius : Math.max(...m.radius);
        const inner = roundRect(m.ax + l, m.ay + t, m.w - l - r, m.h - t - b, Math.max(0, rr - Math.max(t, r, b, l)));
        els.push(<path key="sides" d={shape + " " + inner} fillRule="evenodd" style={{ fill: cssVar(m.stroke.tok) }} />);
      } else if (m.stroke && Array.isArray(m.sw)) {
        const [t, r, b, l] = m.sw, c = cssVar(m.stroke.tok);
        if (t) els.push(<rect key="t" x={m.ax} y={m.ay} width={m.w} height={t} style={{ fill: c }} />);
        if (b) els.push(<rect key="bt" x={m.ax} y={m.ay + m.h - b} width={m.w} height={b} style={{ fill: c }} />);
        if (l) els.push(<rect key="l" x={m.ax} y={m.ay} width={l} height={m.h} style={{ fill: c }} />);
        if (r) els.push(<rect key="r" x={m.ax + m.w - r} y={m.ay} width={r} height={m.h} style={{ fill: c }} />);
      }
      return els.length ? <g key={k} opacity={op}>{els}</g> : null;
    }
    case "rect": {
      if (m.dash && m.stroke && !m.radius) {
        // Figma fits the dash pattern to each side (clockwise from the top left), on the stroke's centre line
        const sw = m.sw ?? 1, ins = m.align === "inside" ? sw / 2 : m.align === "outside" ? -sw / 2 : 0;
        const x0 = m.ax + ins, y0 = m.ay + ins, x1 = m.ax + m.w - ins, y1 = m.ay + m.h - ins;
        const sides: [number, number, number, number][] = [[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]];
        return (
          <g key={k} opacity={op}>
            {m.fill && <rect x={n(m.ax)} y={n(m.ay)} width={n(m.w)} height={n(m.h)} style={css(fillOf(m.fill, defs, idBase))} />}
            <g style={css("fill:none" + strokeOf(m.stroke, sw))}>
              {sides.map(([a, b, c, d], j) => <path key={j} d={`M${n(a)} ${n(b)}L${n(c)} ${n(d)}`} style={css(fitDash(m.dash!, Math.hypot(c - a, d - b)))} />)}
            </g>
          </g>
        );
      }
      const st = fillOf(m.fill, defs, idBase) + strokeOf(m.stroke, m.sw) + (m.dash ? `;stroke-dasharray:${m.dash.join(" ")}` : "");
      if (!m.radius) return <rect key={k} x={n(m.ax)} y={n(m.ay)} width={n(m.w)} height={n(m.h)} opacity={op} style={css(st)} />;
      return <path key={k} d={roundRect(m.ax, m.ay, m.w, m.h, m.radius)} opacity={op} style={css(st)} />;
    }
    case "ellipse": {
      const sw = m.stroke ? m.sw ?? 1 : 0;
      const grow = m.align === "inside" ? -sw / 2 : m.align === "outside" ? sw / 2 : 0;
      const cx = m.ax + m.w / 2, cy = m.ay + m.h / 2;
      const st = fillOf(m.fill, defs, idBase) + strokeOf(m.stroke, sw) + (m.dash ? `;stroke-dasharray:${m.dash.join(" ")}` : "");
      if (m.arc && m.motion?.kind === "sweep" && m.fill && "tok" in m.fill && !m.stroke) {
        // a sweeping arc: the same sector drawn as a stroke along its centre line (as wide as the ring, butt ends), so
        // the entrance can fill it along its direction; the final frame is the filled sector
        const rIn = (m.w / 2) * m.arc.inner, rOut = m.w / 2, rm = (rIn + rOut) / 2, ryk = m.h / m.w;
        const a0 = m.arc.start, a1 = m.arc.end, full = Math.abs(a1 - a0) >= 2 * Math.PI - 1e-6;
        const pt = (a: number) => `${n(cx + Math.cos(a) * rm)} ${n(cy + Math.sin(a) * rm * ryk)}`;
        const d = full
          ? `M${pt(a0)}A${n(rm)} ${n(rm * ryk)} 0 1 1 ${pt(a0 + Math.PI)}A${n(rm)} ${n(rm * ryk)} 0 1 1 ${pt(a0)}`
          : `M${pt(a0)}A${n(rm)} ${n(rm * ryk)} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pt(a1)}`;
        const fo = m.fill.opacity != null && m.fill.opacity !== 1 ? `;stroke-opacity:${m.fill.opacity}` : "";
        return <path key={k} d={d} opacity={op} style={css(`fill:none;stroke:${cssVar(m.fill.tok)};stroke-width:${n(rOut - rIn)};stroke-linecap:butt${fo}`)} />;
      }
      if (m.arc) return <path key={k} d={arcPath(cx, cy, m.w / 2, m.h / 2, m.arc.start, m.arc.end, m.arc.inner)} opacity={op} style={css(st)} />;
      if (m.dash && m.stroke) {
        // Figma draws an ellipse as four quarter curves (from 3 o'clock, clockwise) and fits the dashes to each
        const rx = m.w / 2 + grow, ry = m.h / 2 + grow;
        const q = (a: number) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
        const qLen = (a0: number) => { let L = 0, p = q(a0); for (let s = 1; s <= 32; s++) { const c = q(a0 + (s / 32) * (Math.PI / 2)); L += Math.hypot(c[0] - p[0], c[1] - p[1]); p = c; } return L; };
        return (
          <g key={k} opacity={op}>
            {m.fill && <ellipse cx={n(cx)} cy={n(cy)} rx={n(m.w / 2)} ry={n(m.h / 2)} style={css(fillOf(m.fill, defs, idBase))} />}
            <g style={css("fill:none" + strokeOf(m.stroke, sw))}>
              {[0, 1, 2, 3].map((j) => {
                const a0 = (j * Math.PI) / 2, [ax0, ay0] = q(a0), [ax1, ay1] = q(a0 + Math.PI / 2);
                return <path key={j} d={`M${n(ax0)} ${n(ay0)}A${n(rx)} ${n(ry)} 0 0 1 ${n(ax1)} ${n(ay1)}`} style={css(fitDash(m.dash!, qLen(a0)))} />;
              })}
            </g>
          </g>
        );
      }
      // a fill under an inside / outside stroke keeps the full ellipse; the stroke sits on the moved radius
      if (m.fill && grow) {
        return (
          <g key={k} opacity={op}>
            <ellipse cx={n(cx)} cy={n(cy)} rx={n(m.w / 2)} ry={n(m.h / 2)} style={css(fillOf(m.fill, defs, idBase))} />
            <ellipse cx={n(cx)} cy={n(cy)} rx={n(m.w / 2 + grow)} ry={n(m.h / 2 + grow)} style={css("fill:none" + strokeOf(m.stroke, sw) + (m.dash ? `;stroke-dasharray:${m.dash.join(" ")}` : ""))} />
          </g>
        );
      }
      return <ellipse key={k} cx={n(cx)} cy={n(cy)} rx={n(m.w / 2 + grow)} ry={n(m.h / 2 + grow)} opacity={op} style={css(st)} />;
    }
    case "polygon": {
      const pts = polygonPoints(m.ax, m.ay, m.w, m.h, m.points).map(([x, y]) => `${n(x)} ${n(y)}`).join("L");
      return <path key={k} d={`M${pts}Z`} opacity={op} style={css(fillOf(m.fill, defs, idBase) + strokeOf(m.stroke, m.sw))} />;
    }
    case "vector": {
      const st = fillOf(m.fill, defs, idBase) + strokeOf(m.stroke, m.sw)
        + (m.stroke ? `;stroke-linecap:${m.cap ?? "butt"};stroke-linejoin:${m.join ?? "miter"}` : "");
      if (m.dash) {
        // Figma fits the dash pattern to each segment of an open path (half dashes at both ends of every segment)
        const segs = segments(m.d);
        if (segs.length > 1) {
          const outline = <g key="o" style={css(st.replace(/fill:[^;]*/, "fill:none"))}>{segs.map((sd, j) => <path key={j} d={movePath(sd, m.tx ?? 0, m.ty ?? 0)} style={css(fitDash(m.dash!, pathLength(sd)))} />)}</g>;
          // a filled closed shape keeps its fill under the fitted dashes
          if (m.fill) return <g key={k} opacity={op}><path d={movePath(m.d, m.tx ?? 0, m.ty ?? 0)} style={css(fillOf(m.fill, defs, idBase))} />{outline}</g>;
          return <g key={k} opacity={op}>{outline}</g>;
        }
        return <path key={k} d={movePath(m.d, m.tx ?? 0, m.ty ?? 0)} opacity={op} style={css(st + ";" + fitDash(m.dash, pathLength(m.d)))} />;
      }
      return <path key={k} d={movePath(m.d, m.tx ?? 0, m.ty ?? 0)} opacity={op} style={css(st)} />;
    }
    case "text": {
      const s = styleOf(m.style);
      const st0 = `fill:${cssVar(m.fill.tok)};font-size:${s.size}px;font-weight:${s.weight}${s.tracking ? `;letter-spacing:${s.tracking}px` : ""}`;
      if (m.wrap) {
        // auto-height text: one line per wrapped line, each aligned in the box
        const lines = wrapLines(m.text, m.style, m.w);
        return (
          <text key={k} opacity={op} style={css(st0)}>
            {lines.map((ln, i) => {
              const lw = runWidth(ln, m.style);
              const lx = m.align === "center" ? m.ax + (m.w - lw) / 2 : m.align === "right" ? m.ax + m.w - lw : m.ax;
              return <tspan key={i} x={n(lx)} y={n(m.ay + i * s.lineHeight + baseline(m.style))}>{ln}</tspan>;
            })}
          </text>
        );
      }
      const shown = m.truncate ? truncate(m.text, m.style, m.w) : m.text;
      const rw = runWidth(shown, m.style);
      // an auto-width box is the run's whole-pixel ceiling; Figma still aligns the run inside it (centre / right)
      const x = m.align === "center" ? m.ax + (m.w - rw) / 2 : m.align === "right" ? m.ax + m.w - rw : m.ax;
      const y = m.ay + baseline(m.style);
      const st = st0;
      // Figma rotation is counter-clockwise about the node's origin
      const tr = m.rotation ? `rotate(${-m.rotation} ${n(m.ax)} ${n(m.ay)})` : undefined;
      return <text key={k} x={n(x)} y={n(y)} transform={tr} opacity={op} style={css(st)}>{shown}</text>;
    }
  }
}
const css = (s: string) => Object.fromEntries(s.split(";").filter(Boolean).map((d) => { const [p, ...v] = d.split(":"); return [p.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.join(":").trim()]; }));

export type SvgProps = { marks: Mark[]; w: number; h: number; idBase: string; title: string; desc: string };

/** The chart as an SVG element: role img with its title and one-line summary. */
export function ChartSvg({ marks, w, h, idBase, title, desc }: SvgProps): ReactElement {
  const defs: Defs = [];
  // marks under a clipping frame (clipsContent) are grouped under one clip path per frame
  const clips: Clip[] = [];
  const clipId = (c: Clip) => { let i = clips.findIndex((x) => x.x === c.x && x.y === c.y && x.w === c.w && x.h === c.h); if (i < 0) { clips.push(c); i = clips.length - 1; } return `${idBase}c${i}`; };
  const body: ReactElement[] = [];
  let run: { id: string; els: ReactElement[] } | null = null;
  marks.forEach((m, k) => {
    const el = markEl(m, k, defs, idBase);
    if (!el) return;
    const id = m.clip ? clipId(m.clip) : null;
    if (!id) { run = null; body.push(el); return; }
    if (!run || run.id !== id) { run = { id, els: [] }; body.push(<g key={`g${k}`} clipPath={`url(#${id})`}>{run.els}</g>); }
    run.els.push(el);
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-labelledby={`${idBase}t ${idBase}d`}
      style={{ display: "block", overflow: "visible", fontFamily: "var(--chartory-font-sans)", fontVariantLigatures: "common-ligatures", fontKerning: "normal" }}
    >
      <title id={`${idBase}t`}>{title}</title>
      <desc id={`${idBase}d`}>{desc}</desc>
      {(defs.length > 0 || clips.length > 0) && (
        <defs>
          {clips.map((c, i) => (
            <clipPath key={`c${i}`} id={`${idBase}c${i}`}><path d={roundRect(c.x, c.y, c.w, c.h, c.r)} /></clipPath>
          ))}
          {defs.map(({ id, g, filter, inner }) =>
            g ? (
              <linearGradient key={id} id={id} x1={g.from[0]} y1={g.from[1]} x2={g.to[0]} y2={g.to[1]}>
                {g.stops.map((s, i) => <stop key={i} offset={s.pos} style={{ stopColor: cssVar(s.tok) }} />)}
              </linearGradient>
            ) : filter ? (
              // Figma blur radius = 2 σ
              <filter key={id} id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={filter.blur / 2} /></filter>
            ) : inner ? (
              <mask key={id} id={id} maskUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000">
                <path d={inner.shape} fill="white" />
                <path d={inner.shape} fill="black" transform={`translate(${inner.dx} ${inner.dy})`} />
              </mask>
            ) : null,
          )}
        </defs>
      )}
      {body}
    </svg>
  );
}
