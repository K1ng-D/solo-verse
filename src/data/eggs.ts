import type { Script, Node, Choice } from "./dialogs";
import { L } from "../lib/i18n";
import type { MapData, MapNpc } from "./mapsData";

/** Easter egg: tamu tak terduga (karakter orisinal + Athena) yang muncul setelah satu tempat selesai (lencana didapat). */
export type EggId = "basa" | "keris" | "batik" | "wayang" | "final";
export const EGG_IDS: EggId[] = ["basa", "keris", "batik", "wayang", "final"];
export const EGG_REWARD: Record<EggId, number> = {
  basa: 30,
  keris: 30,
  batik: 30,
  wayang: 30,
  final: 60,
};
export const eggFlag = (id: EggId) => `egg:${id}`;

export const EGG_INFO: Record<
  EggId,
  { emoji: string; name: string; sprite: string; place: () => string }
> = {
  basa: {
    emoji: "📖",
    name: "Kak Aksara",
    sprite: "aksara",
    place: () => L("Sekolah Basa", "Language School"),
  },
  keris: {
    emoji: "🗡️",
    name: "Lintang",
    sprite: "lintang",
    place: () => L("Museum Pusaka", "Heirloom Museum"),
  },
  batik: {
    emoji: "🦉",
    name: "Athena",
    sprite: "athena",
    place: () => L("Rumah Batik", "Batik House"),
  },
  wayang: {
    emoji: "🎤",
    name: "Nada",
    sprite: "nada",
    place: () => L("Panggung Wayang", "Wayang Stage"),
  },
  final: {
    emoji: "📜",
    name: "Pak Slamet",
    sprite: "slamet",
    place: () => L("Gerbang Keraton", "Palace Gate"),
  },
};

/** Tamu berdiri di luar, di Kota Solo, setelah lencana didapat (Pak Slamet: setelah raksasa kalah), sampai diajak bicara. Dialog TIDAK muncul sendiri. */
export const GOD_SPOT: Record<
  EggId,
  { x: number; y: number; face: string; where: () => string }
> = {
  keris: {
    x: 11.5,
    y: 16.5,
    face: "up",
    where: () => L("di tepi sungai", "on the riverbank"),
  },
  basa: {
    x: 23.5,
    y: 21.5,
    face: "right",
    where: () => L("di depan Sekolah Basa", "in front of the Language School"),
  },
  batik: {
    x: 3.5,
    y: 11.5,
    face: "right",
    where: () =>
      L(
        "di dekat semak, sisi kiri kota",
        "by the bush on the left side of town",
      ),
  },
  wayang: {
    x: 28.5,
    y: 12.6,
    face: "left",
    where: () =>
      L(
        "di bawah pohon, sisi kanan kota",
        "under the tree on the right side of town",
      ),
  },
  final: {
    x: 15.5,
    y: 9.5,
    face: "down",
    where: () =>
      L("di alun-alun depan gerbang", "in the square in front of the gate"),
  },
};
export const godNpcId = (id: EggId) => `god_${id}`;
export const eggFromNpc = (npcId: string): EggId | null =>
  npcId.startsWith("god_") && EGG_IDS.includes(npcId.slice(4) as EggId)
    ? (npcId.slice(4) as EggId)
    : null;
/** Tambahkan tamu yang sudah "muncul" ke peta kota (overworld). Peta di dalam ruangan tidak berubah. */
export function withGod(
  map: MapData,
  badges: string[],
  flags: Record<string, any>,
  bossDone = false,
): MapData {
  if (map.id !== "overworld") return map;
  const ids = EGG_IDS.filter(
    (id) =>
      !flags[eggFlag(id)] && (id === "final" ? bossDone : badges.includes(id)),
  );
  if (!ids.length) return map;
  const npcs: MapNpc[] = ids.map((id) => ({
    id: godNpcId(id),
    sprite: EGG_INFO[id].sprite,
    x: GOD_SPOT[id].x,
    y: GOD_SPOT[id].y,
    face: GOD_SPOT[id].face,
    name: EGG_INFO[id].name,
  }));
  return { ...map, npcs: [...map.npcs, ...npcs] };
}

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

