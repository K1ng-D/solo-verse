import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { sfxFiles } from '../data/assetMap';

type P = ReturnType<typeof createAudioPlayer>;
const pool: Record<string, P[]> = {};
const cursor: Record<string, number> = {};
let enabled = true;
let ready = false;

export function setSoundEnabled(v: boolean) { enabled = v; }
export function isSoundEnabled() { return enabled; }

function init() {
  if (ready) return; ready = true;
  try { setAudioModeAsync({ playsInSilentMode: true } as any).catch(() => {}); } catch { /* abaikan */ }
}

export function sfx(name: string, volume = 0.9) {
  if (!enabled) return;
  try {
    init();
    const src = sfxFiles[name]; if (!src) return;
    const arr = (pool[name] ||= []);
    const maxPool = name.startsWith('note') || name === 'gong' ? 4 : 2;
    if (arr.length < maxPool) { const p = createAudioPlayer(src); arr.push(p); cursor[name] = arr.length - 1; p.volume = volume; p.play(); return; }
    const i = ((cursor[name] ?? -1) + 1) % arr.length; cursor[name] = i;
    const p = arr[i]; p.volume = volume;
    try { p.seekTo(0); } catch { /* abaikan */ }
    p.play();
  } catch { /* audio tidak kritis */ }
}
