import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AvatarId, Jenjang, Profile } from "../types";
import { SpriteSheet } from "../world/Sprite";
import { Btn, Panel, Txt } from "../ui";
import { useGame } from "../state";
import { L } from "../../lib/i18n";
import { C } from "../theme";

const AVATARS: { id: AvatarId; name: string }[] = [
  { id: "raka", name: "Raka" },
  { id: "sekar", name: "Sekar" },
  { id: "bayu", name: "Bayu" },
  { id: "aisyah", name: "Aisyah" },
];
const LEVELS: { id: Jenjang; label: string; desc: () => string }[] = [
  {
    id: "sd",
    label: "SD",
    desc: () =>
      L(
        "Soal lebih mudah, 3 pilihan jawaban, waktu lebih lega. Butuh 3 bintang di tiap tempat untuk membuka ujian akhir.",
        "Easier questions, 3 answer options, more time. You need 3 stars at each place to unlock the final exam.",
      ),
  },
  {
    id: "smp",
    label: "SMP",
    desc: () =>
      L(
        "Soal tingkat menengah, 4 pilihan, mulai ada penalaran. Butuh 6 bintang di tiap tempat untuk membuka ujian akhir.",
        "Intermediate questions, 4 options, some reasoning. You need 6 stars at each place to unlock the final exam.",
      ),
  },
  {
    id: "sma",
    label: "SMA",
    desc: () =>
      L(
        "Soal analisis dan konteks, waktu lebih ketat. Butuh 9 bintang di tiap tempat untuk membuka ujian akhir.",
        "Analytical, context-based questions and tighter time. You need 9 stars at each place to unlock the final exam.",
      ),
  },
];

export default function Setup({
  onStart,
  onBack,
}: {
  onStart: (p: Profile) => void;
  onBack: () => void;
}) {
  const ins = useSafeAreaInsets();
  const { lang, setLang } = useGame();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("raka");
  const [jenjang, setJenjang] = useState<Jenjang>("smp");
  const ok = name.trim().length >= 2;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingTop: ins.top + 14,
          paddingBottom: ins.bottom + 24,
          alignItems: "center",
          gap: 14,
        }}
      >
        <Txt size={26} bold color={C.gold} center>
          {L("Siapa kamu, Penjaga Muda?", "Who are you, Young Guardian?")}
        </Txt>
        <Panel style={{ width: "100%", maxWidth: 440, gap: 8 }}>
          <Txt bold>{L("Bahasa", "Language")}</Txt>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              testID="setup-lang-id"
              label="Indonesia"
              kind={lang === "id" ? "gold" : "dark"}
              onPress={() => setLang("id")}
              style={{ flex: 1 }}
            />
            <Btn
              testID="setup-lang-en"
              label="English"
              kind={lang === "en" ? "gold" : "dark"}
              onPress={() => setLang("en")}
              style={{ flex: 1 }}
            />
          </View>
          <Txt size={12} color={C.muted}>
            {L(
              "Isi game tetap bernuansa Jawa. Bahasa ini untuk terjemahan dan petunjuk.",
              "The game stays Javanese in flavour. This language is for translations and instructions.",
            )}
          </Txt>
        </Panel>
        <Panel style={{ width: "100%", maxWidth: 440, gap: 8 }}>
          <Txt bold>{L("Namamu", "Your name")}</Txt>
          <TextInput
            testID="name-input"
            value={name}
            onChangeText={setName}
            maxLength={14}
            placeholder={L("Tulis namamu", "Type your name")}
            placeholderTextColor="#9a8a70"
            style={{
              backgroundColor: C.bg2,
              borderColor: C.line,
              borderWidth: 2,
              borderRadius: 12,
              color: C.text,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 17,
            }}
          />
        </Panel>
        <Panel style={{ width: "100%", maxWidth: 440, gap: 10 }}>
          <Txt bold>{L("Pilih karaktermu", "Choose your character")}</Txt>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {AVATARS.map((a) => (
              <Pressable
                key={a.id}
                testID={`avatar-${a.id}`}
                onPress={() => setAvatar(a.id)}
                style={{
                  alignItems: "center",
                  padding: 6,
                  borderRadius: 14,
                  borderWidth: 3,
                  borderColor: avatar === a.id ? C.gold : "transparent",
                  backgroundColor: avatar === a.id ? "#5a4429" : "transparent",
                }}
              >
                <SpriteSheet
                  sheet={`player_${a.id}_${jenjang}`}
                  row={0}
                  col={0}
                />
                <Txt size={12} bold>
                  {a.name}
                </Txt>
              </Pressable>
            ))}
          </View>
        </Panel>
        <Panel style={{ width: "100%", maxWidth: 440, gap: 8 }}>
          <Txt bold>{L("Jenjang sekolahmu", "Your school level")}</Txt>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {LEVELS.map((l) => (
              <Btn
                key={l.id}
                testID={`lvl-${l.id}`}
                label={l.label}
                kind={jenjang === l.id ? "gold" : "dark"}
                onPress={() => setJenjang(l.id)}
                style={{ flex: 1 }}
              />
            ))}
          </View>
          <Txt size={13} color={C.muted}>
            {LEVELS.find((l) => l.id === jenjang)!.desc()}
          </Txt>
        </Panel>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            width: "100%",
            maxWidth: 440,
          }}
        >
          <Btn kind="dark" label={L("Kembali", "Back")} onPress={onBack} />
          <Btn
            testID="btn-start"
            big
            label={L("Mulai!", "Start!")}
            disabled={!ok}
            onPress={() => onStart({ name: name.trim(), avatar, jenjang })}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
