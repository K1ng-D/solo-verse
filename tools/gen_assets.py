#!/usr/bin/env python3
"""Generator aset SoloVerse: sprite karakter, peta tile, item, efek suara, dan data peta (TS).
Jalankan:  python3 tools/gen_assets.py   (butuh Pillow + numpy)"""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
ROOT = os.path.dirname(HERE)
import chars, maps, misc, sfx

SPR = f'{ROOT}/assets/sprites'; MAP = f'{ROOT}/assets/maps'; SFX = f'{ROOT}/assets/sfx'
for d in (SPR, MAP, SFX): os.makedirs(d, exist_ok=True)

names = chars.build_all(SPR)
misc.make_items(SPR)
sfx.build(SFX)
exports = {}
for build in maps.ALL:
    m = build(); m.render(MAP)
    bad = m.check()
    if bad: print('PERINGATAN', m.id, bad)
    exports[m.id] = m.export()

os.makedirs(f'{ROOT}/src/data', exist_ok=True)
with open(f'{ROOT}/src/data/mapsData.ts', 'w') as f:
    f.write('// DIHASILKAN OTOMATIS oleh tools/gen_assets.py — jangan edit manual.\n')
    f.write('export type MapNpc = {id:string;sprite:string;x:number;y:number;face:string;name:string};\n')
    f.write('export type MapStation = {id:string;x:number;y:number;label:string;r:number};\n')
    f.write('export type MapDoor = {id:string;x:number;y:number;w:number;h:number;to:string;spawn:string|null;label:string};\n')
    f.write('export type MapCollect = {id:string;x:number;y:number};\n')
    f.write('export type MapEnemy = {id:string;x0:number;y0:number;x1:number;y1:number;speed:number};\n')
    f.write('export type MapLabel = {text:string;x:number;y:number};\n')
    f.write('export type MapData = {id:string;w:number;h:number;solid:string[];npcs:MapNpc[];stations:MapStation[];doors:MapDoor[];collectibles:MapCollect[];enemies:MapEnemy[];labels:MapLabel[];spawns:Record<string,[number,number]>};\n')
    f.write('export const MAPS: Record<string, MapData> = ' + json.dumps(exports, indent=1) + ';\n')

with open(f'{ROOT}/src/data/assetMap.ts', 'w') as f:
    f.write('// DIHASILKAN OTOMATIS oleh tools/gen_assets.py — jangan edit manual.\n')
    f.write("import type { ImageSourcePropType } from 'react-native';\n")
    f.write('export const mapImages: Record<string, {base: ImageSourcePropType; over: ImageSourcePropType}> = {\n')
    for k in exports:
        f.write(f"  {k}: {{ base: require('../../assets/maps/{k}_base.png'), over: require('../../assets/maps/{k}_over.png') }},\n")
    f.write('};\n')
    f.write('export const sheets: Record<string, ImageSourcePropType> = {\n')
    for n in names:
        f.write(f"  '{n}': require('../../assets/sprites/{n}.png'),\n")
    f.write('};\n')
    f.write("export const fx: Record<string, ImageSourcePropType> = {\n")
    for n in ('enemy_shadow', 'boss', 'boss_hurt', 'item_flower', 'puppet_semar', 'puppet_gareng', 'puppet_petruk', 'puppet_bagong', 'puppet_arjuna', 'puppet_bima'):
        f.write(f"  '{n}': require('../../assets/sprites/{n}.png'),\n")
    f.write('};\n')
    f.write('export const sfxFiles: Record<string, any> = {\n')
    for n in sorted(os.listdir(SFX)):
        if n.endswith('.wav'): f.write(f"  '{n[:-4]}': require('../../assets/sfx/{n}'),\n")
    f.write('};\n')
print('selesai:', len(names), 'sheet;', len(exports), 'peta')
