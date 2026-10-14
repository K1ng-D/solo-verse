import type { NpcKey } from '../lib/ai';

export type Pair = { a: string; b: string };
export const PAIRS: Record<string, Pair[]> = {
  motif: [
    { a: 'Canting', b: 'Alat penorehan malam' }, { a: 'Malam', b: 'Lilin penahan warna' },
    { a: 'Kawung', b: 'Bulatan geometris berulang' }, { a: 'Parang', b: 'Garis diagonal bersambung' },
    { a: 'Truntum', b: 'Bintang kecil bertebar' }, { a: 'Sogan', b: 'Cokelat khas batik Solo' },
    { a: 'Nglorod', b: 'Melepas malam dengan air panas' }, { a: 'Laweyan', b: 'Kampung batik di Solo' },
  ],
  tokoh: [
    { a: 'Dalang', b: 'Pemain wayang' }, { a: 'Kelir', b: 'Layar putih' },
    { a: 'Blencong', b: 'Lampu minyak' }, { a: 'Gunungan', b: 'Pembuka & penutup lakon' },
    { a: 'Semar', b: 'Penasihat bijak, tubuh bulat' }, { a: 'Petruk', b: 'Tinggi, hidung panjang' },
    { a: 'Arjuna', b: 'Ksatria pemanah' }, { a: 'Gamelan', b: 'Musik pengiring' },
  ],
  katalog: [
    { a: 'Hulu', b: 'Pegangan keris' }, { a: 'Warangka', b: 'Sarung kayu keris' },
    { a: 'Bilah', b: 'Bagian logam utama' }, { a: 'Luk', b: 'Lekukan pada bilah' },
    { a: 'Pamor', b: 'Motif pada bilah' }, { a: 'Pendok', b: 'Selongsong logam warangka' },
    { a: 'Empu', b: 'Pembuat keris' }, { a: 'Jamasan', b: 'Tradisi merawat pusaka' },
  ],
  tembung: [
    { a: 'Omah', b: 'Griya' }, { a: 'Turu', b: 'Tilem' }, { a: 'Lunga', b: 'Tindak' }, { a: 'Aku', b: 'Kula' },
    { a: 'Ora', b: 'Mboten' }, { a: 'Iya', b: 'Nggih' }, { a: 'Banyu', b: 'Toya' }, { a: 'Wis', b: 'Sampun' },
  ],
};
export const PAIR_NOTE: Record<string, string> = {
  motif: 'Kata dan maknanya', tokoh: 'Istilah wayang dan artinya', katalog: 'Bagian keris dan fungsinya', tembung: 'Ngoko ↔ Krama',
};

export type OrderRound = { prompt: string; items: string[]; note?: string; hint?: string };
export const ORDERS: Record<string, { title: string; mode: 'steps' | 'words'; rounds: OrderRound[] }> = {
  tungku: {
    title: 'Urutan Membatik', mode: 'steps',
    rounds: [{ prompt: 'Susun langkah membatik tulis dari awal sampai akhir!', items: ['Siapkan kain mori', 'Gambar pola (nyorek)', 'Torehkan malam dengan canting', 'Celup kain ke pewarna', 'Lorod malam dengan air panas', 'Jemur sampai kering'], note: 'Malam menahan warna, nglorod melepas malam sehingga motif tampak.' }],
  },
  lakon: {
    title: 'Susun Lakon', mode: 'steps',
    rounds: [{ prompt: 'Urutkan jalannya pertunjukan wayang kulit!', items: ['Gunungan dibuka', 'Adegan di kerajaan (jejer)', 'Perang kembang', 'Goro-goro bersama punakawan', 'Perang besar', 'Gunungan ditancapkan, selesai'], note: 'Urutan umum dapat berbeda antar dalang dan gaya, tetapi gunungan selalu membuka dan menutup.' }],
  },
  ukara: {
    title: 'Susun Ukara Jawa', mode: 'words',
    rounds: [
      { prompt: 'Saya akan pergi ke pasar.', items: ['Kula', 'badhe', 'tindak', 'dhateng', 'pasar'], hint: 'Kula = saya, badhe = akan, tindak = pergi' },
      { prompt: 'Simbah sudah makan.', items: ['Simbah', 'sampun', 'dhahar'], hint: 'Dhahar = makan (untuk orang yang dihormati)' },
      { prompt: 'Selamat pagi, Pak Guru.', items: ['Sugeng', 'enjing', 'Pak', 'Guru'], hint: 'Sugeng enjing = selamat pagi' },
      { prompt: 'Terima kasih, Bu Guru.', items: ['Matur', 'nuwun', 'Bu', 'Guru'], hint: 'Matur nuwun = terima kasih' },
    ],
  },
};

