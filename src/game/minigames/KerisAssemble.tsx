import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { GameProps } from '../types';
import { KERIS_PARTS } from '../../data/content';
import { Btn, GameShell, Intro, Panel, ResultCard, Txt } from '../ui';
import { C } from '../theme';
import { sfx } from '../../lib/sound';

// koordinat viewBox 0..100
const HOT: Record<string, { x: number; y: number; tx: number; ty: number }> = {
  hulu: { x: 12, y: 8, tx: 12, ty: 21 },
  luk: { x: 42, y: 8, tx: 42, ty: 27 },
  pamor: { x: 74, y: 8, tx: 72, ty: 31 },
  mendak: { x: 24, y: 50, tx: 23.5, ty: 38 },
  bilah: { x: 62, y: 50, tx: 62, ty: 37 },
  warangka: { x: 14, y: 95, tx: 14, ty: 86 },
  pendok: { x: 60, y: 95, tx: 60, ty: 86 },
};
const bladeY = (x: number) => 31 + 3.2 * Math.sin(((x - 25) / 71) * Math.PI * 5);
const hw = (x: number) => 5.4 * (1 - (x - 25) / 71) + 0.9;
function bladePath() {
  const top: string[] = [], bot: string[] = [];
  for (let x = 25; x <= 96; x += 1.5) { top.push(`${x.toFixed(1)} ${(bladeY(x) - hw(x)).toFixed(1)}`); bot.push(`${x.toFixed(1)} ${(bladeY(x) + hw(x)).toFixed(1)}`); }
  return `M${top.join(' L')} L${bot.reverse().join(' L')} Z`;
}
const shuffle = <T,>(a: T[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

function Chip({ label, selected, onDrop, onTap, disabled }: { label: string; selected: boolean; onDrop: (wx: number, wy: number) => boolean; onTap: () => void; disabled?: boolean }) {
  const pos = useRef(new Animated.ValueXY()).current;
  const [drag, setDrag] = useState(false);
  const refs = useRef({ onDrop, onTap }); refs.current = { onDrop, onTap };
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true, onMoveShouldSetPanResponder: () => true, onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => setDrag(true),
    onPanResponderMove: (_, g) => pos.setValue({ x: g.dx, y: g.dy }),
    onPanResponderRelease: (_, g) => {
      setDrag(false);
      if (Math.abs(g.dx) < 8 && Math.abs(g.dy) < 8) { Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(); refs.current.onTap(); return; }
      const ok = refs.current.onDrop(g.moveX, g.moveY);
      if (!ok) Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 6 }).start();
    },
    onPanResponderTerminate: () => { setDrag(false); Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(); },
  }), []);
  return (
    <Animated.View {...pan.panHandlers} style={[{ transform: pos.getTranslateTransform(), zIndex: drag ? 99 : 1, opacity: disabled ? 0.4 : 1, backgroundColor: selected ? C.gold : C.panel2, borderColor: C.gold, borderWidth: 2, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, minWidth: 86, alignItems: 'center' }, { touchAction: 'none', cursor: 'grab' } as any]}>
      <Txt bold color={selected ? '#2b1b0c' : C.text}>{label}</Txt>
    </Animated.View>
  );
}

