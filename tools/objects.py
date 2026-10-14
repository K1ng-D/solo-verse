from px import *
from tiles import C, T
import random

def shadow(cv, x, y, w, h, a=70):
    cv.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, (20, 30, 10, a))

def roof(cv, x, y, w, h, col, d, l, inset=0.55, tile_h=3, ridge=None):
    """atap trapesium: baris genteng."""
    for i in range(h):
        ins = int((h - 1 - i) * inset)
        x0, x1 = x + ins, x + w - ins
        row = (i // tile_h)
        cv.hline(x0, y + i, x1 - x0, col)
        if i % tile_h == tile_h - 1:
            cv.hline(x0, y + i, x1 - x0, d)
        else:
            for k in range(x0 + (row % 2) * 2, x1, 4):
                cv.px(k, y + i, l if i % tile_h == 0 else col)
        cv.px(x0, y + i, d); cv.px(x1 - 1, y + i, d)
    if ridge:
        top_ins = int((h - 1) * inset)
        cv.hline(x + top_ins - 1, y, w - 2 * top_ins + 2, ridge)
        cv.hline(x + top_ins - 1, y - 1, w - 2 * top_ins + 2, shade(ridge, 0.3))

def pillar(cv, x, y, h, col, d, l):
    cv.rect(x, y, 3, h, col); cv.vline(x, y, h, l); cv.vline(x + 2, y, h, d)
    cv.rect(x - 1, y, 5, 2, d); cv.rect(x - 1, y + h - 2, 5, 2, d)

def window(cv, x, y, w=12, h=12, glass=None):
    cv.rect(x, y, w, h, C['wood_dd'])
    cv.rect(x + 1, y + 1, w - 2, h - 2, glass or hexc('#8fc7e8'))
    cv.vline(x + w // 2, y + 1, h - 2, C['wood_dd']); cv.hline(x + 1, y + h // 2, w - 2, C['wood_dd'])
    cv.px(x + 2, y + 2, hexc('#d6efff')); cv.px(x + 3, y + 2, hexc('#d6efff'))

def cloth(cv, x, y, w, h, kind, base, accent):
    cv.rect(x, y, w, h, base)
    cv.vline(x, y, h, shade(base, -0.25)); cv.vline(x + w - 1, y, h, shade(base, -0.25))
    if kind == 'kawung':
        for cy in range(y + 3, y + h - 2, 5):
            for cx in range(x + 3, x + w - 1, 5):
                cv.px(cx, cy, accent); cv.px(cx - 1, cy, accent) if cx - 1 > x else None
                cv.px(cx + 1, cy, accent) if cx + 1 < x + w - 1 else None
    elif kind == 'parang':
        for k in range(-h, w + h, 5):
            for t in range(h):
                xx = x + k + t
                if x < xx < x + w - 1: cv.px(xx, y + t, accent)
    elif kind == 'dots':
        for cy in range(y + 2, y + h - 1, 4):
            for cx in range(x + 2 + (cy // 4 % 2) * 2, x + w - 1, 4):
                cv.px(cx, cy, accent)
    cv.hline(x, y + h - 1, w, shade(base, -0.3))
    cv.hline(x, y, w, shade(base, -0.2))

# ============ BANGUNAN LUAR RUANG (7x5 = 112x80) ============
def building_base(cv, x, y, w, h, wall, wall_d):
    shadow(cv, x + 2, y + h - 8, w - 4, 12, 80)
    cv.rect(x + 8, y + 32, w - 16, h - 32, wall)
    cv.rect(x + 8, y + h - 3, w - 16, 3, shade(wall, -0.3))
    cv.vline(x + 8, y + 32, h - 32, wall_d); cv.vline(x + w - 9, y + 32, h - 32, wall_d)

def door_arch(cv, x, y, w=16, h=22, col=None):
    col = col or hexc('#4a2f1c')
    cv.rect(x, y, w, h, hexc('#2a1a12'))
    cv.rect(x + 1, y + 1, w - 2, h - 1, col)
    cv.rect(x + 2, y + 2, w - 4, h - 2, shade(col, 0.1))
    cv.vline(x + w // 2, y + 2, h - 2, hexc('#2a1a12'))
    cv.px(x + w // 2 - 2, y + h // 2 + 2, C['gold']); cv.px(x + w // 2 + 2, y + h // 2 + 2, C['gold'])

def house_batik(cv, x, y):
    W, H = 112, 80
    building_base(cv, x, y, W, H, hexc('#f1e3c2'), hexc('#cdb98c'))
    # rangka kayu
    for px_ in (8, 36, 68, 100): cv.rect(x + px_, y + 34, 4, H - 34, C['wood_d']); cv.vline(x + px_, y + 34, H - 34, C['wood'])
    cv.rect(x + 8, y + 34, W - 16, 3, C['wood_d'])
    # atap bertingkat (joglo)
    roof(cv, x + 0, y + 16, W, 22, C['roof'], C['roof_d'], C['roof_l'], inset=0.35)
    roof(cv, x + 22, y + 0, 68, 20, C['roof'], C['roof_d'], C['roof_l'], inset=0.5, ridge=C['gold'])
    cv.hline(x + 0, y + 37, W, C['roof_d']); cv.hline(x + 0, y + 38, W, hexc('#5a2014'))
    # pintu dan jendela
    door_arch(cv, x + 48, y + 56, 16, 24)
    window(cv, x + 14, y + 48, 14, 14); window(cv, x + 84, y + 48, 14, 14)
    # kain batik tergantung
    cv.hline(x + 30, y + 44, 14, C['wood_dd']); cv.hline(x + 68, y + 44, 14, C['wood_dd'])
    cloth(cv, x + 31, y + 45, 6, 18, 'dots', C['indigo'], hexc('#e8d9a8'))
    cloth(cv, x + 38, y + 45, 5, 14, 'kawung', C['sogan'], hexc('#e9c88a'))
    cloth(cv, x + 69, y + 45, 5, 16, 'parang', hexc('#a33a2a'), hexc('#f3e8cb'))
    cloth(cv, x + 75, y + 45, 6, 19, 'dots', hexc('#2f6f5a'), hexc('#e8d9a8'))
    # pot tanaman
    for px_ in (36, 70):
        cv.rect(x + px_, y + 70, 6, 5, hexc('#b5653a')); cv.ellipse(x + px_ + 3, y + 69, 4, 3, C['grass_d']); cv.px(x + px_ + 2, y + 67, hexc('#f4a6c0'))

def house_theater(cv, x, y):
    W, H = 112, 80
    building_base(cv, x, y, W, H, hexc('#7d2a2a'), hexc('#5d1b1b'))
    roof(cv, x + 0, y + 14, W, 24, hexc('#2f6b52'), hexc('#1f4a38'), hexc('#4a8f72'), inset=0.4)
    roof(cv, x + 24, y + 0, 64, 18, hexc('#2f6b52'), hexc('#1f4a38'), hexc('#4a8f72'), inset=0.5, ridge=C['gold'])
    cv.rect(x + 54, y - 4, 4, 5, C['gold']); cv.px(x + 55, y - 6, C['gold'])
    cv.hline(x + 0, y + 37, W, hexc('#173a2b'))
    # pilar merah-emas
    for px_ in (10, 30, 78, 98): pillar(cv, x + px_, y + 38, H - 38, hexc('#c0392b'), hexc('#8a2418'), hexc('#e8625a'))
    # emblem gunungan di dinding
    for cx in (21, 90):
        for i in range(18):
            wd = int(5 * (1 - abs(i - 9) / 10.0)) + 1 if i > 4 else max(1, i // 2 + 1)
            cv.hline(x + cx - wd // 2, y + 42 + i, wd, C['gold'])
        cv.vline(x + cx, y + 46, 12, hexc('#7d2a2a'))
    # layar menyala
    cv.rect(x + 42, y + 42, 28, 14, hexc('#f7e4b0')); cv.frame(x + 41, y + 41, 30, 16, C['wood_dd'])
    cv.ellipse(x + 56, y + 49, 10, 5, hexc('#fff3cf'))
    # siluet wayang mini
    cv.rect(x + 54, y + 46, 3, 8, hexc('#2a1a12')); cv.rect(x + 53, y + 45, 5, 3, hexc('#2a1a12')); cv.px(x + 52, y + 49, hexc('#2a1a12'))
    # pintu tirai
    cv.rect(x + 48, y + 58, 16, 22, hexc('#2a1a12'))
    cv.rect(x + 49, y + 58, 6, 22, hexc('#8a1f2c')); cv.rect(x + 57, y + 58, 6, 22, hexc('#8a1f2c'))
    cv.hline(x + 48, y + 58, 16, C['gold']); cv.hline(x + 49, y + 59, 14, C['gold_d'])
    for i in range(4): cv.px(x + 50 + i, y + 62, hexc('#b03a4a'))

def house_museum(cv, x, y):
    W, H = 112, 80
    shadow(cv, x + 2, y + H - 8, W - 4, 12, 80)
    # tangga
    for i in range(3):
        cv.rect(x + 6 + i * 2, y + H - 6 + i * 2 - 6, W - 12 - i * 4, 2, shade(C['stone_l'], -0.05 * i)) if False else None
    cv.rect(x + 6, y + 72, W - 12, 8, C['stone_l']); cv.hline(x + 6, y + 72, W - 12, C['white']); cv.hline(x + 6, y + 76, W - 12, C['stone'])
    cv.rect(x + 10, y + 34, W - 20, 38, hexc('#e2dccd')); cv.hline(x + 10, y + 70, W - 20, C['stone'])
    # pedimen
    for i in range(22):
        hw = int(i * 54 / 21) + 2
        cv.hline(x + 56 - hw, y + 10 + i, 2 * hw, C['stone_l'] if i % 5 else C['white'])
        cv.hline(x + 56 - hw + 3, y + 10 + i + 1, max(0, 2 * hw - 6), hexc('#e2dccd')) if i < 20 and i > 3 else None
    cv.hline(x + 0, y + 32, W, C['stone_d']); cv.rect(x + 2, y + 30, W - 4, 4, C['stone_l'])
    for i in range(22):
        hw = int(i * 54 / 21) + 2
        cv.px(x + 56 - hw, y + 10 + i, C['stone_d']); cv.px(x + 56 + hw - 1, y + 10 + i, C['stone_d'])
    cv.hline(x + 2, y + 32, W - 4, C['stone_d'])
    cv.ellipse(x + 56, y + 24, 5, 4, C['gold']); cv.px(x + 55, y + 23, C['gold_l'])
    # kolom
    for px_ in (14, 34, 70, 90):
        cv.rect(x + px_, y + 36, 8, 36, hexc('#f4f0e6')); cv.vline(x + px_, y + 36, 36, C['stone_l']); cv.vline(x + px_ + 7, y + 36, 36, C['stone'])
        cv.rect(x + px_ - 1, y + 35, 10, 3, C['stone_l']); cv.rect(x + px_ - 1, y + 70, 10, 3, C['stone'])
        for k in range(40 - 4, 70, 5): cv.vline(x + px_ + 3, y + k, 3, C['stone'])
    # pintu
    cv.rect(x + 46, y + 52, 20, 28, hexc('#2a1a12'))
    cv.rect(x + 48, y + 54, 16, 26, hexc('#5a3a22')); cv.vline(x + 56, y + 54, 26, hexc('#2a1a12'))
    cv.px(x + 54, y + 68, C['gold']); cv.px(x + 58, y + 68, C['gold'])
    # spanduk
    for bx in (24, 78):
        cv.rect(x + bx, y + 40, 6, 20, hexc('#9b2f3a')); cv.hline(x + bx, y + 40, 6, C['gold']); cv.px(x + bx + 2, y + 58, C['gold'])
        cv.px(x + bx + 2, y + 48, C['gold']); cv.px(x + bx + 3, y + 49, C['gold']); cv.px(x + bx + 2, y + 50, C['gold'])

def house_school(cv, x, y):
    W, H = 112, 80
    building_base(cv, x, y, W, H, hexc('#f2d27a'), hexc('#c9a850'))
    roof(cv, x + 0, y + 16, W, 22, hexc('#c0453a'), hexc('#8a2c24'), hexc('#de6a5a'), inset=0.3)
    roof(cv, x + 30, y + 4, 52, 16, hexc('#c0453a'), hexc('#8a2c24'), hexc('#de6a5a'), inset=0.5, ridge=hexc('#8a2c24'))
    # tiang bendera
    cv.vline(x + 56, y - 14, 20, hexc('#cfcfcf')); cv.rect(x + 57, y - 14, 10, 3, hexc('#d63a3a')); cv.rect(x + 57, y - 11, 10, 3, hexc('#fbf7ec'))
    cv.hline(x + 0, y + 37, W, hexc('#6e1c16'))
    for wx in (14, 32, 70, 88):
        window(cv, x + wx, y + 46, 12, 14)
    cv.rect(x + 8, y + 62, W - 16, 2, hexc('#c9a850'))
    door_arch(cv, x + 44, y + 54, 24, 26, hexc('#7a4f2a'))
    # papan nama
    cv.rect(x + 40, y + 41, 32, 9, hexc('#2f5fa8')); cv.frame(x + 40, y + 41, 32, 9, C['white'])
    for k in range(6): cv.px(x + 45 + k * 4, y + 45, C['white']); cv.px(x + 46 + k * 4, y + 45, C['white'])
    # buku & pensil motif
    cv.rect(x + 20, y + 68, 6, 5, hexc('#2f8a5a')); cv.px(x + 22, y + 68, C['white'])

def house_keraton(cv, x, y):
    W, H = 144, 80
    shadow(cv, x + 2, y + H - 8, W - 4, 12, 90)
    # tembok samping
    for sx, ex in ((0, 46), (98, 144)):
        cv.rect(x + sx, y + 44, ex - sx, 36, hexc('#f4ecd8'))
        cv.rect(x + sx, y + 40, ex - sx, 6, hexc('#e4d6b4'))
        for k in range(sx + 2, ex - 2, 8):
            cv.rect(x + k, y + 36, 5, 5, hexc('#f4ecd8')); cv.hline(x + k, y + 36, 5, hexc('#fffaf0'))
        cv.hline(x + sx, y + 76, ex - sx, hexc('#c9b78a')); cv.rect(x + sx, y + 77, ex - sx, 3, hexc('#b9a574'))
        for k in range(sx + 5, ex - 4, 10):
            cv.rect(x + k, y + 54, 4, 14, C['gold']); cv.rect(x + k + 1, y + 55, 2, 12, hexc('#f4ecd8'))
    # menara tengah
    cv.rect(x + 44, y + 30, 56, 50, hexc('#f4ecd8')); cv.vline(x + 44, y + 30, 50, hexc('#d9c9a4')); cv.vline(x + 99, y + 30, 50, hexc('#d9c9a4'))
    roof(cv, x + 38, y + 14, 68, 20, hexc('#b04a30'), hexc('#80301e'), hexc('#cf6644'), inset=0.4)
    roof(cv, x + 52, y + 0, 40, 16, hexc('#b04a30'), hexc('#80301e'), hexc('#cf6644'), inset=0.5, ridge=C['gold'])
    cv.rect(x + 70, y - 6, 4, 8, C['gold']); cv.px(x + 71, y - 8, C['gold_l'])
    cv.hline(x + 38, y + 33, 68, hexc('#5a2014'))
    # hiasan emas
    cv.rect(x + 44, y + 34, 56, 3, C['gold']); cv.hline(x + 44, y + 37, 56, C['gold_d'])
    for k in range(48, 98, 6): cv.px(x + k, y + 35, hexc('#7d2a2a'))
    # gerbang melengkung
    cv.rect(x + 56, y + 48, 32, 32, hexc('#2a1a12'))
    cv.ellipse(x + 72, y + 52, 16, 9, hexc('#2a1a12'))
    cv.rect(x + 58, y + 52, 28, 28, hexc('#3b2a22')); cv.ellipse(x + 72, y + 52, 14, 7, hexc('#3b2a22'))
    cv.frame(x + 55, y + 51, 34, 29, C['gold_d']) if False else None
    for k in range(5): cv.px(x + 60 + k * 6, y + 46 + (0 if k in (1, 2, 3) else 2), C['gold'])
    cv.vline(x + 72, y + 52, 28, hexc('#1c1410'))
    cv.rect(x + 56, y + 46, 3, 34, C['gold']); cv.rect(x + 85, y + 46, 3, 34, C['gold'])
    cv.hline(x + 56, y + 46, 32, C['gold'])
    # bendera kecil
    for fx in (6, 132):
        cv.vline(x + fx, y + 24, 20, C['wood_d']); cv.rect(x + fx + 1, y + 24, 7, 4, hexc('#d63a3a')); cv.rect(x + fx + 1, y + 28, 7, 3, C['white'])

# ============ PROP LUAR RUANG ============
def lamp(cv, x, y):
    cv.rect(x + 7, y + 4, 2, 12, hexc('#3b3b44')); cv.rect(x + 5, y + 14, 6, 2, hexc('#2b2b32'))
    cv.rect(x + 4, y + 1, 8, 5, hexc('#ffe9a8')); cv.frame(x + 3, y, 10, 7, hexc('#3b3b44'))
    cv.px(x + 7, y + 3, C['white'])

def bench(cv, x, y):
    cv.rect(x + 1, y + 5, 30, 4, C['wood_l']); cv.hline(x + 1, y + 5, 30, shade(C['wood_l'], 0.2)); cv.hline(x + 1, y + 8, 30, C['wood_d'])
    cv.rect(x + 1, y + 10, 30, 3, C['wood']); cv.hline(x + 1, y + 12, 30, C['wood_d'])
    for px_ in (3, 26): cv.rect(x + px_, y + 12, 3, 4, C['wood_dd'])
    shadow(cv, x, y + 12, 32, 6, 50)

def warung(cv, x, y):  # 3x2 = 48x32
    shadow(cv, x, y + 22, 48, 10, 60)
    cv.rect(x + 2, y + 12, 44, 18, C['wood'])
    cv.hline(x + 2, y + 12, 44, C['wood_l']); cv.hline(x + 2, y + 29, 44, C['wood_dd'])
    for i in range(0, 44, 11): cv.vline(x + 2 + i, y + 13, 16, C['wood_d'])
    for i in range(0, 48, 6):
        c = hexc('#d63a3a') if (i // 6) % 2 == 0 else hexc('#fbf7ec')
        cv.rect(x + i, y + 1, 6, 10, c)
    cv.hline(x, y + 11, 48, hexc('#8a2418'))
    for i in range(0, 48, 6):
        cv.px(x + i + 2, y + 12, hexc('#8a2418')); cv.px(x + i + 3, y + 12, hexc('#8a2418'))
    # dagangan
    cols = [hexc('#f7c948'), hexc('#7bc96f'), hexc('#e86a6a'), hexc('#f4a6c0')]
    for i in range(6):
        cv.ellipse(x + 8 + i * 6, y + 14, 2, 1.5, cols[i % 4])

def well(cv, x, y):
    shadow(cv, x, y + 10, 16, 6, 60)
    cv.ellipse(x + 8, y + 9, 8, 6, C['stone_d']); cv.ellipse(x + 8, y + 8, 8, 6, C['stone'])
    cv.ellipse(x + 8, y + 8, 5, 3, hexc('#1f5a8a')); cv.px(x + 6, y + 7, C['water_l'])
    cv.rect(x + 1, y + 1, 2, 9, C['wood_d']); cv.rect(x + 13, y + 1, 2, 9, C['wood_d']); cv.hline(x, y, 16, C['wood'])
    cv.px(x + 8, y + 3, C['wood_dd'])

def signpost(cv, x, y):
    cv.rect(x + 7, y + 5, 2, 11, C['wood_d']); cv.rect(x + 1, y + 2, 14, 6, C['wood_l']); cv.frame(x + 1, y + 2, 14, 6, C['wood_dd'])
    cv.hline(x + 3, y + 5, 10, C['wood_dd'])

def potplant(cv, x, y, kind=0):
    cv.rect(x + 4, y + 10, 8, 5, hexc('#b5653a')); cv.hline(x + 3, y + 10, 10, hexc('#d98558')); cv.hline(x + 5, y + 15, 6, hexc('#7a3f22'))
    for dx, dy, c in ((8, 6, C['grass_d']), (5, 7, C['grass']), (11, 7, C['grass']), (8, 3, C['grass_l']), (6, 4, C['grass'])):
        cv.ellipse(x + dx, y + dy, 3, 3, c)
    if kind == 1:
        cv.px(x + 8, y + 3, hexc('#f4a6c0')); cv.px(x + 5, y + 6, hexc('#f4a6c0')); cv.px(x + 11, y + 5, hexc('#f7de5a'))

def tugu(cv, x, y):  # 1x2
    shadow(cv, x, y + 26, 16, 6, 60)
    cv.rect(x + 3, y + 24, 10, 6, C['stone']); cv.hline(x + 3, y + 24, 10, C['stone_l'])
    cv.rect(x + 5, y + 6, 6, 18, hexc('#e6dfcf')); cv.vline(x + 5, y + 6, 18, C['stone_l']); cv.vline(x + 10, y + 6, 18, C['stone'])
    cv.rect(x + 6, y + 2, 4, 4, C['gold']); cv.px(x + 7, y, C['gold_l']); cv.px(x + 8, y, C['gold_l']) ; cv.px(x + 7, y + 3, C['gold_l'])

def tree_trunk(cv, tx, ty):
    x, y = tx * T, ty * T
    shadow(cv, x - 2, y + 10, 20, 8, 70)
    cv.rect(x + 6, y + 4, 4, 11, C['wood_d']); cv.vline(x + 6, y + 4, 11, C['wood']); cv.vline(x + 9, y + 4, 11, C['wood_dd'])
    cv.rect(x + 4, y + 13, 8, 3, C['wood_d']); cv.px(x + 5, y + 14, C['wood'])

def tree_canopy(cv, tx, ty, kind=0, rng=None):
    """tajuk digambar di overlay; ukuran 28x24 berpusat pada tile."""
    x, y = tx * T + 8 - 14, ty * T - 17
    r = rng or random.Random(tx * 31 + ty)
    g1, g2, g3 = (hexc('#2f7d3a'), hexc('#3f9a48'), hexc('#5cb85c'))
    if kind == 1: g1, g2, g3 = (hexc('#397a32'), hexc('#4d9a3c'), hexc('#78bd55'))
    cv.ellipse(x + 14, y + 14, 14, 9, g1)
    cv.ellipse(x + 8, y + 10, 8, 7, g1); cv.ellipse(x + 20, y + 10, 8, 7, g1)
    cv.ellipse(x + 14, y + 8, 9, 7, g2)
    cv.ellipse(x + 11, y + 6, 5, 4, g3); cv.ellipse(x + 18, y + 8, 3, 2, g3)
    for _ in range(14):
        px_, py_ = x + r.randrange(2, 26), y + r.randrange(3, 22)
        if cv.get(px_, py_)[3]: cv.px(px_, py_, g2 if r.random() < 0.5 else hexc('#2a6a30'))
    if kind == 1:
        for _ in range(4): cv.px(x + r.randrange(6, 22), y + r.randrange(4, 18), hexc('#f4a6c0'))

def bush(cv, tx, ty):
    x, y = tx * T, ty * T
    shadow(cv, x, y + 10, 16, 6, 60)
    cv.ellipse(x + 8, y + 9, 7, 5, hexc('#2f7d3a')); cv.ellipse(x + 6, y + 7, 4, 3, hexc('#3f9a48')); cv.ellipse(x + 11, y + 8, 4, 3, hexc('#3f9a48'))
    cv.px(x + 5, y + 6, hexc('#7acb6a')); cv.px(x + 6, y + 6, hexc('#7acb6a')); cv.px(x + 11, y + 11, hexc('#256b30'))

def rock(cv, tx, ty):
    x, y = tx * T, ty * T
    shadow(cv, x, y + 10, 16, 6, 60)
    cv.ellipse(x + 8, y + 9, 7, 5, C['stone_d']); cv.ellipse(x + 8, y + 8, 7, 5, C['stone']); cv.ellipse(x + 6, y + 6, 3, 2, C['stone_l'])

def fence(cv, tx, ty, grid):
    x, y = tx * T, ty * T
    cv.rect(x + 1, y + 6, 3, 10, C['wood']); cv.rect(x + 12, y + 6, 3, 10, C['wood']); cv.vline(x + 1, y + 6, 10, C['wood_l'])
    cv.px(x + 2, y + 5, C['wood_l']); cv.px(x + 13, y + 5, C['wood_l'])
    if grid.get((tx - 1, ty)) == 'f': cv.rect(x, y + 8, 2, 2, C['wood_d']); cv.rect(x, y + 12, 2, 2, C['wood_d'])
    cv.rect(x + 4, y + 8, 8, 2, C['wood_d']); cv.rect(x + 4, y + 12, 8, 2, C['wood_d'])
    if grid.get((tx - 1, ty)) == 'f': cv.rect(x, y + 8, 4, 2, C['wood_d']); cv.rect(x, y + 12, 4, 2, C['wood_d'])
    if grid.get((tx + 1, ty)) == 'f': cv.rect(x + 12, y + 8, 4, 2, C['wood_d']); cv.rect(x + 12, y + 12, 4, 2, C['wood_d'])

# ============ PROP DALAM RUANG ============
def table_top(cv, x, y, w, h, top=None):
    top = top or C['wood_l']
    cv.rect(x, y, w, h - 8, top); cv.hline(x, y, w, shade(top, 0.25)); cv.rect(x, y + h - 8, w, 4, C['wood']); cv.hline(x, y + h - 5, w, C['wood_dd'])
    for lx in (1, w - 4): cv.rect(x + lx, y + h - 4, 3, 4, C['wood_dd'])
    shadow(cv, x, y + h - 3, w, 5, 50)

def canting_table(cv, x, y):  # 3x2
    table_top(cv, x, y, 48, 32)
    cv.rect(x + 4, y + 3, 26, 15, hexc('#f4e8c8')); cv.frame(x + 4, y + 3, 26, 15, hexc('#d9c9a4'))
    for k in range(3):
        cv.line(x + 7, y + 6 + k * 4, x + 26, y + 6 + k * 4 + (1 if k % 2 else 0), hexc('#a8741a'))
    # canting
    cv.line(x + 34, y + 14, x + 42, y + 5, hexc('#5a3a22')); cv.rect(x + 33, y + 14, 3, 2, C['gold_d']); cv.px(x + 32, y + 16, hexc('#2a1a12'))
    # wajan malam
    cv.ellipse(x + 40, y + 12, 5, 3, hexc('#2f2f36')); cv.ellipse(x + 40, y + 11, 4, 2, hexc('#a8741a')); cv.px(x + 39, y + 11, hexc('#e6b84a'))
    cv.rect(x + 36, y + 14, 8, 2, hexc('#1c1c22'))

def dye_vats(cv, x, y):  # 4x2
    shadow(cv, x, y + 24, 64, 8, 60)
    cols = [hexc('#2b3a67'), hexc('#7a4a2a'), hexc('#b03a3a')]
    for i, c in enumerate(cols):
        cx = x + 10 + i * 21
        cv.rect(cx - 9, y + 12, 18, 16, C['wood_d']); cv.rect(cx - 9, y + 12, 18, 2, C['wood_l'])
        for k in range(-8, 9, 4): cv.vline(cx + k, y + 14, 14, C['wood_dd'])
        cv.hline(cx - 9, y + 18, 18, C['gold_d']); cv.hline(cx - 9, y + 24, 18, C['gold_d'])
        cv.ellipse(cx, y + 11, 9, 5, C['wood_dd']); cv.ellipse(cx, y + 11, 8, 4, c)
        cv.ellipse(cx - 2, y + 10, 3, 1, shade(c, 0.35))
    cv.line(x + 2, y + 2, x + 62, y + 2, C['wood_d']); cv.line(x + 2, y + 3, x + 62, y + 3, C['wood'])
    cv.rect(x + 2, y + 2, 2, 22, C['wood_d']); cv.rect(x + 60, y + 2, 2, 22, C['wood_d'])

def cloth_rack(cv, x, y):  # 4x2
    shadow(cv, x, y + 26, 64, 6, 55)
    cv.rect(x + 1, y + 1, 3, 31, C['wood_d']); cv.rect(x + 60, y + 1, 3, 31, C['wood_d']); cv.rect(x, y, 64, 3, C['wood']); cv.hline(x, y, 64, C['wood_l'])
    kinds = [('kawung', C['indigo'], hexc('#e8d9a8')), ('parang', hexc('#a33a2a'), hexc('#f3e8cb')), ('dots', hexc('#2f6f5a'), hexc('#e8d9a8')), ('parang', C['sogan'], hexc('#e9c88a'))]
    for i, (k, b, a) in enumerate(kinds):
        cloth(cv, x + 6 + i * 14, y + 3, 11, 24 + (i % 2) * 3, k, b, a)

def stove(cv, x, y):  # 2x2
    shadow(cv, x, y + 24, 32, 8, 60)
    cv.rect(x + 2, y + 14, 28, 16, hexc('#6a5a50')); cv.hline(x + 2, y + 14, 28, hexc('#8a786a')); cv.hline(x + 2, y + 29, 28, hexc('#3a302a'))
    cv.rect(x + 12, y + 20, 8, 7, hexc('#1c1410')); cv.px(x + 15, y + 24, hexc('#ff8a2a')); cv.px(x + 16, y + 23, hexc('#ffd24a')); cv.px(x + 16, y + 25, hexc('#ff8a2a'))
    cv.ellipse(x + 16, y + 11, 9, 4, hexc('#2f2f36')); cv.ellipse(x + 16, y + 10, 8, 3, hexc('#a8741a')); cv.ellipse(x + 14, y + 9, 3, 1, hexc('#e6b84a'))
    cv.rect(x + 7, y + 10, 2, 5, hexc('#1c1c22')); cv.rect(x + 23, y + 10, 2, 5, hexc('#1c1c22'))

def wall_cloth(cv, x, y, kind, base, accent, w=12, h=20):
    cv.hline(x - 1, y, w + 2, C['wood_dd']); cloth(cv, x, y + 1, w, h, kind, base, accent)

def shelf(cv, x, y, w=48):
    cv.rect(x, y + 12, w, 3, C['wood_d']); cv.hline(x, y + 12, w, C['wood_l'])
    cols = [hexc('#b5653a'), hexc('#e8d9a8'), hexc('#2b3a67'), hexc('#a33a2a'), hexc('#2f6f5a')]
    for i in range(0, w - 4, 6):
        c = cols[(i // 6) % 5]
        cv.rect(x + 2 + i, y + 4, 5, 8, c); cv.hline(x + 2 + i, y + 4, 5, shade(c, 0.3)); cv.rect(x + 3 + i, y + 3, 3, 1, shade(c, -0.2))

def kelir(cv, x, y):  # 10x3 = 160x48
    W, H = 160, 48
    cv.rect(x, y, W, H, C['wood_dd'])
    cv.rect(x + 2, y + 2, W - 4, H - 14, C['wood_d'])
    cv.rect(x + 6, y + 5, W - 12, H - 22, hexc('#f7e1a8'))
    # cahaya blencong
    for i in range(10):
        a = 150 - i * 14
        if a > 0: cv.ellipse(x + 80, y + 20, 70 - i * 5, 12 - i // 2, (255, 214, 120, a // 5 + 5))
    cv.ellipse(x + 80, y + 20, 34, 9, hexc('#fff0c4'))
    ink = hexc('#2a1a12')
    # gunungan (kayon) tengah
    for i in range(20):
        wd = int(8 * (1 - abs(i - 12) / 14.0)) + 2 if i > 3 else i + 1
        cv.hline(x + 80 - wd // 2, y + 6 + i, wd, ink)
    cv.vline(x + 80, y + 12, 8, hexc('#f7e1a8')); cv.px(x + 78, y + 17, hexc('#f7e1a8')); cv.px(x + 82, y + 17, hexc('#f7e1a8'))
    # tokoh kiri & kanan
    for cx, flip in ((44, 1), (116, -1)):
        cv.ellipse(x + cx, y + 11, 3, 3, ink); cv.rect(x + cx - 3, y + 14, 6, 11, ink); cv.rect(x + cx - 2, y + 7, 4, 2, ink)
        cv.px(x + cx + flip * 4, y + 12, ink); cv.px(x + cx + flip * 5, y + 11, ink)
        cv.line(x + cx + flip * 3, y + 16, x + cx + flip * 9, y + 22, ink)
        cv.px(x + cx - flip * 1, y + 11, hexc('#f7e1a8'))
    cv.ellipse(x + 80, y + 4, 2, 2, hexc('#ff8a2a'))
    # batang pisang
    cv.rect(x + 2, y + H - 12, W - 4, 10, hexc('#7fa85a')); cv.hline(x + 2, y + H - 12, W - 4, hexc('#a4cc7a'))
    for i in range(0, W - 4, 6): cv.vline(x + 4 + i, y + H - 10, 7, hexc('#5e8a40'))

def saron(cv, x, y):  # 3x1 = 48x16 ; tampak 3/4
    shadow(cv, x, y + 10, 48, 6, 55)
    cv.rect(x + 1, y + 4, 46, 11, C['wood_d']); cv.hline(x + 1, y + 4, 46, C['wood_l']); cv.hline(x + 1, y + 14, 46, C['wood_dd'])
    cv.rect(x + 2, y + 5, 44, 5, hexc('#7a2f22'))
    for i in range(7):
        bx = x + 3 + i * 6
        cv.rect(bx, y + 2, 5, 8, C['gold']); cv.vline(bx, y + 2, 8, C['gold_l']); cv.hline(bx, y + 9, 5, C['gold_d']); cv.px(bx + 2, y + 5, C['gold_d'])

def gong(cv, x, y):  # 2x3 = 32x48
    shadow(cv, x, y + 40, 32, 8, 60)
    cv.rect(x + 1, y + 2, 4, 44, C['wood_d']); cv.rect(x + 27, y + 2, 4, 44, C['wood_d']); cv.vline(x + 1, y + 2, 44, C['wood'])
    cv.rect(x, y, 32, 4, C['wood']); cv.hline(x, y, 32, C['wood_l'])
    cv.rect(x + 1, y + 42, 30, 4, C['wood_dd'])
    cv.ellipse(x + 16, y + 22, 12, 14, C['gold_d']); cv.ellipse(x + 16, y + 22, 11, 13, C['gold']); cv.ellipse(x + 16, y + 22, 7, 8, C['gold_l']) 
    cv.ellipse(x + 16, y + 22, 5, 6, C['gold_d']); cv.ellipse(x + 16, y + 22, 3, 3, C['gold'])
    cv.px(x + 12, y + 12, C['white']); cv.px(x + 11, y + 14, C['white'])
    cv.line(x + 16, y + 4, x + 16, y + 9, hexc('#a33a2a'))

def bonang(cv, x, y):  # 2x2
    shadow(cv, x, y + 24, 32, 8, 55)
    cv.rect(x + 1, y + 6, 30, 22, C['wood_d']); cv.hline(x + 1, y + 6, 30, C['wood_l']); cv.hline(x + 1, y + 27, 30, C['wood_dd'])
    cv.rect(x + 3, y + 8, 26, 17, hexc('#7a2f22'))
    for r_ in range(2):
        for i in range(4):
            cx, cy = x + 7 + i * 6, y + 11 + r_ * 8
            cv.ellipse(cx, cy, 3, 3, C['gold_d']); cv.ellipse(cx, cy - 0.5, 2.5, 2.5, C['gold']); cv.px(cx, cy - 1, C['gold_l'])

def puppet_chest(cv, x, y):  # 2x2
    shadow(cv, x, y + 24, 32, 8, 55)
    for i, c in enumerate([hexc('#e8b93c'), hexc('#c0392b'), hexc('#2f8a5a'), hexc('#2b3a67'), hexc('#e8b93c')]):
        cv.rect(x + 4 + i * 5, y + 0 + (i % 2) * 2, 3, 12, hexc('#2a1a12')); cv.rect(x + 3 + i * 5, y + 1 + (i % 2) * 2, 5, 4, c)
        cv.vline(x + 5 + i * 5, y + 12, 6, hexc('#5a3a22'))
    cv.rect(x + 1, y + 12, 30, 17, C['wood']); cv.hline(x + 1, y + 12, 30, C['wood_l']); cv.hline(x + 1, y + 28, 30, C['wood_dd'])
    cv.rect(x + 1, y + 12, 30, 3, C['wood_d']); cv.rect(x + 14, y + 16, 4, 5, C['gold']); cv.px(x + 15, y + 18, C['gold_d'])

def story_board(cv, x, y):  # 2x2
    shadow(cv, x, y + 26, 32, 6, 50)
    cv.rect(x + 2, y + 2, 28, 24, C['wood_d']); cv.frame(x + 2, y + 2, 28, 24, C['wood_dd'])
    cv.rect(x + 4, y + 4, 24, 20, hexc('#ecd9a8'))
    pan = [hexc('#a33a2a'), hexc('#2b3a67'), hexc('#2f6f5a'), hexc('#c78a2a')]
    for i in range(4):
        px_, py_ = x + 6 + (i % 2) * 11, y + 6 + (i // 2) * 9
        cv.rect(px_, py_, 9, 7, pan[i]); cv.px(px_ + 4, py_ + 3, hexc('#f3e8cb')); cv.px(px_ + 3, py_ + 3, hexc('#f3e8cb'))
    cv.rect(x + 4, y + 26, 3, 6, C['wood_d']); cv.rect(x + 25, y + 26, 3, 6, C['wood_d'])

def display_case(cv, x, y, variant=0):  # 2x2
    shadow(cv, x, y + 26, 32, 6, 55)
    cv.rect(x + 1, y + 18, 30, 12, C['wood_d']); cv.hline(x + 1, y + 18, 30, C['wood_l']); cv.hline(x + 1, y + 29, 30, C['wood_dd'])
    cv.rect(x + 1, y + 2, 30, 17, hexc('#a9d6ee')); cv.frame(x + 1, y + 2, 30, 17, hexc('#e8e2d4'))
    cv.rect(x + 3, y + 12, 26, 6, hexc('#8a1f2c'))
    ink = hexc('#2a1a12')
    # keris: bilah berluk + hulu emas
    pts = [(6, 15), (9, 13), (12, 15), (15, 13), (18, 15), (21, 13), (24, 14)]
    for i in range(len(pts) - 1):
        cv.line(x + pts[i][0], y + pts[i][1], x + pts[i + 1][0], y + pts[i + 1][1], hexc('#c9ccd2'))
        cv.line(x + pts[i][0], y + pts[i][1] + 1, x + pts[i + 1][0], y + pts[i + 1][1] + 1, hexc('#8a8d96'))
    cv.rect(x + 3, y + 12, 4, 4, C['gold']); cv.px(x + 4, y + 13, C['gold_d'])
    cv.px(x + 8, y + 5, C['white']); cv.px(x + 9, y + 6, C['white']); cv.px(x + 22, y + 7, C['white'])
    cv.vline(x + 30, y + 2, 17, hexc('#d8d2c4'))

def rope_barrier(cv, x, y, n=3):
    for i in (0, n * 16 - 4):
        cv.rect(x + i + 1, y + 4, 2, 11, C['gold_d']); cv.ellipse(x + i + 2, y + 4, 3, 2, C['gold']); cv.rect(x + i - 1, y + 14, 6, 2, C['gold_d'])
    for k in range(4, n * 16 - 4):
        cv.px(x + k + 2, y + 6 + int(2 * ((k - n * 8) / (n * 8.0)) ** 2) , hexc('#b03a3a'))
        cv.px(x + k + 2, y + 7 + int(2 * ((k - n * 8) / (n * 8.0)) ** 2) , hexc('#7d2424'))

def notice_board(cv, x, y):  # 2x1 pada dinding
    cv.rect(x, y, 32, 18, C['wood_dd']); cv.rect(x + 1, y + 1, 30, 16, hexc('#e8d9a8'))
    for i in range(3):
        cv.px(x + 4, y + 4 + i * 4, hexc('#2f8a5a')); cv.hline(x + 6, y + 4 + i * 4, 14, hexc('#6a5a40'))
        cv.px(x + 23, y + 4 + i * 4, hexc('#c0392b')); cv.hline(x + 25, y + 4 + i * 4, 4, hexc('#6a5a40'))

def chalkboard(cv, x, y):  # 5x2 = 80x32
    cv.rect(x, y, 80, 30, C['wood_d']); cv.frame(x, y, 80, 30, C['wood_dd'])
    cv.rect(x + 3, y + 3, 74, 22, hexc('#2f5a48')); cv.hline(x + 3, y + 3, 74, hexc('#3f7a60'))
    ch = hexc('#f2efe6')
    for i, s in enumerate((0, 1, 2, 3, 4, 5, 6)):
        bx = x + 8 + i * 10
        cv.line(bx, y + 8, bx + 3, y + 8, ch); cv.line(bx + 3, y + 8, bx + 3, y + 12, ch); cv.line(bx, y + 12, bx + 3, y + 12, ch); cv.px(bx - 1, y + 10, ch)
        cv.line(bx + 1, y + 16, bx + 5, y + 16, ch); cv.px(bx + 3, y + 18, ch); cv.px(bx + 4, y + 19, ch)
    cv.rect(x + 3, y + 25, 74, 3, C['wood_l']); cv.rect(x + 10, y + 25, 5, 2, ch); cv.rect(x + 60, y + 25, 4, 2, hexc('#e8625a'))

def desk(cv, x, y):  # 2x1
    shadow(cv, x, y + 10, 32, 6, 50)
    cv.rect(x + 1, y + 3, 30, 8, C['wood_l']); cv.hline(x + 1, y + 3, 30, shade(C['wood_l'], 0.25)); cv.hline(x + 1, y + 10, 30, C['wood_dd'])
    cv.rect(x + 3, y + 11, 3, 5, C['wood_dd']); cv.rect(x + 26, y + 11, 3, 5, C['wood_dd'])
    cv.rect(x + 5, y + 4, 8, 5, hexc('#e8d9a8')); cv.vline(x + 9, y + 4, 5, hexc('#a89a74')); cv.rect(x + 18, y + 5, 8, 4, hexc('#2f6f5a')); cv.px(x + 19, y + 6, hexc('#e8d9a8'))

def bookshelf_big(cv, x, y):  # 3x2
    cv.rect(x, y, 48, 32, C['wood_d']); cv.frame(x, y, 48, 32, C['wood_dd'])
    for r_ in range(3):
        yy = y + 2 + r_ * 10
        cv.rect(x + 2, yy, 44, 8, hexc('#3a2418'))
        cols = [hexc('#b5653a'), hexc('#e8d9a8'), hexc('#2b3a67'), hexc('#a33a2a'), hexc('#2f6f5a'), hexc('#c78a2a')]
        i = 0; bx = x + 3
        while bx < x + 44:
            w_ = 3 + (i * 7 % 3); c = cols[i % 6]
            cv.rect(bx, yy + 1 + (i % 2), w_, 7 - (i % 2), c); cv.vline(bx, yy + 1 + (i % 2), 7 - (i % 2), shade(c, 0.25)); bx += w_ + 1; i += 1
        cv.hline(x + 2, yy + 8, 44, C['wood_l'])

def kursi_mbah(cv, x, y):  # 2x1
    shadow(cv, x, y + 10, 32, 6, 50)
    cv.rect(x + 2, y + 0, 28, 6, C['wood_d']); cv.rect(x + 3, y + 1, 26, 4, hexc('#7a4a8c'))
    cv.rect(x + 2, y + 6, 28, 8, C['wood']); cv.rect(x + 3, y + 6, 26, 5, hexc('#9a62ae')); cv.hline(x + 2, y + 13, 28, C['wood_dd'])
    cv.px(x + 6, y + 8, hexc('#e8d9a8')); cv.px(x + 12, y + 8, hexc('#e8d9a8')); cv.px(x + 18, y + 8, hexc('#e8d9a8')); cv.px(x + 24, y + 8, hexc('#e8d9a8'))

def tea_table(cv, x, y):
    shadow(cv, x, y + 10, 16, 5, 50)
    cv.ellipse(x + 8, y + 8, 7, 4, C['wood_l']); cv.ellipse(x + 8, y + 7, 7, 4, shade(C['wood_l'], 0.2)); cv.rect(x + 7, y + 10, 2, 5, C['wood_dd'])
    cv.rect(x + 6, y + 4, 4, 3, hexc('#fbf7ec')); cv.px(x + 10, y + 5, hexc('#fbf7ec')); cv.px(x + 7, y + 4, hexc('#8a4a22'))

def globe_stand(cv, x, y):
    shadow(cv, x, y + 10, 16, 5, 50)
    cv.rect(x + 7, y + 9, 2, 5, C['wood_dd']); cv.rect(x + 4, y + 14, 8, 2, C['wood_d'])
    cv.ellipse(x + 8, y + 6, 5, 5, hexc('#3f8fc6')); cv.ellipse(x + 6, y + 5, 2, 2, hexc('#5cb85c')); cv.ellipse(x + 10, y + 8, 2, 1, hexc('#5cb85c')); cv.px(x + 6, y + 3, C['white'])

def plant_big(cv, x, y):
    cv.rect(x + 3, y + 18, 10, 8, hexc('#b5653a')); cv.hline(x + 2, y + 18, 12, hexc('#d98558')); cv.hline(x + 4, y + 25, 8, hexc('#7a3f22'))
    for dx, dy, rx, ry, c in ((8, 12, 5, 6, C['grass_d']), (4, 14, 4, 5, C['grass']), (12, 14, 4, 5, C['grass']), (8, 7, 4, 5, C['grass_l']), (5, 9, 3, 4, C['grass'])):
        cv.ellipse(x + dx, y + dy, rx, ry, c)
    shadow(cv, x, y + 24, 16, 6, 50)

def banner_wall(cv, x, y, base=hexc('#9b2f3a')):
    cv.hline(x, y, 12, C['gold_d']); cv.rect(x + 1, y + 1, 10, 22, base); cv.vline(x + 1, y + 1, 22, shade(base, 0.2))
    for k in range(3): cv.px(x + 5, y + 5 + k * 5, C['gold']); cv.px(x + 6, y + 6 + k * 5, C['gold']); cv.px(x + 4, y + 6 + k * 5, C['gold'])
    cv.px(x + 5, y + 23, base); cv.px(x + 6, y + 23, base)

def pedestal(cv, x, y, item='vase'):
    shadow(cv, x, y + 12, 16, 5, 50)
    cv.rect(x + 3, y + 8, 10, 8, hexc('#e2dccd')); cv.hline(x + 2, y + 8, 12, C['white']); cv.hline(x + 2, y + 15, 12, C['stone'])
    if item == 'vase':
        cv.ellipse(x + 8, y + 4, 3, 4, hexc('#2b3a67')); cv.px(x + 7, y + 2, hexc('#7ea0e0')); cv.hline(x + 6, y + 1, 4, hexc('#2b3a67'))
    else:
        cv.ellipse(x + 8, y + 4, 4, 3, C['gold']); cv.px(x + 7, y + 3, C['gold_l'])

def mat(cv, x, y, w=2, h=1, col=hexc('#c78a2a')):
    cv.rect(x, y, w * 16, h * 16, col); cv.frame(x, y, w * 16, h * 16, shade(col, -0.3))
    for i in range(3, w * 16, 4): cv.vline(x + i, y + 2, h * 16 - 4, shade(col, -0.12))

def katalog_table(cv, x, y):  # 3x2
    table_top(cv, x, y, 48, 32, hexc('#a9743d'))
    cv.rect(x + 4, y + 4, 12, 9, hexc('#e8d9a8')); cv.vline(x + 10, y + 4, 9, hexc('#a89a74'))
    cv.rect(x + 20, y + 3, 10, 8, hexc('#2f6f5a')); cv.rect(x + 21, y + 4, 8, 1, hexc('#e8d9a8'))
    cv.ellipse(x + 38, y + 8, 4, 4, hexc('#cfe8f5')); cv.frame(x + 34, y + 4, 8, 8, C['gold_d']) if False else None
    cv.ellipse(x + 38, y + 8, 3, 3, hexc('#e8f4fb')); cv.line(x + 41, y + 11, x + 45, y + 14, C['wood_dd'])

def jar_set(cv, x, y):
    for i, c in enumerate((hexc('#b5653a'), hexc('#2b3a67'), hexc('#a33a2a'))):
        cv.ellipse(x + 3 + i * 5, y + 8, 2, 3, c); cv.px(x + 2 + i * 5, y + 6, shade(c, 0.4))
