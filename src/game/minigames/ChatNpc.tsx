import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import type { GameProps } from "../types";
import { askNpc, aiAvailable, aiMessage, ChatMsg, NpcKey } from "../../lib/ai";
import { L, tr } from "../../lib/i18n";
import { FAQ } from "../../data/content";
import { Btn, GameShell, Panel, Portrait, Txt } from "../ui";
import { SpriteSheet } from "../world/Sprite";
import { C } from "../theme";
import { sfx } from "../../lib/sound";

const META = (): Record<
  NpcKey,
  {
    name: string;
    portrait?: string;
    sheet: string;
    hello: string;
    chips: string[];
  }
> => ({
  kiwira: {
    name: "Ki Wira",
    portrait: "ki-wira",
    sheet: "npc_kiwira",
    hello: L(
      "Sampun rawuh! Tanyakan apa saja tentang wayang, gamelan, atau budaya Solo.",
      "Sampun rawuh! Ask me anything about wayang, gamelan, or Solo culture.",
    ),
    chips: [
      L("Apa itu dalang?", "What is a dalang?"),
      L("Kenapa ada gunungan?", "Why is there a gunungan?"),
      L("Siapa punakawan?", "Who are the punakawan?"),
    ],
  },
  busekar: {
    name: "Bu Sekar",
    portrait: "bu-sekar",
    sheet: "npc_busekar",
    hello: L(
      "Wilujeng rawuh! Mau tanya soal batik? Canting, malam, motif, silakan.",
      "Wilujeng rawuh! Want to ask about batik? Canting, wax, motifs, go ahead.",
    ),
    chips: [
      L(
        "Apa bedanya batik tulis dan cap?",
        "What is the difference between tulis and cap batik?",
      ),
      L("Kenapa warna sogan cokelat?", "Why is sogan brown?"),
      L("Apa arti motif kawung?", "What does the kawung motif mean?"),
    ],
  },
  empujaya: {
    name: "Empu Jaya",
    portrait: "empu-jaya",
    sheet: "npc_empujaya",
    hello: L(
      "Selamat datang. Keris adalah karya seni dan pusaka. Apa yang ingin kamu ketahui?",
      "Welcome. The keris is a work of art and an heirloom. What would you like to know?",
    ),
    chips: [
      L("Apa itu pamor?", "What is pamor?"),
      L("Mengapa keris punya luk?", "Why does a keris have luk?"),
      L("Apa itu jamasan?", "What is jamasan?"),
    ],
  },
  bularas: {
    name: "Bu Laras",
    portrait: "bu-laras",
    sheet: "npc_bularas",
    hello: L(
      "Sugeng rawuh! Ayo belajar basa Jawa. Mau tanya apa?",
      "Sugeng rawuh! Let us learn Javanese. What would you like to ask?",
    ),
    chips: [
      L(
        "Apa bedanya ngoko dan krama?",
        "What is the difference between ngoko and krama?",
      ),
      L("Bagaimana berterima kasih pada Simbah?", "How do I thank Simbah?"),
      L("Apa itu aksara Jawa?", "What is Javanese script?"),
    ],
  },
  mbah: {
    name: "Mbah Putri",
    sheet: "npc_mbah",
    hello: L(
      "Eh, Nak, sampun dugi? Ayo ngobrol sama Mbah. Pakai basa krama ya. (Eh, Nak, sudah datang? Mari ngobrol dengan Mbah. Pakai bahasa krama ya.)",
      "Eh, Nak, sampun dugi? Come chat with Mbah. Use polite krama, please. (Eh, dear, you have arrived? ...)",
    ),
    chips: [],
  },
});
const MBAH_CHIPS = () => [
  {
    t: "Sugeng enjing, Mbah.",
    tr: L("Selamat pagi, Mbah.", "Good morning, Mbah."),
  },
  {
    t: "Mbah, panjenengan sehat?",
    tr: L("Mbah, apakah Mbah sehat?", "Mbah, are you well?"),
  },
  {
    t: "Nuwun sewu, Mbah.",
    tr: L("Permisi / mohon maaf, Mbah.", "Excuse me / pardon me, Mbah."),
  },
  {
    t: "Kula badhe sowan, Mbah.",
    tr: L("Saya mau berkunjung, Mbah.", "I would like to visit, Mbah."),
  },
  { t: "Matur nuwun, Mbah.", tr: L("Terima kasih, Mbah.", "Thank you, Mbah.") },
  {
    t: "Nyuwun pamit, Mbah.",
    tr: L("Saya pamit, Mbah.", "I must take my leave, Mbah."),
  },
];
// 5 misi percakapan (sebelumnya 3)
const GOALS = () => [
  {
    id: "sapa",
    text: L(
      "1. Sapa Mbah dengan sopan (mis. “Sugeng enjing”)",
      "1. Greet Mbah politely (e.g. “Sugeng enjing”)",
    ),
    re: /sugeng|wilujeng/i,
  },
  {
    id: "kabar",
    text: L(
      "2. Tanyakan kabar Mbah (mis. “Panjenengan sehat?”)",
      "2. Ask how Mbah is (e.g. “Panjenengan sehat?”)",
    ),
    re: /sehat|sae|pripun|kabar/i,
  },
  {
    id: "permisi",
    text: L(
      "3. Minta izin dengan sopan (“Nuwun sewu”)",
      "3. Ask permission politely (“Nuwun sewu”)",
    ),
    re: /nuwun\s*sewu|ngapunten|sowan/i,
  },
  {
    id: "nuwun",
    text: L(
      "4. Ucapkan terima kasih (“Matur nuwun”)",
      "4. Say thank you (“Matur nuwun”)",
    ),
    re: /matur\s*nuwun/i,
  },
  {
    id: "pamit",
    text: L(
      "5. Pamit dengan sopan (“Nyuwun pamit”)",
      "5. Say goodbye politely (“Nyuwun pamit”)",
    ),
    re: /pamit/i,
  },
];
const NGOKO = /\b(aku|kowe|piye|ora|wis|arep|lunga|mangan|turu)\b/i;