export type SortSet = { title: string; prompt: string; cats: { id: string; label: string; color: string }[]; items: { text: string; cat: string; note: string }[] };
export const SORTS: Record<string, SortSet> = {
  tertib: {
    title: 'Tata Tertib Museum', prompt: 'Apakah ini sikap yang BOLEH atau JANGAN di museum?',
    cats: [{ id: 'ok', label: 'BOLEH', color: '#2f8a45' }, { id: 'no', label: 'JANGAN', color: '#a63a34' }],
    items: [
      { text: 'Melihat koleksi dari jarak aman', cat: 'ok', note: 'Jarak aman melindungi koleksi dan pengunjung.' },
      { text: 'Menyentuh koleksi di dalam vitrin', cat: 'no', note: 'Minyak dan debu dari tangan bisa merusak benda tua.' },
      { text: 'Bertanya sopan kepada pemandu', cat: 'ok', note: 'Bertanya adalah cara belajar yang baik.' },
      { text: 'Berlari di ruang pamer', cat: 'no', note: 'Bisa menabrak benda atau orang.' },
      { text: 'Mengayun-ayunkan replika keris', cat: 'no', note: 'Keris adalah artefak budaya, bukan mainan.' },
      { text: 'Menjaga suara tetap tenang', cat: 'ok', note: 'Suara tenang membuat semua nyaman.' },
      { text: 'Membaca label keterangan koleksi', cat: 'ok', note: 'Label memuat nama, asal, dan makna.' },
      { text: 'Bersandar di kaca pajangan', cat: 'no', note: 'Kaca bisa retak dan bergeser.' },
      { text: 'Mengikuti arahan petugas', cat: 'ok', note: 'Petugas tahu cara menjaga koleksi.' },
      { text: 'Memindahkan benda pamer', cat: 'no', note: 'Benda pamer tidak boleh dipindah.' },
      { text: 'Membuang sampah di dekat koleksi', cat: 'no', note: 'Sampah mengundang hama.' },
      { text: 'Memotret jika diizinkan, tanpa blitz', cat: 'ok', note: 'Cahaya blitz dapat memudarkan warna benda tertentu.' },
    ],
  },
  tingkat: {
    title: 'Unggah-ungguh Basa', prompt: 'Kata ini termasuk tingkat tutur yang mana?',
    cats: [{ id: 'ngoko', label: 'Ngoko', color: '#2f6fa8' }, { id: 'krama', label: 'Krama', color: '#8a6ad0' }, { id: 'inggil', label: 'Krama inggil', color: '#b98a1c' }],
    items: [
      { text: 'Mangan', cat: 'ngoko', note: 'Mangan = makan (akrab).' },
      { text: 'Nedha', cat: 'krama', note: 'Nedha = makan (sopan, untuk diri sendiri).' },
      { text: 'Dhahar', cat: 'inggil', note: 'Dhahar = makan (menghormati orang lain).' },
      { text: 'Turu', cat: 'ngoko', note: 'Turu = tidur.' },
      { text: 'Tilem', cat: 'krama', note: 'Tilem = tidur (sopan).' },
      { text: 'Sare', cat: 'inggil', note: 'Sare = tidur (untuk orang yang dihormati).' },
      { text: 'Omah', cat: 'ngoko', note: 'Omah = rumah.' },
      { text: 'Griya', cat: 'krama', note: 'Griya = rumah (sopan).' },
      { text: 'Kondur', cat: 'inggil', note: 'Kondur = pulang (menghormati).' },
      { text: 'Mulih', cat: 'ngoko', note: 'Mulih = pulang (akrab).' },
      { text: 'Aku', cat: 'ngoko', note: 'Aku = saya (akrab).' },
      { text: 'Kula', cat: 'krama', note: 'Kula = saya (sopan).' },
    ],
  },
};

