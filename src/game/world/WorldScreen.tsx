import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, Image, Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAPS } from '../../data/mapsData';
import { fx, mapImages } from '../../data/assetMap';
import { CHAPTERS, ChapterId, isDone, objective, STATIONS } from '../../data/chapters';
import { C, TILE, px } from '../theme';
import { useGame } from '../state';
import { Bar, Txt } from '../ui';
import { levelOf, levelProgress } from '../types';
import { Joystick } from './Joystick';
import { CH, CW, DIR_ROW, SpriteSheet } from './Sprite';
import { sfx } from '../../lib/sound';

export type WorldHandle = { knockback: () => void; goto: (map: string, spawn: string) => void };
type Props = {
  paused: boolean; startMap: string; startSpawn: string; defeatedAt: Record<string, number>;
  onStation: (stationId: string, mapId: string) => void;
  onNpc: (npcId: string, mapId: string) => void;
  onEncounter: (enemyId: string) => void;
  onGate: () => void;
  onMenu: () => void;
  onMapChange: (map: string) => void;
};

const SPEED = 150;
const HW = 9, HH = 10;
const RESPAWN_MS = 90000;

const MapLayer = React.memo(function MapLayer({ id, layer, w, h }: { id: string; layer: 'base' | 'over'; w: number; h: number }) {
  return <Image source={mapImages[id][layer]} resizeMode="stretch" style={[{ position: 'absolute', left: 0, top: 0, width: w, height: h }, px]} />;
});

