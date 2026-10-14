from px import *
import tiles as t
import objects as o
import random, json
from collections import deque

T = 16
SOLID_CH = set('~TtsrfWwv ')

class GameMap:
    def __init__(self, mid, w, h, fill='.'):
        self.id, self.w, self.h = mid, w, h
        self.grid = {(x, y): fill for x in range(w) for y in range(h)}
        self.objs = []         # (fn, tx, ty, foot)
        self.foot_solid = set()
        self.entities = dict(npcs=[], stations=[], doors=[], collectibles=[], enemies=[], labels=[], spawns={})
        self.theme = 'out'
        self.reserve = set()

    def rect(self, ch, x0, y0, x1, y1):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if (x, y) in self.grid: self.grid[(x, y)] = ch

    def set(self, x, y, ch):
        if (x, y) in self.grid: self.grid[(x, y)] = ch

    def obj(self, fn, tx, ty, wt, ht, foot=None, args=()):
        """foot: None -> seluruh; (dx,dy,dw,dh) -> sub; [] -> tidak solid; list of rects."""
        self.objs.append((fn, tx, ty, wt, ht, args))
        rects = [(0, 0, wt, ht)] if foot is None else ([foot] if (foot and isinstance(foot[0], int)) else (foot or []))
        for (dx, dy, dw, dh) in rects:
            for yy in range(ty + dy, ty + dy + dh):
                for xx in range(tx + dx, tx + dx + dw):
                    self.foot_solid.add((xx, yy))
        for yy in range(ty - 1, ty + ht + 1):
            for xx in range(tx - 1, tx + wt + 1):
                self.reserve.add((xx, yy))

    def solid(self, x, y):
        if not (0 <= x < self.w and 0 <= y < self.h): return True
        if (x, y) in self.foot_solid: return True
        return self.grid[(x, y)] in SOLID_CH

    def walkable_bfs(self, sx, sy):
        seen = {(sx, sy)}; dq = deque([(sx, sy)])
        while dq:
            x, y = dq.popleft()
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                n = (x + dx, y + dy)
                if n not in seen and not self.solid(*n):
                    seen.add(n); dq.append(n)
        return seen

    # --- entitas ---
    def npc(self, nid, sprite, x, y, face='down', name=''):
        self.entities['npcs'].append(dict(id=nid, sprite=sprite, x=x, y=y, face=face, name=name))
    def station(self, sid, x, y, label, r=1.5):
        self.entities['stations'].append(dict(id=sid, x=x, y=y, label=label, r=r))
    def door(self, did, x, y, w, h, to, spawn, label=''):
        self.entities['doors'].append(dict(id=did, x=x, y=y, w=w, h=h, to=to, spawn=spawn, label=label))
    def collect(self, cid, x, y):
        self.entities['collectibles'].append(dict(id=cid, x=x, y=y))
    def enemy(self, eid, x0, y0, x1, y1, speed=1.1):
        self.entities['enemies'].append(dict(id=eid, x0=x0, y0=y0, x1=x1, y1=y1, speed=speed))
    def label(self, text, x, y):
        self.entities['labels'].append(dict(text=text, x=x, y=y))
    def spawn(self, name, x, y):
        self.entities['spawns'][name] = [x, y]

    # --- render ---
    def render(self, outdir):
        W, H = self.w * T, self.h * T
        base = Canvas(W, H); over = Canvas(W, H)
        g = self.grid
        for (x, y), ch in sorted(g.items(), key=lambda k: (k[0][1], k[0][0])):
            if ch in '.,TtsrfbX': 
                pass
            if ch in '.,Ttsrf' and self.theme == 'out':
                t.tile_grass(base, x, y, flowers=(ch == ','))
            elif ch in '=EM':
                t.tile_path(base, x, y, g, 'marble' if ch == 'M' else 'path')
            elif ch == '~': t.tile_water(base, x, y, g)
            elif ch == 'b': t.tile_bridge(base, x, y, g)
            elif ch in 'FSLG': t.tile_floor(base, x, y, ch)
            elif ch in 'KRI': t.tile_carpet(base, x, y, ch)
            elif ch == 'W': t.tile_wallcap(base, x, y)
            elif ch == 'w': t.tile_wall(base, x, y, g, self.wall_theme if hasattr(self, 'wall_theme') else 'cream')
            elif ch == 'v': t.tile_bottomwall(base, x, y)
            elif ch == 'D': t.tile_door(base, x, y)
            elif ch == ' ': base.rect(x * T, y * T, T, T, hexc('#1c1410'))
        # kelas dinding atas: tiles 'w' di bawah 'W' sudah ditangani
        for fn, tx, ty, wt, ht, args in self.objs:
            fn(base, tx * T, ty * T, *args)
        # objek pohon/semak/batu/pagar
        for (x, y), ch in sorted(g.items(), key=lambda k: (k[0][1], k[0][0])):
            if ch in 'Tt':
                o.tree_trunk(base, x, y); o.tree_canopy(over, x, y, 1 if ch == 't' else 0)
            elif ch == 's': o.bush(base, x, y)
            elif ch == 'r': o.rock(base, x, y)
            elif ch == 'f': o.fence(base, x, y, g)
        base.save(f'{outdir}/{self.id}_base.png', 3)
        over.save(f'{outdir}/{self.id}_over.png', 3)

    def export(self):
        solid = [''.join('1' if self.solid(x, y) else '0' for x in range(self.w)) for y in range(self.h)]
        return dict(id=self.id, w=self.w, h=self.h, solid=solid, **self.entities)

    def check(self):
        sp = list(self.entities['spawns'].values())[0]
        reach = self.walkable_bfs(int(sp[0]), int(sp[1]))
        bad = []
        for k in ('npcs', 'collectibles'):
            for e in self.entities[k]:
                if (int(e['x']), int(e['y'])) in self.foot_solid or self.solid(int(e['x']), int(e['y'])): bad.append(('solid', k, e['id']))
        for e in self.entities['collectibles']:
            if (int(e['x']), int(e['y'])) not in reach: bad.append(('unreach', 'collect', e['id']))
        for e in self.entities['stations']:
            ok = any((int(e['x'] + dx), int(e['y'] + dy)) in reach for dx in (-1, 0, 1) for dy in (-1, 0, 1))
            if not ok: bad.append(('unreach', 'station', e['id']))
        for e in self.entities['doors']:
            if (int(e['x']), int(e['y'])) not in reach: bad.append(('unreach', 'door', e['id']))
        for e in self.entities['npcs']:
            if (int(e['x']), int(e['y'] + 1)) not in reach and (int(e['x']), int(e['y'])) not in reach: bad.append(('unreach', 'npc', e['id']))
        return bad

