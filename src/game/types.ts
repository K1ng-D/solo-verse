import type { Jenjang } from '../lib/ai';
export type { Jenjang };
export type AvatarId = 'raka' | 'sekar' | 'bayu' | 'aisyah';
export type Profile = { name: string; avatar: AvatarId; jenjang: Jenjang };
export type Stroke = { p: number[]; w: number; k: 'line' | 'dot'; g?: number };
export type BatikWork = { id: string; strokes: Stroke[]; motif: string; coverage: number; dye?: string; dyeName?: string; date: number };
export type Stage = { stars: number; best: number };
export type Progress = {
  xp: number;
  stages: Record<string, Stage>;
  badges: string[];
  collected: string[];
  work: BatikWork | null;
  gallery: BatikWork[];
  stats: { correct: number; wrong: number; defeated: number; played: number };
  flags: Record<string, boolean>;
  bossDone: boolean;
  last: { map: string; spawn: string } | null;
};
export const emptyProgress = (): Progress => ({
  xp: 0, stages: {}, badges: [], collected: [], work: null, gallery: [],
  stats: { correct: 0, wrong: 0, defeated: 0, played: 0 }, flags: {}, bossDone: false, last: null,
});
export const levelOf = (xp: number) => 1 + Math.floor(xp / 100);
export const levelProgress = (xp: number) => (xp % 100) / 100;
export type Result = { stars: number; score: number; xp?: number; data?: any; fail?: boolean };
export type GameProps = { jenjang: Jenjang; name: string; cfg?: any; onDone: (r: Result) => void; onExit: () => void };
