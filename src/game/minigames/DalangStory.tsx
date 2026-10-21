import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { L } from "../../lib/i18n";
import type { GameProps } from "../types";
import { PUPPETS, VALUES, fallbackStory, StoryScene } from "../../data/content";
import { aiAvailable, aiMessage, genStory } from "../../lib/ai";
import { fx } from "../../data/assetMap";
import {
  Btn,
  GameShell,
  Intro,
  Panel,
  ResultCard,
  Txt,
  Typewriter,
} from "../ui";
import { C, px } from "../theme";
import { sfx } from "../../lib/sound";

export default function DalangStory({ jenjang, onDone, onExit }: GameProps) {
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState<"intro" | "pick" | "gen" | "show" | "end">(
    "intro",
  );
  const [picked, setPicked] = useState<string[]>([]);
  const [value, setValue] = useState(VALUES[0]);
  const [twist, setTwist] = useState("");
  const [story, setStory] = useState<{
    title: string;
    scenes: StoryScene[];
    moral: string;
  } | null>(null);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(false);
  const [note, setNote] = useState("");
  const [usedAi, setUsedAi] = useState(false);

  const a = PUPPETS.find((p) => p.key === picked[0]),
    b = PUPPETS.find((p) => p.key === picked[1]);
  const toggle = (k: string) =>
    setPicked((p) =>
      p.includes(k)
        ? p.filter((x) => x !== k)
        : p.length >= 2
          ? [p[1], k]
          : [...p, k],
    );

  const generate = async () => {
    if (!a || !b) return;
    setPhase("gen");
    setNote("");
    sfx("start");
    if (aiAvailable()) {
      try {
        const s = await genStory(
          jenjang,
          { key: a.key, name: a.name },
          { key: b.key, name: b.name },
          value,
          twist,
        );
        setStory({
          title: s.title,
          moral: s.moral,
          scenes: s.scenes.map((x) => ({
            who: x.who === a.key ? "a" : x.who === b.key ? "b" : "dalang",
            text: x.text,
          })),
        });
        setUsedAi(true);
        setIdx(0);
        setTyped(false);
        setPhase("show");
        return;
      } catch (e) {
        setNote(aiMessage(e));
      }
    }
    setUsedAi(false);
    setStory(fallbackStory(a.name, b.name, value, twist));
    setIdx(0);
    setTyped(false);
    setPhase("show");
  };

  if (phase === "intro")
    return (
      <GameShell title="Panggung Ceritaku" onClose={onExit}>
        <Intro
          emoji="🎭"
          title="Jadi dalang!"
          lines={[
            "Pilih dua tokoh wayang dan satu pesan moral.",
            "Boleh menambahkan kejutan cerita buatanmu sendiri.",
            "Lakonnya ditulis bersama Ki Wira, lalu tokoh-tokoh tampil di kelir!",
          ]}
          onStart={() => setPhase("pick")}
        />
      </GameShell>
    );

  if (phase === "pick" || phase === "gen") {
    const cw = Math.min(110, (Math.min(width, 480) - 48) / 3);
    return (
      <GameShell title="Susun Lakon" onClose={onExit}>
        <ScrollView
          contentContainerStyle={{ padding: 12, alignItems: "center", gap: 12 }}
        >
          <Txt bold>
            {L("1. Pilih 2 tokoh", "1. Pick 2 characters")} ({picked.length}/2)
          </Txt>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              maxWidth: 480,
            }}
          >
            {PUPPETS.map((p) => (
              <Pressable
                key={p.key}
                testID={`pup-${p.key}`}
                onPress={() => toggle(p.key)}
                style={{
                  width: cw,
                  alignItems: "center",
                  backgroundColor: picked.includes(p.key) ? "#5a4429" : C.panel,
                  borderRadius: 12,
                  borderWidth: 3,
                  borderColor: picked.includes(p.key) ? C.gold : C.line,
                  padding: 6,
                }}
              >
                <Image
                  source={(fx as any)[`puppet_${p.key}`]}
                  resizeMode="contain"
                  style={[{ width: cw - 30, height: (cw - 30) * 1.41 }, px]}
                />
                <Txt size={13} bold>
                  {p.name}
                </Txt>
                <Txt size={10} color={C.muted} center>
                  {p.trait}
                </Txt>
              </Pressable>
            ))}
          </View>
          <Txt bold>2. Pilih pesan moral</Txt>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {VALUES.map((v) => (
              <Btn
                key={v}
                small
                kind={value === v ? "gold" : "dark"}
                label={v}
                onPress={() => setValue(v)}
              />
            ))}
          </View>
          <Txt bold>3. Kejutan cerita (boleh dikosongi)</Txt>
          <TextInput
            testID="twist"
            value={twist}
            onChangeText={setTwist}
            maxLength={60}
            placeholder="contoh: tiba-tiba turun hujan"
            placeholderTextColor="#9a8a70"
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: C.panel,
              borderColor: C.line,
              borderWidth: 2,
              borderRadius: 12,
              color: C.text,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
          {phase === "gen" ? (
            <View style={{ alignItems: "center", gap: 8 }}>
              <ActivityIndicator color={C.gold} size="large" />
              <Txt color={C.muted}>
                {aiAvailable()
                  ? "Ki Wira menulis lakonmu…"
                  : "Menyiapkan lakon…"}
              </Txt>
            </View>
          ) : (
            <Btn
              big
              testID="start-show"
              label="Mulai pentas!"
              disabled={picked.length < 2}
              onPress={generate}
              style={{ width: "100%", maxWidth: 420 }}
            />
          )}
        </ScrollView>
      </GameShell>
    );
  }

  if (phase === "end")
    return (
      <GameShell title="Panggung Ceritaku" onClose={onExit}>
        <ResultCard
          win
          stars={twist.trim() ? 3 : 2}
          title="Tepuk tangan!"
          score={story?.title}
          lines={[
            `Pesan: ${story?.moral || ""}`,
            usedAi
              ? "Lakon baru ini ditulis bersama Ki Wira."
              : "Lakon bawaan dipakai.",
          ]}
          onRetry={() => {
            setPhase("pick");
            setStory(null);
          }}
          onDone={() => onDone({ stars: twist.trim() ? 3 : 2, score: 100 })}
        />
      </GameShell>
    );

  const sc = story!.scenes[idx];
  const puppetW = Math.min(130, width * 0.28);
  return (
    <GameShell title={story!.title} onClose={onExit}>
      <View style={{ flex: 1, padding: 12, gap: 10, alignItems: "center" }}>
        <View
          style={{
            width: "100%",
            maxWidth: 480,
            height: puppetW * 1.7,
            backgroundColor: "#f7e1a8",
            borderRadius: 12,
            borderWidth: 6,
            borderColor: "#442a14",
            overflow: "hidden",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              position: "absolute",
              left: "15%",
              right: "15%",
              top: -20,
              bottom: 20,
              backgroundColor: "#fff3cf",
              borderRadius: 200,
              opacity: 0.7,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-end",
              paddingBottom: 6,
            }}
          >
            {[a!, b!].map((p, i) => {
              const active = sc.who === (i === 0 ? "a" : "b");
              return (
                <Image
                  key={p.key}
                  source={(fx as any)[`puppet_${p.key}`]}
                  resizeMode="contain"
                  style={[
                    {
                      width: puppetW,
                      height: puppetW * 1.41,
                      transform: [
                        { scaleX: i === 0 ? 1 : -1 },
                        { scale: active ? 1.12 : 0.92 },
                        { translateY: active ? -6 : 0 },
                      ],
                      opacity: active ? 1 : 0.55,
                    },
                    px,
                  ]}
                />
              );
            })}
          </View>
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 12,
              backgroundColor: "#7fa85a",
            }}
          />
        </View>
        <Panel
          tone="light"
          style={{ width: "100%", maxWidth: 480, minHeight: 120, gap: 6 }}
        >
          <Txt size={12} bold color={C.gold}>
            {sc.who === "a" ? a!.name : sc.who === "b" ? b!.name : "Dalang"} ·
            Adegan {idx + 1}/{story!.scenes.length}
          </Txt>
          <Typewriter
            key={idx}
            text={sc.text}
            onDone={() => setTyped(true)}
            size={16}
          />
          {note && idx === 0 ? (
            <Txt size={11} color={C.muted}>
              {note}
            </Txt>
          ) : null}
        </Panel>
        <Btn
          testID="scene-next"
          label={idx + 1 >= story!.scenes.length ? "Tamat ▶" : "Lanjut ▶"}
          disabled={!typed}
          onPress={() => {
            sfx("tap");
            if (idx + 1 >= story!.scenes.length) setPhase("end");
            else {
              setIdx(idx + 1);
              setTyped(false);
            }
          }}
          style={{ width: "100%", maxWidth: 480 }}
        />
      </View>
    </GameShell>
  );
}