def free_tile(m, x, y):
    """cari tile jalan terdekat."""
    best = None
    for r in range(0, 6):
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                if not m.solid(x + dx, y + dy): return (x + dx, y + dy)
    return (x, y)

# ===================================================================
def build_overworld():
    m = GameMap('overworld', 32, 24)
    rng = random.Random(7)
    for y in range(24):
        for x in range(32):
            if rng.random() < 0.13: m.set(x, y, ',')
    # sungai
    m.rect('~', 0, 14, 31, 15)
    # jalan utama
    m.rect('M', 9, 6, 21, 9)               # plaza keraton
    m.rect('=', 14, 10, 16, 13)            # jalan tengah utara
    m.rect('b', 14, 14, 16, 15)            # jembatan
    m.rect('=', 14, 16, 16, 22)            # jalan tengah selatan
    m.rect('=', 4, 10, 27, 11)             # jalan timur-barat utara
    m.rect('=', 4, 21, 27, 22)             # jalan timur-barat selatan
    m.rect('=', 4, 8, 6, 9)                # akses rumah batik
    m.rect('=', 25, 8, 27, 9)              # akses panggung
    m.rect('=', 4, 17, 6, 20)              # akses museum
    m.rect('=', 25, 17, 27, 20)            # akses sekolah
    # pohon tepi
    for x in range(32):
        m.set(x, 0, 'T' if x % 2 == 0 else 't'); m.set(x, 23, 'T' if x % 2 == 1 else 't')
    for y in range(1, 23):
        if y in (14, 15): continue
        m.set(0, y, 'T' if y % 2 == 0 else 't'); m.set(31, y, 'T' if y % 2 == 1 else 't')
    # bangunan
    m.obj(o.house_keraton, 11, 1, 9, 5, foot=[(0, 0, 9, 4), (0, 4, 4, 1), (5, 4, 4, 1)])
    m.obj(o.house_batik, 2, 3, 7, 5, foot=[(0, 0, 7, 4), (0, 4, 3, 1), (4, 4, 3, 1)])
    m.obj(o.house_theater, 23, 3, 7, 5, foot=[(0, 0, 7, 4), (0, 4, 3, 1), (4, 4, 3, 1)])
    m.obj(o.house_museum, 2, 16, 7, 5, foot=[(0, 0, 7, 4), (0, 4, 3, 1), (4, 4, 3, 1)])
    m.obj(o.house_school, 23, 16, 7, 5, foot=[(0, 0, 7, 4), (0, 4, 3, 1), (4, 4, 3, 1)])
    # warung dan prop
    m.obj(o.warung, 22, 12, 3, 2, foot=[(0, 0, 3, 2)])
    m.obj(o.warung, 7, 12, 3, 2, foot=[(0, 0, 3, 2)])
    for (lx, ly) in ((9, 6), (21, 6), (9, 9), (21, 9), (13, 12), (17, 12), (13, 18), (17, 18)):
        m.obj(o.lamp, lx, ly, 1, 1)
    m.obj(o.bench, 10, 7, 2, 1); m.obj(o.bench, 19, 7, 2, 1)
    m.obj(o.tugu, 12, 8, 1, 2, foot=(0, 1, 1, 1)); m.obj(o.tugu, 18, 8, 1, 2, foot=(0, 1, 1, 1))
    m.obj(o.well, 11, 19, 1, 1)
    m.obj(o.signpost, 13, 10, 1, 1); m.obj(o.signpost, 17, 10, 1, 1)
    m.obj(o.potplant, 3, 8, 1, 1, args=(1,)); m.obj(o.potplant, 9, 8, 1, 1)
    # pagar plaza
    for x in range(9, 22):
        if x not in (14, 15, 16): m.set(x, 5, 'f') if m.grid[(x, 5)] != 'M' and not (11 <= x <= 19) else None
    # pohon acak
    r2 = random.Random(21)
    for _ in range(420):
        x, y = r2.randrange(1, 31), r2.randrange(1, 23)
        if m.grid[(x, y)] in '.,' and (x, y) not in m.reserve and not any(m.grid.get((x + dx, y + dy)) in ('=', 'M', 'b') for dx in (-1, 0, 1) for dy in (-1, 0, 1)):
            if y in (13, 16): continue
            if not any(m.grid.get((x + dx, y + dy)) in ('T', 't', 's', 'r') for dx in (-1, 0, 1) for dy in (-1, 0, 1)):
                m.set(x, y, r2.choice('TtTs' if y > 2 else 'T'))
    for _ in range(26):
        x, y = r2.randrange(1, 31), r2.randrange(1, 23)
        if m.grid[(x, y)] in '.,' and (x, y) not in m.reserve and not any(m.grid.get((x + dx, y + dy)) in ('=', 'M', 'b') for dx in (-1, 0, 1) for dy in (-1, 0, 1)) and y not in (13, 16):
            m.set(x, y, 'r' if r2.random() < 0.5 else 's')
    # --- entitas ---
    m.spawn('start', 15.5, 11.4)
    m.spawn('from_batik', 5.5, 9.0)
    m.spawn('from_wayang', 26.5, 9.0)
    m.spawn('from_keris', 5.5, 21.6)
    m.spawn('from_basa', 26.5, 21.6)
    m.door('to_batik', 5, 7, 1, 1, 'batik', 'in', 'Rumah Batik')
    m.door('to_wayang', 26, 7, 1, 1, 'wayang', 'in', 'Panggung Wayang')
    m.door('to_keris', 5, 20, 1, 1, 'keris', 'in', 'Museum Pusaka')
    m.door('to_basa', 26, 20, 1, 1, 'basa', 'in', 'Sekolah Basa')
    m.door('gate', 15, 5, 1, 1, 'gate', 'in', 'Gerbang Keraton')
    m.label('Rumah Batik Laweyan', 5.5, 2.3); m.label('Panggung Wayang', 26.5, 2.3)
    m.label('Museum Pusaka', 5.5, 15.3); m.label('Sekolah Basa', 26.5, 15.3); m.label('Gerbang Keraton', 15.5, 0.4)
    m.npc('kiwira', 'kiwira', 12.5, 12.3, 'right', 'Ki Wira')
    m.npc('penjaga', 'penjaga', 13.5, 6.6, 'down', 'Prajurit Keraton')
    m.npc('warga1', 'warga1', 23.5, 11.9 - 0.2, 'down', 'Pak Darto')   # dekat warung timur (di jalan)
    m.npc('warga2', 'warga2', 8.5, 11.9 - 0.2, 'down', 'Bu Tini')
    m.npc('warga3', 'warga3', 17.5, 8.5, 'left', 'Mas Bayu')
    for i, (x, y) in enumerate([(2.5, 9.5), (29.5, 9.5), (8.5, 2.5), (22.5, 2.5), (3.5, 13.0), (28.5, 12.6), (12.5, 20.5), (19.5, 18.5), (1.5, 21.5), (30.5, 20.5)]):
        fx, fy = free_tile(m, int(x), int(y)); m.collect(f'ow{i+1}', fx + 0.5, fy + 0.5)
    m.enemy('sh1', 6.5, 10.9, 12.5, 10.9, 1.2)
    m.enemy('sh2', 19.5, 10.9, 25.5, 10.9, 1.2)
    m.enemy('sh3', 6.5, 21.9, 12.5, 21.9, 1.2)
    m.enemy('sh4', 19.5, 21.9, 25.5, 21.9, 1.2)
    return m

