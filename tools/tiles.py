from px import *
import random

T = 16
C = dict(
    grass=hexc('#5aa84a'), grass_d=hexc('#4a9440'), grass_l=hexc('#72bd5a'), grass_dd=hexc('#3d8037'),
    path=hexc('#dcc48e'), path_d=hexc('#c9ae76'), path_l=hexc('#e9d6a6'), path_e=hexc('#b39560'),
    water=hexc('#3f8fc6'), water_d=hexc('#2f77ad'), water_l=hexc('#7ec0e6'), water_ll=hexc('#bfe3f5'),
    wood=hexc('#8f5c2e'), wood_l=hexc('#aa7640'), wood_d=hexc('#5f3b1c'), wood_dd=hexc('#442a14'),
    cream=hexc('#f3e8cb'), cream_d=hexc('#d9c9a4'), white=hexc('#fbf7ec'),
    roof=hexc('#b04a30'), roof_d=hexc('#80301e'), roof_l=hexc('#cf6644'),
    gold=hexc('#e8b93c'), gold_d=hexc('#b98a1c'), gold_l=hexc('#f7de7a'),
    stone=hexc('#a7a39b'), stone_d=hexc('#807c75'), stone_l=hexc('#cbc7be'),
    red=hexc('#b03a3a'), red_d=hexc('#7d2424'), green=hexc('#2f8a5a'),
    indigo=hexc('#2b3a67'), sogan=hexc('#6b4423'), black=hexc('#1c1410'), out=hexc('#2a1a12'),
)

def rr(x, y, seed=0):
    return random.Random((x * 73856093) ^ (y * 19349663) ^ seed)

def tile_grass(cv, tx, ty, flowers=False):
    r = rr(tx, ty)
    x0, y0 = tx * T, ty * T
    cv.rect(x0, y0, T, T, C['grass'])
    for _ in range(14):
        cv.px(x0 + r.randrange(T), y0 + r.randrange(T), C['grass_d'])
    for _ in range(7):
        cv.px(x0 + r.randrange(T), y0 + r.randrange(T), C['grass_l'])
    for _ in range(2):
        x, y = x0 + r.randrange(2, T - 2), y0 + r.randrange(3, T - 1)
        cv.px(x, y, C['grass_dd']); cv.px(x - 1, y - 1, C['grass_dd']); cv.px(x + 1, y - 1, C['grass_dd'])
    if flowers:
        cols = [hexc('#fbf7ec'), hexc('#f4a6c0'), hexc('#f7de5a'), hexc('#e86a6a')]
        for _ in range(r.randrange(2, 4)):
            x, y = x0 + r.randrange(1, T - 1), y0 + r.randrange(1, T - 1)
            c = r.choice(cols)
            cv.px(x, y, c); cv.px(x + 1, y, shade(c, -0.1)); cv.px(x, y + 1, hexc('#3d8037'))

def tile_path(cv, tx, ty, grid, kind='path'):
    r = rr(tx, ty, 5)
    x0, y0 = tx * T, ty * T
    base, dk, lt, ed = (C['path'], C['path_d'], C['path_l'], C['path_e'])
    if kind == 'marble':
        base, dk, lt, ed = hexc('#e6dfcf'), hexc('#cfc6b2'), hexc('#f6f1e4'), hexc('#a89f8a')
    cv.rect(x0, y0, T, T, base)
    if kind == 'marble':
        for i in (0, 8):
            cv.hline(x0, y0 + i, T, dk); cv.vline(x0 + i, y0, T, dk)
        if (tx + ty) % 2 == 0:
            cv.rect(x0 + 1, y0 + 1, 7, 7, lt); cv.rect(x0 + 9, y0 + 9, 7, 7, lt)
        for _ in range(4):
            cv.px(x0 + r.randrange(T), y0 + r.randrange(T), dk)
    else:
        for _ in range(10):
            x, y = x0 + r.randrange(1, T - 3), y0 + r.randrange(1, T - 2)
            cv.hline(x, y, 2, dk)
        for _ in range(8):
            cv.px(x0 + r.randrange(T), y0 + r.randrange(T), lt)
    def is_p(x, y):
        return grid.get((x, y)) in ('=', 'M', 'b', 'D', 'E')
    if not is_p(tx, ty - 1): cv.hline(x0, y0, T, ed); cv.hline(x0, y0 + 1, T, shade(ed, 0.2))
    if not is_p(tx, ty + 1): cv.hline(x0, y0 + T - 1, T, ed)
    if not is_p(tx - 1, ty): cv.vline(x0, y0, T, ed)
    if not is_p(tx + 1, ty): cv.vline(x0 + T - 1, y0, T, ed)

