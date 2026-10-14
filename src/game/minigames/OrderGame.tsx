import React, { useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import type { GameProps } from '../types';
import { ORDERS } from '../../data/content';
import { Btn, GameShell, Hearts, Intro, Panel, ResultCard, Txt, useShake } from '../ui';
import { C } from '../theme';
import { sfx } from '../../lib/sound';

const shuffle = <T,>(a: T[]) => { let r = [...a]; for (let k = 0; k < 6; k++) { for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } if (r.join() !== a.join()) break; } return r; };

export default function OrderGame({ jenjang, cfg, onDone, onExit }: GameProps) {
  const def = ORDERS[cfg?.set || 'tungku'];
  const [phase, setPhase] = useState<'intro' | 'play' | 'note' | 'result' | 'fail'>('intro');
  const [round, setRound] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [seed, setSeed] = useState(0);
  const { shake, style } = useShake();
  const r = def.rounds[round];
  const bank = useMemo(() => shuffle(r.items.map((t, i) => ({ t, i }))), [round, seed]);
  const used = placed.length;
  const words = def.mode === 'words';

  const pick = (t: string) => {
    if (r.items[used] === t) { sfx('correct', 0.6); const p = [...placed, t]; setPlaced(p); if (p.length === r.items.length) setTimeout(() => setPhase('note'), 500); return; }
    sfx('wrong'); shake(); setMistakes((m) => m + 1);
    setHearts((h) => { const n = h - 1; if (n <= 0) setTimeout(() => setPhase('fail'), 350); return n; });
  };
  const nextRound = () => { if (round + 1 >= def.rounds.length) setPhase('result'); else { setRound(round + 1); setPlaced([]); setPhase('play'); } };
  const restart = () => { setRound(0); setPlaced([]); setHearts(3); setMistakes(0); setSeed((s) => s + 1); setPhase('play'); };
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;

  if (phase === 'intro') return (
    <GameShell title={def.title} onClose={onExit}>
      <Intro emoji={words ? '🗣️' : '📜'} title={words ? 'Susun kalimat Jawa' : 'Susun urutan'} lines={[words ? 'Ketuk kata satu per satu sesuai urutan kalimat yang benar.' : 'Ketuk langkah satu per satu sesuai urutan yang benar, dari awal.', 'Salah ketuk = kehilangan satu hati. Ada 3 hati.', words ? 'Ada petunjuk arti kata di bawah soal.' : 'Pikirkan apa yang dilakukan lebih dulu.']} onStart={() => setPhase('play')} />
    </GameShell>
  );
  if (phase === 'fail') return (
    <GameShell title={def.title} onClose={onExit}>
      <ResultCard win={false} stars={0} lines={['Hatimu habis. Coba lagi, kamu pasti bisa!']} onRetry={restart} onDone={onExit} />
    </GameShell>
  );
  if (phase === 'result') return (
    <GameShell title={def.title} onClose={onExit}>
      <ResultCard win stars={stars} score={`Salah: ${mistakes}`} onRetry={restart} onDone={() => onDone({ stars, score: Math.max(0, 100 - mistakes * 15) })} />
    </GameShell>
  );
  if (phase === 'note') return (
    <GameShell title={def.title} onClose={onExit}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 }}>
        <Panel tone="light" style={{ width: '100%', maxWidth: 460, gap: 10 }}>
          <Txt size={20} bold color={C.gold} center>Benar!</Txt>
          <Txt center bold>{words ? placed.join(' ') + '.' : ''}</Txt>
          {words ? <Txt center color={C.muted}>{r.prompt}</Txt> : null}
          {r.note ? <Txt center>{r.note}</Txt> : null}
          <Btn testID="order-next" label={round + 1 >= def.rounds.length ? 'Selesai' : 'Lanjut'} onPress={nextRound} />
        </Panel>
      </View>
    </GameShell>
  );
  return (
    <GameShell title={def.title} onClose={onExit} right={<Hearts n={hearts} size={16} />}>
      <ScrollView contentContainerStyle={{ padding: 14, alignItems: 'center', gap: 14 }}>
        <Panel style={{ width: '100%', maxWidth: 480, gap: 4 }}>
          {def.rounds.length > 1 ? <Txt size={12} color={C.muted}>Soal {round + 1}/{def.rounds.length}</Txt> : null}
          <Txt bold size={17}>{r.prompt}</Txt>
          {r.hint ? <Txt size={12} color={C.goldSoft}>Petunjuk: {r.hint}</Txt> : null}
        </Panel>
        <Animated.View style={[{ width: '100%', maxWidth: 480, minHeight: 90, gap: 6, flexDirection: words ? 'row' : 'column', flexWrap: 'wrap', backgroundColor: '#0003', borderRadius: 12, padding: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: C.line }, style]}>
          {placed.length === 0 ? <Txt color={C.muted} size={13}>Susunanmu muncul di sini…</Txt> : null}
          {placed.map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.greenDark, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 }}>
              {!words ? <Txt bold color="#fff">{i + 1}.</Txt> : null}<Txt bold color="#fff">{t}</Txt>
            </View>
          ))}
        </Animated.View>
        <View style={{ width: '100%', maxWidth: 480, gap: 8, flexDirection: words ? 'row' : 'column', flexWrap: 'wrap', justifyContent: 'center' }}>
          {bank.map(({ t }, k) => placed.includes(t) ? null : (
            <Pressable key={k} testID={`chip-${k}`} onPress={() => pick(t)} style={({ pressed }) => ({ backgroundColor: C.panel2, borderColor: C.gold, borderWidth: 2, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, transform: [{ scale: pressed ? 0.96 : 1 }] })}>
              <Txt bold center>{t}</Txt>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </GameShell>
  );
}
