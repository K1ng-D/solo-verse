import type { NpcKey } from '../lib/ai';
import type { Progress } from '../game/types';
import type { Topic } from './quiz';

export type ChapterId = 'batik' | 'wayang' | 'keris' | 'basa';
export type GameKind = 'draw' | 'mix' | 'memory' | 'order' | 'sort' | 'rhythm' | 'keris' | 'chat' | 'story' | 'quiz' | 'boss';

export const CHAPTER_IDS: ChapterId[] = ['batik', 'wayang', 'keris', 'basa'];
export const CHAPTERS: Record<ChapterId, {
  id: ChapterId; title: string; place: string; door: string; mentor: NpcKey; mentorName: string; portrait: string; topic: Topic;
  stations: string[]; badge: string; color: string; art: string; npcId: string; doorLabel: string; fromSpawn: string;
}> = {
  batik: { id: 'batik', title: 'Batik Laweyan', place: 'Rumah Batik', door: 'to_batik', mentor: 'busekar', mentorName: 'Bu Sekar', portrait: 'bu-sekar', topic: 'batik', stations: ['canting', 'celup', 'motif', 'tungku'], badge: 'Penjaga Batik', color: '#2b3a67', art: 'batik-village', npcId: 'busekar', doorLabel: 'Rumah Batik', fromSpawn: 'from_batik' },
  wayang: { id: 'wayang', title: 'Wayang Adventure', place: 'Panggung Wayang', door: 'to_wayang', mentor: 'kiwira', mentorName: 'Ki Wira', portrait: 'ki-wira', topic: 'wayang', stations: ['gamelan', 'lakon', 'tokoh', 'dalang'], badge: 'Penjaga Wayang', color: '#7d2a2a', art: 'wayang-stage', npcId: 'kiwira2', doorLabel: 'Panggung Wayang', fromSpawn: 'from_wayang' },
  keris: { id: 'keris', title: 'Museum Pusaka', place: 'Museum Pusaka', door: 'to_keris', mentor: 'empujaya', mentorName: 'Empu Jaya', portrait: 'empu-jaya', topic: 'keris', stations: ['anatomi', 'tertib', 'katalog'], badge: 'Penjaga Pusaka', color: '#6b4423', art: 'keris-gallery', npcId: 'empujaya', doorLabel: 'Museum Pusaka', fromSpawn: 'from_keris' },
  basa: { id: 'basa', title: 'Basa Jawa Adventure', place: 'Sekolah Basa', door: 'to_basa', mentor: 'bularas', mentorName: 'Bu Laras', portrait: 'bu-laras', topic: 'basa', stations: ['tingkat', 'ukara', 'tembung', 'mbah'], badge: 'Penjaga Basa', color: '#2f5fa8', art: 'basa-class', npcId: 'bularas', doorLabel: 'Sekolah Basa', fromSpawn: 'from_basa' },
};

