from px import *
from tiles import C
from PIL import Image

INK = hexc('#241610')

def shadow_enemy(frame):
    cv = Canvas(18, 20)
    body = hexc('#3b2a5a'); body_l = hexc('#5a4486'); body_d = hexc('#241838')
    cv.ellipse(9, 9, 7, 7, body)
    cv.rect(2, 9, 14, 7, body)
    # kaki bergelombang
    for i, x in enumerate(range(2, 16, 3)):
        h = 3 if (i + frame) % 2 == 0 else 1
        cv.rect(x, 16, 3, h, body)
    cv.hline(3, 5, 5, body_l); cv.px(4, 4, body_l); cv.px(5, 3, body_l)
    cv.rect(4, 11, 10, 2, body_d)
    # mata
    cv.rect(5, 8, 3, 3, hexc('#ffd24a')); cv.rect(10, 8, 3, 3, hexc('#ffd24a'))
    cv.px(6, 9, INK); cv.px(11, 9, INK)
    cv.line(4, 6, 7, 7, hexc('#1a0f2a')); cv.line(14, 6, 11, 7, hexc('#1a0f2a'))
    cv.rect(7, 13, 4, 1, hexc('#ffd24a'))
    cv.px(8, 14, INK)
    # asap kecil
    cv.px(1, 7 + frame, hexc('#6a5aa0')); cv.px(16, 5 + frame, hexc('#6a5aa0'))
    cv.outline(hexc('#120a1c'))
    return cv

