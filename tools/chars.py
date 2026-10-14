from px import *
from PIL import Image

OUT = hexc('#2a1a12')
CW, CH = 18, 26   # sel sprite native
SKINS = {'light': hexc('#f2c9a0'), 'tan': hexc('#d9a574'), 'brown': hexc('#b9825a')}

def draw_char(direction, frame, o):
    """o: dict skin, hair, hairstyle, top, top2, bottom, shoes, hat, pattern, beard, glasses, hijab"""
    cv = Canvas(CW, CH)
    ox, oy = 1, 1
    skin = o['skin']; hair = o['hair']; top = o['top']; bottom = o['bottom']
    top_d = shade(top, -0.25); top_l = shade(top, 0.2)
    skin_d = shade(skin, -0.15)
    shoes = o.get('shoes', hexc('#4a2e1c'))
    step = 0 if frame == 0 else (1 if frame == 1 else -1)
    side = direction in ('left', 'right')
    back = direction == 'up'

    # ---- kaki ----
    ly = oy + 17
    if side:
        lf = ly + (1 if step == 1 else 0); lb = ly + (1 if step == -1 else 0)
        cv.rect(ox + 6, ly, 3, 5 - (1 if step == 1 else 0), bottom); cv.rect(ox + 6, ly + 4, 3, 1, shoes) if step != 1 else None
        cv.rect(ox + 7, ly, 3, 5 - (1 if step == -1 else 0), shade(bottom, -0.12)); cv.rect(ox + 7, ly + 4, 3, 1, shoes) if step != -1 else None
        if step == 1:
            cv.rect(ox + 5, ly + 3, 3, 2, bottom); cv.rect(ox + 5, ly + 4, 3, 1, shoes)
        if step == -1:
            cv.rect(ox + 8, ly + 3, 3, 2, shade(bottom, -0.12)); cv.rect(ox + 8, ly + 4, 3, 1, shoes)
    else:
        lu = 1 if step == 1 else 0; ru = 1 if step == -1 else 0
        cv.rect(ox + 5, ly, 3, 5 - lu, bottom); cv.rect(ox + 5, ly + 4 - lu, 3, 1, shoes)
        cv.rect(ox + 8, ly, 3, 5 - ru, bottom); cv.rect(ox + 8, ly + 4 - ru, 3, 1, shoes)
        cv.vline(ox + 8, ly, 4, shade(bottom, -0.25))

    # ---- badan ----
    by = oy + 10
    skirt = o.get('skirt')
    if side:
        cv.rect(ox + 5, by, 6, 8, top)
        cv.vline(ox + 5, by, 8, top_d)
        # lengan
        arm_off = step
        cv.rect(ox + 6, by + 1 + (1 if arm_off == 1 else 0), 3, 5, top_d)
        cv.rect(ox + 6, by + 5 + (1 if arm_off == 1 else 0), 3, 1, skin)
    else:
        cv.rect(ox + 4, by, 8, 8, top)
        cv.hline(ox + 4, by + 7, 8, top_d)
        # lengan
        al = 1 if step == 1 else 0; ar = 1 if step == -1 else 0
        cv.rect(ox + 3, by + 1 + al, 2, 5, top_d); cv.rect(ox + 3, by + 5 + al, 2, 2, skin)
        cv.rect(ox + 11, by + 1 + ar, 2, 5, top_d); cv.rect(ox + 11, by + 5 + ar, 2, 2, skin)
        if not back:
            cv.vline(ox + 7, by, 3, shade(top, 0.3)); cv.vline(ox + 8, by, 3, shade(top, 0.3))
            # kerah / leher
            cv.rect(ox + 7, by, 2, 1, skin)
    if skirt:
        cv.rect(ox + (5 if side else 4), by + 6, 6 if side else 8, 6, skirt)
        cv.hline(ox + (5 if side else 4), by + 11, 6 if side else 8, shade(skirt, -0.25))
        if not side:
            for i in range(0, 8, 2):
                cv.px(ox + 4 + i, by + 8, shade(skirt, 0.25)); cv.px(ox + 5 + i, by + 10, shade(skirt, -0.15))
    # pola batik / lencana pada baju
    pat = o.get('pattern')
    if pat and not back:
        gold = hexc('#e8b93c')
        if side:
            for (x, y) in ((6, 12), (8, 14), (7, 16)):
                cv.px(ox + x, oy + y - 1, gold)
        else:
            for (x, y) in ((5, 12), (7, 14), (9, 12), (10, 15), (6, 16)):
                cv.px(ox + x, oy + y - 1, gold)
    if o.get('sash') and not back:
        cv.hline(ox + (5 if side else 4), by + 6, 6 if side else 8, o['sash'])
    # ---- kepala ----
    hy = oy + 2
    if side:
        cv.rect(ox + 4, hy + 2, 8, 7, skin)
        cv.px(ox + 4, hy + 8, None)
        cv.rect(ox + 6, hy + 9, 3, 1, skin_d)  # leher
    else:
        cv.rect(ox + 4, hy + 2, 8, 7, skin)
        cv.rect(ox + 7, hy + 9, 2, 1, skin_d)
    # rambut
    style = o.get('hairstyle', 'short')
    hijab = o.get('hijab')
    if hijab:
        hc = hijab; hd = shade(hc, -0.25); hl = shade(hc, 0.2)
        if back:
            cv.rect(ox + 3, hy, 10, 12, hc); cv.rect(ox + 3, hy + 10, 10, 2, hd)
        elif side:
            cv.rect(ox + 3, hy, 9, 5, hc); cv.rect(ox + 8, hy + 2, 4, 10, hc); cv.rect(ox + 3, hy + 5, 2, 3, hc); cv.rect(ox + 8, hy + 10, 4, 2, hd)
        else:
            cv.rect(ox + 3, hy, 10, 4, hc); cv.rect(ox + 3, hy + 4, 2, 8, hc); cv.rect(ox + 11, hy + 4, 2, 8, hc)
            cv.rect(ox + 5, hy + 10, 6, 2, hc); cv.hline(ox + 4, hy + 11, 8, hd)
            cv.hline(ox + 5, hy + 1, 5, hl)
    else:
        hd = shade(hair, -0.3); hl = shade(hair, 0.22)
        if back:
            cv.rect(ox + 3, hy, 10, 9, hair)
            cv.hline(ox + 4, hy + 1, 5, hl)
            if style in ('long', 'ponytail'):
                cv.rect(ox + 4, hy + 8, 8, 5 if style == 'long' else 3, hair)
                if style == 'ponytail': cv.rect(ox + 7, hy + 8, 2, 6, hair)
        elif side:
            cv.rect(ox + 3, hy, 9, 4, hair); cv.rect(ox + 8, hy + 3, 4, 6, hair)
            cv.rect(ox + 4, hy + 3, 2, 2, hair)
            cv.hline(ox + 5, hy + 1, 4, hl)
            if style == 'long':
                cv.rect(ox + 8, hy + 8, 4, 5, hair)
            if style == 'ponytail':
                cv.rect(ox + 10, hy + 6, 3, 6, hair)
        else:
            cv.rect(ox + 3, hy, 10, 4, hair)
            cv.rect(ox + 3, hy + 3, 2, 5, hair); cv.rect(ox + 11, hy + 3, 2, 5, hair)
            cv.rect(ox + 5, hy + 3, 3, 1, hair)
            cv.hline(ox + 5, hy + 1, 5, hl)
            if style == 'long':
                cv.rect(ox + 3, hy + 8, 2, 5, hair); cv.rect(ox + 11, hy + 8, 2, 5, hair)
            if style == 'bun':
                pass
            if style == 'ponytail':
                cv.rect(ox + 12, hy + 4, 2, 6, hair)
        if style == 'bun':
            cv.rect(ox + 6, hy - 2, 5, 3, hair) if not side else cv.rect(ox + 8, hy - 2, 4, 3, hair)
            cv.hline(ox + (7 if not side else 9), hy - 2, 2, hl)
    # topi / penutup kepala
    hat = o.get('hat')
    if hat == 'blangkon':
        hc = hexc('#3a2418'); gold = hexc('#e8b93c')
        if side:
            cv.rect(ox + 3, hy - 1, 9, 4, hc); cv.rect(ox + 11, hy + 1, 2, 4, hc)
            cv.hline(ox + 3, hy + 2, 9, gold)
        else:
            cv.rect(ox + 3, hy - 1, 10, 4, hc); cv.hline(ox + 3, hy + 2, 10, gold)
            if back: cv.rect(ox + 6, hy + 3, 4, 3, hc)
            cv.px(ox + 4, hy, shade(hc, 0.3)); cv.px(ox + 8, hy - 1, shade(hc, 0.3))
    elif hat == 'peci':
        hc = hexc('#1d1d22')
        cv.rect(ox + 4, hy - 1, 8, 3, hc); cv.hline(ox + 4, hy + 1, 8, shade(hc, 0.25))
    elif hat == 'cap':
        hc = o.get('hatcol', hexc('#c0392b'))
        cv.rect(ox + 3, hy - 1, 10, 3, hc)
        if direction == 'down': cv.rect(ox + 3, hy + 2, 10, 1, shade(hc, -0.3))
        if side: cv.rect(ox + (2 if direction == 'left' else 10), hy + 2, 4, 1, shade(hc, -0.3))
    # wajah
    if not back:
        ec = hexc('#2a1a12')
        if side:
            ex = ox + 5 if direction == 'left' else ox + 10
            cv.rect(ex, hy + 5, 1, 2, ec)
            cv.px(ex, hy + 8 if False else hy + 7, ec) if False else None
            cv.px((ox + 4) if direction == 'left' else (ox + 11), hy + 6, shade(skin, -0.1))
            cv.px(ex + (1 if direction == 'left' else -1), hy + 7, hexc('#e58f8f'))
        else:
            cv.rect(ox + 5, hy + 5, 1, 2, ec); cv.rect(ox + 10, hy + 5, 1, 2, ec)
            cv.px(ox + 5, hy + 7, hexc('#e58f8f')); cv.px(ox + 10, hy + 7, hexc('#e58f8f'))
            cv.px(ox + 7, hy + 8, hexc('#a5503f')); cv.px(ox + 8, hy + 8, hexc('#a5503f'))
        if o.get('glasses'):
            gc = hexc('#3b3b3b')
            if not side:
                cv.frame(ox + 4, hy + 4, 4, 3, gc); cv.frame(ox + 9, hy + 4, 4, 3, gc); cv.hline(ox + 8, hy + 5, 1, gc)
            else:
                ex = ox + 4 if direction == 'left' else ox + 8
                cv.frame(ex, hy + 4, 4, 3, gc)
        if o.get('beard'):
            bc = o['beard']
            if not side:
                cv.rect(ox + 5, hy + 8, 6, 2, bc); cv.rect(ox + 4, hy + 6, 1, 3, bc); cv.rect(ox + 11, hy + 6, 1, 3, bc)
                cv.rect(ox + 6, hy + 7, 4, 1, bc); cv.px(ox + 7, hy + 8, hexc('#a5503f')); cv.px(ox + 8, hy + 8, hexc('#a5503f'))
            else:
                bx = ox + 4 if direction == 'left' else ox + 8
                cv.rect(bx, hy + 7, 4, 3, bc)
    cv.outline(OUT)
    if direction == 'right':
        pass
    return cv