export type StationDef = { id: string; chapter: ChapterId; kind: GameKind; title: string; blurb: string; xp: number; cfg?: any; needs?: string; needsMsg?: string };
export const STATIONS: Record<string, StationDef> = {
  canting: { id: 'canting', chapter: 'batik', kind: 'draw', title: 'Nyanting: Gambar Batikmu', blurb: 'Gambar motif dengan canting di atas kain!', xp: 40 },
  celup: { id: 'celup', chapter: 'batik', kind: 'mix', title: 'Celup Warna', blurb: 'Campur pigmen sampai warnanya pas, lalu celup kainmu!', xp: 40, needs: 'batik:canting', needsMsg: 'Kainmu belum bermotif. Gambar dulu di Meja Canting!' },
  motif: { id: 'motif', chapter: 'batik', kind: 'memory', title: 'Jemuran Motif', blurb: 'Pasangkan kata dengan artinya.', xp: 30, cfg: { set: 'motif' } },
  tungku: { id: 'tungku', chapter: 'batik', kind: 'order', title: 'Tungku Malam', blurb: 'Susun urutan membatik tulis.', xp: 30, cfg: { set: 'tungku' } },
  gamelan: { id: 'gamelan', chapter: 'wayang', kind: 'rhythm', title: 'Tabuh Gamelan', blurb: 'Tekan nada tepat saat jatuh di garis emas!', xp: 40 },
  lakon: { id: 'lakon', chapter: 'wayang', kind: 'order', title: 'Susun Lakon', blurb: 'Urutkan jalannya pertunjukan wayang.', xp: 30, cfg: { set: 'lakon' } },
  tokoh: { id: 'tokoh', chapter: 'wayang', kind: 'memory', title: 'Peti Wayang', blurb: 'Cocokkan istilah dan tokoh wayang.', xp: 30, cfg: { set: 'tokoh' } },
  dalang: { id: 'dalang', chapter: 'wayang', kind: 'story', title: 'Panggung Ceritaku', blurb: 'Jadi dalang! Pilih tokoh dan buat lakonmu.', xp: 40 },
  anatomi: { id: 'anatomi', chapter: 'keris', kind: 'keris', title: 'Anatomi Keris', blurb: 'Seret nama bagian ke tempat yang tepat.', xp: 40 },
  tertib: { id: 'tertib', chapter: 'keris', kind: 'sort', title: 'Tata Tertib Museum', blurb: 'Boleh atau jangan? Pilih cepat!', xp: 30, cfg: { set: 'tertib' } },
  katalog: { id: 'katalog', chapter: 'keris', kind: 'memory', title: 'Katalog Pusaka', blurb: 'Pasangkan istilah keris.', xp: 30, cfg: { set: 'katalog' } },
  tingkat: { id: 'tingkat', chapter: 'basa', kind: 'sort', title: 'Unggah-ungguh Basa', blurb: 'Ngoko, krama, atau krama inggil?', xp: 40, cfg: { set: 'tingkat' } },
  ukara: { id: 'ukara', chapter: 'basa', kind: 'order', title: 'Susun Ukara', blurb: 'Susun kata jadi kalimat Jawa.', xp: 30, cfg: { set: 'ukara' } },
  tembung: { id: 'tembung', chapter: 'basa', kind: 'memory', title: 'Pasangan Tembung', blurb: 'Cocokkan ngoko dengan krama.', xp: 30, cfg: { set: 'tembung' } },
  mbah: { id: 'mbah', chapter: 'basa', kind: 'chat', title: 'Ngobrol karo Mbah', blurb: 'Latihan sapaan sopan dengan Mbah (boleh tanya AI).', xp: 50 },
};
export const stageKey = (ch: string, id: string) => `${ch}:${id}`;
export const isDone = (p: Progress, ch: string, id: string) => !!p.stages[stageKey(ch, id)]?.stars;
export const chapterStagesDone = (p: Progress, ch: ChapterId) => CHAPTERS[ch].stations.filter((s) => isDone(p, ch, s)).length;
export const chapterReady = (p: Progress, ch: ChapterId) => chapterStagesDone(p, ch) === CHAPTERS[ch].stations.length;
export const hasBadge = (p: Progress, ch: ChapterId) => p.badges.includes(ch);
export const totalStars = (p: Progress) => Object.values(p.stages).reduce((s, x) => s + x.stars, 0);

export function nextChapter(p: Progress): ChapterId | null {
  return CHAPTER_IDS.find((c) => !hasBadge(p, c)) || null;
}

export type Objective = { text: string; stationId?: string; npcId?: string; doorId?: string };
export function objective(p: Progress, mapId: string): Objective {
  if (!p.flags.metKiwira) return mapId === 'overworld' ? { text: 'Temui Ki Wira di dekat jembatan', npcId: 'kiwira' } : { text: 'Keluar dan temui Ki Wira' };
  const inChapter = CHAPTER_IDS.find((c) => c === mapId);
  if (inChapter) {
    const ch = CHAPTERS[inChapter];
    const next = ch.stations.find((s) => !isDone(p, inChapter, s));
    if (next) return { text: `Misi: ${STATIONS[next].title}`, stationId: next };
    if (!hasBadge(p, inChapter)) return { text: `Misi: Ujian dari ${ch.mentorName}`, npcId: ch.npcId };
    return { text: 'Bab selesai! Keluar lewat pintu bawah' };
  }
  const nc = nextChapter(p);
  if (nc) return { text: `Misi: Masuki ${CHAPTERS[nc].place}`, doorId: CHAPTERS[nc].door };
  if (!p.bossDone) return { text: 'Misi: Hadapi Raksasa di Gerbang Keraton', doorId: 'gate' };
  return { text: 'Kamu Penjaga Budaya Solo! Kumpulkan Sekar Emas & lawan Bayangan Lupa' };
}
