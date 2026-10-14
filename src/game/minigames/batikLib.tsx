import React, { useMemo } from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import type { Jenjang, Stroke } from '../types';

export type Pt = [number, number];
export type Motif = 'kawung' | 'parang' | 'truntum' | 'bebas';

export const MOTIFS: { id: Motif; name: string; desc: string }[] = [
  { id: 'kawung', name: 'Kawung', desc: 'Bulatan lonjong yang membentuk bunga empat kelopak.' },
  { id: 'parang', name: 'Parang', desc: 'Garis miring bergelombang yang bersambung seperti ombak.' },
  { id: 'truntum', name: 'Truntum', desc: 'Bintang-bintang kecil yang bertebar seperti taburan bintang.' },
  { id: 'bebas', name: 'Kreasi Bebas', desc: 'Gambar apa saja dengan canting, boleh pakai simetri!' },
];

function ellipse(cx: number, cy: number, rx: number, ry: number, n = 28): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2; out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return out;
}

export function makeGuide(motif: Motif, j: Jenjang): Pt[][] {
  const g: Pt[][] = [];
  if (motif === 'kawung') {
    const centers: [number, number, number][] = j === 'sd' ? [[0.5, 0.5, 0.82]] : j === 'smp' ? [[0.3, 0.3, 0.46], [0.7, 0.7, 0.46]] : [[0.27, 0.27, 0.46], [0.73, 0.27, 0.46], [0.27, 0.73, 0.46], [0.73, 0.73, 0.46]];
    for (const [cx, cy, u] of centers) {
      const a = 0.19 * u, b = 0.13 * u;
      g.push(ellipse(cx, cy - a, b, a), ellipse(cx, cy + a, b, a), ellipse(cx - a, cy, a, b), ellipse(cx + a, cy, a, b));
    }
  } else if (motif === 'parang') {
    const n = j === 'sd' ? 2 : j === 'smp' ? 3 : 4;
    for (let k = 0; k < n; k++) {
      const y0 = 0.35 + (k + 0.5) * (0.95 / n);
      const line: Pt[] = [];
      for (let t = 0; t <= 1.0001; t += 0.025) {
        const x = 0.06 + t * 0.88, y = y0 - 0.62 * t + 0.04 * Math.sin(t * Math.PI * 2 * 3);
        if (y > 0.05 && y < 0.95) line.push([x, y]);
      }
      if (line.length > 3) g.push(line);
    }
  } else if (motif === 'truntum') {
    const pos: Pt[] = j === 'sd' ? [[0.3, 0.3], [0.7, 0.3], [0.5, 0.65]] : j === 'smp' ? [[0.25, 0.28], [0.5, 0.28], [0.75, 0.28], [0.375, 0.6], [0.625, 0.6], [0.5, 0.85]] : [[0.22, 0.22], [0.5, 0.22], [0.78, 0.22], [0.36, 0.5], [0.64, 0.5], [0.22, 0.78], [0.5, 0.78], [0.78, 0.78]];
    const r = 0.08;
    for (const [cx, cy] of pos) {
      g.push([[cx - r, cy], [cx + r, cy]], [[cx, cy - r], [cx, cy + r]], [[cx - r * 0.7, cy - r * 0.7], [cx + r * 0.7, cy + r * 0.7]], [[cx + r * 0.7, cy - r * 0.7], [cx - r * 0.7, cy + r * 0.7]]);
    }
  }
  return g;
}

