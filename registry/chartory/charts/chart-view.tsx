// <ChartView>: one chart type drawn as SVG from its definition (registry plan step 1). Isomorphic: no server-only, no
// browser API, so it renders in a React Server Component (Next) or in the browser (Vite); only the motion layer
// (ChartMotion) is a client component. The site's <Chart no> (chart.tsx) and every package component
// (components/chartory/<slug>.tsx) are thin wrappers that pass a `def`, so the buyer gets the code the site runs.
// The text alternative is the svg's title + desc and a visually hidden data table.
import { ChartMotion } from "./chart-motion";
import { ChartSvg } from "./core/render";
import { buildBox, buildVariant, type Box, type ChartDef, type Collection, type Size, type Variant } from "./core/shell";

export type ChartColor = "cat-1" | "cat-2" | "cat-3" | "cat-4";
export type ChartMode = "chartory-dark" | "chartory-light" | "ember" | "ember-light";
export type ChartViewProps = {
  def: ChartDef;
  size?: Size; legend?: boolean;
  /** cat-1…cat-4; left out, the chart takes the colour set around it (data-chart-color), else the theme's (= cat-1) */
  color?: ChartColor; mode?: ChartMode; className?: string;
  /** Data in the type's own shape (default: the sample from the Figma kit). */
  data?: unknown;
  /** Further data states; the client morphs to them (update) or ticks through them (live). */
  states?: unknown[];
  /** Live: advance through `states` every this many ms while in view. */
  interval?: number;
  /** Lab: show an "Update data" button that steps through `states`. */
  controls?: boolean;
  /** An illustration whose meaning is in the copy next to it: hidden from assistive tech, no data table. */
  decorative?: boolean;
  /** A card outside the kit sizes (Website pages: same data drawn several ways); `size` is then ignored. */
  box?: Box;
  /** The text alternative for `data`. Without it, the sample's is used for the sample; for other data only a title
   *  (the type's name) is given, since the sample's summary and table would describe the wrong numbers. */
  describe?: ChartDef["describe"];
  /** Tells apart the SVG ids of two charts of one type and size on a page. */
  id?: string;
  /** The visual language: hearth (default), signal, or both drawn with the page choosing one through
   *  <html data-collection> (the site's way: static pages stay cached, nothing flashes). */
  collection?: Collection | "both";
};

/** visually hidden (no Tailwind needed in the buyer's project) */
export const SR_ONLY = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 } as const;

// Layout is a pure function of (type, size, legend, data, collection): the sample's variants are built once per process.
const built = new Map<string, Variant>();
function variantOf(def: ChartDef, size: Size, legend: boolean, data: unknown, col: Collection): Variant {
  if (data !== undefined) return buildVariant(def, size, legend, data, col);
  const key = `${def.no}:${size}:${legend}:${col}`;
  let v = built.get(key);
  if (!v) { v = buildVariant(def, size, legend, undefined, col); built.set(key, v); }
  return v;
}

const nameOf = (def: ChartDef) => def.slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

export function ChartView({ def, size = "m", legend = true, color, mode, className, data, states, interval, controls, decorative, box, describe, id, collection = "hearth" }: ChartViewProps) {
  const lg = legend && !!def.legend;
  // a box chart (the site's own card sizes) is drawn in the collection too: Figma draws those cards in Hearth only, and
  // Signal follows the kit's Signal cards (the person, 2026-10-21: question pages stayed Hearth under Signal)
  const cols: Collection[] = collection === "both" ? ["hearth", "signal"] : [collection];
  const variants = cols.map((col) => (box ? buildBox(def, box, data, col) : variantOf(def, size, lg, data, col)));
  const v = variants[0];
  const idBase = `c${def.no}${box ? "b" + (id ?? "") : size}${v.legend ? "l" : ""}${color?.slice(4) ?? ""}${mode ? mode.replace(/[^a-z]/g, "") : ""}${!box && id ? id : ""}`;
  const own = describe ?? (data === undefined ? def.describe : null);
  const title = own?.title ?? nameOf(def), summary = own?.summary ?? "";
  const motion = (col: Collection, vv: Variant, ib: string) => (
    <ChartMotion
      interval={interval}
      controls={controls}
      states={states?.map((d, i) => { const st = box ? buildBox(def, box, d, col) : buildVariant(def, size, lg, d, col); return <ChartSvg key={i} marks={st.marks} w={st.w} h={st.h} idBase={`${ib}s${i + 1}`} title={title} desc={summary} />; })}
    >
      <ChartSvg marks={vv.marks} w={vv.w} h={vv.h} idBase={ib} title={title} desc={summary} />
    </ChartMotion>
  );
  return (
    <figure data-theme={mode} data-chart-color={color} className={className} style={{ margin: 0, width: v.w }} aria-hidden={decorative || undefined}>
      {cols.length === 2 ? (
        <>
          <div className="signal:hidden">{motion("hearth", variants[0], idBase)}</div>
          <div className="hidden signal:block">{motion("signal", variants[1], idBase + "g")}</div>
        </>
      ) : motion(cols[0], v, cols[0] === "signal" ? idBase + "g" : idBase)}
      {!decorative && own && <table style={SR_ONLY}>
        <caption>{title}</caption>
        <thead><tr>{own.table.head.map((h, i) => (h ? <th key={h} scope="col">{h}</th> : <td key={`h${i}`} />))}</tr></thead>
        <tbody>{own.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j || !c ? <td key={j}>{c}</td> : <th key={j} scope="row">{c}</th>))}</tr>)}</tbody>
      </table>}
    </figure>
  );
}
