# Aset
| Lokasi | Isi | Sumber |
|---|---|---|
| assets/sprites/player_*_{sd,smp,sma}.png | 4 avatar × 3 seragam (sheet 3×4) | generator (tools/chars.py) |
| assets/sprites/npc_*.png | 11 NPC | generator |
| assets/sprites/enemy_*, boss*, item_flower*, puppet_* | musuh, bos, Sekar Emas, wayang | tools/misc.py |
| assets/maps/*_base.png, *_over.png | 5 peta (overworld + 4 interior) | tools/maps.py, tiles.py, objects.py |
| assets/sfx/*.wav | 20 efek suara | tools/sfx.py |
| assets/art, assets/icons | ilustrasi potret/latar (dari v2) | bawaan v2 |
Ubah desain: edit file di tools/ lalu jalankan `python3 tools/gen_assets.py`.