# ---------- interior ----------
def room(mid, wall_theme='cream', floor='F'):
    m = GameMap(mid, 20, 14, floor)
    m.theme = 'in'; m.wall_theme = wall_theme
    m.rect('W', 0, 0, 19, 0); m.rect('w', 0, 1, 19, 2)
    m.rect('W', 0, 3, 0, 12); m.rect('W', 19, 3, 19, 12)
    m.rect('v', 0, 13, 19, 13); m.rect('D', 9, 13, 10, 13)
    m.rect('W', 0, 1, 0, 2); m.rect('W', 19, 1, 19, 2)
    m.spawn('in', 10.0, 12.2)
    m.door('exit', 9, 13, 2, 1, 'overworld', None, 'Keluar')
    return m

def build_batik():
    m = room('batik', 'cream', 'F')
    m.rect('I', 7, 6, 12, 10)
    m.obj(lambda cv, x, y: o.shelf(cv, x, y, 48), 2, 1, 3, 1, foot=[])
    m.obj(lambda cv, x, y: o.wall_cloth(cv, x, y, 'kawung', t.C['indigo'], hexc('#e8d9a8')), 6, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.wall_cloth(cv, x, y, 'parang', hexc('#a33a2a'), hexc('#f3e8cb')), 13, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.wall_cloth(cv, x, y, 'dots', t.C['sogan'], hexc('#e9c88a')), 10, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.jar_set(cv, x, y), 16, 1, 1, 1, foot=[])
    m.obj(o.canting_table, 2, 4, 3, 2, foot=[(0, 0, 3, 2)])
    m.obj(o.dye_vats, 8, 4, 4, 2, foot=[(0, 0, 4, 2)])
    m.obj(o.cloth_rack, 14, 4, 4, 2, foot=[(0, 0, 4, 2)])
    m.obj(o.stove, 17, 8, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(o.plant_big, 1, 10, 1, 2, foot=(0, 1, 1, 1)); m.obj(o.plant_big, 18, 11, 1, 2, foot=(0, 1, 1, 1))
    m.station('canting', 3.5, 6.1, 'Meja Canting', 1.6)
    m.station('celup', 10.0, 6.1, 'Bak Pewarna', 1.7)
    m.station('motif', 16.0, 6.1, 'Jemuran Motif', 1.7)
    m.station('tungku', 17.9, 10.3, 'Tungku Malam', 1.4)
    m.npc('busekar', 'busekar', 5.5, 8.6, 'right', 'Bu Sekar')
    m.npc('pelanggan', 'pelanggan', 13.5, 9.5, 'left', 'Mbak Ayu')
    for i, (x, y) in enumerate([(2.5, 8.5), (11.5, 11.5), (15.5, 8.5)]):
        m.collect(f'ba{i+1}', x, y)
    return m

def build_wayang():
    m = room('wayang', 'cream', 'F')
    m.rect('S', 2, 3, 17, 5)
    m.obj(o.kelir, 5, 0, 10, 3, foot=[(0, 0, 10, 3)])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#7d2a2a')), 2, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#7d2a2a')), 17, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.mat(cv, x, y, 2, 1, hexc('#c78a2a')), 9, 4, 2, 1, foot=[])
    for (mx, my) in ((7, 10), (10, 10), (13, 10), (7, 12)):
        m.obj(lambda cv, x, y: o.mat(cv, x, y, 2, 1, hexc('#8a2f2f')), mx, my, 2, 1, foot=[])
    m.obj(o.saron, 3, 7, 3, 1, foot=[(0, 0, 3, 1)]); m.obj(o.saron, 3, 9, 3, 1, foot=[(0, 0, 3, 1)])
    m.obj(o.gong, 16, 6, 2, 3, foot=[(0, 0, 2, 3)])
    m.obj(o.bonang, 14, 9, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(o.story_board, 1, 4, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(o.puppet_chest, 8, 7, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(o.plant_big, 18, 11, 1, 2, foot=(0, 1, 1, 1)); m.obj(o.plant_big, 1, 11, 1, 2, foot=(0, 1, 1, 1))
    m.station('gamelan', 16.4, 9.3, 'Gamelan', 1.8)
    m.station('lakon', 2.0, 6.3, 'Papan Lakon', 1.6)
    m.station('tokoh', 9.0, 9.4, 'Peti Wayang', 1.6)
    m.station('dalang', 10.0, 5.6, 'Kursi Dalang', 1.5)
    m.npc('kiwira2', 'kiwira', 6.0, 6.8, 'right', 'Ki Wira')
    m.npc('dalang', 'dalang', 12.6, 6.8, 'left', 'Pak Dalang')
    for i, (x, y) in enumerate([(3.5, 11.5), (12.5, 12.0), (17.5, 4.5)]):
        m.collect(f'wa{i+1}', x, y)
    return m

def build_keris():
    m = room('keris', 'stone', 'G')
    m.rect('R', 9, 3, 10, 12)
    m.obj(lambda cv, x, y: o.display_case(cv, x, y, 0), 3, 3, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(lambda cv, x, y: o.display_case(cv, x, y, 1), 7, 3, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(lambda cv, x, y: o.display_case(cv, x, y, 2), 11, 3, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(lambda cv, x, y: o.display_case(cv, x, y, 3), 15, 3, 2, 2, foot=[(0, 0, 2, 2)])
    m.obj(o.notice_board, 17, 1, 2, 1, foot=[])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#9b2f3a')), 3, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#2b3a67')), 8, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#9b2f3a')), 13, 1, 1, 2, foot=[])
    m.obj(o.katalog_table, 3, 8, 3, 2, foot=[(0, 0, 3, 2)])
    m.obj(lambda cv, x, y: o.rope_barrier(cv, x, y, 3), 12, 8, 3, 1, foot=[(0, 0, 3, 1)])
    m.obj(lambda cv, x, y: o.rope_barrier(cv, x, y, 3), 12, 11, 3, 1, foot=[(0, 0, 3, 1)])
    m.obj(lambda cv, x, y: o.pedestal(cv, x, y, 'vase'), 13, 9, 1, 1); m.obj(lambda cv, x, y: o.pedestal(cv, x, y, 'gold'), 14, 9, 1, 1)
    m.obj(o.plant_big, 1, 10, 1, 2, foot=(0, 1, 1, 1)); m.obj(o.plant_big, 18, 11, 1, 2, foot=(0, 1, 1, 1))
    m.station('anatomi', 8.0, 5.4, 'Anatomi Keris', 1.7)
    m.station('tertib', 17.9, 3.6, 'Tata Tertib', 1.6)
    m.station('katalog', 4.5, 10.3, 'Katalog Pusaka', 1.7)
    m.npc('empujaya', 'empujaya', 6.5, 7.5, 'right', 'Empu Jaya')
    m.npc('pengunjung', 'warga2', 15.5, 7.0, 'down', 'Pengunjung')
    for i, (x, y) in enumerate([(2.5, 7.0), (17.5, 9.0), (12.5, 12.0)]):
        m.collect(f'ke{i+1}', x, y)
    return m

def build_basa():
    m = room('basa', 'blue', 'L')
    m.obj(o.chalkboard, 7, 1, 5, 2, foot=[])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#2f5fa8')), 2, 1, 1, 2, foot=[])
    m.obj(lambda cv, x, y: o.banner_wall(cv, x, y, hexc('#2f5fa8')), 17, 1, 1, 2, foot=[])
    m.obj(o.desk, 9, 5, 2, 1, foot=[(0, 0, 2, 1)])
    for (dx, dy) in ((4, 8), (4, 10), (13, 8), (13, 10), (7, 8), (10, 8)):
        m.obj(o.desk, dx, dy, 2, 1, foot=[(0, 0, 2, 1)])
    m.obj(o.bookshelf_big, 15, 3, 3, 2, foot=[(0, 0, 3, 2)])
    m.obj(o.kursi_mbah, 2, 4, 2, 1, foot=[(0, 0, 2, 1)])
    m.obj(o.tea_table, 4, 4, 1, 1); m.obj(o.globe_stand, 1, 7, 1, 1)
    m.obj(o.plant_big, 18, 11, 1, 2, foot=(0, 1, 1, 1))
    m.station('tingkat', 9.5, 3.7, 'Papan Tulis', 1.7)
    m.station('ukara', 10.0, 6.5, 'Meja Guru', 1.6)
    m.station('tembung', 16.5, 5.4, 'Rak Buku', 1.7)
    m.station('mbah', 3.2, 6.0, 'Ngobrol karo Mbah', 1.6)
    m.npc('bularas', 'bularas', 12.8, 4.9, 'left', 'Bu Laras')
    m.npc('mbah', 'mbah', 2.9, 5.0, 'down', 'Mbah Putri')
    for i, (x, y) in enumerate([(1.5, 11.5), (17.5, 8.5), (8.5, 11.5)]):
        m.collect(f'bs{i+1}', x, y)
    return m

ALL = [build_overworld, build_batik, build_wayang, build_keris, build_basa]