def tile_water(cv, tx, ty, grid):
    r = rr(tx, ty, 9)
    x0, y0 = tx * T, ty * T
    cv.rect(x0, y0, T, T, C['water'])
    for k in range(3):
        x, y = x0 + r.randrange(1, T - 5), y0 + 2 + k * 5 + r.randrange(2)
        cv.hline(x, y, 4, C['water_l']); cv.px(x + 4, y + 1, C['water_l'])
    for _ in range(5):
        cv.px(x0 + r.randrange(T), y0 + r.randrange(T), C['water_d'])
    def is_w(x, y):
        return grid.get((x, y)) in ('~', 'b')
    if not is_w(tx, ty - 1): cv.hline(x0, y0, T, C['water_l']); cv.hline(x0, y0 + 1, T, shade(C['water'], 0.15))
    if not is_w(tx, ty + 1): cv.hline(x0, y0 + T - 1, T, C['water_d'])

def tile_bridge(cv, tx, ty, grid):
    x0, y0 = tx * T, ty * T
    tile_water(cv, tx, ty, grid)
    cv.rect(x0 + 1, y0, T - 2, T, C['wood'])
    for i in range(0, T, 4):
        cv.hline(x0 + 1, y0 + i, T - 2, C['wood_d']); cv.hline(x0 + 1, y0 + i + 1, T - 2, C['wood_l'])
    cv.vline(x0, y0, T, C['wood_dd']); cv.vline(x0 + T - 1, y0, T, C['wood_dd'])
    cv.vline(x0 + 1, y0, T, C['wood_d']); cv.vline(x0 + T - 2, y0, T, C['wood_d'])

def tile_floor(cv, tx, ty, kind='F'):
    r = rr(tx, ty, 3)
    x0, y0 = tx * T, ty * T
    if kind == 'F':
        base, d, l = hexc('#b9824a'), hexc('#9b6a38'), hexc('#c99560')
    elif kind == 'S':  # panggung
        base, d, l = hexc('#8a4f2a'), hexc('#6e3c1e'), hexc('#a4663a')
    elif kind == 'L':  # lantai kelas
        base, d, l = hexc('#c9b78a'), hexc('#b3a074'), hexc('#dccc9f')
    elif kind == 'G':  # lantai museum marmer
        base, d, l = hexc('#d9d3c6'), hexc('#bfb8a8'), hexc('#ece7dc')
    cv.rect(x0, y0, T, T, base)
    if kind in ('F', 'S'):
        for i in (0, 5, 10):
            cv.hline(x0, y0 + i, T, d)
            sx = x0 + r.randrange(3, 13)
            cv.vline(sx, y0 + i + 1, 4, d)
        for _ in range(6): cv.px(x0 + r.randrange(T), y0 + r.randrange(T), l)
    elif kind == 'L':
        cv.hline(x0, y0, T, d); cv.vline(x0, y0, T, d)
        for _ in range(6): cv.px(x0 + r.randrange(T), y0 + r.randrange(T), l)
    else:
        cv.hline(x0, y0, T, d); cv.vline(x0, y0, T, d)
        if (tx + ty) % 2 == 0: cv.rect(x0 + 1, y0 + 1, T - 1, T - 1, l)
        for _ in range(3): cv.px(x0 + r.randrange(T), y0 + r.randrange(T), d)

