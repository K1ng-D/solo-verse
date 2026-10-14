import type { Progress, Jenjang } from '../game/types';
import { CHAPTERS, CHAPTER_IDS, ChapterId, chapterReady, chapterStagesDone, hasBadge, STATIONS } from './chapters';

export type Choice = { label: string; next?: string; action?: string };
export type Node = { speaker: string; portrait?: string; text: string; choices?: Choice[]; next?: string; action?: string };
export type Script = { start: string; nodes: Record<string, Node> };
export type DCtx = { name: string; jenjang: Jenjang; prog: Progress };

const PORTRAIT: Record<string, string> = { kiwira: 'ki-wira', kiwira2: 'ki-wira', busekar: 'bu-sekar', empujaya: 'empu-jaya', bularas: 'bu-laras' };
export const portraitOf = (npcId: string) => PORTRAIT[npcId];

function chat(npc: string, label = 'Tanya (AI)'): Choice { return { label, action: `chat:${npc}` }; }

function mentor(ch: ChapterId, c: DCtx): Script {
  const def = CHAPTERS[ch]; const p = c.prog; const who = def.mentorName; const por = def.portrait;
  const done = chapterStagesDone(p, ch); const total = def.stations.length;
  const nodes: Record<string, Node> = {};
  const intro: Record<ChapterId, string> = {
    batik: `Wilujeng rawuh, ${c.name}! Di sini kita belajar membatik. Mulai dari Meja Canting, ya.`,
    wayang: `Sampun rawuh, ${c.name}! Di panggung ini bayangan bisa bercerita. Cobalah semua pojok panggung.`,
    keris: `Selamat datang di Museum Pusaka, ${c.name}. Keris adalah karya seni dan warisan. Kita belajar dengan hormat.`,
    basa: `Sugeng rawuh, ${c.name}! Hari ini kita belajar basa Jawa yang santun.`,
  };
  if (hasBadge(p, ch)) {
    nodes.a = { speaker: who, portrait: por, text: `Lencana ${def.badge} sudah kamu miliki. Bangga sekali! Mau mengobrol atau latihan lagi?`, choices: [chat(def.mentor, `Tanya ${who} (AI)`), { label: 'Latihan soal', action: `exam:${ch}` }, { label: 'Sampai jumpa', action: 'close' }] };
    return { start: 'a', nodes };
  }
  if (chapterReady(p, ch)) {
    nodes.a = { speaker: who, portrait: por, text: 'Semua tahap sudah kamu selesaikan! Siap untuk ujian akhir demi lencana?', choices: [{ label: 'Siap, mulai ujian!', action: `exam:${ch}` }, chat(def.mentor, `Tanya ${who} dulu (AI)`), { label: 'Nanti dulu', action: 'close' }] };
    return { start: 'a', nodes };
  }
  nodes.a = {
    speaker: who, portrait: por,
    text: done === 0 ? intro[ch] : `Bagus! ${done}/${total} tahap selesai. Lanjutkan ke tahap berikutnya ya.`,
    choices: [{ label: 'Apa misiku?', next: 'b' }, chat(def.mentor, `Tanya ${who} (AI)`), { label: 'Siap!', action: 'close' }],
  };
  const left = def.stations.filter((s) => !p.stages[`${ch}:${s}`]);
  nodes.b = { speaker: who, portrait: por, text: `Selesaikan ${left.map((s) => STATIONS[s].title).join(', ')}. Cari yang berkilau di ruangan ini! Setelah itu, temui aku untuk ujian.`, choices: [{ label: 'Mengerti!', action: 'close' }] };
  return { start: 'a', nodes };
}

