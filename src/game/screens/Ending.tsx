import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { art, icons } from "../../data/art";
import { Btn, Panel, Txt } from "../ui";
import { C, px } from "../theme";
import { L } from "../../lib/i18n";
import { sfx } from "../../lib/sound";

type Kind = "good" | "bad";
const ITEMS = ["batik", "wayang", "keris", "basa"] as const;

/**
 * Layar ending boss.
 * BAD  : Bayangan Lupa "memakan" batik, wayang, keris, dan basa Jawa satu per satu (seolah kerja kerasmu hilang).
 *        Progres asli TIDAK dihapus. Tombol mengembalikan pemain ke depan gerbang untuk mengulang melawan boss.
 * GOOD : keempat warisan pulih satu per satu, lalu sertifikat.
 */
export default function Ending({
  kind,
  name,
  onPrimary,
  onSecondary,
}: {
  kind: Kind;
  name: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}) {
  const ins = useSafeAreaInsets();
  const { width: sw, height: sh } = useWindowDimensions();
  const tall = sh / Math.max(1, sw) > 1.4;
  const bad = kind === "bad";
  const [step, setStep] = useState(0);
  const vals = useRef(ITEMS.map(() => new Animated.Value(0))).current;
  const fade = useRef(new Animated.Value(0)).current;

  const names: Record<(typeof ITEMS)[number], string> = {
    batik: "Batik",
    wayang: "Wayang",
    keris: "Keris",
    basa: L("Basa Jawa", "Javanese"),
  };
  const captions = bad
    ? [
        L(
          "Batik memudar menjadi kain kelabu tanpa motif…",
          "Batik fades into grey cloth with no motif…",
        ),
        L(
          "Wayang kehilangan bayangannya dan layar menjadi gelap…",
          "Wayang loses its shadows and the screen goes dark…",
        ),
        L(
          "Keris berkarat dan namanya terlupakan…",
          "The keris rusts and its name is forgotten…",
        ),
        L(
          "Basa Jawa tak lagi terucap. Hening…",
          "Javanese is no longer spoken. Silence…",
        ),
      ]
    : [
        L(
          "Batik berwarna-warni kembali menghiasi Laweyan!",
          "Colourful batik adorns Laweyan once more!",
        ),
        L(
          "Bayangan wayang menari lagi di balik kelir!",
          "Wayang shadows dance again behind the screen!",
        ),
        L(
          "Keris berkilau di museum, terawat dan dihormati!",
          "The keris gleams in the museum, cared for and honoured!",
        ),
        L(
          "Basa Jawa kembali terdengar di setiap rumah!",
          "Javanese is heard in every home again!",
        ),
      ];

  useEffect(() => {
    sfx(bad ? "hurt" : "levelup");
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    if (step >= ITEMS.length) return;
    const id = setTimeout(
      () => {
        Animated.timing(vals[step], {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
        sfx(bad ? "wrong" : "collect", 0.7);
        setStep((s) => s + 1);
      },
      step === 0 ? 1200 : 1500,
    );
    return () => clearTimeout(id);
  }, [step]);

  const skip = () => {
    vals.forEach((v) => v.setValue(1));
    setStep(ITEMS.length);
  };
  const done = step >= ITEMS.length;
  const cap =
    step > 0
      ? captions[Math.min(step, ITEMS.length) - 1]
      : bad
        ? L(
            "Raksasa Bayangan Lupa menang. Kamu terdesak…",
            "The Giant of Forgetting wins. You are cornered…",
          )
        : L(
            "Jawaban terakhirmu tepat! Raksasa pecah menjadi cahaya…",
            "Your final answer is right! The Giant shatters into light…",
          );

  return (
    <ImageBackground
      source={art[bad ? "ending_bad" : "ending_good"]}
      resizeMode={tall ? "cover" : "contain"}
      imageStyle={{ width: "100%", height: "100%" }}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: bad ? "#0a0510" : "#150d3a",
      }}
    >
      <Pressable
        onPress={skip}
        style={{ flex: 1 }}
        testID={bad ? "ending-bad" : "ending-good"}
      >
        <LinearGradient
          colors={
            bad
              ? ["rgba(5,0,8,0.05)", "rgba(10,0,4,0.55)", "rgba(10,0,0,0.92)"]
              : ["rgba(10,6,3,0.0)", "rgba(10,6,3,0.5)", "rgba(10,6,3,0.9)"]
          }
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            padding: 18,
            paddingTop: ins.top + 18,
            paddingBottom: ins.bottom + 18,
            gap: 16,
          }}
        >
          <View style={{ alignItems: "center", gap: 14 }}>
            <Animated.View
              style={{ opacity: fade, alignItems: "center", gap: 4 }}
            >
              <Txt
                size={13}
                bold
                color={bad ? "#c9a0ff" : C.goldSoft}
                style={{ letterSpacing: 4 }}
              >
                {bad ? "BAD ENDING" : "GOOD ENDING"}
              </Txt>
              <Txt size={30} bold center color={bad ? C.red : C.gold}>
                {bad
                  ? L("Bayangan Lupa Menang", "The Shadows of Forgetting Win")
                  : L("Penjaga Budaya Solo!", "Guardian of Solo Culture!")}
              </Txt>
            </Animated.View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {ITEMS.map((k, i) => {
                const v = vals[i];
                const style = bad
                  ? {
                      opacity: v.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.18],
                      }),
                      transform: [
                        {
                          scale: v.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.7],
                          }),
                        },
                      ],
                    }
                  : {
                      opacity: v.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.25, 1],
                      }),
                      transform: [
                        {
                          scale: v.interpolate({
                            inputRange: [0, 0.6, 1],
                            outputRange: [0.8, 1.18, 1],
                          }),
                        },
                      ],
                    };
                const hit = bad ? step > i : step > i;
                return (
                  <Animated.View
                    key={k}
                    style={[{ alignItems: "center", width: 74 }, style]}
                  >
                    <View
                      style={{
                        width: 66,
                        height: 66,
                        borderRadius: 33,
                        backgroundColor: bad && hit ? "#1a1020" : C.panel2,
                        borderWidth: 3,
                        borderColor: bad ? (hit ? "#6a4a8a" : C.gold) : C.gold,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={icons[k]}
                        style={[
                          {
                            width: 40,
                            height: 40,
                            tintColor: bad && hit ? "#6f6f6f" : undefined,
                          },
                          px,
                        ]}
                        resizeMode="contain"
                      />
                      {bad && hit ? (
                        <Txt size={26} style={{ position: "absolute" }}>
                          ☠
                        </Txt>
                      ) : null}
                      {!bad && hit ? (
                        <Txt
                          size={18}
                          style={{ position: "absolute", right: -2, top: -4 }}
                        >
                          ✨
                        </Txt>
                      ) : null}
                    </View>
                    <Txt size={11} bold center color={C.cream}>
                      {names[k]}
                    </Txt>
                  </Animated.View>
                );
              })}
            </View>
          </View>
          <View style={{ alignItems: "center", gap: 12, width: "100%" }}>
            <Panel
              tone="light"
              style={{
                width: "100%",
                maxWidth: 400,
                minHeight: 74,
                justifyContent: "center",
                borderColor: bad ? "#6a4a8a" : C.gold,
              }}
            >
              <Txt center bold>
                {cap}
              </Txt>
              {done ? (
                <Txt center size={13} color={C.muted} style={{ marginTop: 6 }}>
                  {bad
                    ? L(
                        `${name}, kerja kerasmu tampak lenyap. Tapi Ki Wira berbisik: "Bangkitlah. Warisan ini masih bisa diselamatkan." Kamu terbangun di depan Gerbang Keraton.`,
                        `${name}, all your hard work seems lost. But Ki Wira whispers: "Rise. This heritage can still be saved." You wake up in front of the Palace Gate.`,
                      )
                    : L(
                        `${name}, Bayangan Lupa sirna dan Keraton kembali terang. Batik, wayang, keris, dan basa Jawa aman di tanganmu.`,
                        `${name}, the Shadows of Forgetting vanish and the Palace shines again. Batik, wayang, keris, and Javanese are safe in your hands.`,
                      )}
                </Txt>
              ) : null}
            </Panel>

            {done ? (
              <View style={{ width: "100%", maxWidth: 400, gap: 8 }}>
                <Btn
                  testID={bad ? "ending-retry" : "finale-cert"}
                  big
                  kind={bad ? "red" : "gold"}
                  label={
                    bad
                      ? L("Bangkit dan Lawan Lagi", "Rise and Fight Again")
                      : L("Lihat Sertifikat", "View Certificate")
                  }
                  onPress={onPrimary}
                />
                {onSecondary ? (
                  <Btn
                    testID="ending-continue"
                    kind="dark"
                    label={L("Lanjut Menjelajah", "Keep Exploring")}
                    onPress={onSecondary}
                  />
                ) : null}
              </View>
            ) : (
              <Txt size={11} color={C.muted}>
                {L("Ketuk untuk melewati", "Tap to skip")}
              </Txt>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </ImageBackground>
  );
}