export const KERIS_PARTS = [
  { id: 'hulu', label: 'Hulu', info: 'Pegangan keris yang sering diukir indah.', lvl: 1 },
  { id: 'bilah', label: 'Bilah', info: 'Bagian logam utama keris.', lvl: 1 },
  { id: 'warangka', label: 'Warangka', info: 'Sarung kayu yang melindungi bilah.', lvl: 1 },
  { id: 'luk', label: 'Luk', info: 'Lekukan (gelombang) pada bilah.', lvl: 2 },
  { id: 'pendok', label: 'Pendok', info: 'Selongsong logam pelapis warangka.', lvl: 2 },
  { id: 'pamor', label: 'Pamor', info: 'Motif guratan pada bilah dari lapisan logam.', lvl: 3 },
  { id: 'mendak', label: 'Mendak', info: 'Cincin penghubung antara hulu dan bilah.', lvl: 3 },
];

export const PUPPETS = [
  { key: 'semar', name: 'Semar', trait: 'bijak & penyayang' },
  { key: 'gareng', name: 'Gareng', trait: 'teliti & jenaka' },
  { key: 'petruk', name: 'Petruk', trait: 'jangkung & lucu' },
  { key: 'bagong', name: 'Bagong', trait: 'polos & apa adanya' },
  { key: 'arjuna', name: 'Arjuna', trait: 'ksatria halus' },
  { key: 'bima', name: 'Bima', trait: 'kuat & jujur' },
];
export const VALUES = ['Jujur', 'Gotong royong', 'Berani menolong', 'Menjaga lingkungan'];

export type StoryScene = { who: 'a' | 'b' | 'dalang'; text: string };
export function fallbackStory(a: string, b: string, value: string, twist: string): { title: string; scenes: StoryScene[]; moral: string } {
  const t = twist ? ` Tiba-tiba ${twist.slice(0, 60)}!` : '';
  const L: Record<string, StoryScene[]> = {
    'Jujur': [
      { who: 'dalang', text: `Di sebuah desa, ${a} menemukan dompet kecil di dekat pasar.${t}` },
      { who: 'b', text: 'Isinya banyak sekali. Kita pakai saja?' },
      { who: 'a', text: 'Tidak. Ini milik orang lain. Mari kita cari pemiliknya.' },
      { who: 'dalang', text: 'Mereka bertanya kepada para penjual sampai pemilik dompet ditemukan. Ia sangat berterima kasih.' },
      { who: 'b', text: 'Hatiku ringan sekali setelah berbuat jujur.' },
    ],
    'Gotong royong': [
      { who: 'dalang', text: `Hujan deras membuat jembatan bambu di desa roboh.${t}` },
      { who: 'a', text: 'Aku tidak kuat mengangkat bambu ini sendirian.' },
      { who: 'b', text: 'Ayo panggil warga. Kalau bersama-sama, pasti terasa ringan.' },
      { who: 'dalang', text: 'Warga datang membawa bambu dan tali, lalu bekerja bersama.' },
      { who: 'a', text: 'Lihat, jembatannya selesai sebelum matahari terbenam!' },
    ],
    'Berani menolong': [
      { who: 'dalang', text: `Seekor anak kambing terjebak di tepi sungai.${t}` },
      { who: 'b', text: 'Airnya deras. Aku takut.' },
      { who: 'a', text: 'Takut itu wajar. Tapi kita bisa menolong dengan hati-hati.' },
      { who: 'dalang', text: 'Mereka mengulurkan tali dan menarik anak kambing perlahan sampai selamat.' },
      { who: 'b', text: 'Berani bukan berarti tidak takut, tapi tetap mau menolong.' },
    ],
    'Menjaga lingkungan': [
      { who: 'dalang', text: `Sungai di dekat desa mulai penuh sampah.${t}` },
      { who: 'a', text: 'Ikan-ikan jadi sulit bernapas.' },
      { who: 'b', text: 'Ayo kita bersihkan dan ajak anak-anak menjaga sungai.' },
      { who: 'dalang', text: 'Mereka memungut sampah dan membuat tempat sampah dari bambu.' },
      { who: 'a', text: 'Sungai bersih, ikan-ikan kembali bermain!' },
    ],
  };
  return { title: `${a} dan ${b}: ${value}`, scenes: L[value] || L['Jujur'], moral: `${value} membuat hidup bersama menjadi lebih baik.` };
}

