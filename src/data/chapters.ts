import type { NpcKey } from "../lib/ai";
import type { Jenjang, Progress } from "../game/types";
import type { Topic } from "./quiz";
import { EN, L, T } from "../lib/i18n";

export type ChapterId = "batik" | "wayang" | "keris" | "basa";
export type GameKind =
  | "draw"
  | "mix"
  | "memory"
  | "order"
  | "sort"
  | "rhythm"
  | "keris"
  | "chat"
  | "story"
  | "quiz"
  | "boss";

export const CHAPTER_IDS: ChapterId[] = ["batik", "wayang", "keris", "basa"];
export const CHAPTERS: Record<
  ChapterId,
  {
    id: ChapterId;
    title: string;
    place: string;
    door: string;
    mentor: NpcKey;
    mentorName: string;
    portrait: string;
    topic: Topic;
    stations: string[];
    badge: string;
    color: string;
    art: string;
    npcId: string;
    doorLabel: string;
    fromSpawn: string;
  }
> = {
  batik: {
    id: "batik",
    title: "Batik Laweyan",
    place: T("Rumah Batik", "Batik House"),
    door: "to_batik",
    mentor: "busekar",
    mentorName: "Bu Sekar",
    portrait: "bu-sekar",
    topic: "batik",
    stations: ["canting", "celup", "motif", "tungku"],
    badge: T("Penjaga Batik", "Batik Guardian"),
    color: "#2b3a67",
    art: "batik-village",
    npcId: "busekar",
    doorLabel: T("Rumah Batik", "Batik House"),
    fromSpawn: "from_batik",
  },
  wayang: {
    id: "wayang",
    title: "Wayang Adventure",
    place: T("Panggung Wayang", "Wayang Stage"),
    door: "to_wayang",
    mentor: "kiwira",
    mentorName: "Ki Wira",
    portrait: "ki-wira",
    topic: "wayang",
    stations: ["gamelan", "lakon", "tokoh", "dalang"],
    badge: T("Penjaga Wayang", "Wayang Guardian"),
    color: "#7d2a2a",
    art: "wayang-stage",
    npcId: "kiwira2",
    doorLabel: T("Panggung Wayang", "Wayang Stage"),
    fromSpawn: "from_wayang",
  },
  keris: {
    id: "keris",
    title: T("Museum Pusaka", "Heirloom Museum"),
    place: T("Museum Pusaka", "Heirloom Museum"),
    door: "to_keris",
    mentor: "empujaya",
    mentorName: "Empu Jaya",
    portrait: "empu-jaya",
    topic: "keris",
    stations: ["anatomi", "tertib", "katalog"],
    badge: T("Penjaga Pusaka", "Heirloom Guardian"),
    color: "#6b4423",
    art: "keris-gallery",
    npcId: "empujaya",
    doorLabel: T("Museum Pusaka", "Heirloom Museum"),
    fromSpawn: "from_keris",
  },
  basa: {
    id: "basa",
    title: "Basa Jawa Adventure",
    place: T("Sekolah Basa", "Language School"),
    door: "to_basa",
    mentor: "bularas",
    mentorName: "Bu Laras",
    portrait: "bu-laras",
    topic: "basa",
    stations: ["tingkat", "ukara", "tembung", "mbah"],
    badge: T("Penjaga Basa", "Language Guardian"),
    color: "#2f5fa8",
    art: "basa-class",
    npcId: "bularas",
    doorLabel: T("Sekolah Basa", "Language School"),
    fromSpawn: "from_basa",
  },
};