export function sampleGuide(g: Pt[][], step = 0.014): Pt[] {
  const out: Pt[] = [];
  for (const line of g) {
    for (let i = 0; i < line.length - 1; i++) {
      const [x0, y0] = line[i], [x1, y1] = line[i + 1]; const d = Math.hypot(x1 - x0, y1 - y0); const n = Math.max(1, Math.round(d / step));
      for (let k = 0; k < n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
    }
  }
  return out;
}

export const THR: Record<Jenjang, number> = { sd: 0.055, smp: 0.042, sma: 0.034 };
export function coverage(samples: Pt[], strokes: Stroke[], thr: number): { ratio: number; hit: boolean[] } {
  const pts: Pt[] = [];
  for (const s of strokes) { for (let i = 0; i + 1 < s.p.length; i += 2) { pts.push([s.p[i], s.p[i + 1]]); if (i + 3 < s.p.length) { pts.push([(s.p[i] + s.p[i + 2]) / 2, (s.p[i + 1] + s.p[i + 3]) / 2]); } } }
  const hit = samples.map(([x, y]) => pts.some(([a, b]) => Math.hypot(a - x, b - y) < thr));
  return { ratio: samples.length ? hit.filter(Boolean).length / samples.length : 0, hit };
}
export const inkLength = (strokes: Stroke[]) => strokes.reduce((t, s) => { if (s.k === 'dot') return t + s.p.length / 2 * 0.02; let l = 0; for (let i = 2; i + 1 < s.p.length; i += 2) l += Math.hypot(s.p[i] - s.p[i - 2], s.p[i + 1] - s.p[i - 1]); return t + l; }, 0) / 2;

export function starsFor(motif: Motif, j: Jenjang, ratio: number, ink: number): number {
  if (motif === 'bebas') return ink >= 12 ? 3 : ink >= 7 ? 2 : ink >= 3 ? 1 : 0;
  const t = j === 'sd' ? [0.3, 0.5, 0.7] : j === 'smp' ? [0.4, 0.6, 0.8] : [0.5, 0.7, 0.88];
  return ratio >= t[2] ? 3 : ratio >= t[1] ? 2 : ratio >= t[0] ? 1 : 0;
}

function pathOf(p: number[], S: number) {
  const n = p.length / 2; if (n < 2) return '';
  let d = `M${p[0] * S} ${p[1] * S}`;
  for (let i = 1; i < n - 1; i++) { const mx = (p[i * 2] + p[i * 2 + 2]) / 2, my = (p[i * 2 + 1] + p[i * 2 + 3]) / 2; d += ` Q${p[i * 2] * S} ${p[i * 2 + 1] * S} ${mx * S} ${my * S}`; }
  d += ` L${p[(n - 1) * 2] * S} ${p[(n - 1) * 2 + 1] * S}`;
  return d;
}

export const CLOTH = '#f3e6c4';
export const WAX = '#b9791b';
export const WAX_DONE = '#f6edd0';

export const BatikCloth = React.memo(function BatikCloth({ size, strokes, dye, done, guide, hit, live, liveW = 0.012, liveDot, thick = 1 }: { size: number; strokes: Stroke[]; dye?: string; done?: boolean; guide?: Pt[][]; hit?: boolean[]; live?: number[] | null; liveW?: number; liveDot?: boolean; thick?: number }) {
  const S = size;
  const crackle = useMemo(() => {
    if (!dye) return [] as string[];
    let seed = strokes.length * 97 + 13; const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const out: string[] = [];
    for (let i = 0; i < 14; i++) { let x = r(), y = r(); let d = `M${x * S} ${y * S}`; for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 0.18; y += (r() - 0.5) * 0.18; d += ` L${x * S} ${y * S}`; } out.push(d); }
    return out;
  }, [dye, strokes.length, S]);
  const wax = dye ? (done ? WAX_DONE : WAX) : WAX;
  const bg = dye || CLOTH;
  return (
    <Svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
      <Rect x={0} y={0} width={S} height={S} fill={bg} />
      {Array.from({ length: 22 }).map((_, i) => <Line key={'g' + i} x1={0} y1={(i + 0.5) * (S / 22)} x2={S} y2={(i + 0.5) * (S / 22)} stroke={dye ? '#00000012' : '#b09a6a22'} strokeWidth={1} />)}
      {dye && done ? crackle.map((d, i) => <Path key={'c' + i} d={d} stroke="#f6edd055" strokeWidth={0.8} fill="none" />) : null}
      {guide ? guide.map((l, i) => <Path key={'q' + i} d={pathOf(l.flat(), S)} stroke="#7a5a2a" strokeOpacity={0.55} strokeWidth={Math.max(2, S * 0.008)} strokeDasharray="2,5" strokeLinecap="round" fill="none" />) : null}
      {strokes.map((s, i) => s.k === 'dot'
        ? <G key={i}>{Array.from({ length: s.p.length / 2 }).map((_, k) => <Circle key={k} cx={s.p[k * 2] * S} cy={s.p[k * 2 + 1] * S} r={Math.max(2, s.w * S * 0.62 * thick)} fill={wax} />)}</G>
        : s.p.length < 4
          ? <Circle key={i} cx={s.p[0] * S} cy={s.p[1] * S} r={Math.max(1.5, s.w * S * 0.5 * thick)} fill={wax} />
          : <Path key={i} d={pathOf(s.p, S)} stroke={wax} strokeWidth={Math.max(1.5, s.w * S * thick)} strokeLinecap="round" strokeLinejoin="round" fill="none" />)}
      {live && live.length >= 2 ? (liveDot
        ? <G>{Array.from({ length: live.length / 2 }).map((_, k) => <Circle key={k} cx={live[k * 2] * S} cy={live[k * 2 + 1] * S} r={Math.max(2, liveW * S * 0.62)} fill={wax} />)}</G>
        : live.length < 4 ? <Circle cx={live[0] * S} cy={live[1] * S} r={Math.max(1.5, liveW * S * 0.5)} fill={wax} /> : <Path d={pathOf(live, S)} stroke={wax} strokeWidth={Math.max(1.5, liveW * S)} strokeLinecap="round" strokeLinejoin="round" fill="none" />) : null}
      {guide && hit ? null : null}
    </Svg>
  );
});
