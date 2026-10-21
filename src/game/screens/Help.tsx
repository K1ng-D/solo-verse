import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, Panel, Txt } from "../ui";
import { C } from "../theme";
import { L } from "../../lib/i18n";

const items = (): [string, string, string][] => [
  [
    "🕹️",
    L("Bergerak", "Moving"),
    L(
      "Geser joystick di kiri bawah, atau pakai panah / WASD di keyboard.",
      "Drag the joystick at the bottom left, or use the arrow keys / WASD on a keyboard.",
    ),
  ],
  [
    "🅐",
    L("Berinteraksi", "Interacting"),
    L(
      "Dekati orang atau benda yang berkilau, lalu tekan tombol A (atau Spasi / Enter).",
      "Get close to a person or sparkling object, then press A (or Space / Enter).",
    ),
  ],
  [
    "🏠",
    L("Masuk bangunan", "Entering buildings"),
    L(
      "Jalan ke pintu rumah untuk masuk. Keluar lewat pintu di bagian bawah ruangan.",
      "Walk to the door to go in. Leave through the door at the bottom of the room.",
    ),
  ],
  [
    "🎨",
    L("Mini-game", "Mini-games"),
    L(
      "Menggambar batik, campur warna, tabuh gamelan, susun keris, dan masih banyak lagi.",
      "Draw batik, mix colours, play the gamelan, assemble a keris, and more.",
    ),
  ],
  [
    "👾",
    L("Bayangan Lupa", "Shadows of Forgetting"),
    L(
      "Jangan sentuh bayangan di jalan, kecuali kamu siap menjawab pertanyaan untuk mengusirnya.",
      "Do not touch the shadows on the road unless you are ready to answer questions to drive them away.",
    ),
  ],
  [
    "⭐",
    L("Bintang", "Stars"),
    L(
      "Tiap wahana memberi 1 sampai 3 bintang. Di tiap tempat, kumpulkan 3 bintang (SD), 6 bintang (SMP), atau 9 bintang (SMA) untuk membuka ujian akhir. Wahana boleh diulang untuk menambah bintang.",
      "Each activity gives 1 to 3 stars. At each place, collect 3 stars (SD), 6 stars (SMP), or 9 stars (SMA) to unlock the final exam. You can replay activities to earn more stars.",
    ),
  ],
  [
    "🏅",
    L("Lencana", "Badges"),
    L(
      "Setelah bintang cukup, ikuti ujian dari pembimbing untuk meraih lencana. Empat lencana membuka Gerbang Keraton.",
      "Once you have enough stars, take the mentor's exam to earn the badge. Four badges open the Palace Gate.",
    ),
  ],
  [
    "👑",
    L("Raksasa", "The Giant"),
    L(
      "Kalau kalah, Bayangan Lupa menang dan kamu kembali ke depan gerbang. Bangkit dan coba lagi!",
      "If you lose, the Shadows win and you return to the front of the gate. Rise and try again!",
    ),
  ],
  [
    "🌼",
    L("Sekar Emas", "Golden Flowers"),
    L(
      "Kumpulkan bunga berkilau untuk bonus XP.",
      "Collect the sparkling flowers for bonus XP.",
    ),
  ],
  [
    "❓",
    L("Tamu misterius", "Mystery guests"),
    L(
      "Selesaikan satu tempat dan kejutan bisa muncul. Ada 5 tamu yang menunggu!",
      "Complete a place and a surprise may appear. 5 guests are waiting!",
    ),
  ],
  [
    "🌐",
    L("Internet", "Internet"),
    L(
      "Tanya NPC, penjelasan jawaban, penilaian batik, dan cerita dalang butuh internet. Tanpa internet game tetap bisa dimainkan.",
      "Asking NPCs, answer explanations, batik feedback, and the dalang story need internet. Without it the game is still fully playable.",
    ),
  ],
];
export default function Help({ onBack }: { onBack: () => void }) {
  const ins = useSafeAreaInsets();
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
          testID="help-back"
        />
        <Txt size={20} bold color={C.gold} center style={{ flex: 1 }}>
          {L("Cara Main", "How to Play")}
        </Txt>
        <View style={{ width: 90 }} />
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 14,
          gap: 10,
          paddingBottom: ins.bottom + 30,
          maxWidth: 560,
          width: "100%",
          alignSelf: "center",
        }}
      >
        {items().map(([e, t, d]) => (
          <Panel
            key={t}
            style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
          >
            <Txt size={28}>{e}</Txt>
            <View style={{ flex: 1 }}>
              <Txt bold color={C.gold}>
                {t}
              </Txt>
              <Txt size={13}>{d}</Txt>
            </View>
          </Panel>
        ))}
      </ScrollView>
    </View>
  );
}