function mbahFallback(msg: string): string {
  if (NGOKO.test(msg) && !/kula|panjenengan|nuwun|sugeng/i.test(msg))
    return L(
      'Hehe, Nak, ngomong sama Mbah pakai krama ya. Contoh: "Kula badhe tindak" bukan "Aku arep lunga". (Bicara dengan Mbah pakai krama ya, Nak.)',
      'Hehe, dear, speak to Mbah in krama. For example: "Kula badhe tindak", not "Aku arep lunga". (Use krama with Mbah, dear.)',
    );
  if (/sugeng|wilujeng/i.test(msg))
    return L(
      "Nggih, sugeng enjing, Nak. Sampun dhahar dereng? (Ya, selamat pagi, Nak. Sudah makan belum?)",
      "Nggih, sugeng enjing, Nak. Sampun dhahar dereng? (Yes, good morning, dear. Have you eaten yet?)",
    );
  if (/matur\s*nuwun/i.test(msg))
    return L(
      "Sami-sami, Nak. Mbah bingah panjenengan sowan. (Sama-sama, Nak. Mbah senang kamu datang.)",
      "Sami-sami, Nak. Mbah bingah panjenengan sowan. (You are welcome, dear. Mbah is glad you came.)",
    );
  if (/pamit/i.test(msg))
    return L(
      "Nggih, ngatos-atos ing dalan, Nak. (Ya, hati-hati di jalan, Nak.)",
      "Nggih, ngatos-atos ing dalan, Nak. (Yes, take care on the road, dear.)",
    );
  if (/nuwun sewu|ngapunten/i.test(msg))
    return L(
      "Mangga, Nak, mboten napa-napa. (Silakan, Nak, tidak apa-apa.)",
      "Mangga, Nak, mboten napa-napa. (Please, dear, it is fine.)",
    );
  if (/sehat|sae|pripun|kabar/i.test(msg))
    return L(
      "Alhamdulillah, Mbah sae, Nak. Panjenengan pripun? (Alhamdulillah, Mbah sehat. Kamu bagaimana?)",
      "Alhamdulillah, Mbah sae, Nak. Panjenengan pripun? (Thank God, Mbah is well, dear. How about you?)",
    );
  if (/sowan/i.test(msg))
    return L(
      "Mangga sowan, Nak. Mbah ngentosi. (Silakan berkunjung, Nak. Mbah menunggu.)",
      "Mangga sowan, Nak. Mbah ngentosi. (Please visit, dear. Mbah is waiting.)",
    );
  return L(
    'Mbah kirang mangertos, Nak. Coba pakai "Sugeng enjing", "Matur nuwun", atau "Nyuwun pamit". (Mbah kurang paham, Nak.)',
    'Mbah kirang mangertos, Nak. Try "Sugeng enjing", "Matur nuwun", or "Nyuwun pamit". (Mbah does not quite understand, dear.)',
  );
}
function faqReply(npc: NpcKey, msg: string): string {
  const m = msg.toLowerCase();
  const hit = FAQ[npc].find((f) => f.k.some((k) => m.includes(k)));
  if (hit) return tr(hit.a);
  const keys = FAQ[npc]
    .slice(0, 4)
    .map((f) => f.k[0])
    .join(", ");
  return L(
    `Hmm, aku belum paham pertanyaan itu. Coba tanyakan tentang: ${keys}. (Sambungkan internet agar bisa bertanya bebas.)`,
    `Hmm, I do not understand that question yet. Try asking about: ${keys}. (Connect to the internet to ask freely.)`,
  );
}

