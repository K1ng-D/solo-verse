import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import type { GameProps, BatikWork } from '../types';
import { BatikCloth } from './batikLib';
import { Bar, Btn, GameShell, Hearts, Intro, Panel, ResultCard, Stars, Txt } from '../ui';
import { C } from '../theme';
import { sfx } from '../../lib/sound';

type Rgb = [number, number, number];
const PIG: { id: string; name: string; rgb: Rgb; css: string }[] = [
  { id: 'r', name: 'Merah', rgb: [200, 45, 45], css: '#c82d2d' },
  { id: 'y', name: 'Kuning', rgb: [245, 200, 40], css: '#f5c828' },
  { id: 'b', name: 'Biru', rgb: [40, 70, 170], css: '#2846aa' },
  { id: 'w', name: 'Putih', rgb: [245, 245, 240], css: '#f5f5f0' },
  { id: 'k', name: 'Hitam', rgb: [30, 25, 25], css: '#1e1919' },
];
const mix = (counts: Record<string, number>): Rgb => {
  let n = 0; const t: Rgb = [0, 0, 0];
  for (const p of PIG) { const c = counts[p.id] || 0; n += c; t[0] += p.rgb[0] * c; t[1] += p.rgb[1] * c; t[2] += p.rgb[2] * c; }
  return n ? [t[0] / n, t[1] / n, t[2] / n] : [235, 225, 200];
};
const css = (c: Rgb) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
const hex = (c: Rgb) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const dist = (a: Rgb, b: Rgb) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

type Target = { name: string; rec: Record<string, number>; fact: string };
const TARGETS: Record<string, Target[]> = {
  sd: [
    { name: 'Jingga', rec: { r: 1, y: 1 }, fact: 'Merah + kuning = jingga, warna hangat seperti matahari terbit.' },
    { name: 'Hijau Daun', rec: { y: 1, b: 1 }, fact: 'Kuning + biru = hijau, warna daun.' },
    { name: 'Ungu', rec: { r: 1, b: 1 }, fact: 'Merah + biru = ungu.' },
  ],
  smp: [
    { name: 'Jingga', rec: { r: 1, y: 1 }, fact: 'Merah + kuning = jingga.' },
    { name: 'Hijau Daun', rec: { y: 2, b: 1 }, fact: 'Lebih banyak kuning membuat hijau lebih cerah.' },
    { name: 'Cokelat Sogan', rec: { r: 2, y: 2, b: 1, k: 2 }, fact: 'Sogan adalah cokelat khas batik Solo, secara tradisional dari kulit pohon soga.' },
  ],
  sma: [
    { name: 'Indigo (Nila)', rec: { b: 3, k: 1 }, fact: 'Indigo/nila secara tradisional dari tanaman Indigofera; biru tua khas kain batik.' },
    { name: 'Merah Soga', rec: { r: 3, y: 1, k: 1 }, fact: 'Merah kecokelatan hangat yang sering dipakai pada batik klasik.' },
    { name: 'Cokelat Sogan', rec: { r: 2, y: 2, b: 1, k: 2 }, fact: 'Sogan: cokelat khas batik Solo-Yogya; secara tradisional dari kulit kayu soga.' },
  ],
};
const THR: Record<string, number> = { sd: 58, smp: 44, sma: 32 };
const MAXDROP = 10;