export default function KerisAssemble({ jenjang, onDone, onExit }: GameProps) {
  const { width, height } = useWindowDimensions();
  const W = Math.max(250, Math.min(width - 20, height - 330, 430));
  const lvl = jenjang === 'sd' ? 1 : jenjang === 'smp' ? 2 : 3;
  const active = KERIS_PARTS.filter((p) => p.lvl <= lvl);
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [solved, setSolved] = useState<string[]>([]);
  const [mist, setMist] = useState(0);
  const [msg, setMsg] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const chips = useMemo(() => shuffle(active.map((p) => p.id)), [round, lvl]);
  const board = useRef<View>(null);
  const origin = useRef({ x: 0, y: 0 });
  const measure = () => board.current?.measureInWindow((x, y) => { origin.current = { x, y }; });

  const place = (partId: string, hotId: string) => {
    const p = KERIS_PARTS.find((k) => k.id === partId)!;
    if (partId === hotId) {
      sfx('correct'); const s = [...solved, partId]; setSolved(s); setSel(null); setMsg(`${p.label}: ${p.info}`);
      if (s.length === active.length) setTimeout(() => setPhase('result'), 900);
      return true;
    }
    sfx('wrong'); setMist((m) => m + 1); setMsg(`Hmm, ${p.label} bukan di sini. ${p.info}`); setSel(null);
    return false;
  };
  const dropAt = (partId: string, wx: number, wy: number) => {
    measure();
    let best: string | null = null, bd = 9999;
    for (const a of active) { if (solved.includes(a.id)) continue; const h = HOT[a.id]; const cx = origin.current.x + (h.x / 100) * W, cy = origin.current.y + (h.y / 100) * W; const d = Math.hypot(wx - cx, wy - cy); if (d < bd) { bd = d; best = a.id; } }
    if (best && bd < 44) return place(partId, best);
    return false;
  };
  const stars = mist === 0 ? 3 : mist <= 2 ? 2 : 1;
  const reset = () => { setSolved([]); setMist(0); setMsg(''); setSel(null); setRound((r) => r + 1); setPhase('play'); };
  const bladeD = useMemo(bladePath, []);

  if (phase === 'intro') return (
    <GameShell title="Anatomi Keris" onClose={onExit}>
      <Intro emoji="🗡️" title="Kenali bagian-bagian keris" lines={['Keris adalah pusaka dan karya seni Jawa. Di sini kita belajar nama bagiannya.', 'Seret nama ke lingkaran bernomor yang tepat (atau ketuk nama lalu ketuk lingkarannya).', 'Setiap jawaban benar membuka penjelasan singkat.']} onStart={() => setPhase('play')} />
    </GameShell>
  );
  if (phase === 'result') return (
    <GameShell title="Anatomi Keris" onClose={onExit}>
      <ResultCard win stars={stars} score={`Salah taruh: ${mist}`} lines={['Kamu sudah mengenal anatomi keris!']} onRetry={reset} onDone={() => onDone({ stars, score: Math.max(0, 100 - mist * 12) })} />
    </GameShell>
  );

  return (
    <GameShell title="Anatomi Keris" onClose={onExit} right={<Txt size={13} bold color={C.goldSoft}>{solved.length}/{active.length}</Txt>}>
      <View style={{ alignItems: 'center', gap: 8, zIndex: 10 }}>
        <View ref={board} onLayout={measure} style={{ width: W, height: W, backgroundColor: '#efe3c5', borderRadius: 12, borderWidth: 3, borderColor: C.line, overflow: 'hidden' }}>
          <Svg width={W} height={W} viewBox="0 0 100 100">
            {/* hulu */}
            <Path d="M4 28 Q4 17 13 17 Q22 17 22 27 L22 39 Q13 46 4 39 Z" fill="#a8741a" stroke="#4a2f1c" strokeWidth={0.9} />
            <Circle cx={10} cy={26} r={1.2} fill="#4a2f1c" /><Circle cx={15} cy={30} r={1} fill="#e8b93c" /><Path d="M7 35 Q13 38 19 35" stroke="#4a2f1c" strokeWidth={0.7} fill="none" />
            {/* mendak */}
            <Rect x={22} y={26} width={4} height={14} fill="#e8b93c" stroke="#4a2f1c" strokeWidth={0.7} />
            {/* bilah */}
            <Path d={bladeD} fill="#c4c8cf" stroke="#3a3d45" strokeWidth={0.8} />
            {[30, 38, 46, 54, 61, 68, 75, 82].map((x, i) => <Circle key={i} cx={x} cy={bladeY(x) + (i % 2 ? 1 : -1)} r={0.9} fill="#6c7078" />)}
            <Path d={`M26 ${bladeY(26)} ${Array.from({ length: 24 }).map((_, i) => `L${(26 + i * 2.9).toFixed(1)} ${bladeY(26 + i * 2.9).toFixed(1)}`).join(' ')}`} stroke="#8a8d96" strokeWidth={0.5} fill="none" />
            {/* warangka */}
            <Path d="M4 76 Q4 64 15 64 L60 66 Q92 68 96 76 Q92 85 60 86 L15 88 Q4 88 4 76 Z" fill="#6b3b1b" stroke="#2a1a12" strokeWidth={0.9} />
            <Path d="M8 70 Q40 66 85 72" stroke="#a36a38" strokeWidth={0.8} fill="none" />
            <Rect x={48} y={65} width={22} height={21} fill="#e8b93c" stroke="#7a5a10" strokeWidth={0.8} />
            {[0, 1, 2].map((i) => <Path key={i} d={`M${51 + i * 6} 70 L${54 + i * 6} 75 L${51 + i * 6} 80`} stroke="#7a5a10" strokeWidth={0.8} fill="none" />)}
            {/* garis penunjuk + label */}
            {KERIS_PARTS.map((p) => {
              const h = HOT[p.id]; const isActive = lvl >= p.lvl; const done = solved.includes(p.id);
              return (
                <G key={p.id}>
                  <Line x1={h.x} y1={h.y} x2={h.tx} y2={h.ty} stroke={isActive ? (done ? '#2f8a45' : '#a63a34') : '#555'} strokeWidth={0.7} strokeDasharray={isActive ? undefined : '1.5,1.5'} />
                  {!isActive || done ? (
                    <G><Rect x={h.x - 11} y={h.y - 4} width={22} height={8} rx={2} fill={done ? '#2f8a45' : '#4a4a4a'} /><SvgText x={h.x} y={h.y + 1.6} fontSize={4.4} fill="#fff" fontWeight="bold" textAnchor="middle">{p.label}</SvgText></G>
                  ) : (
                    <G><Circle cx={h.x} cy={h.y} r={5.4} fill={sel ? '#ffe9a8' : '#fff'} stroke="#a63a34" strokeWidth={0.9} strokeDasharray="2,1.2" /><SvgText x={h.x} y={h.y + 1.8} fontSize={5.5} fill="#a63a34" fontWeight="bold" textAnchor="middle">{active.findIndex((a) => a.id === p.id) + 1}</SvgText></G>
                  )}
                </G>
              );
            })}
          </Svg>
          {/* area ketuk untuk memilih (mode ketuk) */}
          {active.filter((a) => !solved.includes(a.id)).map((a) => {
            const h = HOT[a.id];
            return <View key={a.id} testID={`hot-${a.id}`} onStartShouldSetResponder={() => true} onResponderRelease={() => { if (sel) place(sel, a.id); }} style={{ position: 'absolute', left: (h.x / 100) * W - 24, top: (h.y / 100) * W - 24, width: 48, height: 48, borderRadius: 24 }} />;
          })}
        </View>
        <Panel style={{ width: W, minHeight: 56, justifyContent: 'center', paddingVertical: 8 }}><Txt size={13} center color={msg ? C.text : C.muted}>{msg || 'Seret nama bagian ke lingkaran bernomor di gambar.'}</Txt></Panel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', width: W + 10 }}>
          {chips.map((id) => solved.includes(id) ? null : (
            <Chip key={id} label={KERIS_PARTS.find((p) => p.id === id)!.label} selected={sel === id} onTap={() => setSel(sel === id ? null : id)} onDrop={(wx, wy) => dropAt(id, wx, wy)} />
          ))}
        </View>
        {sel ? <Txt size={12} color={C.goldSoft}>Ketuk lingkaran bernomor untuk menaruh “{KERIS_PARTS.find((p) => p.id === sel)!.label}”.</Txt> : null}
      </View>
    </GameShell>
  );
}
