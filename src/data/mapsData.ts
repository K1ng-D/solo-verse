// DIHASILKAN OTOMATIS oleh tools/gen_assets.py — jangan edit manual.
export type MapNpc = {id:string;sprite:string;x:number;y:number;face:string;name:string};
export type MapStation = {id:string;x:number;y:number;label:string;r:number};
export type MapDoor = {id:string;x:number;y:number;w:number;h:number;to:string;spawn:string|null;label:string};
export type MapCollect = {id:string;x:number;y:number};
export type MapEnemy = {id:string;x0:number;y0:number;x1:number;y1:number;speed:number};
export type MapLabel = {text:string;x:number;y:number};
export type MapData = {id:string;w:number;h:number;solid:string[];npcs:MapNpc[];stations:MapStation[];doors:MapDoor[];collectibles:MapCollect[];enemies:MapEnemy[];labels:MapLabel[];spawns:Record<string,[number,number]>};
export const MAPS: Record<string, MapData> = {
 "overworld": {
  "id": "overworld",
  "w": 32,
  "h": 24,
  "solid": [
   "11111111111111111111111111111111",
   "10000000000111111111000000010001",
   "10000000000111111111000000000001",
   "10111111100111111111010111111101",
   "10111111100111111111000111111101",
   "10111111111111101111110111111101",
   "10111111110000000000010111111101",
   "10111011101100000001100111011101",
   "10010000010000000000000000000001",
   "10000000010010000010010000000001",
   "10000000000001000100000000000001",
   "10100000000000000000000000000001",
   "10000001110001000100001110000101",
   "10000001110000000000001110000001",
   "11111111111111000111111111111111",
   "11111111111111000111111111111111",
   "10111111100000000000000111111101",
   "10111111100000000000100111111101",
   "10111111100001000100000111111101",
   "10111111100100000001010111111101",
   "10111011100000000000000111011101",
   "10000000000000000000000000000001",
   "10000000000000000000000000000001",
   "11111111111111111111111111111111"
  ],
  "npcs": [
   {
    "id": "kiwira",
    "sprite": "kiwira",
    "x": 12.5,
    "y": 12.3,
    "face": "right",
    "name": "Ki Wira"
   },
   {
    "id": "penjaga",
    "sprite": "penjaga",
    "x": 13.5,
    "y": 6.6,
    "face": "down",
    "name": "Prajurit Keraton"
   },
   {
    "id": "warga1",
    "sprite": "warga1",
    "x": 23.5,
    "y": 11.700000000000001,
    "face": "down",
    "name": "Pak Darto"
   },
   {
    "id": "warga2",
    "sprite": "warga2",
    "x": 8.5,
    "y": 11.700000000000001,
    "face": "down",
    "name": "Bu Tini"
   },
   {
    "id": "warga3",
    "sprite": "warga3",
    "x": 17.5,
    "y": 8.5,
    "face": "left",
    "name": "Mas Bayu"
   }
  ],
  "stations": [],
  "doors": [
   {
    "id": "to_batik",
    "x": 5,
    "y": 7,
    "w": 1,
    "h": 1,
    "to": "batik",
    "spawn": "in",
    "label": "Rumah Batik"
   },
   {
    "id": "to_wayang",
    "x": 26,
    "y": 7,
    "w": 1,
    "h": 1,
    "to": "wayang",
    "spawn": "in",
    "label": "Panggung Wayang"
   },
   {
    "id": "to_keris",
    "x": 5,
    "y": 20,
    "w": 1,
    "h": 1,
    "to": "keris",
    "spawn": "in",
    "label": "Museum Pusaka"
   },
   {
    "id": "to_basa",
    "x": 26,
    "y": 20,
    "w": 1,
    "h": 1,
    "to": "basa",
    "spawn": "in",
    "label": "Sekolah Basa"
   },
   {
    "id": "gate",
    "x": 15,
    "y": 5,
    "w": 1,
    "h": 1,
    "to": "gate",
    "spawn": "in",
    "label": "Gerbang Keraton"
   }
  ],
  "collectibles": [
   {
    "id": "ow1",
    "x": 2.5,
    "y": 9.5
   },
   {
    "id": "ow2",
    "x": 29.5,
    "y": 9.5
   },
   {
    "id": "ow3",
    "x": 8.5,
    "y": 2.5
   },
   {
    "id": "ow4",
    "x": 22.5,
    "y": 2.5
   },
   {
    "id": "ow5",
    "x": 3.5,
    "y": 13.5
   },
   {
    "id": "ow6",
    "x": 28.5,
    "y": 12.5
   },
   {
    "id": "ow7",
    "x": 12.5,
    "y": 20.5
   },
   {
    "id": "ow8",
    "x": 19.5,
    "y": 18.5
   },
   {
    "id": "ow9",
    "x": 1.5,
    "y": 21.5
   },
   {
    "id": "ow10",
    "x": 30.5,
    "y": 20.5
   }
  ],
  "enemies": [
   {
    "id": "sh1",
    "x0": 6.5,
    "y0": 10.9,
    "x1": 12.5,
    "y1": 10.9,
    "speed": 1.2
   },
   {
    "id": "sh2",
    "x0": 19.5,
    "y0": 10.9,
    "x1": 25.5,
    "y1": 10.9,
    "speed": 1.2
   },
   {
    "id": "sh3",
    "x0": 6.5,
    "y0": 21.9,
    "x1": 12.5,
    "y1": 21.9,
    "speed": 1.2
   },
   {
    "id": "sh4",
    "x0": 19.5,
    "y0": 21.9,
    "x1": 25.5,
    "y1": 21.9,
    "speed": 1.2
   }
  ],
  "labels": [
   {
    "text": "Rumah Batik Laweyan",
    "x": 5.5,
    "y": 2.3
   },
   {
    "text": "Panggung Wayang",
    "x": 26.5,
    "y": 2.3
   },
   {
    "text": "Museum Pusaka",
    "x": 5.5,
    "y": 15.3
   },
   {
    "text": "Sekolah Basa",
    "x": 26.5,
    "y": 15.3
   },
   {
    "text": "Gerbang Keraton",
    "x": 15.5,
    "y": 0.4
   }
  ],
  "spawns": {
   "start": [
    15.5,
    11.4
   ],
   "from_batik": [
    5.5,
    9.0
   ],
   "from_wayang": [
    26.5,
    9.0
   ],
   "from_keris": [
    5.5,
    21.6
   ],
   "from_basa": [
    26.5,
    21.6
   ]
  }
 },
 "batik": {
  "id": "batik",
  "w": 20,
  "h": 14,
  "solid": [
   "11111111111111111111",
   "11111111111111111111",
   "11111111111111111111",
   "10000000000000000001",
   "10111000111100111101",
   "10111000111100111101",
   "10000000000000000001",
   "10000000000000000001",
   "10000000000000000111",
   "10000000000000000111",
   "10000000000000000001",
   "11000000000000000001",
   "10000000000000000011",
   "11111111100111111111"
  ],
  "npcs": [
   {
    "id": "busekar",
    "sprite": "busekar",
    "x": 5.5,
    "y": 8.6,
    "face": "right",
    "name": "Bu Sekar"
   },
   {
    "id": "pelanggan",
    "sprite": "pelanggan",
    "x": 13.5,
    "y": 9.5,
    "face": "left",
    "name": "Mbak Ayu"
   }
  ],
  "stations": [
   {
    "id": "canting",
    "x": 3.5,
    "y": 6.1,
    "label": "Meja Canting",
    "r": 1.6
   },
   {
    "id": "celup",
    "x": 10.0,
    "y": 6.1,
    "label": "Bak Pewarna",
    "r": 1.7
   },
   {
    "id": "motif",
    "x": 16.0,
    "y": 6.1,
    "label": "Jemuran Motif",
    "r": 1.7
   },
   {
    "id": "tungku",
    "x": 17.9,
    "y": 10.3,
    "label": "Tungku Malam",
    "r": 1.4
   }
  ],
  "doors": [
   {
    "id": "exit",
    "x": 9,
    "y": 13,
    "w": 2,
    "h": 1,
    "to": "overworld",
    "spawn": null,
    "label": "Keluar"
   }
  ],
  "collectibles": [
   {
    "id": "ba1",
    "x": 2.5,
    "y": 8.5
   },
   {
    "id": "ba2",
    "x": 11.5,
    "y": 11.5
   },
   {
    "id": "ba3",
    "x": 15.5,
    "y": 8.5
   }
  ],
  "enemies": [],
  "labels": [],
  "spawns": {
   "in": [
    10.0,
    12.2
   ]
  }
 },
 "wayang": {
  "id": "wayang",
  "w": 20,
  "h": 14,
  "solid": [
   "11111111111111111111",
   "11111111111111111111",
   "11111111111111111111",
   "10000000000000000001",
   "11100000000000000001",
   "11100000000000000001",
   "10000000000000001101",
   "10011100110000001101",
   "10000000110000001101",
   "10011100000000110001",
   "10000000000000110001",
   "10000000000000000001",
   "11000000000000000011",
   "11111111100111111111"
  ],
  "npcs": [
   {
    "id": "kiwira2",
    "sprite": "kiwira",
    "x": 6.0,
    "y": 6.8,
    "face": "right",
    "name": "Ki Wira"
   },
   {
    "id": "dalang",
    "sprite": "dalang",
    "x": 12.6,
    "y": 6.8,
    "face": "left",
    "name": "Pak Dalang"
   }
  ],
  "stations": [
   {
    "id": "gamelan",
    "x": 16.4,
    "y": 9.3,
    "label": "Gamelan",
    "r": 1.8
   },
   {
    "id": "lakon",
    "x": 2.0,
    "y": 6.3,
    "label": "Papan Lakon",
    "r": 1.6
   },
   {
    "id": "tokoh",
    "x": 9.0,
    "y": 9.4,
    "label": "Peti Wayang",
    "r": 1.6
   },
   {
    "id": "dalang",
    "x": 10.0,
    "y": 5.6,
    "label": "Kursi Dalang",
    "r": 1.5
   }
  ],
  "doors": [
   {
    "id": "exit",
    "x": 9,
    "y": 13,
    "w": 2,
    "h": 1,
    "to": "overworld",
    "spawn": null,
    "label": "Keluar"
   }
  ],
  "collectibles": [
   {
    "id": "wa1",
    "x": 3.5,
    "y": 11.5
   },
   {
    "id": "wa2",
    "x": 12.5,
    "y": 12.0
   },
   {
    "id": "wa3",
    "x": 17.5,
    "y": 4.5
   }
  ],
  "enemies": [],
  "labels": [],
  "spawns": {
   "in": [
    10.0,
    12.2
   ]
  }
 },
 "keris": {
  "id": "keris",
  "w": 20,
  "h": 14,
  "solid": [
   "11111111111111111111",
   "11111111111111111111",
   "11111111111111111111",
   "10011001100110011001",
   "10011001100110011001",
   "10000000000000000001",
   "10000000000000000001",
   "10000000000000000001",
   "10011100000011100001",
   "10011100000001100001",
   "10000000000000000001",
   "11000000000011100001",
   "10000000000000000011",
   "11111111100111111111"
  ],
  "npcs": [
   {
    "id": "empujaya",
    "sprite": "empujaya",
    "x": 6.5,
    "y": 7.5,
    "face": "right",
    "name": "Empu Jaya"
   },
   {
    "id": "pengunjung",
    "sprite": "warga2",
    "x": 15.5,
    "y": 7.0,
    "face": "down",
    "name": "Pengunjung"
   }
  ],
  "stations": [
   {
    "id": "anatomi",
    "x": 8.0,
    "y": 5.4,
    "label": "Anatomi Keris",
    "r": 1.7
   },
   {
    "id": "tertib",
    "x": 17.9,
    "y": 3.6,
    "label": "Tata Tertib",
    "r": 1.6
   },
   {
    "id": "katalog",
    "x": 4.5,
    "y": 10.3,
    "label": "Katalog Pusaka",
    "r": 1.7
   }
  ],
  "doors": [
   {
    "id": "exit",
    "x": 9,
    "y": 13,
    "w": 2,
    "h": 1,
    "to": "overworld",
    "spawn": null,
    "label": "Keluar"
   }
  ],
  "collectibles": [
   {
    "id": "ke1",
    "x": 2.5,
    "y": 7.0
   },
   {
    "id": "ke2",
    "x": 17.5,
    "y": 9.0
   },
   {
    "id": "ke3",
    "x": 12.5,
    "y": 12.0
   }
  ],
  "enemies": [],
  "labels": [],
  "spawns": {
   "in": [
    10.0,
    12.2
   ]
  }
 },
 "basa": {
  "id": "basa",
  "w": 20,
  "h": 14,
  "solid": [
   "11111111111111111111",
   "11111111111111111111",
   "11111111111111111111",
   "10000000000000011101",
   "10111000000000011101",
   "10000000011000000001",
   "10000000000000000001",
   "11000000000000000001",
   "10001101101101100001",
   "10000000000000000001",
   "10001100000001100001",
   "10000000000000000001",
   "10000000000000000011",
   "11111111100111111111"
  ],
  "npcs": [
   {
    "id": "bularas",
    "sprite": "bularas",
    "x": 12.8,
    "y": 4.9,
    "face": "left",
    "name": "Bu Laras"
   },
   {
    "id": "mbah",
    "sprite": "mbah",
    "x": 2.9,
    "y": 5.0,
    "face": "down",
    "name": "Mbah Putri"
   }
  ],
  "stations": [
   {
    "id": "tingkat",
    "x": 9.5,
    "y": 3.7,
    "label": "Papan Tulis",
    "r": 1.7
   },
   {
    "id": "ukara",
    "x": 10.0,
    "y": 6.5,
    "label": "Meja Guru",
    "r": 1.6
   },
   {
    "id": "tembung",
    "x": 16.5,
    "y": 5.4,
    "label": "Rak Buku",
    "r": 1.7
   },
   {
    "id": "mbah",
    "x": 3.2,
    "y": 6.0,
    "label": "Ngobrol karo Mbah",
    "r": 1.6
   }
  ],
  "doors": [
   {
    "id": "exit",
    "x": 9,
    "y": 13,
    "w": 2,
    "h": 1,
    "to": "overworld",
    "spawn": null,
    "label": "Keluar"
   }
  ],
  "collectibles": [
   {
    "id": "bs1",
    "x": 1.5,
    "y": 11.5
   },
   {
    "id": "bs2",
    "x": 17.5,
    "y": 8.5
   },
   {
    "id": "bs3",
    "x": 8.5,
    "y": 11.5
   }
  ],
  "enemies": [],
  "labels": [],
  "spawns": {
   "in": [
    10.0,
    12.2
   ]
  }
 }
};