export default function ChatNpc({
  jenjang,
  name,
  cfg,
  onDone,
  onExit,
}: GameProps) {
  const npc: NpcKey = cfg?.npc || "kiwira";
  const mbah = npc === "mbah" && !!cfg?.goals;
  const meta = META()[npc];
  const goals = GOALS();
  const [msgs, setMsgs] = useState<
    { from: "me" | "npc"; text: string; note?: string }[]
  >([{ from: "npc", text: meta.hello }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);
  const [showChips, setShowChips] = useState(jenjang === "sd");
  const scroll = useRef<ScrollView>(null);
  const hist = useRef<ChatMsg[]>([]);
  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 60);
  }, [msgs, busy]);

  const send = async (raw: string) => {
    const t = raw.trim();
    if (!t || busy) return;
    setText("");
    setTurns((n) => n + 1);
    sfx("tap", 0.4);
    setMsgs((m) => [...m, { from: "me", text: t }]);
    if (mbah) {
      const nd = goals
        .filter((g) => g.re.test(t) && !done.includes(g.id))
        .map((g) => g.id);
      if (nd.length) {
        setDone((d) => [...d, ...nd]);
        sfx("collect");
      }
    }
    setBusy(true);
    let reply = "";
    let note: string | undefined;
    if (aiAvailable()) {
      try {
        reply = await askNpc(
          npc,
          jenjang,
          name,
          hist.current,
          t,
          mbah
            ? `Latihan basa krama dengan Mbah. Pancing pemain secara halus untuk: ${goals
                .filter((g) => !done.includes(g.id))
                .map((g) => g.text.replace(/^\d\.\s*/, ""))
                .join("; ")}`
            : "",
        );
        hist.current.push(
          { role: "user", text: t },
          { role: "model", text: reply },
        );
      } catch (e) {
        reply = mbah ? mbahFallback(t) : faqReply(npc, t);
        note = aiMessage(e);
      }
    } else {
      reply = mbah ? mbahFallback(t) : faqReply(npc, t);
      note = L("Mode offline: jawaban dasar", "Offline mode: basic answers");
    }
    setMsgs((m) => [...m, { from: "npc", text: reply, note }]);
    setBusy(false);
  };

  const allDone = mbah && goals.every((g) => done.includes(g.id));
  const finish = () => {
    const stars = turns <= 8 ? 3 : turns <= 13 ? 2 : 1;
    onDone({ stars, score: 100, data: { turns } });
  };
  const leave = () => {
    if (!mbah) onDone({ stars: 0, score: 0, data: { asked: turns } });
    else onExit();
  };

  return (
    <GameShell
      title={mbah ? "Ngobrol karo Mbah" : `${L("Tanya", "Ask")} ${meta.name}`}
      onClose={leave}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: 12, gap: 8, flex: 1 }}>
          {mbah ? (
            <Panel style={{ gap: 4, paddingVertical: 8 }}>
              <Txt
                size={12}
                bold
                color={C.gold}
              >{`${L("Misi percakapan", "Conversation quests")} ${done.length}/${goals.length}`}</Txt>
              {goals.map((g) => (
                <Txt
                  key={g.id}
                  size={12}
                  color={done.includes(g.id) ? C.green : C.muted}
                >
                  {(done.includes(g.id) ? "✓ " : "○ ") + g.text}
                </Txt>
              ))}
            </Panel>
          ) : (
            <Txt size={11} color={C.muted} center>
              {L(
                "Tanyakan apa saja tentang budaya Solo",
                "Ask anything about Solo culture",
              )}
            </Txt>
          )}
          <ScrollView
            ref={scroll}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            {msgs.map((m, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: m.from === "me" ? "flex-end" : "flex-start",
                  gap: 8,
                }}
              >
                {m.from === "npc" ? (
                  meta.portrait ? (
                    <Portrait name={meta.portrait} size={40} round />
                  ) : (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        overflow: "hidden",
                        backgroundColor: C.panel2,
                        borderWidth: 2,
                        borderColor: C.gold,
                      }}
                    >
                      <View style={{ position: "absolute", left: -7, top: -2 }}>
                        <SpriteSheet
                          sheet={meta.sheet}
                          row={0}
                          col={0}
                          scale={0.85}
                        />
                      </View>
                    </View>
                  )
                ) : null}
                <View
                  style={{
                    maxWidth: "78%",
                    backgroundColor: m.from === "me" ? C.gold : C.panel,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: m.from === "me" ? C.goldDark : C.line,
                    padding: 10,
                  }}
                >
                  <Txt
                    color={m.from === "me" ? "#2b1b0c" : C.text}
                    bold={m.from === "me"}
                  >
                    {m.text}
                  </Txt>
                  {m.note ? (
                    <Txt size={11} color={C.muted} style={{ marginTop: 4 }}>
                      {m.note}
                    </Txt>
                  ) : null}
                </View>
              </View>
            ))}
            {busy ? (
              <Txt color={C.muted} size={13}>
                {meta.name} {L("sedang mengetik…", "is typing…")}
              </Txt>
            ) : null}
          </ScrollView>
          {allDone ? (
            <Btn
              testID="chat-finish"
              kind="green"
              label={L(
                "Percakapan selesai! Ambil hadiah",
                "Conversation complete! Claim your reward",
              )}
              onPress={finish}
            />
          ) : null}
          {mbah ? (
            <View>
              <Pressable onPress={() => setShowChips(!showChips)}>
                <Txt size={12} color={C.goldSoft} bold>
                  {showChips
                    ? L("▼ Sembunyikan bantuan kalimat", "▼ Hide sentence help")
                    : L("▶ Perlu bantuan kalimat?", "▶ Need sentence help?")}
                </Txt>
              </Pressable>
              {showChips ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  {MBAH_CHIPS().map((c) => (
                    <Pressable
                      key={c.t}
                      testID={`chip-${c.t.split(",")[0].replace(/\s/g, "")}`}
                      onPress={() => send(c.t)}
                      style={{
                        backgroundColor: C.panel2,
                        borderColor: C.line,
                        borderWidth: 2,
                        borderRadius: 12,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                      }}
                    >
                      <Txt size={13} bold>
                        {c.t}
                      </Txt>
                      <Txt size={10} color={C.muted}>
                        {c.tr}
                      </Txt>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {meta.chips.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => send(c)}
                  style={{
                    backgroundColor: C.panel2,
                    borderColor: C.line,
                    borderWidth: 2,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Txt size={12} bold>
                    {c}
                  </Txt>
                </Pressable>
              ))}
            </View>
          )}
          <View style={{ flexDirection: "row", gap: 8, paddingBottom: 6 }}>
            <TextInput
              testID="chat-input"
              value={text}
              onChangeText={setText}
              onSubmitEditing={() => send(text)}
              placeholder={
                mbah
                  ? L("Tulis dalam basa Jawa…", "Write in Javanese…")
                  : L("Tulis pertanyaanmu…", "Type your question…")
              }
              placeholderTextColor="#9a8a70"
              maxLength={200}
              style={{
                flex: 1,
                backgroundColor: C.panel,
                borderColor: C.line,
                borderWidth: 2,
                borderRadius: 12,
                color: C.text,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 15,
              }}
            />
            <Btn
              testID="chat-send"
              label={L("Kirim", "Send")}
              onPress={() => send(text)}
              disabled={busy || !text.trim()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GameShell>
  );
}
