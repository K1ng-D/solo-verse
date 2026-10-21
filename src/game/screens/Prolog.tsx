import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { art } from "../../data/art";
import { Btn, Panel, Portrait, Txt, Typewriter } from "../ui";
import { C } from "../theme";
import { L } from "../../lib/i18n";

export default function Prolog({
  name,
  onEnd,
}: {
  name: string;
  onEnd: () => void;
}) {
  const ins = useSafeAreaInsets();
  const slides = [
    {
      bg: "pendhapa",
      who: "Ki Wira",
      por: "ki-wira",
      text: L(
        `Sampun rawuh, ${name}! Dahulu Solo penuh batik, wayang, keris, dan basa Jawa yang dijaga turun-temurun.`,
        `Sampun rawuh, ${name}! Long ago Solo was full of batik, wayang, keris, and Javanese, passed down through generations.`,
      ),
    },
    {
      bg: "heritage-map",
      who: "Ki Wira",
      por: "ki-wira",
      text: L(
        "Tapi kini Bayangan Lupa menyelimuti kota. Orang-orang lupa dan warisan budaya memudar.",
        "But now the Shadows of Forgetting cover the city. People forget, and the cultural heritage fades.",
      ),
    },
    {
      bg: "finale",
      who: "Ki Wira",
      por: "ki-wira",
      text: L(
        "Hanya Penjaga Budaya yang bisa mengusirnya. Maukah kamu menjadi penjaga itu?",
        "Only a Culture Guardian can drive them away. Will you be that guardian?",
      ),
    },
  ];
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(false);
  const s = slides[i];
  return (
    <ImageBackground
      source={art[s.bg]}
      resizeMode="cover"
      imageStyle={{ width: "100%", height: "100%" }}
      style={{ flex: 1, width: "100%", height: "100%", backgroundColor: C.bg }}
    >
      <LinearGradient
        colors={["rgba(20,12,6,0.1)", "rgba(20,12,6,0.95)"]}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          padding: 16,
          paddingBottom: ins.bottom + 20,
        }}
      >
        <Panel tone="light" style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Portrait name={s.por} size={72} />
            <View style={{ flex: 1, gap: 4 }}>
              <Txt size={13} bold color={C.gold}>
                {s.who}
              </Txt>
              <Typewriter
                key={i}
                text={s.text}
                onDone={() => setTyped(true)}
                size={16}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn
              kind="ghost"
              small
              label={L("Lewati", "Skip")}
              onPress={onEnd}
            />
            <View style={{ flex: 1 }} />
            <Btn
              testID="prolog-next"
              label={
                i + 1 >= slides.length
                  ? L("Aku siap!", "I am ready!")
                  : L("Lanjut ▶", "Next ▶")
              }
              disabled={!typed}
              onPress={() => {
                setTyped(false);
                if (i + 1 >= slides.length) onEnd();
                else setI(i + 1);
              }}
            />
          </View>
        </Panel>
      </LinearGradient>
    </ImageBackground>
  );
}