export const WorldScreen = forwardRef<WorldHandle, Props>(function WorldScreen(props, ref) {
  const { profile, progress, collect, setFlag } = useGame();
  const ins = useSafeAreaInsets();
  const { width: vw, height: vh } = useWindowDimensions();
  const [mapId, setMapId] = useState(props.startMap);
  const map = MAPS[mapId];
  const grid = useMemo(() => map.solid.map((r) => r.split('').map((c) => c === '1')), [mapId]);
  const mapW = map.w * TILE, mapH = map.h * TILE;

  const S = useRef({ x: 0, y: 0, dir: 'down', dist: 0, moving: false, invuln: 0, lock: 0, walked: 0 });
  const input = useRef({ jx: 0, jy: 0 });
  const keys = useRef<Record<string, boolean>>({});
  const enemyRT = useRef<Record<string, { t: number; d: number }>>({});
  const target = useRef<{ kind: 'npc' | 'station'; id: string; label: string; x: number; y: number } | null>(null);
  const spawnRef = useRef(props.startSpawn);
  const fade = useRef(new Animated.Value(0)).current;
  const [, setFrame] = useState(0);

  const latest = useRef({ props, progress, map, grid, mapId, collect, setFlag, profile });
  latest.current = { props, progress, map, grid, mapId, collect, setFlag, profile };

  const placeAt = useCallback((id: string, spawn: string) => {
    const m = MAPS[id]; const sp = m.spawns[spawn] || m.spawns.in || m.spawns.start || [m.w / 2, m.h / 2];
    S.current.x = sp[0] * TILE; S.current.y = sp[1] * TILE; S.current.dir = id === 'overworld' ? 'down' : 'up';
    S.current.invuln = 1.5; S.current.lock = 0.2;
    enemyRT.current = {};
  }, []);
  useEffect(() => { placeAt(mapId, spawnRef.current); props.onMapChange(mapId); }, [mapId]);

  const goto = useCallback((id: string, spawn: string) => {
    if (S.current.lock > 5) return;
    S.current.lock = 10; sfx('door');
    Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start(() => {
      spawnRef.current = spawn;
      if (id === latest.current.mapId) placeAt(id, spawn); else setMapId(id);
      setTimeout(() => { S.current.lock = 0; Animated.timing(fade, { toValue: 0, duration: 220, useNativeDriver: true }).start(); }, 60);
    });
  }, [fade, placeAt]);

  useImperativeHandle(ref, () => ({
    knockback: () => { S.current.y += TILE * 1.2; S.current.invuln = 3; },
    goto,
  }), [goto]);

  // ---- keyboard (web)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(k) && !(e.target as HTMLElement)?.closest?.('input,textarea')) {
        if (!latest.current.props.paused) e.preventDefault();
      }
      keys.current[k] = true;
      if ((k === ' ' || k === 'enter' || k === 'e') && !e.repeat && !(e.target as HTMLElement)?.closest?.('input,textarea')) doInteract();
      if (k === 'escape' && !latest.current.props.paused) latest.current.props.onMenu();
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    const blur = () => { keys.current = {}; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, []);

  const doInteract = useCallback(() => {
    const L = latest.current;
    if (L.props.paused || S.current.lock > 0) return;
    const t = target.current; if (!t) return;
    if (t.kind === 'npc') L.props.onNpc(t.id, L.mapId); else L.props.onStation(t.id, L.mapId);
  }, []);

  // ---- loop
  useEffect(() => {
    let raf = 0; let last = performance.now();
    const blocked = (x: number, y: number, npcs: { x: number; y: number }[], g: boolean[][]) => {
      for (const [cx, cy] of [[x - HW, y - HH], [x + HW, y - HH], [x - HW, y], [x + HW, y]]) {
        const tx = Math.floor(cx / TILE), ty = Math.floor(cy / TILE);
        if (ty < 0 || tx < 0 || ty >= g.length || tx >= g[0].length || g[ty][tx]) return true;
      }
      for (const n of npcs) if (x + HW > n.x - 12 && x - HW < n.x + 12 && y > n.y - 14 && y - HH < n.y + 3) return true;
      return false;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const L = latest.current; const s = S.current;
      if (L.props.paused) return;
      s.invuln = Math.max(0, s.invuln - dt); s.lock = Math.max(0, s.lock - dt);
      // input
      const k = keys.current;
      let ix = (k['arrowright'] || k['d'] ? 1 : 0) - (k['arrowleft'] || k['a'] ? 1 : 0);
      let iy = (k['arrowdown'] || k['s'] ? 1 : 0) - (k['arrowup'] || k['w'] ? 1 : 0);
      if (input.current.jx || input.current.jy) { ix = input.current.jx; iy = input.current.jy; }
      const mag = Math.min(1, Math.hypot(ix, iy));
      const m = L.map; const npcs = m.npcs.map((n) => ({ x: n.x * TILE, y: n.y * TILE }));
      s.moving = false;
      if (mag > 0 && s.lock === 0) {
        const nx = ix / Math.hypot(ix, iy), ny = iy / Math.hypot(ix, iy);
        const stepx = nx * SPEED * mag * dt, stepy = ny * SPEED * mag * dt;
        if (!blocked(s.x + stepx, s.y, npcs, L.grid)) s.x += stepx;
        if (!blocked(s.x, s.y + stepy, npcs, L.grid)) s.y += stepy;
        s.dir = Math.abs(ix) > Math.abs(iy) ? (ix < 0 ? 'left' : 'right') : (iy < 0 ? 'up' : 'down');
        s.dist += Math.hypot(stepx, stepy); s.walked += Math.hypot(stepx, stepy); s.moving = true;
        if (s.walked > TILE * 3 && !L.progress.flags.tutMove) L.setFlag('tutMove');
      }
      // pintu
      for (const d of m.doors) {
        const tx = s.x / TILE, ty = (s.y - 2) / TILE;
        if (tx >= d.x && tx < d.x + d.w && ty >= d.y && ty < d.y + d.h && s.lock === 0) {
          if (d.id === 'gate') { s.lock = 1.2; s.y = (d.y + 1.6) * TILE; L.props.onGate(); }
          else goto(d.to, d.spawn || CHAPTERS[(L.mapId as ChapterId)]?.fromSpawn || 'in');
          break;
        }
      }
      // koleksi
      for (const c of m.collectibles) {
        if (L.progress.collected.includes(c.id)) continue;
        if (Math.hypot(s.x - c.x * TILE, (s.y - 10) - c.y * TILE) < 30) L.collect(c.id);
      }
      // musuh
      const nowMs = Date.now();
      for (const e of m.enemies) {
        const rt = (enemyRT.current[e.id] ||= { t: Math.random(), d: 1 });
        const len = Math.hypot(e.x1 - e.x0, e.y1 - e.y0) || 1;
        rt.t += (rt.d * e.speed * dt) / len; if (rt.t > 1) { rt.t = 1; rt.d = -1; } if (rt.t < 0) { rt.t = 0; rt.d = 1; }
        if (L.props.defeatedAt[e.id] && nowMs - L.props.defeatedAt[e.id] < RESPAWN_MS) continue;
        const ex = (e.x0 + (e.x1 - e.x0) * rt.t) * TILE, ey = (e.y0 + (e.y1 - e.y0) * rt.t) * TILE;
        if (s.invuln <= 0 && Math.hypot(s.x - ex, s.y - ey) < 34) { s.invuln = 2.5; L.props.onEncounter(e.id); }
      }
      // target interaksi
      let best: typeof target.current = null; let bd = 1e9;
      for (const n of m.npcs) { const d = Math.hypot(s.x - n.x * TILE, s.y - n.y * TILE); if (d < 70 && d < bd) { bd = d; best = { kind: 'npc', id: n.id, label: n.name, x: n.x * TILE, y: n.y * TILE }; } }
      for (const st of m.stations) { const d = Math.hypot(s.x - st.x * TILE, s.y - st.y * TILE); if (d < st.r * TILE && d - 8 < bd) { bd = d - 8; best = { kind: 'station', id: st.id, label: st.label, x: st.x * TILE, y: st.y * TILE }; } }
      target.current = best;
      setFrame((f) => (f + 1) & 0xffff);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [goto]);

  // ---- render
  const s = S.current; const now = Date.now();
  const camX = mapW <= vw ? (mapW - vw) / 2 : Math.max(0, Math.min(mapW - vw, s.x - vw / 2));
  const camY = mapH <= vh ? (mapH - vh) / 2 : Math.max(0, Math.min(mapH - vh, s.y - 40 - vh / 2));
  const obj = objective(progress, mapId);
  const col = progress.collected;
  const walkFrame = s.moving ? 1 + (Math.floor(s.dist / 12) % 2) : 0;
  const sheetKey = profile ? `player_${profile.avatar}_${profile.jenjang}` : 'player_raka_smp';
  const bob = (i: number) => Math.round(Math.sin(now / 420 + i * 1.7) * 1.2);
  const bounce = Math.round(Math.sin(now / 180) * 4);
  const tgt = target.current;
  const flowers = m_collectibles(map, col);

  return (
    <View style={{ flex: 1, backgroundColor: '#14100c', overflow: 'hidden' }} testID="world">
      <View style={{ position: 'absolute', left: 0, top: 0, width: mapW, height: mapH, transform: [{ translateX: -camX }, { translateY: -camY }] }}>
        <MapLayer id={mapId} layer="base" w={mapW} h={mapH} />
        {/* label bangunan */}
        {map.labels.map((l, i) => (
          <View key={'l' + i} style={{ position: 'absolute', left: l.x * TILE - 80, top: l.y * TILE - 10, width: 160, alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(27,19,14,0.82)', borderColor: C.gold, borderWidth: 2, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ color: C.goldSoft, fontWeight: '900', fontSize: 11 }}>{l.text}</Text></View>
          </View>
        ))}
        {/* sekar emas */}
        {flowers.map((c, i) => (
          <View key={c.id} style={{ position: 'absolute', left: c.x * TILE - 24, top: c.y * TILE - 34 + bob(i) * 2, width: 48, height: 54, overflow: 'hidden' }}>
            <Image source={fx.item_flower} resizeMode="stretch" style={[{ position: 'absolute', width: 96, height: 54, left: -(Math.floor(now / 350 + i) % 2) * 48 }, px]} />
          </View>
        ))}
        {/* marker stasiun */}
        {map.stations.map((st) => {
          const ch = (CHAPTERS as any)[mapId] as (typeof CHAPTERS)[ChapterId] | undefined;
          const done = ch ? isDone(progress, ch.id, st.id) : false;
          const isObj = obj.stationId === st.id;
          return (
            <View key={st.id} pointerEvents="none" style={{ position: 'absolute', left: st.x * TILE - 16, top: st.y * TILE - 64 + (isObj ? bounce : 0), width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? C.greenDark : isObj ? C.gold : 'rgba(232,185,60,0.55)', borderWidth: 2, borderColor: '#2a1a12', zIndex: 5 }}>
              <Text style={{ color: done ? '#fff' : '#2b1b0c', fontWeight: '900', fontSize: 16 }}>{done ? '✓' : '!'}</Text>
            </View>
          );
        })}
        {/* penunjuk pintu */}
        {obj.doorId ? map.doors.filter((d) => d.id === obj.doorId).map((d) => (
          <Text key="dm" style={{ position: 'absolute', left: (d.x + d.w / 2) * TILE - 14, top: (d.y - 1.2) * TILE + bounce, fontSize: 28, color: C.gold, fontWeight: '900', textShadowColor: '#000', textShadowRadius: 3, zIndex: 5 }}>▼</Text>
        )) : null}
        {/* musuh */}
        {map.enemies.map((e, i) => {
          if (props.defeatedAt[e.id] && now - props.defeatedAt[e.id] < RESPAWN_MS) return null;
          const rt = enemyRT.current[e.id]; const t = rt ? rt.t : 0;
          const ex = (e.x0 + (e.x1 - e.x0) * t) * TILE, ey = (e.y0 + (e.y1 - e.y0) * t) * TILE;
          return (
            <View key={e.id} style={{ position: 'absolute', left: ex - 27, top: ey - 58 + bob(i) * 2, width: 54, height: 60, overflow: 'hidden', zIndex: Math.floor(ey) }}>
              <Image source={fx.enemy_shadow} resizeMode="stretch" style={[{ position: 'absolute', width: 108, height: 60, left: -(Math.floor(now / 300 + i) % 2) * 54 }, px]} />
            </View>
          );
        })}
        {/* NPC */}
        {map.npcs.map((n, i) => (
          <View key={n.id} style={{ position: 'absolute', left: n.x * TILE - CW / 2, top: n.y * TILE - 70 + bob(i), zIndex: Math.floor(n.y * TILE) }}>
            <SpriteSheet sheet={`npc_${n.sprite}`} row={DIR_ROW[tgt && tgt.kind === 'npc' && tgt.id === n.id ? facing(s, n) : n.face] ?? 0} col={0} />
            {obj.npcId === n.id ? <View pointerEvents="none" style={{ position: 'absolute', left: CW / 2 - 14, top: -26 + bounce, width: 28, height: 28, borderRadius: 14, backgroundColor: C.gold, borderWidth: 2, borderColor: '#2a1a12', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '900', color: '#2b1b0c' }}>!</Text></View> : null}
          </View>
        ))}
        {/* pemain */}
        <View testID="player" style={{ position: 'absolute', left: s.x - CW / 2, top: s.y - 70, zIndex: Math.floor(s.y), opacity: s.invuln > 0 && Math.floor(now / 100) % 2 === 0 && s.invuln < 2 ? 0.5 : 1 }}>
          <SpriteSheet sheet={sheetKey} row={DIR_ROW[s.dir]} col={walkFrame} />
        </View>
        <MapLayer id={mapId} layer="over" w={mapW} h={mapH} />
        {tgt ? (
          <View pointerEvents="none" style={{ position: 'absolute', left: tgt.x - 70, top: tgt.y - (tgt.kind === 'npc' ? 96 : 100), width: 140, alignItems: 'center', zIndex: 9999 }}>
            <View style={{ backgroundColor: 'rgba(27,19,14,0.92)', borderColor: C.gold, borderWidth: 2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 }}><Text style={{ color: C.text, fontWeight: '900', fontSize: 12 }}>A · {tgt.label}</Text></View>
          </View>
        ) : null}
      </View>

      {/* HUD */}
      <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, top: 0, paddingTop: ins.top + 6, paddingHorizontal: 10, flexDirection: 'row', gap: 8, alignItems: 'flex-start', zIndex: 100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(27,19,14,0.88)', borderColor: C.line, borderWidth: 2, borderRadius: 14, padding: 6, paddingRight: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: C.panel2, borderWidth: 2, borderColor: C.gold }}>
            <View style={{ position: 'absolute', left: -6, top: -2 }}><SpriteSheet sheet={sheetKey} row={0} col={0} scale={0.9} /></View>
          </View>
          <View style={{ width: 82 }}>
            <Txt size={12} bold numberOfLines={1}>{profile?.name || 'Pemain'}</Txt>
            <Txt size={11} color={C.goldSoft} bold>Lv {levelOf(progress.xp)} · {progress.xp} XP</Txt>
            <Bar value={levelProgress(progress.xp)} h={6} />
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(27,19,14,0.88)', borderColor: C.line, borderWidth: 2, borderRadius: 14, paddingVertical: 6, paddingHorizontal: 10, minHeight: 52, justifyContent: 'center' }}>
          <Txt size={12} color={C.gold} bold>{mapId === 'overworld' ? 'Kota Solo' : CHAPTERS[mapId as ChapterId]?.title}</Txt>
          <Txt size={13} bold numberOfLines={2} testID="objective">{obj.text}</Txt>
        </View>
        <Pressable testID="menu" onPress={props.onMenu} style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(27,19,14,0.88)', borderColor: C.line, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.gold, fontSize: 24, fontWeight: '900' }}>☰</Text></Pressable>
      </View>

      {!progress.flags.tutMove && progress.flags.metKiwira !== undefined ? null : null}
      {!progress.flags.tutMove ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 190, alignItems: 'center', zIndex: 100 }}>
          <View style={{ backgroundColor: 'rgba(27,19,14,0.9)', borderColor: C.gold, borderWidth: 2, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, maxWidth: 320 }}>
            <Txt size={13} center bold>{Platform.OS === 'web' ? 'Gerakkan joystick atau tombol panah/WASD. Tekan A / Spasi untuk berinteraksi.' : 'Geser joystick di kiri bawah untuk berjalan. Tekan A untuk berinteraksi.'}</Txt>
          </View>
        </View>
      ) : null}

      <View pointerEvents="box-none" style={{ position: 'absolute', left: 14, right: 14, bottom: Math.max(ins.bottom, 10) + 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 100 }}>
        <Joystick onChange={(x, y) => { input.current.jx = x; input.current.jy = y; }} />
        <Pressable testID="btn-a" onPress={doInteract} style={({ pressed }) => ({ width: 84, height: 84, borderRadius: 42, backgroundColor: tgt ? C.gold : 'rgba(120,100,60,0.7)', borderWidth: 4, borderColor: tgt ? C.goldDark : 'rgba(60,45,25,0.8)', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.92 : 1 }], marginBottom: 14 })}>
          <Text style={{ fontSize: 34, fontWeight: '900', color: tgt ? '#2b1b0c' : '#2b1b0c88' }}>A</Text>
        </Pressable>
      </View>
      <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#000', opacity: fade, zIndex: 150 }} />
    </View>
  );
});

function facing(s: { x: number; y: number }, n: { x: number; y: number }) {
  const dx = s.x - n.x * TILE, dy = s.y - n.y * TILE;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
}
function m_collectibles(map: (typeof MAPS)[string], col: string[]) { return map.collectibles.filter((c) => !col.includes(c.id)); }
