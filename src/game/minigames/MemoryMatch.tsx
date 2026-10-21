import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import type { GameProps } from "../types";
import { PAIRS, PAIR_NOTE } from "../../data/content";
import { Btn, GameShell, Intro, Panel, ResultCard, Txt } from "../ui";
import { C } from "../theme";
import { sfx } from "../../lib/sound";

type Card = { uid: number; pair: number; side: "a" | "b"; text: string };
const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

function Flip({
  size,
  text,
  side,
  shown,
  matched,
}: {
  size: number;
  text: string;
  side: "a" | "b";
  shown: boolean;
  matched: boolean;
}) {
  // Tampilan murni mengikuti state (tidak ada state tampilan sendiri), jadi tidak mungkin tidak sinkron saat di-spam.
  const sx = useRef(new Animated.Value(1)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    sx.setValue(0.2);
    Animated.timing(sx, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [shown]);
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ scaleX: sx }],
        borderRadius: 12,
        borderWidth: 3,
        borderColor: matched ? C.green : shown ? C.gold : "#2a1d12",
        backgroundColor: shown
          ? side === "a"
            ? "#f3e6c4"
            : "#e9d9a8"
          : C.indigo,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      {shown ? (
        <Txt
          size={size > 90 ? 15 : 12}
          bold
          center
          color="#2b1b0c"
          numberOfLines={4}
        >
          {text}
        </Txt>
      ) : (
        <Txt size={26} color={C.goldSoft} bold>
          ✦
        </Txt>
      )}
    </Animated.View>
  );
}

export default function MemoryMatch({
  jenjang,
  cfg,
  onDone,
  onExit,
}: GameProps) {
  const { width } = useWindowDimensions();
  const set = cfg?.set || "motif";
  const nPairs = jenjang === "sd" ? 4 : jenjang === "smp" ? 6 : 8;
  const [round, setRound] = useState(0);
  const deck = useMemo(() => {
    const pairs = shuffle(PAIRS[set]).slice(0, nPairs);
    const cards: Card[] = [];
    let uid = 0;
    pairs.forEach((p, i) => {
      cards.push(
        { uid: uid++, pair: i, side: "a", text: p.a },
        { uid: uid++, pair: i, side: "b", text: p.b },
      );
    });
    return { pairs, cards: shuffle(cards) };
  }, [set, nPairs, round]);
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState("");
  const busy = useRef(false);
  // Sumber kebenaran sinkron (ref): klik beruntun dalam satu frame tidak lagi membaca state basi.
  const openRef = useRef<number[]>([]);
  const matchedRef = useRef<number[]>([]);
  const setOpenS = (v: number[]) => {
    openRef.current = v;
    setOpen(v);
  };
  const setMatchedS = (v: number[]) => {
    matchedRef.current = v;
    setMatched(v);
  };

  const cols = 4;
  const size = Math.min(
    104,
    Math.floor((Math.min(width, 520) - 32 - (cols - 1) * 8) / cols),
  );
  const tap = (uid: number) => {
    const card = deck.cards.find((c) => c.uid === uid);
    if (
      !card ||
      busy.current ||
      openRef.current.length >= 2 ||
      openRef.current.includes(uid) ||
      matchedRef.current.includes(card.pair)
    )
      return;
    sfx("tap", 0.4);
    const o = [...openRef.current, uid];
    setOpenS(o);
    if (o.length === 2) {
      busy.current = true;
      const [a, b] = o.map((id) => deck.cards.find((c) => c.uid === id)!);
      if (a.pair === b.pair) {
        setTimeout(() => {
          sfx("correct");
          const p = deck.pairs[a.pair];
          setMsg(`${p.a} = ${p.b}`);
          const m = [...matchedRef.current, a.pair];
          setMatchedS(m);
          setOpenS([]);
          busy.current = false;
          if (m.length === deck.pairs.length)
            setTimeout(() => setPhase("result"), 700);
        }, 350);
      } else {
        setWrong((w) => w + 1);
        setTimeout(() => {
          sfx("wrong", 0.5);
          setOpenS([]);
          busy.current = false;
        }, 850);
      }
    }
  };
  const stars = wrong <= Math.ceil(nPairs / 2) ? 3 : wrong <= nPairs ? 2 : 1;
  const reset = () => {
    setRound((r) => r + 1);
    setOpenS([]);
    setMatchedS([]);
    setWrong(0);
    setMsg("");
    busy.current = false;
    setPhase("play");
  };

  if (phase === "intro")
    return (
      <GameShell title={PAIR_NOTE[set] || "Pasangkan Kartu"} onClose={onExit}>
        <Intro
          emoji="🃏"
          title="Cocokkan pasangan"
          lines={[
            "Balik dua kartu setiap giliran.",
            "Cocokkan kata dengan artinya. Ingat letak kartunya!",
            "Makin sedikit salah, makin banyak bintang.",
          ]}
          onStart={() => setPhase("play")}
        />
      </GameShell>
    );
  if (phase === "result")
    return (
      <GameShell title="Selesai" onClose={onExit}>
        <ResultCard
          win
          stars={stars}
          score={`Salah buka: ${wrong}`}
          lines={["Semua pasangan ketemu!"]}
          onRetry={reset}
          onDone={() => onDone({ stars, score: Math.max(0, 100 - wrong * 8) })}
        />
      </GameShell>
    );
  return (
    <GameShell
      title={PAIR_NOTE[set] || "Pasangkan Kartu"}
      onClose={onExit}
      right={
        <Txt size={13} bold color={C.goldSoft}>
          ✗ {wrong}
        </Txt>
      }
    >
      <ScrollView
        contentContainerStyle={{ alignItems: "center", padding: 12, gap: 12 }}
      >
        <Panel
          style={{
            width: "100%",
            maxWidth: 520,
            minHeight: 50,
            justifyContent: "center",
          }}
        >
          <Txt center color={msg ? C.goldSoft : C.muted} bold={!!msg}>
            {msg || `Pasangan ketemu: ${matched.length}/${deck.pairs.length}`}
          </Txt>
        </Panel>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            maxWidth: 520,
          }}
        >
          {deck.cards.map((c) => (
            <Pressable
              key={c.uid}
              testID={`card-${c.uid}`}
              onPress={() => tap(c.uid)}
            >
              <Flip
                size={size}
                text={c.text}
                side={c.side}
                shown={open.includes(c.uid) || matched.includes(c.pair)}
                matched={matched.includes(c.pair)}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </GameShell>
  );
}
