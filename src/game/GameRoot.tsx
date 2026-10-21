import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { C } from "./theme";
import { useGame } from "./state";
import { Btn, Overlay, Panel, Stars, Txt } from "./ui";
import { L } from "../lib/i18n";
import {
  CHAPTERS,
  ChapterId,
  STATIONS,
  chapterReady,
  isDone,
  objective,
  stageKey,
} from "../data/chapters";
import {
  EGG_INFO,
  EGG_REWARD,
  EggId,
  GOD_SPOT,
  eggFlag,
  eggFromNpc,
  eggScript,
} from "../data/eggs";
import { getDialog, Script } from "../data/dialogs";
import { sfx } from "../lib/sound";
import type { GameProps, Profile } from "./types";
import { WorldHandle, WorldScreen } from "./world/WorldScreen";
import DialogBox from "./DialogBox";
import Title from "./screens/Title";
import Setup from "./screens/Setup";
import Prolog from "./screens/Prolog";
import Passport from "./screens/Passport";
import Settings from "./screens/Settings";
import Help from "./screens/Help";
import Ending from "./screens/Ending";
import BatikDraw from "./minigames/BatikDraw";
import ColorMix from "./minigames/ColorMix";
import MemoryMatch from "./minigames/MemoryMatch";
import OrderGame from "./minigames/OrderGame";
import RapidSort from "./minigames/RapidSort";
import Rhythm from "./minigames/Rhythm";
import KerisAssemble from "./minigames/KerisAssemble";
import ChatNpc from "./minigames/ChatNpc";
import DalangStory from "./minigames/DalangStory";
import QuizBattle from "./minigames/QuizBattle";

type Screen =
  | "title"
  | "setup"
  | "prolog"
  | "world"
  | "passport"
  | "settings"
  | "help";
type Mini =
  | { t: "station"; id: string; cfg: any }
  | { t: "exam"; ch: ChapterId | "mix"; cfg: any }
  | { t: "enc"; id: string; cfg: any }
  | { t: "boss"; cfg: any }
  | { t: "chat"; cfg: any };

const COMPONENTS: Record<string, React.ComponentType<GameProps>> = {
  draw: BatikDraw,
  mix: ColorMix,
  memory: MemoryMatch,
  order: OrderGame,
  sort: RapidSort,
  rhythm: Rhythm,
  keris: KerisAssemble,
  chat: ChatNpc,
  story: DalangStory,
  quiz: QuizBattle,
};