// FAQ offline kalau AI belum aktif
export const FAQ: Record<NpcKey, { k: string[]; a: string }[]> = {
  busekar: [
    { k: ['canting'], a: 'Canting itu alat kecil bertangkai dengan wadah malam cair. Ujungnya berlubang untuk menggambar garis halus di kain.' },
    { k: ['malam', 'lilin'], a: 'Malam adalah lilin khusus batik. Setelah membeku, ia menahan warna sehingga bagian itu tetap terang saat dicelup.' },
    { k: ['kawung'], a: 'Kawung berpola bulatan lonjong yang berulang rapi. Dari jauh seperti bunga empat kelopak.' },
    { k: ['parang'], a: 'Parang berpola garis miring bersambung seperti ombak atau bilah. Banyak orang memaknainya sebagai semangat yang tak putus.' },
    { k: ['sogan', 'cokelat', 'warna'], a: 'Sogan adalah warna cokelat khas batik Solo. Warna ini berasal dari pewarna alami kulit pohon soga.' },
    { k: ['laweyan'], a: 'Laweyan adalah kampung batik di Solo. Rumah-rumahnya punya tembok tinggi dan banyak yang menjadi galeri batik.' },
  ],
  kiwira: [
    { k: ['dalang'], a: 'Dalang adalah pemimpin pertunjukan wayang. Ia memainkan wayang, mengisi suara, dan memberi aba-aba kepada penabuh gamelan.' },
    { k: ['gamelan'], a: 'Gamelan adalah seperangkat alat musik dari logam seperti saron, bonang, kenong, dan gong. Gong besar menandai akhir satu putaran lagu.' },
    { k: ['semar', 'punakawan'], a: 'Punakawan adalah Semar, Gareng, Petruk, dan Bagong. Mereka menemani ksatria sambil menghibur dan memberi nasihat.' },
    { k: ['gunungan', 'kayon'], a: 'Gunungan atau kayon dipakai untuk membuka dan menutup pertunjukan, juga menandai pergantian adegan.' },
    { k: ['kelir'], a: 'Kelir adalah layar putih. Lampu blencong di belakang wayang membuat bayangannya tampak di kelir.' },
  ],
  empujaya: [
    { k: ['empu'], a: 'Empu adalah ahli pembuat keris. Pekerjaan ini membutuhkan keterampilan dan tata cara yang panjang.' },
    { k: ['luk'], a: 'Luk adalah lekukan pada bilah keris. Ada juga keris yang bilahnya lurus.' },
    { k: ['pamor'], a: 'Pamor adalah motif guratan pada bilah yang berasal dari lapisan logam. Polanya unik pada tiap bilah.' },
    { k: ['warangka', 'sarung'], a: 'Warangka adalah sarung kayu yang melindungi bilah dan sering dihias indah.' },
    { k: ['hulu'], a: 'Hulu adalah bagian pegangan keris yang sering berukir tokoh atau hewan.' },
    { k: ['jamasan', 'suro'], a: 'Jamasan adalah tradisi merawat pusaka, sering dikaitkan dengan bulan Suro. Dilakukan dengan penuh tata krama.' },
  ],
  bularas: [
    { k: ['ngoko'], a: 'Ngoko dipakai untuk bicara akrab, misalnya kepada teman sebaya. Contoh: "Aku arep mangan".' },
    { k: ['krama'], a: 'Krama dipakai untuk bicara sopan. Contoh: "Kula badhe nedha" artinya "Saya mau makan".' },
    { k: ['matur nuwun', 'terima kasih'], a: 'Matur nuwun artinya terima kasih. Kalau kepada orang yang lebih tua, ucapkan dengan sopan dan sedikit membungkuk.' },
    { k: ['sugeng'], a: 'Sugeng enjing = selamat pagi, sugeng siang = selamat siang, sugeng sonten = selamat sore.' },
    { k: ['aksara', 'hanacaraka'], a: 'Aksara Jawa dimulai dari Hanacaraka. Ada 20 aksara dasar yang disebut nglegena.' },
  ],
  mbah: [
    { k: ['sugeng', 'selamat'], a: 'Nggih, sugeng enjing, Nak. (Ya, selamat pagi, Nak.) Sampun dhahar dereng? (Sudah makan belum?)' },
    { k: ['matur nuwun', 'terima kasih'], a: 'Sami-sami, Nak. (Sama-sama, Nak.) Kula bingah sampeyan sowan. (Mbah senang kamu datang.)' },
    { k: ['pamit', 'pulang'], a: 'Nggih, ngatos-atos ing dalan, Nak. (Ya, hati-hati di jalan, Nak.)' },
  ],
};