def make_sheet(o, path, scale=3):
    """3 kolom (diam, jalan A, jalan B) x 4 baris (bawah, kiri, kanan, atas)."""
    sheet = Image.new('RGBA', (CW * 3, CH * 4), (0, 0, 0, 0))
    rows = ['down', 'left', 'right', 'up']
    for r, d in enumerate(rows):
        for f in range(3):
            if d == 'right':
                cv = draw_char('left', f, o).flip()
                # flip membuat sisi benar; hat/mata sudah mengikuti 'left' lalu dibalik
            else:
                cv = draw_char(d, f, o)
            sheet.paste(cv.im, (f * CW, r * CH))
    sheet = sheet.resize((sheet.width * scale, sheet.height * scale), Image.NEAREST)
    sheet.save(path)
    return sheet

LOOKS = {
    # 4 avatar pemain; seragam menyesuaikan jenjang
    'raka':  dict(skin=SKINS['tan'], hair=hexc('#231813'), hairstyle='short'),
    'sekar': dict(skin=SKINS['light'], hair=hexc('#2b1b14'), hairstyle='ponytail'),
    'bayu':  dict(skin=SKINS['brown'], hair=hexc('#1a1210'), hairstyle='short', hat='cap', hatcol=hexc('#2f6f9f')),
    'aisyah': dict(skin=SKINS['light'], hair=hexc('#2b1b14'), hairstyle='short', hijab=hexc('#f3efe6')),
}
UNIFORM = {
    'sd':  dict(top=hexc('#f4f1ea'), bottom=hexc('#c0392b'), skirt_f=hexc('#c0392b'), sash=None),
    'smp': dict(top=hexc('#f4f1ea'), bottom=hexc('#2f5fa8'), skirt_f=hexc('#2f5fa8'), sash=None),
    'sma': dict(top=hexc('#f4f1ea'), bottom=hexc('#6e7a86'), skirt_f=hexc('#6e7a86'), sash=None),
}
FEMALE = {'sekar', 'aisyah'}

