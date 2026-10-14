import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, View, useWindowDimensions } from 'react-native';
import type { GameProps } from '../types';
import { GameShell, Intro, ResultCard, Txt } from '../ui';
import { C } from '../theme';
import { sfx } from '../../lib/sound';

const LANES = [
  { name: 'Saron', color: '#e8b93c', key: 'd', snd: 'note' },
  { name: 'Bonang', color: '#5aa7e0', key: 'f', snd: 'note' },
  { name: 'Kenong', color: '#5fbf74', key: 'j', snd: 'note1' },
  { name: 'Gong', color: '#e2625a', key: 'k', snd: 'gong' },
];
type Note = { t: number; lane: number; snd: string; state: 0 | 1 | 2 | 3 }; // 0 menunggu, 1 sempurna, 2 bagus, 3 meleset
const MELODY = [3, 2, 3, 5, 3, 2, 1, 2];

function buildNotes(j: string): { notes: { t: number; lane: number; snd: string }[]; lanes: number[]; fall: number } {
  const cfg = j === 'sd' ? { step: 0.55, steps: 32, fall: 2.0, lanes: [0, 2, 3] } : j === 'smp' ? { step: 0.45, steps: 36, fall: 1.7, lanes: [0, 1, 2, 3] } : { step: 0.38, steps: 44, fall: 1.4, lanes: [0, 1, 2, 3] };
  const out: { t: number; lane: number; snd: string }[] = []; let mi = 0;
  for (let s = 0; s < cfg.steps; s++) {
    const t = s * cfg.step;
    if (s % 2 === 0) { out.push({ t, lane: 0, snd: `note${MELODY[mi++ % MELODY.length]}` }); }
    if (cfg.lanes.includes(1) && (s % 4 === 1 || (j === 'sma' && s % 4 === 3))) out.push({ t, lane: 1, snd: `note${MELODY[(mi + 2) % MELODY.length]}` });
    if (s % 8 === 4) out.push({ t, lane: cfg.lanes.includes(1) ? 2 : 1, snd: 'note1' });
    if (s % 16 === 15) out.push({ t, lane: cfg.lanes.includes(1) ? 3 : 2, snd: 'gong' });
  }
  return { notes: out, lanes: cfg.lanes, fall: cfg.fall };
}

