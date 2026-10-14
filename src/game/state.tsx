import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { emptyProgress, levelOf, Profile, Progress, BatikWork } from './types';
import { loadJSON, saveJSON, removeKey } from '../lib/storage';
import { initAI } from '../lib/ai';
import { setSoundEnabled, sfx } from '../lib/sound';

const SAVE = 'soloverse.save.v3';
export type Toast = { id: number; text: string; kind: 'info' | 'good' | 'bad' | 'xp' };

type Ctx = {
  ready: boolean;
  profile: Profile | null; progress: Progress;
  soundOn: boolean; toggleSound: () => void;
  toasts: Toast[]; toast: (text: string, kind?: Toast['kind']) => void;
  setProfile: (p: Profile) => void;
  update: (fn: (p: Progress) => Progress) => void;
  addXP: (n: number, label?: string) => void;
  recordStage: (key: string, stars: number, xp: number) => { first: boolean };
  collect: (id: string) => boolean;
  setFlag: (k: string, v?: boolean) => void;
  saveWork: (w: BatikWork) => void;
  pushGallery: (w: BatikWork) => void;
  award: (ch: string) => void;
  bump: (k: 'correct' | 'wrong' | 'defeated' | 'played', n?: number) => void;
  finishBoss: () => void;
  setLast: (map: string, spawn: string) => void;
  resetAll: () => void;
};
const GameCtx = createContext<Ctx>(null as any);
export const useGame = () => useContext(GameCtx);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Progress>(emptyProgress());
  const [soundOn, setSoundOn] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ref = useRef<Progress>(progress);
  const tid = useRef(1);

  useEffect(() => {
    (async () => {
      const s = await loadJSON<{ profile: Profile | null; progress: Progress; soundOn: boolean }>(SAVE, { profile: null, progress: emptyProgress(), soundOn: true });
      const prog = { ...emptyProgress(), ...s.progress, stats: { ...emptyProgress().stats, ...(s.progress?.stats || {}) } };
      ref.current = prog; setProgress(prog); setProfileState(s.profile || null); setSoundOn(s.soundOn !== false); setSoundEnabled(s.soundOn !== false);
      await initAI();
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => saveJSON(SAVE, { profile, progress, soundOn }), 250);
    return () => clearTimeout(t);
  }, [ready, profile, progress, soundOn]);

  const toast = useCallback((text: string, kind: Toast['kind'] = 'info') => {
    const id = tid.current++;
    setToasts((t) => [...t.slice(-2), { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => { const n = fn(ref.current); ref.current = n; setProgress(n); }, []);

  const addXP = useCallback((n: number, label?: string) => {
    if (n <= 0) return;
    const before = levelOf(ref.current.xp);
    update((p) => ({ ...p, xp: p.xp + n }));
    toast(`+${n} XP${label ? ' · ' + label : ''}`, 'xp');
    if (levelOf(ref.current.xp) > before) { setTimeout(() => { toast(`Naik ke Level ${levelOf(ref.current.xp)}!`, 'good'); sfx('levelup'); }, 500); }
  }, [update, toast]);

  const recordStage = useCallback((key: string, stars: number, xp: number) => {
    const old = ref.current.stages[key];
    const first = !old || !old.stars;
    const best = Math.max(old?.stars || 0, stars);
    update((p) => ({ ...p, stages: { ...p.stages, [key]: { stars: best, best: Math.max(old?.best || 0, stars) } } }));
    addXP(first ? xp : Math.round(xp / 4), first ? 'tahap selesai' : 'latihan ulang');
    return { first };
  }, [update, addXP]);

  const collect = useCallback((id: string) => {
    if (ref.current.collected.includes(id)) return false;
    update((p) => ({ ...p, collected: [...p.collected, id] }));
    addXP(5, 'Sekar Emas'); sfx('collect');
    return true;
  }, [update, addXP]);

  const value = useMemo<Ctx>(() => ({
    ready, profile, progress, soundOn, toasts, toast, update, addXP, recordStage, collect,
    toggleSound: () => setSoundOn((v) => { setSoundEnabled(!v); return !v; }),
    setProfile: (p) => setProfileState(p),
    setFlag: (k, v = true) => update((p) => ({ ...p, flags: { ...p.flags, [k]: v } })),
    saveWork: (w) => update((p) => ({ ...p, work: w })),
    pushGallery: (w) => update((p) => ({ ...p, gallery: [w, ...p.gallery.filter((g) => g.id !== w.id)].slice(0, 8) })),
    award: (ch) => update((p) => (p.badges.includes(ch) ? p : { ...p, badges: [...p.badges, ch] })),
    bump: (k, n = 1) => update((p) => ({ ...p, stats: { ...p.stats, [k]: p.stats[k] + n } })),
    finishBoss: () => update((p) => ({ ...p, bossDone: true })),
    setLast: (map, spawn) => update((p) => ({ ...p, last: { map, spawn } })),
    resetAll: () => { ref.current = emptyProgress(); setProgress(ref.current); setProfileState(null); removeKey(SAVE); },
  }), [ready, profile, progress, soundOn, toasts, toast, update, addXP, recordStage, collect]);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}