def player_opts(look, jenjang):
    o = dict(LOOKS[look]); u = UNIFORM[jenjang]
    o['top'] = u['top']; o['bottom'] = u['bottom']
    if look in FEMALE:
        o['skirt'] = u['skirt_f']; o['bottom'] = shade(u['bottom'], -0.1)
    o['sash'] = None
    o['pattern'] = False
    if look == 'bayu':
        pass
    return o

NPCS = {
    'kiwira': dict(skin=SKINS['tan'], hair=hexc('#e9e6df'), hairstyle='short', hat='blangkon', top=hexc('#2b2b33'), bottom=hexc('#5b3a22'), pattern=True, beard=hexc('#f1eee8')),
    'busekar': dict(skin=SKINS['light'], hair=hexc('#2a1a14'), hairstyle='bun', top=hexc('#b3453b'), bottom=hexc('#6b4423'), skirt=hexc('#6b4423'), pattern=True),
    'empujaya': dict(skin=SKINS['brown'], hair=hexc('#1f1713'), hairstyle='short', hat='blangkon', top=hexc('#4a4a52'), bottom=hexc('#3a2a1c'), pattern=False, sash=hexc('#e8b93c'), beard=hexc('#2a1a14')),
    'bularas': dict(skin=SKINS['light'], hair=hexc('#2a1a14'), hairstyle='bun', top=hexc('#2f8a6a'), bottom=hexc('#6b4423'), skirt=hexc('#6b4423'), pattern=True, glasses=True),
    'mbah': dict(skin=SKINS['tan'], hair=hexc('#d8d4cc'), hairstyle='bun', top=hexc('#7a4a8c'), bottom=hexc('#6b4423'), skirt=hexc('#6b4423'), pattern=True),
    'warga1': dict(skin=SKINS['tan'], hair=hexc('#231813'), hairstyle='short', hat='peci', top=hexc('#3f7f56'), bottom=hexc('#3a3a3a')),
    'warga2': dict(skin=SKINS['light'], hair=hexc('#3a2418'), hairstyle='long', top=hexc('#d98c2b'), bottom=hexc('#4a4a52'), skirt=hexc('#4a5fa8')),
    'warga3': dict(skin=SKINS['brown'], hair=hexc('#1a1210'), hairstyle='short', top=hexc('#b8433a'), bottom=hexc('#2f3f66')),
    'penjaga': dict(skin=SKINS['tan'], hair=hexc('#1a1210'), hairstyle='short', hat='blangkon', top=hexc('#7b1f1f'), bottom=hexc('#e8b93c'), sash=hexc('#e8b93c'), pattern=True),
    'pelanggan': dict(skin=SKINS['light'], hair=hexc('#5a3a22'), hairstyle='long', top=hexc('#e0b0c8'), bottom=hexc('#4a4a52'), skirt=hexc('#8a5a7a')),
    'dalang': dict(skin=SKINS['tan'], hair=hexc('#1a1210'), hairstyle='short', hat='blangkon', top=hexc('#1f1f26'), bottom=hexc('#6b4423'), pattern=True, sash=hexc('#e8b93c')),
}

def build_all(outdir):
    names = []
    for look in LOOKS:
        for j in UNIFORM:
            n = f'player_{look}_{j}'
            make_sheet(player_opts(look, j), f'{outdir}/{n}.png'); names.append(n)
    for k, o in NPCS.items():
        n = f'npc_{k}'
        make_sheet(o, f'{outdir}/{n}.png'); names.append(n)
    return names

if __name__ == '__main__':
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    build_all(out)
