import type { Progress, Jenjang } from "../game/types";
import {
  CHAPTERS,
  CHAPTER_IDS,
  ChapterId,
  chapterReady,
  chapterStars,
  hasBadge,
  starNeed,
  STATIONS,
} from "./chapters";
import { L, tr } from "../lib/i18n";

export type Choice = { label: string; next?: string; action?: string };
export type Node = {
  speaker: string;
  portrait?: string;
  emoji?: string;
  text: string;
  choices?: Choice[];
  next?: string;
  action?: string;
};
export type Script = { start: string; nodes: Record<string, Node> };
export type DCtx = { name: string; jenjang: Jenjang; prog: Progress };

const PORTRAIT: Record<string, string> = {
  kiwira: "ki-wira",
  kiwira2: "ki-wira",
  busekar: "bu-sekar",
  empujaya: "empu-jaya",
  bularas: "bu-laras",
};
export const portraitOf = (npcId: string) => PORTRAIT[npcId];

function chat(npc: string, label: string): Choice {
  return { label, action: `chat:${npc}` };
}

function mentor(ch: ChapterId, c: DCtx): Script {
  const def = CHAPTERS[ch];
  const p = c.prog;
  const who = def.mentorName;
  const por = def.portrait;
  const have = chapterStars(p, ch),
    need = starNeed(c.jenjang, ch),
    max = def.stations.length * 3;
  const J = c.jenjang.toUpperCase();
  const nodes: Record<string, Node> = {};
  const intro: Record<ChapterId, string> = {
    batik: L(
      `Wilujeng rawuh, ${c.name}! Di sini kita belajar membatik. Mulai dari Meja Canting, ya.`,
      `Welcome, ${c.name}! Here we learn batik. Start at the Canting Table.`,
    ),
    wayang: L(
      `Sampun rawuh, ${c.name}! Di panggung ini bayangan bisa bercerita. Cobalah semua pojok panggung.`,
      `Welcome, ${c.name}! On this stage, shadows tell stories. Try every corner of the stage.`,
    ),
    keris: L(
      `Selamat datang di Museum Pusaka, ${c.name}. Keris adalah karya seni dan warisan. Kita belajar dengan hormat.`,
      `Welcome to the Heirloom Museum, ${c.name}. The keris is a work of art and heritage. We learn with respect.`,
    ),
    basa: L(
      `Sugeng rawuh, ${c.name}! Hari ini kita belajar basa Jawa yang santun.`,
      `Sugeng rawuh, ${c.name}! Today we learn polite Javanese.`,
    ),
  };
  if (hasBadge(p, ch)) {
    nodes.a = {
      speaker: who,
      portrait: por,
      text: L(
        `Lencana ${tr(def.badge)} sudah kamu miliki. Bangga sekali! Mau mengobrol atau latihan lagi?`,
        `You already hold the ${def.badge} badge. I'm so proud! Want to chat or practise again?`,
      ),
      choices: [
        chat(def.mentor, L(`Tanya ${who}`, `Ask ${who}`)),
        { label: L("Latihan soal", "Practice quiz"), action: `exam:${ch}` },
        { label: L("Sampai jumpa", "See you"), action: "close" },
      ],
    };
    return { start: "a", nodes };
  }
  if (chapterReady(p, ch, c.jenjang)) {
    nodes.a = {
      speaker: who,
      portrait: por,
      text: L(
        `Bintangmu sudah cukup (${have}/${need})! Siap untuk ujian akhir demi lencana?`,
        `You have enough stars (${have}/${need})! Ready for the final exam for the badge?`,
      ),
      choices: [
        {
          label: L("Siap, mulai ujian!", "Ready, start the exam!"),
          action: `exam:${ch}`,
        },
        chat(def.mentor, L(`Tanya ${who} dulu`, `Ask ${who} first`)),
        { label: L("Nanti dulu", "Later"), action: "close" },
      ],
    };
    return { start: "a", nodes };
  }
  nodes.a = {
    speaker: who,
    portrait: por,
    text:
      have === 0
        ? intro[ch]
        : L(
            `Bagus! Bintangmu ${have}/${need}. Kumpulkan lagi untuk membuka ujian akhir.`,
            `Nice! Your stars: ${have}/${need}. Collect more to unlock the final exam.`,
          ),
    choices: [
      { label: L("Apa misiku?", "What is my quest?"), next: "b" },
      chat(def.mentor, L(`Tanya ${who}`, `Ask ${who}`)),
      { label: L("Siap!", "Ready!"), action: "close" },
    ],
  };
  const list = def.stations
    .map(
      (s) =>
        `${tr(STATIONS[s].title)} ${"★".repeat(p.stages[`${ch}:${s}`]?.stars || 0)}${"☆".repeat(3 - (p.stages[`${ch}:${s}`]?.stars || 0))}`,
    )
    .join(" · ");
  nodes.b = {
    speaker: who,
    portrait: por,
    text: L(
      `Untuk jenjang ${J}, kamu butuh minimal ${need} bintang (maksimal ${max}) di tempat ini sebelum ujian akhir. Tiap wahana memberi 1 sampai 3 bintang, dan boleh diulang untuk menambah bintang. ${list}`,
      `At ${J} level you need at least ${need} stars (out of ${max}) here before the final exam. Each activity gives 1 to 3 stars, and you can replay to earn more. ${list}`,
    ),
    choices: [{ label: L("Mengerti!", "Got it!"), action: "close" }],
  };
  return { start: "a", nodes };
}