/** Tamu bertanya satu hal sederhana; jawaban benar memberi hadiah, salah boleh coba lagi. */
function quizEgg(
  id: EggId,
  who: string,
  lines: { a: string; b: string; ok: string; bad: string; end: string },
  right: string,
  wrong: [string, string],
): Script {
  const win = (label: string): Choice => ({ label, next: "ok" });
  const lose = (label: string): Choice => ({ label, next: "bad" });
  const choices = shuffle([win(right), lose(wrong[0]), lose(wrong[1])]);
  const portrait = `god_${id === "basa" ? "aksara" : id === "keris" ? "lintang" : id === "batik" ? "athena" : "nada"}`;
  const nodes: Record<string, Node> = {
    a: { speaker: who, portrait, text: lines.a, next: "q" },
    q: { speaker: who, portrait, text: lines.b, choices },
    bad: {
      speaker: who,
      portrait,
      text: lines.bad,
      choices: [{ label: L("Coba lagi", "Try again"), next: "q" }],
    },
    ok: { speaker: who, portrait, text: lines.ok, next: "end" },
    end: { speaker: who, portrait, text: lines.end, action: `egg:${id}` },
  };
  return { start: "a", nodes };
}

export function eggScript(id: EggId, name: string): Script {
  switch (id) {
    case "basa":
      return quizEgg(
        "basa",
        "Kak Aksara",
        {
          a: L(
            "Sugeng enjing! 📖 Aku Kak Aksara, sensei bahasa dari negeri buku. Aku keliling belajar bahasa daerah, dan katanya basa krama di Solo adalah yang paling halus.",
            "Sugeng enjing! 📖 I am Kak Aksara, a language sensei from the land of books. I travel around learning regional languages, and they say krama in Solo is the most refined of all.",
          ),
          b: L(
            `Boleh aku belajar darimu, ${name}? Kalau aku mau berterima kasih kepada orang yang lebih tua dengan sopan, aku harus bilang apa?`,
            `May I learn from you, ${name}? If I want to thank an elder politely, what should I say?`,
          ),
          ok: L(
            '"Matur nuwun"! Catatanku langsung penuh bintang. Bahasa itu seperti kunci ke hati orang, ya.',
            '"Matur nuwun"! My notebook is suddenly full of stars. Language really is a key to people\'s hearts.',
          ),
          bad: L(
            "Hmm, kalau begitu Mbah bisa bingung. Ingat-ingat sapaan sopan dari Sekolah Basa tadi, ya!",
            "Hmm, Mbah might get confused. Try to recall the polite phrases from the Language School!",
          ),
          end: L(
            "Sebagai hadiah, kuberikan satu bintang ilmu. Matur nuwun, Guru! 📖",
            "As a reward, take one star of knowledge. Matur nuwun, teacher! 📖",
          ),
        },
        L("Matur nuwun, Mbah.", "Matur nuwun, Mbah."),
        [
          L("Aku wis mangan, Mbah!", "Aku wis mangan, Mbah! (I already ate!)"),
          L("Hei, Mbah, piye kabarmu?", "Hey, Mbah, piye kabarmu? (casual)"),
        ],
      );
    case "keris":
      return quizEgg(
        "keris",
        "Lintang",
        {
          a: L(
            "Jangan takut. 🗡️ Namaku Lintang, pengelana yang mengikuti kabar tentang pusaka. Tadi aku menyusuri tepi sungai ini dan melihat Museum Pusaka dari kejauhan.",
            "Do not be afraid. 🗡️ My name is Lintang, a wanderer who follows tales of heirlooms. I walked along this riverbank and spotted the Heirloom Museum from afar.",
          ),
          b: L(
            "Di sana kulihat benda dengan bilah berkelok-kelok. Lekukan pada bilah keris itu namanya apa?",
            "There I saw an object with a winding blade. What are the curves on a keris blade called?",
          ),
          ok: L(
            "Luk! Jumlahnya biasanya ganjil. Kelokan itu bukan sekadar hiasan, ada makna dan doa di dalamnya.",
            "Luk! The number is usually odd. Those curves are not just decoration, they carry meaning and prayers.",
          ),
          bad: L(
            "Bukan itu. Pusaka sepenting ini tak boleh salah disebut. Coba lagi.",
            "Not that. An heirloom this important must not be named wrongly. Try again.",
          ),
          end: L(
            "Aku akan menghormatinya: dilihat dan dipelajari, bukan diayun-ayunkan. Terima kasih, Penjaga! 🗡️",
            "I will respect it: to be seen and studied, never waved about. Thank you, Guardian! 🗡️",
          ),
        },
        "Luk",
        ["Pamor", "Hulu"],
      );
    case "batik":
      return quizEgg(
        "batik",
        "Athena",
        {
          a: L(
            "Hoo-hoo! 🦉 Aku Athena, dewi kerajinan menenun. Dulu aku kalah sabar dari seorang penenun bernama Arachne. Sekarang kudengar ada seni kain yang digambar dengan lilin!",
            "Hoo-hoo! 🦉 I am Athena, goddess of weaving and crafts. Long ago I lost my patience with a weaver named Arachne. Now I hear of a cloth art drawn with wax!",
          ),
          b: L(
            "Aku ingin ikut membatik. Tapi apa yang menahan warna agar bagian kain tertentu tidak terkena celupan?",
            "I want to try batik. But what holds back the colour so some parts of the cloth do not take the dye?",
          ),
          ok: L(
            "Malam, lilin batik! Kau memang cerdas. Aku pernah memakai benang, tapi lilin sungguh cara berpikir yang lain.",
            "Malam, batik wax! How clever. I only ever used thread, but wax is a different way of thinking.",
          ),
          bad: L(
            "Hmm, kalau begitu kain Arachne pun tak akan selamat. Pikirkan lagi, kawan!",
            "Hmm, by that logic even Arachne's cloth would not survive. Think again, friend!",
          ),
          end: L(
            "Akan kupajang di Gunung Olympus: batik kawung pertama para dewa. Terima kasih! 🦉",
            "I shall hang it on Mount Olympus: the first kawung batik of the gods. Thank you! 🦉",
          ),
        },
        L("Malam (lilin batik)", "Malam (batik wax)"),
        [L("Tepung", "Flour"), L("Air garam", "Salt water")],
      );
    case "wayang":
      return quizEgg(
        "wayang",
        "Nada",
        {
          a: L(
            "Cek, cek, satu dua! 🎤 Aku Nada, penyanyi panggung. Tadi kudengar gamelan dari Panggung Wayang, dan suaraku langsung ingin ikut. Boleh ikut latihan?",
            "Check, check, one two! 🎤 I am Nada, a stage singer. I heard the gamelan from the Wayang Stage and my voice just wanted to join in. May I practise with you?",
          ),
          b: L(
            "Tapi di sini siapa yang memimpin pertunjukan, mengisi semua suara wayang, dan memberi aba-aba pada para penabuh? Dirigen? Penyanyi?",
            "But who here leads the show, voices all the puppets, and cues the musicians? A conductor? A singer?",
          ),
          ok: L(
            "Dalang! Satu orang memainkan puluhan tokoh sampai fajar. Itu baru konser sungguhan.",
            "The dalang! One person plays dozens of characters until dawn. That is a real concert.",
          ),
          bad: L(
            "Hmm, kalau begitu siapa yang bercerita sambil menggerakkan wayang? Coba pikirkan lagi.",
            "Hmm, then who tells the story while moving the puppets? Think again.",
          ),
          end: L(
            "Aku mau belajar nembang dulu bersama sinden. Terima kasih, Penjaga! 🎤",
            "I shall learn to sing tembang with a sinden first. Thank you, Guardian! 🎤",
          ),
        },
        "Dalang",
        [L("Dirigen", "Conductor"), L("Penyanyi", "Singer")],
      );
    case "final":
      return {
        start: "a",
        nodes: {
          a: {
            speaker: "Pak Slamet",
            portrait: "god_slamet",
            text: L(
              `Sugeng sonten! 📜 Saya Pak Slamet, warga Solo biasa yang kebagian mengantar surat. Katanya ada Penjaga Budaya Solo bernama ${name}. Benar itu kamu, Nak?`,
              `Good evening! 📜 I am Pak Slamet, an ordinary Solo resident who got the job of delivering a letter. They say there is a Culture Guardian of Solo named ${name}. Is that you, dear?`,
            ),
            next: "b",
          },
          b: {
            speaker: "Pak Slamet",
            portrait: "god_slamet",
            text: L(
              'Suratnya dari Kak Aksara, Lintang, Athena, dan Nada: "Terima kasih, Guru! Kami membuka kelas budaya Jawa tiap malam Jumat. Kak Aksara selalu paling awal karena sibuk berlatih matur nuwun."',
              'The letter is from Kak Aksara, Lintang, Athena, and Nada: "Thank you, teacher! We hold a Javanese culture class every Friday night. Kak Aksara is always first because he is busy practising matur nuwun."',
            ),
            next: "c",
          },
          c: {
            speaker: "Pak Slamet",
            portrait: "god_slamet",
            text: L(
              "Pesan dari saya sendiri: jaga terus budayamu, ya. Batik, wayang, keris, dan basa Jawa itu titipan leluhur. Matur nuwun, sugeng tindak! 🙏",
              "A message from me: keep guarding your culture. Batik, wayang, keris, and Javanese are a treasure handed down by our ancestors. Matur nuwun, sugeng tindak! 🙏",
            ),
            action: "egg:final",
          },
        },
      };
  }
}