export default function Rhythm({ jenjang, onDone, onExit }: GameProps) {
  const { width, height } = useWindowDimensions();
  const plan = useMemo(() => buildNotes(jenjang), [jenjang]);
  const laneDefs = plan.lanes.map((i, k) => ({ ...LANES[i], lane: k }));
  // untuk SD (3 jalur) petakan: saron, kenong, gong
  const L = laneDefs.length;
  const W = Math.min(width - 24, 440), laneW = W / L;
  const H = Math.max(260, Math.min(height - 250, 470)); const hitY = H - 60;
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [, setTick] = useState(0);
  const notes = useRef<Note[]>([]);
  const startAt = useRef(0);
  const stats = useRef({ p: 0, g: 0, m: 0, combo: 0, best: 0 });
  const pops = useRef<{ lane: number; text: string; t: number; c: string }[]>([]);
  const flash = useRef<number[]>([]);
  const ended = useRef(false);

  const begin = () => {
    notes.current = plan.notes.map((n) => ({ ...n, t: n.t + plan.fall + 0.6, state: 0 as const }));
    stats.current = { p: 0, g: 0, m: 0, combo: 0, best: 0 }; pops.current = []; flash.current = new Array(L).fill(0); ended.current = false;
    startAt.current = performance.now() / 1000 + 2.4; setPhase('play'); sfx('start');
  };
  const nowS = () => performance.now() / 1000 - startAt.current;

  const hit = (lane: number) => {
    if (phase !== 'play') return;
    const t = nowS(); flash.current[lane] = performance.now();
    let best: Note | null = null;
    for (const n of notes.current) if (n.lane === lane && n.state === 0 && Math.abs(n.t - t) < 0.22 && (!best || n.t < best.t)) best = n;
    if (!best) { sfx('tap', 0.2); return; }
    const d = Math.abs(best.t - t);
    best.state = d < 0.09 ? 1 : 2; const s = stats.current;
    if (best.state === 1) s.p++; else s.g++;
    s.combo++; s.best = Math.max(s.best, s.combo);
    pops.current.push({ lane, text: best.state === 1 ? 'Sempurna!' : 'Bagus', t: performance.now(), c: best.state === 1 ? C.gold : C.green });
    sfx(best.snd, 0.9);
  };
  const hitRef = useRef(hit); hitRef.current = hit;

  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = nowS(); const s = stats.current;
      for (const n of notes.current) if (n.state === 0 && t - n.t > 0.22) { n.state = 3; s.m++; s.combo = 0; pops.current.push({ lane: n.lane, text: 'Meleset', t: performance.now(), c: C.red }); }
      if (!ended.current && notes.current.every((n) => n.state !== 0) && t > 1) { ended.current = true; setTimeout(() => setPhase('result'), 600); }
      setTick((x) => (x + 1) & 0xffff);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const down = (e: KeyboardEvent) => { if (e.repeat) return; const i = laneDefs.findIndex((l) => l.key === e.key.toLowerCase()); if (i >= 0) hitRef.current(i); };
    window.addEventListener('keydown', down); return () => window.removeEventListener('keydown', down);
  }, [L]);

  const total = plan.notes.length; const st = stats.current;
  const acc = total ? (st.p + st.g * 0.6) / total : 0;
  const stars = acc >= 0.8 ? 3 : acc >= 0.55 ? 2 : acc >= 0.3 ? 1 : 0;

  if (phase === 'intro') return (
    <GameShell title="Tabuh Gamelan" onClose={onExit}>
      <Intro emoji="🥁" title="Jadi penabuh gamelan" lines={['Nada emas jatuh ke garis. Tekan jalur yang sama tepat saat nada menyentuh garis.', Platform.OS === 'web' ? `Bisa pakai tombol ${laneDefs.map((l) => l.key.toUpperCase()).join(' ')} atau sentuh jalurnya.` : 'Sentuh jalur di bagian bawah layar.', 'Gong besar menandai akhir satu putaran lagu. Jangan sampai terlewat!']} onStart={begin} />
    </GameShell>
  );
  if (phase === 'result') return (
    <GameShell title="Tabuh Gamelan" onClose={onExit}>
      <ResultCard win={stars > 0} stars={stars} score={`Sempurna ${st.p} · Bagus ${st.g} · Meleset ${st.m}`} lines={[`Beruntun terbaik: ${st.best}`, stars === 0 ? 'Latihan sekali lagi, ikuti iramanya!' : '']} onRetry={() => setPhase('intro')} onDone={() => (stars > 0 ? onDone({ stars, score: Math.round(acc * 100) }) : onExit())} />
    </GameShell>
  );

  const t = nowS(); const count = Math.ceil(-t + plan.fall * 0);
  return (
    <GameShell title="Tabuh Gamelan" onClose={onExit} right={<Txt size={13} bold color={C.goldSoft}>x{st.combo}</Txt>}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ width: W, height: H, backgroundColor: '#150e09', borderRadius: 12, borderWidth: 3, borderColor: C.line, overflow: 'hidden' }}>
          {laneDefs.map((l, k) => (
            <View key={k} style={{ position: 'absolute', left: k * laneW, top: 0, width: laneW, height: H, backgroundColor: k % 2 ? '#ffffff08' : '#00000022', borderRightWidth: 1, borderColor: '#ffffff14' }}>
              {performance.now() - (flash.current[k] || 0) < 120 ? <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H, backgroundColor: l.color + '22' }} /> : null}
            </View>
          ))}
          <View style={{ position: 'absolute', left: 0, right: 0, top: hitY - 3, height: 6, backgroundColor: C.gold, opacity: 0.9, shadowColor: C.gold, shadowOpacity: 1, shadowRadius: 8 }} />
          {notes.current.map((n, i) => {
            if (n.state !== 0 && n.state !== 3) return null;
            const y = hitY - ((n.t - t) / plan.fall) * hitY;
            if (y < -30 || y > H + 20) return null;
            const l = laneDefs[n.lane];
            return <View key={i} style={{ position: 'absolute', left: n.lane * laneW + laneW / 2 - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, backgroundColor: n.state === 3 ? '#555' : l.color, borderWidth: 4, borderColor: '#0006', opacity: n.state === 3 ? 0.4 : 1, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff6' }} /></View>;
          })}
          {pops.current.filter((p) => performance.now() - p.t < 500).slice(-4).map((p, i) => (
            <Txt key={i} bold size={14} color={p.c} style={{ position: 'absolute', left: p.lane * laneW, width: laneW, textAlign: 'center', top: hitY - 50 - (performance.now() - p.t) / 12 }}>{p.text}</Txt>
          ))}
          {t < 0 ? <View style={{ position: 'absolute', left: 0, right: 0, top: H / 2 - 40, alignItems: 'center' }}><Txt size={54} bold color={C.gold}>{Math.min(3, Math.max(1, Math.ceil(-t)))}</Txt></View> : null}
        </View>
        <View style={{ width: W, flexDirection: 'row', gap: 4 }}>
          {laneDefs.map((l, k) => (
            <Pressable key={k} testID={`lane-${k}`} onPressIn={() => hit(k)} style={({ pressed }) => ({ flex: 1, height: 84, borderRadius: 14, backgroundColor: l.color, borderBottomWidth: pressed ? 2 : 7, borderColor: '#0007', alignItems: 'center', justifyContent: 'center', transform: [{ translateY: pressed ? 4 : 0 }] })}>
              <Txt bold color="#2b1b0c" size={15}>{l.name}</Txt>
              {Platform.OS === 'web' ? <Txt size={11} bold color="#2b1b0c99">{l.key.toUpperCase()}</Txt> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </GameShell>
  );
}