export type StationDef = {
  id: string;
  chapter: ChapterId;
  kind: GameKind;
  title: string;
  blurb: string;
  xp: number;
  cfg?: any;
  needs?: string;
  needsMsg?: string;
};
export const STATIONS: Record<string, StationDef> = {
  canting: {
    id: "canting",
    chapter: "batik",
    kind: "draw",
    title: T("Nyanting: Gambar Batikmu", "Nyanting: Draw Your Batik"),
    blurb: T(
      "Gambar motif dengan canting di atas kain!",
      "Draw a motif with the canting on the cloth!",
    ),
    xp: 40,
  },
  celup: {
    id: "celup",
    chapter: "batik",
    kind: "mix",
    title: T("Celup Warna", "Dye Bath"),
    blurb: T(
      "Campur pigmen sampai warnanya pas, lalu celup kainmu!",
      "Mix pigments until the colour is right, then dye your cloth!",
    ),
    xp: 40,
    needs: "batik:canting",
    needsMsg: T(
      "Kainmu belum bermotif. Gambar dulu di Meja Canting!",
      "Your cloth has no motif yet. Draw one at the Canting Table first!",
    ),
  },
  motif: {
    id: "motif",
    chapter: "batik",
    kind: "memory",
    title: T("Jemuran Motif", "Motif Drying Line"),
    blurb: T(
      "Pasangkan kata dengan artinya.",
      "Match each word with its meaning.",
    ),
    xp: 30,
    cfg: { set: "motif" },
  },
  tungku: {
    id: "tungku",
    chapter: "batik",
    kind: "order",
    title: T("Tungku Malam", "The Wax Stove"),
    blurb: T(
      "Susun urutan membatik tulis.",
      "Put the steps of hand-drawn batik in order.",
    ),
    xp: 30,
    cfg: { set: "tungku" },
  },
  gamelan: {
    id: "gamelan",
    chapter: "wayang",
    kind: "rhythm",
    title: T("Tabuh Gamelan", "Play the Gamelan"),
    blurb: T(
      "Tekan nada tepat saat jatuh di garis emas!",
      "Tap each note exactly as it hits the golden line!",
    ),
    xp: 40,
  },
  lakon: {
    id: "lakon",
    chapter: "wayang",
    kind: "order",
    title: T("Susun Lakon", "Arrange the Play"),
    blurb: T(
      "Urutkan jalannya pertunjukan wayang.",
      "Put the wayang performance in order.",
    ),
    xp: 30,
    cfg: { set: "lakon" },
  },
  tokoh: {
    id: "tokoh",
    chapter: "wayang",
    kind: "memory",
    title: T("Peti Wayang", "The Puppet Chest"),
    blurb: T(
      "Cocokkan istilah dan tokoh wayang.",
      "Match wayang terms and characters.",
    ),
    xp: 30,
    cfg: { set: "tokoh" },
  },
  dalang: {
    id: "dalang",
    chapter: "wayang",
    kind: "story",
    title: T("Panggung Ceritaku", "My Story Stage"),
    blurb: T(
      "Jadi dalang! Pilih tokoh dan buat lakonmu.",
      "Be the dalang! Pick characters and create your play.",
    ),
    xp: 40,
  },
  anatomi: {
    id: "anatomi",
    chapter: "keris",
    kind: "keris",
    title: T("Anatomi Keris", "Anatomy of the Keris"),
    blurb: T(
      "Seret nama bagian ke tempat yang tepat.",
      "Drag each part name to the right place.",
    ),
    xp: 40,
  },
  tertib: {
    id: "tertib",
    chapter: "keris",
    kind: "sort",
    title: T("Tata Tertib Museum", "Museum Etiquette"),
    blurb: T("Boleh atau jangan? Pilih cepat!", "Allowed or not? Choose fast!"),
    xp: 30,
    cfg: { set: "tertib" },
  },
  katalog: {
    id: "katalog",
    chapter: "keris",
    kind: "memory",
    title: T("Katalog Pusaka", "Heirloom Catalogue"),
    blurb: T("Pasangkan istilah keris.", "Match keris terms."),
    xp: 30,
    cfg: { set: "katalog" },
  },
  tingkat: {
    id: "tingkat",
    chapter: "basa",
    kind: "sort",
    title: T("Unggah-ungguh Basa", "Speech Levels"),
    blurb: T(
      "Ngoko, krama, atau krama inggil?",
      "Ngoko, krama, or krama inggil?",
    ),
    xp: 40,
    cfg: { set: "tingkat" },
  },
  ukara: {
    id: "ukara",
    chapter: "basa",
    kind: "order",
    title: T("Susun Ukara", "Build a Sentence"),
    blurb: T(
      "Susun kata jadi kalimat Jawa.",
      "Arrange words into a Javanese sentence.",
    ),
    xp: 30,
    cfg: { set: "ukara" },
  },
  tembung: {
    id: "tembung",
    chapter: "basa",
    kind: "memory",
    title: T("Pasangan Tembung", "Word Pairs"),
    blurb: T("Cocokkan ngoko dengan krama.", "Match ngoko with krama."),
    xp: 30,
    cfg: { set: "tembung" },
  },
  mbah: {
    id: "mbah",
    chapter: "basa",
    kind: "chat",
    title: T("Ngobrol karo Mbah", "Chat with Mbah"),
    blurb: T(
      "Latihan sapaan sopan dengan Mbah.",
      "Practise polite greetings with Mbah.",
    ),
    xp: 50,
  },
};
export const stageKey = (ch: string, id: string) => `${ch}:${id}`;
export const isDone = (p: Progress, ch: string, id: string) =>
  !!p.stages[stageKey(ch, id)]?.stars;
export const hasBadge = (p: Progress, ch: ChapterId) => p.badges.includes(ch);
export const totalStars = (p: Progress) =>
  Object.values(p.stages).reduce((s, x) => s + x.stars, 0);

// ---- syarat bintang untuk membuka tantangan terakhir (ujian) di tiap tempat
export const STAR_NEED: Record<Jenjang, number> = { sd: 3, smp: 6, sma: 9 };
export const starsOf = (p: Progress, ch: string, id: string) =>
  p.stages[stageKey(ch, id)]?.stars || 0;