def tile_carpet(cv, tx, ty, kind='K'):
    x0, y0 = tx * T, ty * T
    if kind == 'K':
        base, d, g = hexc('#8f2f2f'), hexc('#6e2020'), C['gold']
    elif kind == 'R':
        base, d, g = hexc('#7d2832'), hexc('#5d1b24'), C['gold']
    else:
        base, d, g = hexc('#2b3a67'), hexc('#1f2b4f'), hexc('#e8d9a8')
    cv.rect(x0, y0, T, T, base)
    cv.frame(x0, y0, T, T, d)
    # motif kawung kecil
    cx, cy = x0 + 8, y0 + 8
    for dx, dy in ((0, -3), (0, 3), (-3, 0), (3, 0)):
        cv.ellipse(cx + dx, cy + dy, 2, 2, g)
        cv.px(cx + dx, cy + dy, base)
    cv.px(cx, cy, g)

def tile_wall(cv, tx, ty, grid, theme='cream'):
    x0, y0 = tx * T, ty * T
    up = grid.get((tx, ty - 1))
    if theme == 'cream': face, fd, fl = hexc('#efe0bd'), hexc('#d8c59a'), hexc('#faf0d6')
    elif theme == 'stone': face, fd, fl = hexc('#cfc9bb'), hexc('#aaa393'), hexc('#e4dfd2')
    elif theme == 'blue': face, fd, fl = hexc('#cdd8e6'), hexc('#a7b5c9'), hexc('#e6edf5')
    cv.rect(x0, y0, T, T, face)
    if up in ('W', None) or up == ' ':
        # bagian atas dinding (di bawah cap)
        cv.hline(x0, y0, T, fl)
        if theme == 'stone':
            for i in (5, 10): cv.hline(x0, y0 + i, T, fd)
            cv.vline(x0 + 4 + (ty % 2) * 4, y0, 5, fd); cv.vline(x0 + 12 - (ty % 2) * 4, y0 + 5, 5, fd)
    else:
        # bagian bawah dinding: panel kayu
        cv.rect(x0, y0 + 8, T, 8, C['wood'])
        cv.hline(x0, y0 + 8, T, C['wood_l']); cv.hline(x0, y0 + 15, T, C['wood_dd'])
        for i in range(0, T, 4): cv.vline(x0 + i, y0 + 9, 6, C['wood_d'])
        cv.hline(x0, y0 + 7, T, fd)

def tile_wallcap(cv, tx, ty):
    x0, y0 = tx * T, ty * T
    cv.rect(x0, y0, T, T, hexc('#4a2f1c'))
    cv.hline(x0, y0 + 13, T, hexc('#2b1a0f')); cv.hline(x0, y0 + 14, T, hexc('#6a4529')); cv.hline(x0, y0 + 15, T, hexc('#8f6038'))
    for _ in range(5): cv.px(x0 + (tx * 7 + _ * 5) % T, y0 + (_ * 3) % 12, hexc('#5a3a22'))

def tile_bottomwall(cv, tx, ty):
    x0, y0 = tx * T, ty * T
    cv.rect(x0, y0, T, T, hexc('#4a2f1c'))
    cv.hline(x0, y0, T, hexc('#8f6038')); cv.hline(x0, y0 + 1, T, hexc('#6a4529'))
    cv.hline(x0, y0 + 2, T, hexc('#2b1a0f'))

def tile_door(cv, tx, ty, interior=True):
    x0, y0 = tx * T, ty * T
    cv.rect(x0, y0, T, T, hexc('#4a2f1c'))
    cv.rect(x0 + 1, y0, T - 2, T, hexc('#7a4f2a'))
    cv.rect(x0 + 2, y0 + 1, T - 4, T - 2, hexc('#8f6038'))
    cv.vline(x0 + 8, y0 + 1, T - 2, hexc('#4a2f1c'))
    cv.px(x0 + 6, y0 + 8, C['gold']); cv.px(x0 + 10, y0 + 8, C['gold'])