export default function ColorMix({ jenjang, cfg, onDone, onExit }: GameProps) {
  const work: BatikWork | null = cfg?.work || null;
  const targets = TARGETS[jenjang];
  const thr = THR[jenjang];
  const pigments = jenjang === 'sd' ? PIG.slice(0, 3) : jenjang === 'smp' ? [...PIG.slice(0, 3), PIG[4]] : PIG;
  const [phase, setPhase] = useState<'intro' | 'mix' | 'pick' | 'dye' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [made, setMade] = useState<{ name: string; css: string }[]>([]);
  const [resets, setResets] = useState(0);
  const [chosen, setChosen] = useState(0);
  const [dyed, setDyed] = useState(false);
  const [lorod, setLorod] = useState(false);
  const [okMsg, setOkMsg] = useState('');
  const pulse = useRef(new Animated.Value(1)).current;

  const target = targets[round];
  const tRgb = useMemo(() => mix(target.rec), [round]);
  const cur = mix(counts);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const d = total ? dist(cur, tRgb) : 999;
  const sim = Math.max(0, Math.min(1, 1 - d / 160));
  const match = total > 0 && d <= thr;

  const add = (id: string) => {
    if (total >= MAXDROP || okMsg) return;
    setCounts((c) => ({ ...c, [id]: (c[id] || 0) + 1 })); sfx('tap', 0.4);
    pulse.setValue(1.12); Animated.spring(pulse, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  };
  const reset = () => { setCounts({}); setResets((r) => r + 1); };
  const confirm = () => { sfx('correct'); setOkMsg(target.fact); setMade((m) => [...m, { name: target.name, css: css(tRgb) }]); };
  const next = () => { setOkMsg(''); setCounts({}); if (round + 1 >= targets.length) setPhase('pick'); else setRound(round + 1); };

  if (phase === 'intro') return (
    <GameShell title="Celup Warna" onClose={onExit}>
      <Intro emoji="🎨" title="Campur pewarna" lines={['Tekan pigmen untuk meneteskan warna ke mangkuk.', 'Buat warnamu semirip warna target. Batas 10 tetes.', 'Setelah 3 warna jadi, pilih satu untuk mencelup kain batikmu.']} onStart={() => setPhase('mix')} />
    </GameShell>
  );

  if (phase === 'mix') return (
    <GameShell title={`Warna ${round + 1}/${targets.length}`} onClose={onExit}>
      <ScrollView contentContainerStyle={{ padding: 14, alignItems: 'center', gap: 12 }}>
        <Panel style={{ width: '100%', maxWidth: 460, alignItems: 'center', gap: 6 }}>
          <Txt size={13} color={C.muted}>Buat warna:</Txt>
          <Txt size={22} bold color={C.gold}>{target.name}</Txt>
          <View style={{ flexDirection: 'row', gap: 22, alignItems: 'center', marginTop: 6 }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: css(tRgb), borderWidth: 4, borderColor: '#2a1d12' }} />
              <Txt size={12} bold>Target</Txt>
            </View>
            <Txt size={26} color={C.gold}>≈</Txt>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Animated.View testID="bowl" style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: total ? css(cur) : '#e6dcc0', borderWidth: 4, borderColor: match ? C.green : '#2a1d12', transform: [{ scale: pulse }] }} />
              <Txt size={12} bold>Campuranmu</Txt>
            </View>
          </View>
          <View style={{ width: '100%', marginTop: 8, gap: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt size={12} color={C.muted}>Kemiripan</Txt><Txt size={12} bold color={match ? C.green : C.goldSoft}>{match ? 'Pas!' : `${Math.round(sim * 100)}%`}</Txt></View>
            <Bar value={sim} h={12} color={match ? C.green : C.gold} />
          </View>
          <Txt size={12} color={C.muted}>Tetes: {total}/{MAXDROP}</Txt>
        </Panel>
        {okMsg ? (
          <Panel tone="light" style={{ width: '100%', maxWidth: 460, gap: 8 }}>
            <Txt bold color={C.gold}>Warna {target.name} jadi!</Txt>
            <Txt>{okMsg}</Txt>
            <Btn testID="mix-next" label={round + 1 >= targets.length ? 'Pilih warna celup' : 'Warna berikutnya'} onPress={next} />
          </Panel>
        ) : (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {pigments.map((p) => (
                <Pressable key={p.id} testID={`pig-${p.id}`} onPress={() => add(p.id)} style={({ pressed }) => ({ alignItems: 'center', gap: 4, transform: [{ scale: pressed ? 0.92 : 1 }] })}>
                  <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: p.css, borderWidth: 4, borderColor: '#2a1d12', alignItems: 'center', justifyContent: 'center' }}>
                    <Txt size={22} bold color={p.id === 'w' ? '#333' : '#fff'}>{counts[p.id] ? counts[p.id] : '+'}</Txt>
                  </View>
                  <Txt size={12} bold>{p.name}</Txt>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn kind="dark" label="Ulang" onPress={reset} />
              <Btn kind="green" label="Warna pas!" testID="mix-ok" disabled={!match} onPress={confirm} />
            </View>
            {total >= MAXDROP && !match ? <Txt color={C.red} size={13} center>Tetes habis. Tekan Ulang, lalu coba komposisi lain.</Txt> : null}
          </>
        )}
      </ScrollView>
    </GameShell>
  );

  if (phase === 'pick' || phase === 'dye') {
    const dye = made[chosen];
    const strokes = work?.strokes || [];
    return (
      <GameShell title={phase === 'pick' ? 'Pilih Warna Celup' : 'Mencelup Kain'} onClose={onExit}>
        <ScrollView contentContainerStyle={{ padding: 14, alignItems: 'center', gap: 12 }}>
          {phase === 'pick' ? (
            <>
              <Txt center>Pilih warna untuk mencelup kain batikmu:</Txt>
              <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                {made.map((m, i) => (
                  <Pressable key={i} testID={`dye-${i}`} onPress={() => setChosen(i)} style={{ alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 72, height: 72, borderRadius: 14, backgroundColor: m.css, borderWidth: 4, borderColor: chosen === i ? C.gold : '#2a1d12' }} />
                    <Txt size={12} bold color={chosen === i ? C.gold : C.text}>{m.name}</Txt>
                  </Pressable>
                ))}
              </View>
              <View style={{ borderWidth: 4, borderColor: '#6a4529', borderRadius: 6, overflow: 'hidden' }}><BatikCloth size={230} strokes={strokes} /></View>
              <Btn big label="Celup kain!" testID="dye-go" onPress={() => { setPhase('dye'); sfx('collect'); setTimeout(() => setDyed(true), 350); }} />
            </>
          ) : (
            <>
              <View style={{ borderWidth: 4, borderColor: '#6a4529', borderRadius: 6, overflow: 'hidden' }}>
                <BatikCloth size={270} strokes={strokes} dye={dyed ? dye.css : undefined} done={lorod} />
              </View>
              {!dyed ? <Txt color={C.muted}>Mencelup…</Txt> : !lorod ? (
                <>
                  <Txt center>Kain sudah berwarna {dye.name}. Garis malam masih menempel (cokelat keemasan).</Txt>
                  <Btn big testID="lorod" label="Nglorod: lepas malam!" onPress={() => { setLorod(true); sfx('win'); }} />
                </>
              ) : (
                <>
                  <Txt center bold color={C.gold}>Motif muncul! Malam menahan warna, jadi garis tetap terang.</Txt>
                  <Btn big testID="mix-finish" label="Selesai" onPress={() => {
                    const stars = resets <= 1 ? 3 : resets <= 4 ? 2 : 1;
                    onDone({ stars, score: Math.max(0, 100 - resets * 10), data: { dye: dye.css, dyeName: dye.name } });
                  }} />
                </>
              )}
            </>
          )}
        </ScrollView>
      </GameShell>
    );
  }
  return null;
}