export const chapterStars = (p: Progress, ch: ChapterId) =>
  CHAPTERS[ch].stations.reduce((s, id) => s + starsOf(p, ch, id), 0);
export const chapterMaxStars = (ch: ChapterId) =>
  CHAPTERS[ch].stations.length * 3;
export const starNeed = (j: Jenjang, ch: ChapterId) =>
  Math.min(STAR_NEED[j], chapterMaxStars(ch));
export const chapterReady = (p: Progress, ch: ChapterId, j: Jenjang) =>
  chapterStars(p, ch) >= starNeed(j, ch);
export const chapterStagesDone = (p: Progress, ch: ChapterId) =>
  CHAPTERS[ch].stations.filter((s) => isDone(p, ch, s)).length;

export function nextChapter(p: Progress): ChapterId | null {
  return CHAPTER_IDS.find((c) => !hasBadge(p, c)) || null;
}

export type Objective = {
  text: string;
  stationId?: string;
  npcId?: string;
  doorId?: string;
};
export function objective(
  p: Progress,
  mapId: string,
  j: Jenjang = "smp",
): Objective {
  if (!p.flags.metKiwira)
    return mapId === "overworld"
      ? {
          text: L(
            "Temui Ki Wira di dekat jembatan",
            "Meet Ki Wira near the bridge",
          ),
          npcId: "kiwira",
        }
      : { text: L("Keluar dan temui Ki Wira", "Go outside and meet Ki Wira") };
  const inChapter = CHAPTER_IDS.find((c) => c === mapId);
  if (inChapter) {
    const ch = CHAPTERS[inChapter];
    const have = chapterStars(p, inChapter),
      need = starNeed(j, inChapter);
    if (!hasBadge(p, inChapter)) {
      if (have < need) {
        // wahana yang belum pernah dimainkan dulu, lalu yang bintangnya paling sedikit
        const fresh = ch.stations.find((s) => !isDone(p, inChapter, s));
        const low = [...ch.stations].sort(
          (a, b) => starsOf(p, inChapter, a) - starsOf(p, inChapter, b),
        )[0];
        const target = fresh || low;
        const t = STATIONS[target].title;
        return {
          text: fresh
            ? `${L("Misi", "Quest")}: ${L(t, trTitle(t))}  (★ ${have}/${need})`
            : L(
                `Kumpulkan bintang ${have}/${need}: ulangi ${t}`,
                `Collect stars ${have}/${need}: replay ${trTitle(t)}`,
              ),
          stationId: target,
        };
      }
      return {
        text: L(
          `Bintang cukup (${have}/${need})! Temui ${ch.mentorName} untuk ujian`,
          `Enough stars (${have}/${need})! See ${ch.mentorName} for the exam`,
        ),
        npcId: ch.npcId,
      };
    }
    if (!p.flags[`egg:${inChapter}`])
      return {
        text: L(
          "Ada tamu aneh muncul di Kota Solo! Keluar dan cari dia",
          "A strange visitor has appeared in the city of Solo! Go outside and find them",
        ),
      };
    return {
      text: L(
        "Bab selesai! Keluar lewat pintu bawah",
        "Chapter complete! Leave through the bottom door",
      ),
    };
  }
  const nc = nextChapter(p);
  const pend = CHAPTER_IDS.find((c) => hasBadge(p, c) && !p.flags[`egg:${c}`]);
  if (pend && mapId === "overworld")
    return {
      text: L(
        "Ada tamu aneh di Kota Solo! Cari dan ajak bicara",
        "A strange visitor is in the city of Solo! Find them and talk",
      ),
      npcId: `god_${pend}`,
    };
  if (nc)
    return {
      text: `${L("Misi", "Quest")}: ${L("Masuki", "Enter")} ${CHAPTERS[nc].place}`,
      doorId: CHAPTERS[nc].door,
    };
  if (!p.bossDone)
    return {
      text: L(
        "Misi: Hadapi Raksasa di Gerbang Keraton",
        "Quest: Face the Giant at the Palace Gate",
      ),
      doorId: "gate",
    };
  if (mapId === "overworld" && !p.flags["egg:final"])
    return {
      text: L(
        "Ada bapak pengantar surat di depan gerbang! Ajak bicara",
        "A letter carrier is by the gate! Go talk to him",
      ),
      npcId: "god_final",
    };
  return {
    text: L(
      "Kamu Penjaga Budaya Solo! Kumpulkan Sekar Emas & lawan Bayangan Lupa",
      "You are a Guardian of Solo Culture! Collect Golden Flowers and fight the Shadows of Forgetting",
    ),
  };
}
const trTitle = (t: string) => EN[t] ?? t;
