import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, View } from 'react-native';
import type { GameProps } from '../types';
import { getQuestions, localQuestions, Q, Topic } from '../../data/quiz';
import { aiAvailable, aiMessage, explainWhy } from '../../lib/ai';
import { fx } from '../../data/assetMap';
import { Bar, Btn, GameShell, Hearts, Panel, ResultCard, Txt, useShake } from '../ui';
import { C, px } from '../theme';
import { sfx } from '../../lib/sound';
import { useGame } from '../state';

type Mode = 'exam' | 'encounter' | 'boss';
const TIME: Record<string, number> = { sd: 25, smp: 20, sma: 15 };

export default function QuizBattle({ jenjang, cfg, onDone, onExit }: GameProps) {
  const mode: Mode = cfg?.mode || 'exam';
  const topic: Topic | 'mix' = cfg?.topic || 'mix';
  const title: string = cfg?.title || 'Kuis';
  const total = mode === 'boss' ? (jenjang === 'sd' ? 8 : jenjang === 'smp' ? 10 : 12) : mode === 'encounter' ? 3 : (cfg?.count || 5);
  const maxHearts = mode === 'encounter' ? 2 : 3;
  const timeLimit = TIME[jenjang] - (mode === 'boss' ? 3 : 0);

  const [phase, setPhase] = useState<'load' | 'play' | 'win' | 'lose'>('load');
  const [qs, setQs] = useState<Q[]>([]);
  const [usedAi, setUsedAi] = useState(false);
  const [qi, setQi] = useState(0);
  const [hearts, setHearts] = useState(maxHearts);
  const [ok, setOk] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hp, setHp] = useState(total);
  const [sel, setSel] = useState<number | null>(null);
  const [time, setTime] = useState(timeLimit);
  const [hidden, setHidden] = useState<number[]>([]);
  const [charms, setCharms] = useState(mode === 'boss' ? 2 : mode === 'encounter' ? 1 : 0);
  const [why, setWhy] = useState('');
  const [whyBusy, setWhyBusy] = useState(false);
  const [hurt, setHurt] = useState(false);
  const [dmg, setDmg] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const lock = useRef(false);
  const { bump } = useGame();
  const { shake, style: shakeStyle } = useShake();
  const flash = useRef(new Animated.Value(0)).current;
  const bossShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true; setPhase('load');
    (async () => {
      const need = mode === 'boss' ? total + 4 : total;
      const r = await getQuestions(topic, jenjang, need, true);
      if (!alive) return;
      setQs(r.qs); setUsedAi(r.ai); setQi(0); setHearts(maxHearts); setOk(0); setWrong(0); setStreak(0); setHp(total); setSel(null); setHidden([]); setWhy('');
      setCharms(mode === 'boss' ? 2 : mode === 'encounter' ? 1 : 0); lock.current = false; setPhase('play');
    })();
    return () => { alive = false; };
  }, [round]);

  const q = qs[qi];
  useEffect(() => {
    if (phase !== 'play' || sel !== null) return;
    const t0 = Date.now(); setTime(timeLimit);
    const id = setInterval(() => { const left = timeLimit - (Date.now() - t0) / 1000; setTime(Math.max(0, left)); if (left <= 0) { clearInterval(id); answer(-1); } }, 120);
    return () => clearInterval(id);
  }, [phase, qi, sel]);

  const finishCheck = (h: number, o: number, newHp: number, idx: number) => {
    if (h <= 0) return 'lose';
    if (mode === 'boss') return newHp <= 0 ? 'win' : null;
    if (idx + 1 >= total) { if (mode === 'encounter') return o >= 2 ? 'win' : 'lose'; return o / total >= 0.6 ? 'win' : 'lose'; }
    return null;
  };

  const answer = (i: number) => {
    if (lock.current || !q) return; lock.current = true; setSel(i);
    const good = i === q.answer;
    let h = hearts, o = ok, nhp = hp, s = streak;
    if (good) {
      sfx('correct'); bump('correct'); o++; s++; setOk(o); setStreak(s);
      if (mode !== 'exam') { const d = s >= 3 ? 2 : 1; nhp = Math.max(0, hp - d); setHp(nhp); setDmg(`-${d}`); setHurt(true); sfx('hit'); setTimeout(() => { setHurt(false); setDmg(null); }, 450); Animated.sequence([Animated.timing(bossShake, { toValue: 1, duration: 60, useNativeDriver: true }), Animated.timing(bossShake, { toValue: -1, duration: 60, useNativeDriver: true }), Animated.timing(bossShake, { toValue: 0, duration: 60, useNativeDriver: true })]).start(); }
    } else {
      sfx(mode === 'exam' ? 'wrong' : 'hurt'); bump('wrong'); h = hearts - 1; setHearts(h); setWrong((w) => w + 1); s = 0; setStreak(0); shake();
      flash.setValue(0.5); Animated.timing(flash, { toValue: 0, duration: 450, useNativeDriver: true }).start();
    }
    const end = finishCheck(h, o, nhp, qi);
    if (good) { setTimeout(() => advance(end), end ? 900 : 1300); }
    else { setPendingEnd(end); }
  };
  const [pendingEnd, setPendingEnd] = useState<string | null>(null);
  const advance = (end: string | null) => {
    setPendingEnd(null); setWhy('');
    if (end) { setPhase(end as any); return; }
    // soal habis tetapi boss belum kalah: tambah soal lokal
    if (qi + 1 >= qs.length) { setQs((x) => [...x, ...localQuestions(topic, jenjang, 6)]); }
    setQi((x) => x + 1); setSel(null); setHidden([]); lock.current = false;
  };
  const useCharm = () => {
    if (!q || charms <= 0 || sel !== null) return;
    const wrongs = q.options.map((_, i) => i).filter((i) => i !== q.answer && !hidden.includes(i));
    setHidden([...hidden, ...wrongs.slice(0, 1)]); setCharms((c) => c - 1); sfx('collect');
  };

  const acc = ok / Math.max(1, ok + wrong);
  const stars = mode === 'boss' ? (hearts >= 3 ? 3 : hearts === 2 ? 2 : 1) : acc >= 0.9 ? 3 : acc >= 0.75 ? 2 : 1;

  if (phase === 'load') return (
    <GameShell title={title} onClose={onExit}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <ActivityIndicator color={C.gold} size="large" />
        <Txt color={C.muted}>{aiAvailable() ? 'Ki Wira menyiapkan soal (termasuk soal baru dari AI)…' : 'Menyiapkan soal…'}</Txt>
      </View>
    </GameShell>
  );
  if (phase === 'win') return (
    <GameShell title={title} onClose={onExit}>
      <ResultCard win stars={stars} title={mode === 'boss' ? 'Raksasa Terkalahkan!' : mode === 'encounter' ? 'Bayangan Lenyap!' : 'Lulus!'} score={`Benar ${ok} · Salah ${wrong}`} lines={usedAi ? ['Sebagian soal dibuat AI.'] : []} onRetry={mode === 'encounter' ? undefined : () => setRound((r) => r + 1)} onDone={() => onDone({ stars, score: Math.round(acc * 100), data: { win: true } })} />
    </GameShell>
  );
  if (phase === 'lose') return (
    <GameShell title={title} onClose={onExit}>
      <ResultCard win={false} stars={0} title={mode === 'exam' ? 'Belum lulus' : 'Kamu Terdesak!'} score={`Benar ${ok} · Salah ${wrong}`} lines={['Pelajari lagi dari wahana di sekitar, lalu coba lagi.']} onRetry={() => setRound((r) => r + 1)} onDone={() => onDone({ stars: 0, score: Math.round(acc * 100), fail: true, data: { win: false } })} />
    </GameShell>
  );
  if (!q) return null;
  const showEnemy = mode !== 'exam';
  const answered = sel !== null;
  return (
    <GameShell title={title} onClose={onExit} right={<Hearts n={hearts} max={maxHearts} size={16} />}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 5 }}><Animated.View style={{ flex: 1, backgroundColor: C.red, opacity: flash }} /></View>
      <ScrollView contentContainerStyle={{ padding: 12, alignItems: 'center', gap: 10, paddingBottom: 20 }}>
        {showEnemy ? (
          <View style={{ alignItems: 'center', gap: 4, width: '100%', maxWidth: 480 }}>
            <Animated.View style={{ transform: [{ translateX: bossShake.interpolate({ inputRange: [-1, 1], outputRange: [-12, 12] }) }] }}>
              {mode === 'boss'
                ? <Image source={hurt ? fx.boss_hurt : fx.boss} resizeMode="stretch" style={[{ width: 130, height: 140 }, px]} />
                : <View style={{ width: 90, height: 100, overflow: 'hidden' }}><Image source={fx.enemy_shadow} resizeMode="stretch" style={[{ width: 180, height: 100, left: hurt ? -90 : 0 }, px]} /></View>}
            </Animated.View>
            {dmg ? <Txt size={22} bold color={C.gold} style={{ position: 'absolute', top: 10, right: 60 }}>{dmg}</Txt> : null}
            <View style={{ width: '70%' }}><Bar value={hp} max={total} h={12} color={C.red} /></View>
            <Txt size={11} color={C.muted}>{mode === 'boss' ? 'Raksasa Bayangan Lupa' : 'Bayangan Lupa'} · Beruntun: {streak}{streak >= 3 ? ' (serangan ganda!)' : ''}</Txt>
          </View>
        ) : (
          <View style={{ width: '100%', maxWidth: 480, gap: 4 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt size={12} color={C.muted}>Soal {qi + 1}/{total}</Txt><Txt size={12} color={C.goldSoft} bold>Benar: {ok}</Txt></View></View>
        )}
        <View style={{ width: '100%', maxWidth: 480 }}><Bar value={time} max={timeLimit} h={8} color={time < 4 ? C.red : C.green} /></View>
        <Animated.View style={[{ width: '100%', maxWidth: 480 }, shakeStyle]}>
          <Panel tone="light" style={{ gap: 6 }}>
            {q.ai ? <Txt size={11} bold color={C.blue}>✨ Soal dari AI</Txt> : null}
            <Txt size={18} bold testID="question">{q.question}</Txt>
          </Panel>
        </Animated.View>
        <View style={{ width: '100%', maxWidth: 480, gap: 8 }}>
          {q.options.map((o, i) => {
            const isRight = answered && i === q.answer; const isWrong = answered && i === sel && i !== q.answer;
            return (
              <Pressable key={i} testID={`opt-${i}`} disabled={answered || hidden.includes(i)} onPress={() => answer(i)} style={({ pressed }) => ({ backgroundColor: isRight ? C.greenDark : isWrong ? C.redDark : C.panel2, borderColor: isRight ? C.green : isWrong ? C.red : C.line, borderWidth: 2, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 14, flexDirection: 'row', gap: 10, alignItems: 'center', opacity: hidden.includes(i) ? 0.25 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#0004', alignItems: 'center', justifyContent: 'center' }}><Txt bold size={13}>{'ABCD'[i]}</Txt></View>
                <Txt style={{ flex: 1 }} bold>{o}</Txt>
              </Pressable>
            );
          })}
        </View>
        {!answered && charms > 0 ? <Btn small kind="blue" label={`Jimat Ki Wira (${charms}): buang 1 jawaban salah`} onPress={useCharm} /> : null}
        {answered ? (
          <Panel style={{ width: '100%', maxWidth: 480, gap: 8 }}>
            <Txt bold color={sel === q.answer ? C.green : C.red}>{sel === q.answer ? 'Benar!' : sel === -1 ? 'Waktu habis!' : 'Kurang tepat.'}</Txt>
            <Txt size={14}>{q.explain}</Txt>
            {why ? <Txt size={14} color={C.goldSoft}>{why}</Txt> : null}
            {sel !== q.answer && aiAvailable() && !why ? <Btn small kind="blue" label={whyBusy ? 'Ki Wira berpikir…' : 'Kenapa? Tanya AI'} disabled={whyBusy} onPress={async () => { setWhyBusy(true); try { setWhy(await explainWhy(jenjang, q, sel! >= 0 ? q.options[sel!] : '(tidak menjawab)')); } catch (e) { setWhy(aiMessage(e)); } setWhyBusy(false); }} /> : null}
            {sel !== q.answer ? <Btn testID="quiz-next" label="Lanjut" onPress={() => advance(pendingEnd)} /> : null}
          </Panel>
        ) : null}
      </ScrollView>
    </GameShell>
  );
}