def boss(hurt=False, scale=1):
    cv = Canvas(52, 56)
    body = hexc('#2f2150') if not hurt else hexc('#c8bde6')
    body_l = hexc('#4d3a7e') if not hurt else hexc('#ece6fa')
    body_d = hexc('#1b1233') if not hurt else hexc('#a89cd0')
    cv.ellipse(26, 26, 20, 20, body)
    cv.rect(6, 26, 40, 20, body)
    for i, x in enumerate(range(6, 46, 7)):
        h = 8 if i % 2 == 0 else 4
        cv.rect(x, 46, 7, h, body)
        cv.px(x + 3, 46 + h, body_d)
    cv.ellipse(18, 16, 8, 6, body_l)
    # tanduk / mahkota pecahan emas
    gold = C['gold'] if not hurt else hexc('#fff0b0')
    for (x, h) in ((12, 8), (20, 12), (26, 14), (32, 12), (40, 8)):
        for k in range(h):
            cv.hline(x - (h - k) // 4, 6 - k + 8, (h - k) // 2 + 1, gold) if False else None
    for (x, h) in ((12, 7), (19, 10), (26, 13), (33, 10), (40, 7)):
        for k in range(h):
            w = max(1, (h - k) // 3 + 1)
            cv.hline(x - w // 2, 10 - k + 2, w, gold)
    cv.hline(10, 12, 33, shade(gold, -0.25))
    # mata besar
    for ex in (16, 33):
        cv.rect(ex, 20, 8, 7, hexc('#ffd24a')); cv.rect(ex + 1, 21, 6, 5, hexc('#fff1a0') if not hurt else C['white'])
        cv.rect(ex + 3, 22, 3, 4, INK)
        cv.line(ex - 2, 17, ex + 8, 19 if ex < 25 else 17, hexc('#120a1c')) if False else None
    cv.line(13, 17, 24, 20, hexc('#120a1c')); cv.line(14, 18, 24, 21, hexc('#120a1c'))
    cv.line(40, 17, 29, 20, hexc('#120a1c')); cv.line(39, 18, 29, 21, hexc('#120a1c'))
    # mulut bergerigi
    cv.rect(15, 34, 22, 8, hexc('#120a1c'))
    for i in range(6): cv.rect(16 + i * 3, 34, 2, 3, C['white']); cv.rect(17 + i * 3, 39, 2, 3, C['white'])
    # pola batik pudar di dada
    for yy in range(44, 52, 4):
        for xx in range(10, 44, 6):
            cv.px(xx, yy, body_l); cv.px(xx + 1, yy, body_l)
    # lengan
    cv.ellipse(5, 36, 4, 8, body); cv.ellipse(47, 36, 4, 8, body)
    cv.outline(hexc('#0e0818'))
    return cv

def flower(frame):
    cv = Canvas(16, 18)
    g = C['gold']; gl = C['gold_l']; gd = C['gold_d']
    cx, cy = 8, 9 - frame
    for dx, dy in ((0, -3), (3, -1), (2, 3), (-2, 3), (-3, -1)):
        cv.ellipse(cx + dx, cy + dy, 2.5, 2.5, g)
    cv.ellipse(cx, cy, 2, 2, hexc('#fff2b0')); cv.px(cx, cy, hexc('#e86a3a'))
    cv.px(cx - 1, cy - 3, gl); cv.px(cx + 3, cy - 1, gl)
    for (x, y) in ((2, 3 + frame), (13, 4), (3, 13), (13, 12 + frame)):
        cv.px(x, y, C['white']); cv.px(x - 1, y, hexc('#fff2b0')); cv.px(x + 1, y, hexc('#fff2b0')); cv.px(x, y - 1, hexc('#fff2b0')); cv.px(x, y + 1, hexc('#fff2b0'))
    cv.outline(hexc('#7a4f0f'))
    return cv

# ---- Wayang kulit mini (profil menghadap kanan), 30x44 ----
def puppet(kind):
    cv = Canvas(34, 48)
    ink = hexc('#241610'); gold = C['gold']; goldd = C['gold_d']
    face = hexc('#f0d9a8')
    P = dict(
        semar=dict(w=15, h=14, nose=2, belly=8, hair='kuncung', skin=hexc('#e9dcc0'), cloth=hexc('#3a2418'), crown=False),
        gareng=dict(w=11, h=10, nose=3, belly=4, hair='plain', skin=hexc('#e8d3a0'), cloth=hexc('#3a2418'), crown=False),
        petruk=dict(w=8, h=17, nose=6, belly=2, hair='kuncung', skin=hexc('#e2c690'), cloth=hexc('#3a2418'), crown=False),
        bagong=dict(w=13, h=11, nose=2, belly=6, hair='plain', skin=hexc('#e9dcc0'), cloth=hexc('#3a2418'), crown=False),
        arjuna=dict(w=9, h=17, nose=4, belly=0, hair='crown', skin=hexc('#f0d9a8'), cloth=hexc('#241610'), crown=True),
        bima=dict(w=13, h=15, nose=4, belly=3, hair='crown', skin=hexc('#e0c08a'), cloth=hexc('#241610'), crown=True),
    )[kind]
    cx = 14
    # kaki & kain
    body_w = P['w']
    top = 17
    cv.rect(cx - body_w // 2, top, body_w, 15, P['cloth'])
    if P['belly']:
        cv.ellipse(cx, top + 8, body_w // 2 + P['belly'] // 3, 7, P['cloth'])
    # kain bawah dengan segitiga emas
    for i in range(0, body_w, 3):
        cv.px(cx - body_w // 2 + i + 1, top + 12, gold); cv.px(cx - body_w // 2 + i + 1, top + 13, goldd)
    cv.hline(cx - body_w // 2, top + 9, body_w, gold)
    cv.rect(cx - body_w // 2 + 1, top + 15, 4, 8, P['cloth']); cv.rect(cx + 1, top + 15, 4, 8, P['cloth'])
    cv.rect(cx - body_w // 2 + 3, top + 22, 4, 2, P['cloth']); cv.rect(cx + 1, top + 22, 5, 2, P['cloth'])
    # lengan panjang ke depan
    cv.line(cx + 2, top + 3, cx + 11, top + 12, P['cloth']); cv.line(cx + 3, top + 3, cx + 12, top + 12, P['cloth'])
    cv.rect(cx + 11, top + 12, 3, 2, P['skin'])
    cv.px(cx + 6, top + 6, gold); cv.px(cx + 9, top + 9, gold)
    # leher & kepala (profil)
    cv.rect(cx - 1, top - 3, 3, 4, P['skin'])
    hx = cx - 3; hy = top - 12
    cv.rect(hx, hy, 8, 10, P['skin'])
    cv.rect(hx + 8, hy + 4, P['nose'], 2, P['skin'])  # hidung
    cv.px(hx + 8 + P['nose'] - 1, hy + 6, P['skin'])
    cv.px(hx + 6, hy + 4, ink); cv.px(hx + 7, hy + 4, ink)   # mata
    cv.px(hx + 7, hy + 8, hexc('#b0503f'))
    if P['hair'] == 'kuncung':
        cv.rect(hx, hy - 2, 8, 3, ink); cv.line(hx + 2, hy - 2, hx + 1, hy - 7, ink); cv.px(hx + 1, hy - 8, ink); cv.px(hx + 2, hy - 7, ink)
        cv.px(hx + 4, hy - 3, goldd)
    elif P['hair'] == 'plain':
        cv.rect(hx - 1, hy - 2, 9, 3, ink); cv.rect(hx - 1, hy - 2, 3, 10, ink)
    else:
        cv.rect(hx - 1, hy - 1, 10, 3, ink); cv.rect(hx - 1, hy - 1, 3, 12, ink)
        # mahkota
        cv.rect(hx, hy - 5, 8, 4, gold); cv.hline(hx, hy - 2, 8, goldd)
        for k in range(4): cv.px(hx + 1 + k * 2, hy - 6, gold)
        cv.px(hx + 3, hy - 8, gold); cv.px(hx + 4, hy - 7, gold)
        cv.line(hx - 2, hy + 1, hx - 4, hy + 8, gold)
    # rim emas pada siluet
    cv.outline(ink)
    return cv

def make_items(outdir):
    # musuh 2 frame
    sheet = Image.new('RGBA', (18 * 2 * 3, 20 * 3), (0, 0, 0, 0))
    for f in range(2):
        e = shadow_enemy(f).im.resize((18 * 3, 20 * 3), Image.NEAREST); sheet.paste(e, (f * 54, 0))
    sheet.save(f'{outdir}/enemy_shadow.png')
    boss(False).save(f'{outdir}/boss.png', 4); boss(True).save(f'{outdir}/boss_hurt.png', 4)
    sh = Image.new('RGBA', (16 * 2 * 3, 18 * 3), (0, 0, 0, 0))
    for f in range(2): sh.paste(flower(f).im.resize((48, 54), Image.NEAREST), (f * 48, 0))
    sh.save(f'{outdir}/item_flower.png')
    for k in ('semar', 'gareng', 'petruk', 'bagong', 'arjuna', 'bima'):
        puppet(k).save(f'{outdir}/puppet_{k}.png', 4)

if __name__ == '__main__':
    import sys
    make_items(sys.argv[1])