export function getDialog(npcId: string, c: DCtx): Script | null {
  const p = c.prog;
  switch (npcId) {
    case "kiwira": {
      const nodes: Record<string, Node> = {};
      if (!p.flags.metKiwira) {
        nodes.a = {
          speaker: "Ki Wira",
          portrait: "ki-wira",
          text: L(
            `Sampun rawuh, ${c.name}! Selamat datang di Solo.`,
            `Sampun rawuh, ${c.name}! Welcome to Solo.`,
          ),
          next: "b",
        };
        nodes.b = {
          speaker: "Ki Wira",
          portrait: "ki-wira",
          text: L(
            "Bayangan Lupa menyebar. Orang jadi lupa pada batik, wayang, keris, dan basa Jawa.",
            "The Shadows of Forgetting are spreading. People are forgetting batik, wayang, keris, and the Javanese language.",
          ),
          next: "c",
        };
        nodes.c = {
          speaker: "Ki Wira",
          portrait: "ki-wira",
          text: L(
            "Kumpulkan 4 lencana di Rumah Batik, Panggung Wayang, Museum Pusaka, dan Sekolah Basa. Lalu hadapi si Raksasa di Gerbang Keraton!",
            "Collect 4 badges at the Batik House, Wayang Stage, Heirloom Museum, and Language School. Then face the Giant at the Palace Gate!",
          ),
          choices: [
            { label: L("Siap, Ki!", "Ready, Ki!"), action: "flag:metKiwira" },
            { label: L("Cara mainnya?", "How do I play?"), next: "h" },
          ],
        };
        nodes.h = {
          speaker: "Ki Wira",
          portrait: "ki-wira",
          text: L(
            `Gerakkan karaktermu dengan joystick (atau panah/WASD). Dekati yang berkilau lalu tekan tombol A (atau Spasi). Di setiap tempat, kumpulkan bintang dari wahana: SD 3, SMP 6, SMA 9 bintang untuk membuka ujian akhir. Awas Bayangan Lupa di jalan!`,
            "Move with the joystick (or arrow keys/WASD). Get close to anything sparkling and press A (or Space). At each place, collect stars from the activities: 3 for SD, 6 for SMP, 9 for SMA unlocks the final exam. Beware of Shadows of Forgetting on the road!",
          ),
          choices: [
            { label: L("Mengerti!", "Got it!"), action: "flag:metKiwira" },
          ],
        };
        return { start: "a", nodes };
      }
      const left = CHAPTER_IDS.filter((x) => !hasBadge(p, x)).length;
      nodes.a = {
        speaker: "Ki Wira",
        portrait: "ki-wira",
        text: left
          ? L(
              `Masih ${left} lencana lagi, ${c.name}. Ada yang bisa Ki Wira bantu?`,
              `${left} more badges to go, ${c.name}. Can Ki Wira help?`,
            )
          : p.bossDone
            ? L(
                "Keraton aman berkat kamu. Mau berlatih lagi?",
                "The palace is safe thanks to you. Want to practise again?",
              )
            : L(
                "Empat lencana lengkap! Gerbang Keraton menunggumu.",
                "All four badges collected! The Palace Gate awaits you.",
              ),
        choices: [
          chat("kiwira", L("Tanya Ki Wira", "Ask Ki Wira")),
          {
            label: L("Latihan soal campuran", "Mixed practice quiz"),
            action: "exam:mix",
          },
          { label: L("Petunjuk misi", "Quest hint"), action: "hint" },
          { label: L("Tidak, terima kasih", "No, thank you"), action: "close" },
        ],
      };
      return { start: "a", nodes };
    }
    case "penjaga": {
      const n = p.badges.length;
      const nodes: Record<string, Node> = {};
      if (n < 4)
        nodes.a = {
          speaker: L("Prajurit Keraton", "Palace Guard"),
          text: L(
            `Gerbang Keraton hanya dibuka untuk Penjaga Budaya. Lencanamu baru ${n}/4. Kumpulkan dulu, ya!`,
            `The Palace Gate opens only for Culture Guardians. You have ${n}/4 badges. Collect them first!`,
          ),
          choices: [{ label: L("Baik!", "Okay!"), action: "close" }],
        };
      else
        nodes.a = {
          speaker: L("Prajurit Keraton", "Palace Guard"),
          text: p.bossDone
            ? L(
                "Terima kasih sudah menyelamatkan keraton! Mau menantang Raksasa lagi?",
                "Thank you for saving the palace! Want to challenge the Giant again?",
              )
            : L(
                "Empat lencana lengkap! Raksasa Bayangan Lupa menunggu di dalam. Siap?",
                "All four badges! The Giant of Forgetting waits inside. Ready?",
              ),
          choices: [
            {
              label: p.bossDone
                ? L("Tantang lagi!", "Challenge again!")
                : L("Hadapi sekarang!", "Face it now!"),
              action: "boss",
            },
            { label: L("Nanti dulu", "Later"), action: "close" },
          ],
        };
      return { start: "a", nodes };
    }
    case "warga1":
      return one(
        "Pak Darto",
        L(
          "Kalau lapar, cobalah selat Solo. Hidangan ini perpaduan gaya Jawa dan Eropa, lho. Enak!",
          "If you are hungry, try selat Solo. It blends Javanese and European styles. Delicious!",
        ),
      );
    case "warga2":
      return one(
        "Bu Tini",
        L(
          "Batik Laweyan terkenal dengan warna sogan yang cokelat hangat. Mampir ke Rumah Batik, ya!",
          "Laweyan batik is famous for its warm brown sogan colour. Drop by the Batik House!",
        ),
      );
    case "warga3":
      return one(
        "Mas Bayu",
        L(
          "Lihat sinar emas yang berkilau? Itu Sekar Emas! Kumpulkan untuk tambahan XP. Dan hati-hati Bayangan Lupa di jalan!",
          "See that golden sparkle? That is a Golden Flower! Collect them for extra XP. And watch out for the Shadows of Forgetting!",
        ),
      );
    case "busekar":
      return mentor("batik", c);
    case "kiwira2":
      return mentor("wayang", c);
    case "empujaya":
      return mentor("keris", c);
    case "bularas":
      return mentor("basa", c);
    case "pelanggan":
      return one(
        "Mbak Ayu",
        L(
          "Saya mau memesan kain motif kawung untuk acara keluarga. Motifnya rapi dan sederhana, saya suka!",
          "I would like to order cloth with the kawung motif for a family event. It is neat and simple, I love it!",
        ),
      );
    case "dalang":
      return one(
        "Pak Dalang",
        L(
          "Sebelum pentas, dalang dan penabuh gamelan saling menghormati. Wayang pun tidak diletakkan sembarangan, lho.",
          "Before a show, the dalang and the gamelan players respect each other. Even the puppets are never put down carelessly.",
        ),
      );
    case "pengunjung":
      return one(
        L("Pengunjung", "Visitor"),
        L(
          "Kata petugas, jangan menyentuh vitrin kaca. Cukup lihat dan baca labelnya, ya.",
          "The staff say not to touch the glass cases. Just look and read the labels.",
        ),
      );
    case "mbah": {
      const nodes: Record<string, Node> = {
        a: {
          speaker: "Mbah Putri",
          text: L(
            "Nak, sini ngobrol karo Mbah. Kita latihan basa krama yuk!",
            "Come here and chat with Mbah, dear. Let us practise krama together!",
          ),
          choices: [
            {
              label: L("Ayo, Mbah!", "Let's go, Mbah!"),
              action: "station:mbah",
            },
            { label: L("Nanti, Mbah", "Later, Mbah"), action: "close" },
          ],
        },
      };
      return { start: "a", nodes };
    }
  }
  return null;
}
function one(speaker: string, text: string): Script {
  return {
    start: "a",
    nodes: {
      a: {
        speaker,
        text,
        choices: [
          {
            label: L("Matur nuwun!", "Thank you! (Matur nuwun)"),
            action: "close",
          },
        ],
      },
    },
  };
}