function Root() {
  const G = useGame();
  const [screen, setScreen] = useState<Screen>("title");
  const [back, setBack] = useState<Screen>("title");
  const [dialog, setDialog] = useState<Script | null>(null);
  const [mini, setMini] = useState<Mini | null>(null);
  const [menu, setMenu] = useState(false);
  const [cele, setCele] = useState<{
    title: string;
    text: string;
    stars?: number;
    egg?: EggId;
  } | null>(null);
  const [ending, setEnding] = useState<"good" | "bad" | null>(null);
  const [defeated, setDefeated] = useState<Record<string, number>>({});
  const [worldKey, setWorldKey] = useState(0);
  const world = useRef<WorldHandle>(null);
  const mapNow = useRef("overworld");
  const gref = useRef(G);
  gref.current = G;

  const paused = !!(dialog || mini || menu || cele || ending);

  const startStation = useCallback((id: string) => {
    const g = gref.current;
    const def = STATIONS[id];
    if (!def) return;
    if (def.needs) {
      const [c, s] = def.needs.split(":");
      if (!isDone(g.progress, c, s)) {
        g.toast(
          def.needsMsg ||
            L(
              "Selesaikan tahap sebelumnya dulu.",
              "Finish the previous step first.",
            ),
          "bad",
        );
        sfx("wrong");
        return;
      }
    }
    let cfg = { ...(def.cfg || {}) };
    if (def.kind === "mix") cfg.work = g.progress.work;
    if (id === "mbah") cfg = { npc: "mbah", goals: true };
    setMini({ t: "station", id, cfg });
  }, []);

  const startExam = (ch: ChapterId | "mix") => {
    const topic = ch === "mix" ? "mix" : CHAPTERS[ch].topic;
    setMini({
      t: "exam",
      ch,
      cfg: {
        mode: "exam",
        topic,
        title:
          ch === "mix"
            ? L("Latihan Campuran", "Mixed Practice")
            : `${L("Ujian", "Exam")}: ${L(CHAPTERS[ch].badge, CHAPTERS[ch].badge)}`,
        count: 5,
      },
    });
  };

  const onAction = (a: string) => {
    const g = gref.current;
    setDialog(null);
    if (a === "close") return;
    if (a.startsWith("flag:")) {
      g.setFlag(a.slice(5));
      sfx("collect");
      return;
    }
    if (a.startsWith("exam:")) {
      const ch = a.slice(5) as ChapterId | "mix";
      const prof = g.profile;
      if (
        ch !== "mix" &&
        prof &&
        !g.progress.badges.includes(ch) &&
        !chapterReady(g.progress, ch, prof.jenjang)
      ) {
        g.toast(
          L(
            "Bintangmu belum cukup untuk ujian ini.",
            "You do not have enough stars for this exam yet.",
          ),
          "bad",
        );
        sfx("wrong");
        return;
      }
      startExam(ch);
      return;
    }
    if (a.startsWith("egg:")) {
      const id = a.slice(4) as EggId;
      if (!g.progress.flags[eggFlag(id)]) {
        g.setFlag(eggFlag(id));
        g.addXP(EGG_REWARD[id], L("Tamu misterius", "Mystery guest"));
        sfx("levelup");
        g.toast(
          `${EGG_INFO[id].emoji} ${L("Easter egg ditemukan", "Easter egg found")}: ${EGG_INFO[id].name}`,
          "good",
        );
      }
      return;
    }
    if (a.startsWith("chat:")) {
      setMini({ t: "chat", cfg: { npc: a.slice(5) } });
      return;
    }
    if (a === "station:mbah") {
      startStation("mbah");
      return;
    }
    if (a === "boss") {
      setMini({
        t: "boss",
        cfg: { mode: "boss", topic: "mix", title: "Raksasa Bayangan Lupa" },
      });
      return;
    }
    if (a === "hint") {
      g.toast(objective(g.progress, mapNow.current).text, "info");
      return;
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      /[?&]debug/.test(window.location?.search || "")
    )
      (window as any).__sv = {
        station: startStation,
        exam: startExam,
        boss: () => onAction("boss"),
        npc: (id: string) => onNpc(id),
        ending: (k: "good" | "bad") => setEnding(k),
        egg: (id: EggId) =>
          setDialog(eggScript(id, gref.current.profile?.name || "Kawan")),
      };
  });
  const onNpc = (npcId: string) => {
    const g = gref.current;
    if (!g.profile) return;
    const eg = eggFromNpc(npcId);
    if (eg) {
      sfx("tap", 0.5);
      setDialog(eggScript(eg, g.profile.name));
      return;
    }
    const s = getDialog(npcId, {
      name: g.profile.name,
      jenjang: g.profile.jenjang,
      prog: g.progress,
    });
    if (s) {
      sfx("tap", 0.5);
      setDialog(s);
    }
  };

  const closeMini = () => setMini(null);

  const onResult = (
    m: Mini,
    r: { stars: number; score: number; data?: any; fail?: boolean },
  ) => {
    const g = gref.current;
    setMini(null);
    if (m.t === "station") {
      const def = STATIONS[m.id];
      if (def.kind === "chat" && m.id !== "mbah") return;
      if (r.stars <= 0) return;
      g.bump("played");
      g.recordStage(stageKey(def.chapter, def.id), r.stars, def.xp);
      if (def.kind === "draw" && r.data) {
        g.saveWork(r.data);
        g.toast(
          L("Kainmu siap dicelup!", "Your cloth is ready to dye!"),
          "good",
        );
      }
      if (def.kind === "mix" && r.data && g.progress.work) {
        const w = {
          ...g.progress.work,
          dye: r.data.dye,
          dyeName: r.data.dyeName,
        };
        g.saveWork(w);
        g.pushGallery(w);
        g.toast(
          L(
            "Batik masuk Galeri di Paspor!",
            "Batik added to the Passport gallery!",
          ),
          "good",
        );
      }
      return;
    }
    if (m.t === "chat") return;
    if (m.t === "exam") {
      if (r.fail) return;
      if (m.ch === "mix") {
        g.addXP(10 * r.stars, L("latihan", "practice"));
        return;
      }
      const ch = m.ch;
      const had = g.progress.badges.includes(ch);
      g.recordStage(stageKey(ch, "ujian"), r.stars, 80);
      if (!had) {
        g.award(ch);
        sfx("levelup");
        setCele({
          title: `${L("Lencana", "Badge")}: ${CHAPTERS[ch].badge}!`,
          text: L(
            `Kamu lulus ujian ${CHAPTERS[ch].mentorName}. Satu lencana lagi untukmu.`,
            `You passed ${CHAPTERS[ch].mentorName}'s exam. One more badge is yours.`,
          ),
          stars: r.stars,
          egg: ch as EggId,
        });
      }
      return;
    }
    if (m.t === "enc") {
      if (r.fail || !r.data?.win) {
        world.current?.knockback();
        return;
      }
      setDefeated((d) => ({ ...d, [m.id]: Date.now() }));
      g.bump("defeated");
      g.addXP(15, L("Bayangan Lupa", "Shadow of Forgetting"));
      return;
    }
    if (m.t === "boss") {
      if (r.fail || !r.data?.win) {
        setEnding("bad");
        return;
      }
      const first = !g.progress.bossDone;
      g.finishBoss();
      g.addXP(first ? 150 : 40, L("Raksasa", "Giant"));
      setEnding("good");
    }
  };

  const onExitMini = (m: Mini) => {
    setMini(null);
    if (m.t === "enc") world.current?.knockback();
  };

  // ---- screens ----
  if (!G.ready)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: C.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={C.gold} size="large" />
      </View>
    );

  const go = (s: Screen) => {
    setBack(screen);
    setScreen(s);
  };
  if (screen === "title")
    return (
      <Title
        onPlay={() => {
          setWorldKey((k) => k + 1);
          setScreen("world");
        }}
        onNew={() => {
          if (G.profile) {
            go("settings");
          } else setScreen("setup");
        }}
        onSettings={() => go("settings")}
        onHelp={() => go("help")}
      />
    );
  if (screen === "setup")
    return (
      <Setup
        onBack={() => setScreen("title")}
        onStart={(p: Profile) => {
          G.setProfile(p);
          setScreen("prolog");
        }}
      />
    );
  if (screen === "prolog")
    return (
      <Prolog
        name={G.profile?.name || "Kawan"}
        onEnd={() => {
          setWorldKey((k) => k + 1);
          setScreen("world");
        }}
      />
    );
  if (screen === "passport")
    return <Passport onBack={() => setScreen("world")} />;
  if (screen === "help")
    return (
      <Help onBack={() => setScreen(back === "world" ? "world" : "title")} />
    );
  if (screen === "settings")
    return (
      <Settings
        onBack={() => setScreen(back === "world" ? "world" : "title")}
        onReset={() => {
          G.resetAll();
          setDefeated({});
          setScreen("setup");
        }}
      />
    );

  const prof = G.profile!;
  const last = G.progress.last;
  const Comp = mini
    ? COMPONENTS[
        mini.t === "station"
          ? STATIONS[mini.id].kind
          : mini.t === "chat"
            ? "chat"
            : "quiz"
      ]
    : null;
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <WorldScreen
        key={worldKey}
        ref={world}
        paused={paused}
        startMap={last?.map || "overworld"}
        startSpawn={last?.spawn || "start"}
        defeatedAt={defeated}
        onStation={(id) => startStation(id)}
        onNpc={(id) => onNpc(id)}
        onEncounter={(id) =>
          setMini({
            t: "enc",
            id,
            cfg: { mode: "encounter", topic: "mix", title: "Bayangan Lupa" },
          })
        }
        onGate={() => onNpc("penjaga")}
        onMenu={() => setMenu(true)}
        onMapChange={(m) => {
          mapNow.current = m;
          gref.current.setLast(m, m === "overworld" ? "start" : "in");
        }}
      />
      {dialog ? <DialogBox script={dialog} onAction={onAction} /> : null}
      {mini && Comp ? (
        <Comp
          key={JSON.stringify(mini)}
          jenjang={prof.jenjang}
          name={prof.name}
          cfg={mini.cfg}
          onDone={(r) => onResult(mini, r)}
          onExit={() => onExitMini(mini)}
        />
      ) : null}
      {menu ? (
        <Overlay z={90}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Panel style={{ width: "100%", maxWidth: 340, gap: 10 }}>
              <Txt size={20} bold color={C.gold} center>
                {L("Jeda", "Paused")}
              </Txt>
              <Btn
                label={L("Lanjut Main", "Resume")}
                onPress={() => setMenu(false)}
                testID="menu-resume"
              />
              <Btn
                label={L("Paspor Budaya", "Culture Passport")}
                kind="dark"
                onPress={() => {
                  setMenu(false);
                  setScreen("passport");
                }}
                testID="menu-passport"
              />
              <Btn
                label={
                  G.soundOn
                    ? L("Suara: Hidup", "Sound: On")
                    : L("Suara: Mati", "Sound: Off")
                }
                kind="dark"
                onPress={G.toggleSound}
              />
              <Btn
                label={L("Pengaturan", "Settings")}
                kind="dark"
                onPress={() => {
                  setMenu(false);
                  go("settings");
                }}
                testID="menu-settings"
              />
              <Btn
                label={L("Cara Main", "How to Play")}
                kind="dark"
                onPress={() => {
                  setMenu(false);
                  go("help");
                }}
              />
              <Btn
                label={L("Ke Menu Utama", "Main Menu")}
                kind="red"
                onPress={() => {
                  setMenu(false);
                  setScreen("title");
                }}
                testID="menu-title"
              />
            </Panel>
          </View>
        </Overlay>
      ) : null}
      {cele ? (
        <Overlay z={95}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Panel
              tone="light"
              style={{
                width: "100%",
                maxWidth: 360,
                alignItems: "center",
                gap: 8,
              }}
            >
              <Txt size={44}>🏅</Txt>
              <Txt size={22} bold color={C.gold} center>
                {cele.title}
              </Txt>
              {cele.stars ? <Stars n={cele.stars} size={30} /> : null}
              <Txt center color={C.muted}>
                {cele.text}
              </Txt>
              <Btn
                label={L("Hore!", "Hooray!")}
                onPress={() => {
                  const egg = cele.egg;
                  setCele(null);
                  if (egg && !gref.current.progress.flags[eggFlag(egg)])
                    setTimeout(
                      () =>
                        gref.current.toast(
                          `${EGG_INFO[egg].emoji} ${L("Ada tamu aneh muncul di Kota Solo", "A strange visitor has appeared in the city of Solo")}: ${GOD_SPOT[egg].where()}`,
                          "info",
                        ),
                      300,
                    );
                }}
                style={{ alignSelf: "stretch" }}
                testID="cele-ok"
              />
            </Panel>
          </View>
        </Overlay>
      ) : null}
      {ending ? (
        <Overlay z={96} dim={0}>
          <Ending
            kind={ending}
            name={prof.name}
            onPrimary={() => {
              if (ending === "bad") {
                setEnding(null);
                gref.current.setLast("overworld", "gate");
                setWorldKey((k) => k + 1);
                return;
              }
              setEnding(null);
              setScreen("passport");
            }}
            onSecondary={
              ending === "good"
                ? () => {
                    setEnding(null);
                    if (!gref.current.progress.flags[eggFlag("final")])
                      setTimeout(
                        () =>
                          gref.current.toast(
                            `${EGG_INFO.final.emoji} ${L("Ada bapak pengantar surat berdiri", "A letter carrier is standing")} ${GOD_SPOT.final.where()}!`,
                            "info",
                          ),
                        300,
                      );
                  }
                : undefined
            }
          />
        </Overlay>
      ) : null}
    </View>
  );
}

export default function GameRoot() {
  return <Root />;
}
