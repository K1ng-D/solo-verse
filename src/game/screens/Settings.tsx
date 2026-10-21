import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state";
import { Btn, Panel, Txt } from "../ui";
import { C } from "../theme";
import { aiMessage, testAiKey, useAiStatus } from "../../lib/ai";
import { L } from "../../lib/i18n";

export default function Settings({
  onBack,
  onReset,
}: {
  onBack: () => void;
  onReset: () => void;
}) {
  const { soundOn, toggleSound, lang, setLang } = useGame();
  const ins = useSafeAreaInsets();
  const ai = useAiStatus();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [diag, setDiag] = useState(false);
  const test = async () => {
    setBusy(true);
    setMsg("");
    setOk(null);
    try {
      const r = await testAiKey();
      setMsg(r || L("Terhubung!", "Connected!"));
      setOk(true);
    } catch (e) {
      setMsg(aiMessage(e));
      setOk(false);
    }
    setBusy(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: ins.top + 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingBottom: 8,
        }}
      >
        <Btn
          small
          kind="dark"
          label={L("← Kembali", "← Back")}
          onPress={onBack}
          testID="settings-back"
        />
        <Txt size={20} bold color={C.gold} center style={{ flex: 1 }}>
          {L("Pengaturan", "Settings")}
        </Txt>
        <View style={{ width: 90 }} />
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 14,
          gap: 12,
          paddingBottom: ins.bottom + 30,
          maxWidth: 560,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Panel style={{ gap: 8 }}>
          <Txt bold size={16} color={C.gold}>
            {L("Bahasa", "Language")}
          </Txt>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn
              label="Indonesia"
              kind={lang === "id" ? "gold" : "dark"}
              onPress={() => setLang("id")}
              style={{ flex: 1 }}
              testID="lang-id"
            />
            <Btn
              label="English"
              kind={lang === "en" ? "gold" : "dark"}
              onPress={() => setLang("en")}
              style={{ flex: 1 }}
              testID="lang-en"
            />
          </View>
          <Txt size={12} color={C.muted}>
            {L(
              "Isi game tetap bernuansa bahasa Jawa. Pilihan ini untuk terjemahan dan petunjuk.",
              "The game content stays Javanese. This option is for translations and instructions.",
            )}
          </Txt>
        </Panel>
        <Panel style={{ gap: 8 }}>
          <Txt bold size={16} color={C.gold}>
            {L("Suara", "Sound")}
          </Txt>
          <Btn
            label={
              soundOn
                ? L("Suara: Hidup", "Sound: On")
                : L("Suara: Mati", "Sound: Off")
            }
            kind={soundOn ? "green" : "dark"}
            onPress={toggleSound}
            testID="toggle-sound"
          />
        </Panel>
        <Panel style={{ gap: 8 }}>
          <Txt bold size={16} color={C.gold}>
            {L("Data", "Data")}
          </Txt>
          {confirm ? (
            <View style={{ gap: 8 }}>
              <Txt size={13}>
                {L(
                  "Semua progres dan profil akan dihapus. Yakin?",
                  "All progress and your profile will be deleted. Are you sure?",
                )}
              </Txt>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Btn
                  label={L("Batal", "Cancel")}
                  kind="dark"
                  onPress={() => setConfirm(false)}
                  style={{ flex: 1 }}
                />
                <Btn
                  label={L("Ya, hapus", "Yes, delete")}
                  kind="red"
                  onPress={onReset}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <Btn
              label={L("Hapus Progres", "Delete Progress")}
              kind="red"
              onPress={() => setConfirm(true)}
            />
          )}
        </Panel>
        <Panel style={{ gap: 8 }}>
          <Btn
            small
            kind="ghost"
            label={
              diag
                ? L("▼ Diagnostik koneksi", "▼ Connection diagnostics")
                : L("▶ Diagnostik koneksi", "▶ Connection diagnostics")
            }
            onPress={() => setDiag(!diag)}
            testID="diag-toggle"
          />
          {diag ? (
            <View style={{ gap: 8 }}>
              <Txt size={12} color={ai.available ? C.green : C.muted}>
                {ai.available
                  ? L(
                      "● Kunci API terbaca dari .env",
                      "● API key read from .env",
                    )
                  : L("○ Kunci API belum terbaca", "○ API key not found")}
              </Txt>
              {!ai.available ? (
                <Txt size={13} color={C.muted}>
                  {L(
                    "Isi EXPO_PUBLIC_GEMINI_API_KEY di file .env, lalu jalankan ulang dengan npx expo start -c.",
                    "Set EXPO_PUBLIC_GEMINI_API_KEY in the .env file, then restart with npx expo start -c.",
                  )}
                </Txt>
              ) : null}
              <Btn
                label={
                  busy
                    ? L("Menguji…", "Testing…")
                    : L("Uji Koneksi", "Test Connection")
                }
                kind="blue"
                disabled={busy || !ai.available}
                onPress={test}
                testID="test-ai"
              />
              {msg ? (
                <Txt size={13} color={ok === false ? C.red : C.green}>
                  {msg}
                </Txt>
              ) : null}
            </View>
          ) : null}
        </Panel>
      </ScrollView>
    </View>
  );
}
