import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { GameProps } from '../types';
import { SORTS } from '../../data/content';
import { Bar, Btn, GameShell, Hearts, Intro, Panel, ResultCard, Txt, useShake } from '../ui';
import { C } from '../theme';
import { sfx } from '../../lib/sound';
import { Animated } from 'react-native';

const shuffle = <T,>(a: T[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

export default function RapidSort({ jenjang, cfg, onDone, onExit }: GameProps) {
  const set = SORTS[cfg?.set || 'tertib'];
  const N = jenjang === 'sd' ? 8 : jenjang === 'smp' ? 10 : 12;
  const T = jenjang === 'sd' ? 9 : jenjang === 'smp' ? 7 : 5;
  const [seed, setSeed] = useState(0);
  const items = useMemo(() => shuffle(set.items).slice(0, N), [seed]);
  const [phase, setPhase] = useState<'intro' | 'play' | 'result' | 'fail'>('intro');
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [ok, setOk] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(T);
  const [fb, setFb] = useState<null | { good: boolean; note: string }>(null);
  const { shake, style } = useShake();
  const lock = useRef(false);

  useEffect(() => {
    if (phase !== 'play' || fb) return;
    setTime(T);
    const t0 = Date.now();
    const id = setInterval(() => {
      const left = T - (Date.now() - t0) / 1000; setTime(Math.max(0, left));
      if (left <= 0) { clearInterval(id); answer(null); }
    }, 100);
    return () => clearInterval(id);
  }, [phase, i, fb]);

  const advance = (h: number) => {
    setFb(null); lock.current = false;
    if (h <= 0) { setPhase('fail'); return; }
    if (i + 1 >= items.length) setPhase('result'); else setI(i + 1);
  };
  const answer = (cat: string | null) => {
    if (lock.current || fb) return; lock.current = true;
    const it = items[i]; const good = cat === it.cat;
    let h = hearts;
    if (good) { sfx('correct', 0.6); setOk((o) => o + 1); setStreak((s) => s + 1); } else { sfx('wrong'); shake(); h = hearts - 1; setHearts(h); setStreak(0); }
    setFb({ good, note: (cat === null ? 'Waktu habis. ' : '') + it.note });
    setTimeout(() => advance(h), good ? 900 : 1700);
  };
  const acc = ok / items.length;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const restart = () => { setSeed((s) => s + 1); setI(0); setHearts(3); setOk(0); setStreak(0); setFb(null); lock.current = false; setPhase('play'); };

  if (phase === 'intro') return (
    <GameShell title={set.title} onClose={onExit}>
      <Intro emoji="⚡" title="Pilah cepat!" lines={[set.prompt, `Setiap kartu hanya punya ${T} detik.`, 'Salah atau kehabisan waktu = kehilangan satu hati.']} onStart={() => setPhase('play')} />
    </GameShell>
  );
  if (phase === 'fail') return <GameShell title={set.title} onClose={onExit}><ResultCard win={false} stars={0} lines={['Hatimu habis. Pelan-pelan, coba lagi!']} onRetry={restart} onDone={onExit} /></GameShell>;
  if (phase === 'result') return <GameShell title={set.title} onClose={onExit}><ResultCard win stars={stars} score={`Benar ${ok}/${items.length}`} onRetry={restart} onDone={() => onDone({ stars, score: Math.round(acc * 100) })} /></GameShell>;

  const it = items[i];
  return (
    <GameShell title={set.title} onClose={onExit} right={<Hearts n={hearts} size={16} />}>
      <View style={{ flex: 1, padding: 14, alignItems: 'center', gap: 14 }}>
        <View style={{ width: '100%', maxWidth: 480, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt size={12} color={C.muted}>Kartu {i + 1}/{items.length}</Txt><Txt size={12} bold color={C.goldSoft}>Beruntun: {streak}</Txt></View>
          <Bar value={time} max={T} h={10} color={time < 2 ? C.red : C.gold} />
        </View>
        <Animated.View style={[{ width: '100%', maxWidth: 480, flex: 1, maxHeight: 240, justifyContent: 'center' }, style]}>
          <Panel tone="light" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 150, borderColor: fb ? (fb.good ? C.green : C.red) : C.gold }}>
            <Txt size={13} color={C.muted} center>{set.prompt}</Txt>
            <Txt size={26} bold center color={C.cream} testID="sort-card">{it.text}</Txt>
            {fb ? <Txt center bold color={fb.good ? C.green : C.red} style={{ marginTop: 6 }}>{fb.good ? 'Tepat!' : 'Kurang tepat'}</Txt> : null}
            {fb ? <Txt size={13} center color={C.text}>{fb.note}</Txt> : null}
          </Panel>
        </Animated.View>
        <View style={{ flexDirection: 'row', gap: 10, width: '100%', maxWidth: 480 }}>
          {set.cats.map((c) => (
            <Pressable key={c.id} testID={`cat-${c.id}`} disabled={!!fb} onPress={() => answer(c.id)} style={({ pressed }) => ({ flex: 1, backgroundColor: c.color, borderRadius: 14, paddingVertical: 20, alignItems: 'center', borderBottomWidth: pressed ? 1 : 5, borderColor: '#0006', opacity: fb ? 0.55 : 1, transform: [{ translateY: pressed ? 4 : 0 }] })}>
              <Txt size={set.cats.length > 2 ? 15 : 20} bold color="#fff" center>{c.label}</Txt>
            </Pressable>
          ))}
        </View>
      </View>
    </GameShell>
  );
}
