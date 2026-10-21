import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import type { GameProps, Stroke, BatikWork } from "../types";
import {
  BatikCloth,
  coverage,
  inkLength,
  makeGuide,
  Motif,
  MOTIFS,
  sampleGuide,
  starsFor,
  THR,
} from "./batikLib";
import {
  Bar,
  Btn,
  GameShell,
  Intro,
  Panel,
  ResultCard,
  Stars,
  Txt,
} from "../ui";
import { C } from "../theme";
import { aiAvailable, aiMessage, critiqueBatik } from "../../lib/ai";
import { sfx } from "../../lib/sound";

const WIDTHS = [0.009, 0.014, 0.022];

export default function BatikDraw({ jenjang, onDone, onExit }: GameProps) {
  const { width, height } = useWindowDimensions();
  const S = Math.max(240, Math.min(width - 24, height - 360, 430));
  const [phase, setPhase] = useState<"intro" | "pick" | "draw" | "result">(
    "intro",
  );
  const [motif, setMotif] = useState<Motif>("kawung");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [tool, setTool] = useState<"line" | "dot">("line");
  const [thick, setThick] = useState(1);
  const [sym, setSym] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [live, setLive] = useState<number[] | null>(null);
  const [critique, setCritique] = useState("");
  const [busy, setBusy] = useState(false);
  const liveRef = useRef<number[] | null>(null);
  const raf = useRef(0);
  const cfg = useRef({ tool, w: WIDTHS[thick], sym, S });
  cfg.current = { tool, w: WIDTHS[thick], sym, S };

  const guide = useMemo(() => makeGuide(motif, jenjang), [motif, jenjang]);
  const samples = useMemo(() => sampleGuide(guide), [guide]);
  const cov = useMemo(
    () =>
      motif === "bebas"
        ? { ratio: 0, hit: [] as boolean[] }
        : coverage(samples, strokes, THR[jenjang]),
    [samples, strokes, motif, jenjang],
  );
  const ink = useMemo(() => inkLength(strokes), [strokes]);
  const stars = starsFor(motif, jenjang, cov.ratio, ink);

  const pan = useMemo(() => {
    const pos = (e: any) => ({
      x: Math.max(
        0,
        Math.min(1, (e.nativeEvent.locationX ?? 0) / cfg.current.S),
      ),
      y: Math.max(
        0,
        Math.min(1, (e.nativeEvent.locationY ?? 0) / cfg.current.S),
      ),
    });
    const flush = () => {
      raf.current = 0;
      setLive(liveRef.current ? [...liveRef.current] : null);
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { x, y } = pos(e);
        liveRef.current = [x, y];
        setLive([x, y]);
      },
      onPanResponderMove: (e) => {
        const L = liveRef.current;
        if (!L) return;
        const { x, y } = pos(e);
        const d = Math.hypot(x - L[L.length - 2], y - L[L.length - 1]);
        if (d >= (cfg.current.tool === "dot" ? 0.045 : 0.006)) {
          L.push(x, y);
          if (!raf.current) raf.current = requestAnimationFrame(flush);
        }
      },
      onPanResponderRelease: () => {
        const L = liveRef.current;
        liveRef.current = null;
        setLive(null);
        if (!L) return;
        const g = Date.now();
        const c = cfg.current;
        const add: Stroke[] = [
          { p: L, w: c.w, k: c.tool === "dot" ? "dot" : "line", g },
        ];
        if (c.sym)
          add.push({
            p: L.map((v, i) => (i % 2 === 0 ? 1 - v : v)),
            w: c.w,
            k: c.tool === "dot" ? "dot" : "line",
            g,
          });
        setStrokes((s) => [...s, ...add]);
        sfx("tap", 0.25);
      },
      onPanResponderTerminate: () => {
        liveRef.current = null;
        setLive(null);
      },
    });
  }, []);
  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const undo = () =>
    setStrokes((s) => {
      if (!s.length) return s;
      const g = s[s.length - 1].g;
      return s.filter((x) => x.g !== g);
    });
  const finish = () => {
    if (stars === 0) {
      return;
    }
    setPhase("result");
  };
  const work = (): BatikWork => ({
    id: "w" + Date.now(),
    strokes,
    motif,
    coverage: motif === "bebas" ? Math.min(1, ink / 12) : cov.ratio,
    date: Date.now(),
  });

  if (phase === "intro")
    return (
      <GameShell title="Nyanting: Gambar Batikmu" onClose={onExit}>
        <Intro
          emoji="🖌️"
          title="Jadi pembatik!"
          lines={[
            "Pilih motif, lalu gambar di kain memakai canting (jarimu).",
            "Ikuti garis putus-putus. Makin teliti, makin banyak bintang!",
            "Coba tombol Simetri supaya motifmu rapi seperti kain sungguhan.",
          ]}
          onStart={() => setPhase("pick")}
        />
      </GameShell>
    );

  if (phase === "pick")
    return (
      <GameShell title="Pilih Motif" onClose={onExit}>
        <ScrollView
          contentContainerStyle={{ padding: 14, gap: 10, alignItems: "center" }}
        >
          {MOTIFS.map((m) => (
            <Pressable
              key={m.id}
              testID={`motif-${m.id}`}
              onPress={() => {
                setMotif(m.id);
                setStrokes([]);
                setPhase("draw");
              }}
              style={{ width: "100%", maxWidth: 480 }}
            >
              <Panel
                style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
              >
                <View
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: C.line,
                  }}
                >
                  <BatikCloth
                    size={84}
                    strokes={[]}
                    guide={
                      m.id === "bebas" ? undefined : makeGuide(m.id, jenjang)
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt size={18} bold color={C.gold}>
                    {m.name}
                  </Txt>
                  <Txt size={13} color={C.muted}>
                    {m.desc}
                  </Txt>
                </View>
              </Panel>
            </Pressable>
          ))}
        </ScrollView>
      </GameShell>
    );

  if (phase === "result")
    return (
      <GameShell title="Karya Batikmu" onClose={onExit}>
        <ScrollView
          contentContainerStyle={{ padding: 14, alignItems: "center", gap: 12 }}
        >
          <View
            style={{
              borderWidth: 4,
              borderColor: "#6a4529",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <BatikCloth size={Math.min(S, 300)} strokes={strokes} />
          </View>
          <Stars n={stars} size={38} />
          <Txt center bold>
            {motif === "bebas"
              ? "Kreasi bebas yang indah!"
              : `Ketelitian mengikuti pola ${MOTIFS.find((m) => m.id === motif)!.name}: ${Math.round(cov.ratio * 100)}%`}
          </Txt>
          {aiAvailable() ? (
            <Panel style={{ width: "100%", maxWidth: 460, gap: 8 }}>
              {critique ? (
                <Txt>{critique}</Txt>
              ) : (
                <Txt color={C.muted} size={13}>
                  Mau dengar komentar Bu Sekar tentang karyamu?
                </Txt>
              )}
              <Btn
                kind="blue"
                small
                label={
                  busy
                    ? "Bu Sekar sedang melihat…"
                    : critique
                      ? "Minta komentar lagi"
                      : "Minta komentar Bu Sekar"
                }
                disabled={busy}
                onPress={async () => {
                  setBusy(true);
                  try {
                    setCritique(
                      await critiqueBatik(jenjang, {
                        motif: MOTIFS.find((m) => m.id === motif)!.name,
                        coverage: cov.ratio,
                        strokes: strokes.length,
                        symmetric: sym,
                      }),
                    );
                  } catch (e) {
                    setCritique(aiMessage(e));
                  }
                  setBusy(false);
                }}
              />
            </Panel>
          ) : null}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn
              kind="dark"
              label="Gambar lagi"
              onPress={() => setPhase("draw")}
            />
            <Btn
              label="Simpan karya"
              testID="save-work"
              onPress={() =>
                onDone({
                  stars,
                  score: Math.round(cov.ratio * 100),
                  data: work(),
                })
              }
            />
          </View>
        </ScrollView>
      </GameShell>
    );

  const label =
    motif === "bebas"
      ? `Tinta: ${Math.min(100, Math.round((ink / 12) * 100))}%`
      : `Ketelitian: ${Math.round(cov.ratio * 100)}%`;
  const progress = motif === "bebas" ? Math.min(1, ink / 12) : cov.ratio;
  return (
    <GameShell
      title={MOTIFS.find((m) => m.id === motif)!.name}
      onClose={onExit}
      right={<Stars n={stars} size={16} />}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 12,
          gap: 10,
        }}
      >
        <View style={{ width: S, gap: 4 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Txt size={12} bold color={C.goldSoft}>
              {label}
            </Txt>
            <Txt size={12} color={C.muted}>
              {motif === "bebas" ? "Gambar bebas" : "Ikuti garis putus-putus"}
            </Txt>
          </View>
          <Bar value={progress} h={10} color={stars >= 3 ? C.green : C.gold} />
        </View>
        <View
          style={{
            width: S + 10,
            height: S + 10,
            backgroundColor: "#6a4529",
            borderRadius: 8,
            padding: 5,
          }}
        >
          <View style={{ width: S, height: S }}>
            <BatikCloth
              size={S}
              strokes={strokes}
              guide={showGuide && motif !== "bebas" ? guide : undefined}
              live={live}
              liveW={WIDTHS[thick]}
              liveDot={tool === "dot"}
            />
            <View
              testID="canvas"
              {...pan.panHandlers}
              style={[
                { position: "absolute", left: 0, top: 0, width: S, height: S },
                { touchAction: "none", cursor: "crosshair" } as any,
              ]}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Btn
            small
            kind={tool === "line" ? "gold" : "dark"}
            label="Garis"
            icon="✎"
            onPress={() => setTool("line")}
          />
          <Btn
            small
            kind={tool === "dot" ? "gold" : "dark"}
            label="Titik (isen)"
            icon="●"
            onPress={() => setTool("dot")}
          />
          <Btn
            small
            kind={sym ? "green" : "dark"}
            label={sym ? "Simetri: ON" : "Simetri: OFF"}
            icon="⇋"
            onPress={() => setSym(!sym)}
          />
          {motif !== "bebas" ? (
            <Btn
              small
              kind={showGuide ? "blue" : "dark"}
              label={showGuide ? "Pola: tampil" : "Pola: sembunyi"}
              onPress={() => setShowGuide(!showGuide)}
            />
          ) : null}
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {["Tipis", "Sedang", "Tebal"].map((t, i) => (
            <Btn
              key={t}
              small
              kind={thick === i ? "gold" : "dark"}
              label={t}
              onPress={() => setThick(i)}
            />
          ))}
          <Btn small kind="dark" label="Urung" icon="↶" onPress={undo} />
          <Btn small kind="red" label="Hapus" onPress={() => setStrokes([])} />
        </View>
        <Btn
          big
          testID="finish-draw"
          label={stars ? "Selesai!" : "Gambar sedikit lagi…"}
          disabled={!stars}
          onPress={finish}
          style={{ width: Math.min(S, 340) }}
        />
      </ScrollView>
    </GameShell>
  );
}
