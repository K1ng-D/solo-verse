import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state";
import { Btn, Panel, Txt } from "../ui";
import { C } from "../theme";
import { aiMessage, testAiKey, useAiStatus } from "../../lib/ai";

export default function Settings({
  onBack,
  onReset,
}: {
  onBack: () => void;
  onReset: () => void;
}) {
  const { soundOn, toggleSound } = useGame();
  const ins = useSafeAreaInsets();
  const ai = useAiStatus();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [confirm, setConfirm] = useState(false);

  const test = async () => {
    setBusy(true);
    setMsg("");
    setOk(null);
    try {
      const r = await testAiKey();
      setMsg(r || "Terhubung!");
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
          label="← Kembali"
          onPress={onBack}
          testID="settings-back"
        />
        <Txt size={20} bold color={C.gold} center style={{ flex: 1 }}>
          Pengaturan
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
            Gemini AI
          </Txt>
          <Txt size={12} color={ai.available ? C.green : C.muted}>
            {ai.available
              ? "● Kunci terbaca dari .env"
              : "○ Kunci belum terbaca"}
          </Txt>
          {!ai.available ? (
            <Txt size={13} color={C.muted}>
              Isi EXPO_PUBLIC_GEMINI_API_KEY di file .env, lalu jalankan ulang
              dengan npx expo start -c.
            </Txt>
          ) : null}
          <Btn
            label={busy ? "Menguji…" : "Uji Koneksi"}
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
        </Panel>

        <Panel style={{ gap: 8 }}>
          <Txt bold size={16} color={C.gold}>
            Suara
          </Txt>
          <Btn
            label={soundOn ? "Suara: Hidup" : "Suara: Mati"}
            kind={soundOn ? "green" : "dark"}
            onPress={toggleSound}
            testID="toggle-sound"
          />
        </Panel>

        <Panel style={{ gap: 8 }}>
          <Txt bold size={16} color={C.gold}>
            Data
          </Txt>
          {confirm ? (
            <View style={{ gap: 8 }}>
              <Txt size={13}>Semua progres dan profil akan dihapus. Yakin?</Txt>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Btn
                  label="Batal"
                  kind="dark"
                  onPress={() => setConfirm(false)}
                  style={{ flex: 1 }}
                />
                <Btn
                  label="Ya, hapus"
                  kind="red"
                  onPress={onReset}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <Btn
              label="Hapus Progres"
              kind="red"
              onPress={() => setConfirm(true)}
            />
          )}
        </Panel>
      </ScrollView>
    </View>
  );
}