export function getDialog(npcId: string, c: DCtx): Script | null {
  const p = c.prog;
  switch (npcId) {
    case 'kiwira': {
      const nodes: Record<string, Node> = {};
      if (!p.flags.metKiwira) {
        nodes.a = { speaker: 'Ki Wira', portrait: 'ki-wira', text: `Sampun rawuh, ${c.name}! Selamat datang di Solo.`, next: 'b' };
        nodes.b = { speaker: 'Ki Wira', portrait: 'ki-wira', text: 'Bayangan Lupa menyebar. Orang jadi lupa pada batik, wayang, keris, dan basa Jawa.', next: 'c' };
        nodes.c = { speaker: 'Ki Wira', portrait: 'ki-wira', text: 'Kumpulkan 4 lencana di Rumah Batik, Panggung Wayang, Museum Pusaka, dan Sekolah Basa. Lalu hadapi si Raksasa di Gerbang Keraton!', choices: [{ label: 'Siap, Ki!', action: 'flag:metKiwira' }, { label: 'Cara mainnya?', next: 'h' }] };
        nodes.h = { speaker: 'Ki Wira', portrait: 'ki-wira', text: 'Gerakkan karaktermu dengan joystick (atau panah/WASD). Dekati yang berkilau lalu tekan tombol A (atau Spasi). Awas Bayangan Lupa di jalan: jawab pertanyaan untuk mengusirnya!', choices: [{ label: 'Mengerti!', action: 'flag:metKiwira' }] };
        return { start: 'a', nodes };
      }
      const left = CHAPTER_IDS.filter((x) => !hasBadge(p, x)).length;
      nodes.a = { speaker: 'Ki Wira', portrait: 'ki-wira', text: left ? `Masih ${left} lencana lagi, ${c.name}. Ada yang bisa Ki Wira bantu?` : p.bossDone ? 'Keraton aman berkat kamu. Mau berlatih lagi?' : 'Empat lencana lengkap! Gerbang Keraton menunggumu.', choices: [chat('kiwira', 'Tanya Ki Wira (AI)'), { label: 'Latihan soal campuran', action: 'exam:mix' }, { label: 'Petunjuk misi', action: 'hint' }, { label: 'Tidak, terima kasih', action: 'close' }] };
      return { start: 'a', nodes };
    }
    case 'penjaga': {
      const n = p.badges.length; const nodes: Record<string, Node> = {};
      if (n < 4) nodes.a = { speaker: 'Prajurit Keraton', text: `Gerbang Keraton hanya dibuka untuk Penjaga Budaya. Lencanamu baru ${n}/4. Kumpulkan dulu, ya!`, choices: [{ label: 'Baik!', action: 'close' }] };
      else nodes.a = { speaker: 'Prajurit Keraton', text: p.bossDone ? 'Terima kasih sudah menyelamatkan keraton! Mau menantang Raksasa lagi?' : 'Empat lencana lengkap! Raksasa Bayangan Lupa menunggu di dalam. Siap?', choices: [{ label: p.bossDone ? 'Tantang lagi!' : 'Hadapi sekarang!', action: 'boss' }, { label: 'Nanti dulu', action: 'close' }] };
      return { start: 'a', nodes };
    }
    case 'warga1': return one('Pak Darto', 'Kalau lapar, cobalah selat Solo. Hidangan ini perpaduan gaya Jawa dan Eropa, lho. Enak!');
    case 'warga2': return one('Bu Tini', 'Batik Laweyan terkenal dengan warna sogan yang cokelat hangat. Mampir ke Rumah Batik, ya!');
    case 'warga3': return one('Mas Bayu', 'Lihat sinar emas yang berkilau? Itu Sekar Emas! Kumpulkan untuk tambahan XP. Dan hati-hati Bayangan Lupa di jalan!');
    case 'busekar': return mentor('batik', c);
    case 'kiwira2': return mentor('wayang', c);
    case 'empujaya': return mentor('keris', c);
    case 'bularas': return mentor('basa', c);
    case 'pelanggan': return one('Mbak Ayu', 'Saya mau memesan kain motif kawung untuk acara keluarga. Motifnya rapi dan sederhana, saya suka!');
    case 'dalang': return one('Pak Dalang', 'Sebelum pentas, dalang dan penabuh gamelan saling menghormati. Wayang pun tidak diletakkan sembarangan, lho.');
    case 'pengunjung': return one('Pengunjung', 'Kata petugas, jangan menyentuh vitrin kaca. Cukup lihat dan baca labelnya, ya.');
    case 'mbah': {
      const nodes: Record<string, Node> = { a: { speaker: 'Mbah Putri', text: 'Nak, sini ngobrol karo Mbah. Kita latihan basa krama yuk!', choices: [{ label: 'Ayo, Mbah!', action: 'station:mbah' }, { label: 'Nanti, Mbah', action: 'close' }] } };
      return { start: 'a', nodes };
    }
  }
  return null;
}
function one(speaker: string, text: string): Script {
  return { start: 'a', nodes: { a: { speaker, text, choices: [{ label: 'Matur nuwun!', action: 'close' }] } } };
}
