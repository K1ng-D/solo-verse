import { aiAvailable, genQuiz, Jenjang, AiQuestion } from '../lib/ai';

export type Topic = 'batik' | 'wayang' | 'keris' | 'basa' | 'solo';
export type Q = AiQuestion & { topic?: Topic; d?: 1 | 2 | 3 };
type Raw = [Topic, 1 | 2 | 3, string, string, string[], string];

// [topik, tingkat (1 mudah..3 sulit), soal, jawaban benar, pengecoh[], penjelasan]
const RAW: Raw[] = [
  // ---------------- BATIK
  ['batik', 1, 'Alat kecil untuk menorehkan malam (lilin) saat membatik tulis disebut…', 'Canting', ['Palu', 'Gunting', 'Sendok'], 'Canting punya wadah kecil untuk malam cair dan ujung berlubang untuk menggambar garis.'],
  ['batik', 1, 'Bahan yang dipakai untuk menahan warna agar tidak meresap ke kain batik adalah…', 'Malam (lilin batik)', ['Tepung', 'Garam', 'Pasir'], 'Malam yang membeku menutup serat kain sehingga bagian itu tidak terkena warna.'],
  ['batik', 1, 'Salah satu kampung batik terkenal di Kota Solo adalah…', 'Laweyan', ['Malioboro', 'Kasongan', 'Trowulan'], 'Kampung Batik Laweyan dikenal sebagai sentra batik di Solo.'],
  ['batik', 1, 'Hari Batik Nasional diperingati setiap tanggal…', '2 Oktober', ['17 Agustus', '28 Oktober', '21 April'], 'Tanggal 2 Oktober dipilih karena UNESCO menetapkan batik Indonesia sebagai warisan budaya pada 2 Oktober 2009.'],
  ['batik', 1, 'Batik cap dibuat dengan bantuan…', 'Cap tembaga (stempel)', ['Pensil warna', 'Kuas cat air', 'Mesin foto'], 'Cap tembaga dicelup ke malam lalu ditekan ke kain sehingga motif cepat berulang.'],
  ['batik', 2, 'Motif kawung memiliki bentuk dasar…', 'Bulatan/elips geometris yang berulang', ['Gambar hewan laut', 'Huruf-huruf', 'Gambar gunung'], 'Kawung tersusun dari bentuk bulat lonjong yang tersusun rapi dan berulang.'],
  ['batik', 2, 'Tahap melepas malam dari kain dengan air panas disebut…', 'Nglorod', ['Nyanting', 'Njemur', 'Nyorek'], 'Nglorod (pelorodan) dilakukan setelah pewarnaan agar malam larut dan motif tampak.'],
  ['batik', 2, 'Warna khas batik Solo yang cokelat kekuningan hingga cokelat tua disebut…', 'Sogan', ['Neon', 'Pastel', 'Metalik'], 'Sogan berasal dari pewarna alami kulit pohon soga dan menjadi ciri batik Solo-Yogya.'],
  ['batik', 2, 'Urutan yang benar setelah kain selesai dicanting adalah…', 'Dicelup pewarna', ['Langsung dijahit', 'Dibakar', 'Digunting kecil-kecil'], 'Setelah malam menutup bagian motif, kain dicelup agar bagian lain berwarna.'],
  ['batik', 2, 'Motif parang ditandai dengan…', 'Garis miring diagonal yang bersambung', ['Lingkaran kecil bertebar', 'Kotak seperti papan catur', 'Gambar bunga teratai'], 'Parang berupa pola diagonal bersambung seperti ombak atau bilah.'],
  ['batik', 3, 'Batik Indonesia ditetapkan UNESCO sebagai Warisan Budaya Takbenda pada tahun…', '2009', ['1999', '2015', '1985'], 'Penetapan UNESCO pada 2 Oktober 2009 menjadi dasar Hari Batik Nasional.'],
  ['batik', 3, 'Mana yang paling tepat disebut batik secara tradisional?', 'Kain bermotif yang dibuat dengan perintang warna malam', ['Kain bermotif hasil cetak mesin tanpa malam', 'Semua kain bergambar bunga', 'Kain polos berwarna cokelat'], 'Ciri batik adalah teknik perintang warna (wax-resist) memakai malam; kain bermotif batik hasil cetak biasa disebut tekstil motif batik.'],
  ['batik', 3, 'Motif truntum sering dimaknai sebagai lambang…', 'Cinta yang tumbuh kembali dan tulus', ['Kemenangan perang', 'Kekayaan harta', 'Kekuatan sungai'], 'Truntum berarti "bersemi lagi"; banyak diceritakan sebagai simbol cinta yang tumbuh kembali.'],
  ['batik', 3, 'Mengapa motif batik tertentu dipilih untuk acara tertentu?', 'Karena motif membawa makna dan harapan', ['Karena warnanya murah', 'Karena mudah dilipat', 'Tidak ada alasan apa pun'], 'Banyak motif batik memuat makna dan doa sehingga dipilih sesuai acara.'],
  // ---------------- WAYANG
  ['wayang', 1, 'Orang yang memainkan wayang kulit disebut…', 'Dalang', ['Penari', 'Pemahat', 'Pelukis'], 'Dalang menggerakkan wayang, mengisi suara, dan memimpin pertunjukan.'],
  ['wayang', 1, 'Musik pengiring pertunjukan wayang kulit adalah…', 'Gamelan', ['Piano', 'Gitar listrik', 'Biola'], 'Gamelan terdiri dari saron, bonang, kendang, gong, dan alat lain.'],
  ['wayang', 1, 'Wayang kulit dibuat dari…', 'Kulit hewan yang ditatah dan disungging', ['Plastik', 'Kertas koran', 'Kaca'], 'Kulit (misalnya kerbau atau sapi) ditatah lalu diwarnai.'],
  ['wayang', 1, 'Layar putih tempat bayangan wayang tampil disebut…', 'Kelir', ['Gunungan', 'Blencong', 'Gender'], 'Kelir adalah layar; lampu di belakangnya membuat bayangan wayang terlihat.'],
  ['wayang', 1, 'Tokoh punakawan yang bertubuh bulat dan bijak adalah…', 'Semar', ['Arjuna', 'Bima', 'Yudhistira'], 'Semar dikenal sebagai pengasuh dan penasihat bijak.'],
  ['wayang', 2, 'Empat punakawan adalah…', 'Semar, Gareng, Petruk, Bagong', ['Arjuna, Bima, Nakula, Sadewa', 'Rama, Sinta, Laksmana, Hanoman', 'Semar, Arjuna, Bima, Gatotkaca'], 'Punakawan menemani dan menasihati para ksatria.'],
  ['wayang', 2, 'Gunungan (kayon) dipakai antara lain untuk…', 'Membuka dan menutup pertunjukan serta pergantian adegan', ['Menyimpan wayang', 'Mematikan lampu', 'Menghitung penonton'], 'Gunungan menjadi tanda awal, akhir, dan perubahan suasana.'],
  ['wayang', 2, 'Lampu minyak tradisional yang menerangi kelir bernama…', 'Blencong', ['Lentera kertas', 'Obor sungai', 'Senter'], 'Cahaya blencong yang bergoyang membuat bayangan wayang tampak hidup.'],
  ['wayang', 2, 'Pandawa yang terkenal ahli memanah adalah…', 'Arjuna', ['Bima', 'Semar', 'Petruk'], 'Arjuna digambarkan sebagai ksatria halus dan pemanah ulung.'],
  ['wayang', 2, 'Dua epos besar yang menjadi sumber banyak lakon wayang adalah…', 'Ramayana dan Mahabharata', ['Malin Kundang dan Sangkuriang', 'Iliad dan Odyssey', 'Timun Mas dan Bawang Merah'], 'Banyak lakon wayang berasal dari dua epos ini lalu diadaptasi budaya Jawa.'],
  ['wayang', 2, 'Hari Wayang Nasional diperingati pada tanggal…', '7 November', ['2 Oktober', '21 April', '1 Juni'], 'Tanggal 7 November dipilih mengingat pengakuan UNESCO atas wayang pada 7 November 2003.'],
  ['wayang', 3, 'Berapa saudara Pandawa?', 'Lima', ['Tiga', 'Tujuh', 'Seratus'], 'Pandawa lima: Yudhistira, Bima, Arjuna, Nakula, Sadewa.'],
  ['wayang', 3, 'Punakawan dikenal sebagai tokoh khas wayang Jawa. Peran mereka adalah…', 'Pengasuh, penghibur, dan penasihat ksatria', ['Raja penakluk', 'Dewa penguasa langit', 'Musuh utama Pandawa'], 'Punakawan menyampaikan nasihat dan kritik lewat humor.'],
  ['wayang', 3, 'Adegan "goro-goro" dalam pertunjukan wayang biasanya…', 'Penuh humor dengan punakawan', ['Adegan penutup', 'Adegan upacara raja', 'Adegan tanpa dialog'], 'Goro-goro menjadi selingan segar sekaligus tempat nasihat.'],
  ['wayang', 3, 'Pertunjukan wayang orang di Solo terkenal di…', 'Sriwedari', ['Pasar Gede', 'Alun-alun Kidul', 'Laweyan'], 'Wayang Orang Sriwedari menjadi ikon seni pertunjukan Solo.'],
  // ---------------- KERIS
  ['keris', 1, 'Di museum, keris dipandang sebagai…', 'Karya seni dan warisan budaya', ['Mainan', 'Alat dapur', 'Alat tulis'], 'Keris adalah pusaka budaya yang dihargai karena seni, sejarah, dan maknanya.'],
  ['keris', 1, 'Ahli pembuat keris disebut…', 'Empu', ['Dalang', 'Pembatik', 'Penari'], 'Empu membuat keris dengan keahlian khusus dan penuh tata cara.'],
  ['keris', 1, 'Bagian keris yang menjadi pegangan disebut…', 'Hulu', ['Warangka', 'Pamor', 'Luk'], 'Hulu sering diukir dengan bentuk indah.'],
  ['keris', 1, 'Sarung keris yang terbuat dari kayu disebut…', 'Warangka', ['Bilah', 'Hulu', 'Pamor'], 'Warangka melindungi bilah dan sering dihias indah.'],
  ['keris', 1, 'Saat melihat koleksi di museum, sikap yang benar adalah…', 'Tidak menyentuh dan mengikuti arahan petugas', ['Menyentuh semua koleksi', 'Berlari-lari', 'Memindahkan benda pamer'], 'Tangan kita membawa minyak dan debu yang bisa merusak benda tua.'],
  ['keris', 2, 'Lekukan pada bilah keris disebut…', 'Luk', ['Pamor', 'Pendok', 'Mendak'], 'Luk adalah gelombang pada bilah; ada juga bilah yang lurus.'],
  ['keris', 2, 'Motif guratan pada bilah keris yang berasal dari lapisan logam disebut…', 'Pamor', ['Warangka', 'Mendak', 'Hulu'], 'Pamor tampak sebagai pola unik pada bilah.'],
  ['keris', 2, 'Selongsong logam yang melapisi warangka disebut…', 'Pendok', ['Hulu', 'Luk', 'Empu'], 'Pendok memperindah dan melindungi bagian warangka.'],
  ['keris', 2, 'Mengapa koleksi keris disimpan dalam vitrin kaca?', 'Melindungi dari sentuhan, debu, dan kelembapan', ['Agar tampak mahal', 'Agar bisa dijual', 'Agar tidak diberi nama'], 'Perawatan koleksi (konservasi) menjaga benda tetap awet.'],
  ['keris', 2, 'Tradisi membersihkan dan merawat pusaka yang sering dikaitkan dengan bulan Suro disebut…', 'Jamasan', ['Sekaten', 'Kirab', 'Grebeg'], 'Jamasan pusaka adalah tradisi perawatan yang dilakukan dengan penuh tata krama.'],
  ['keris', 3, 'UNESCO mengakui keris Indonesia sebagai Karya Agung Warisan Budaya Takbenda pada tahun…', '2005', ['1985', '1995', '2020'], 'Pengakuan ini menegaskan keris sebagai warisan dunia yang perlu dilestarikan.'],
  ['keris', 3, 'Jumlah luk pada keris yang berlekuk umumnya…', 'Ganjil (misalnya 3, 5, 7)', ['Selalu genap', 'Selalu sepuluh', 'Tidak pernah ada'], 'Pada keris berlekuk, jumlah luk lazimnya ganjil; ada pula keris berbilah lurus.'],
  ['keris', 3, 'Keris sering dipandang sebagai ageman atau pusaka karena…', 'Memuat nilai, status, dan harapan pemiliknya', ['Hanya murah dan mudah dibeli', 'Tidak punya makna', 'Hanya dipakai untuk memasak'], 'Selain bentuk, keris menyimpan nilai simbolik dalam budaya Jawa.'],
  ['keris', 3, 'Hulu keris sering dihias dengan…', 'Ukiran bentuk tokoh, hewan, atau ornamen', ['Tulisan latin besar', 'Foto keluarga', 'Plastik berwarna'], 'Ukiran hulu beragam dan menunjukkan seni pahat tradisional.'],
  // ---------------- BASA JAWA
  ['basa', 1, 'Arti "Matur nuwun" adalah…', 'Terima kasih', ['Selamat tidur', 'Permisi', 'Sampai jumpa'], 'Matur nuwun dipakai untuk berterima kasih dengan sopan.'],
  ['basa', 1, 'Arti "Sugeng enjing" adalah…', 'Selamat pagi', ['Selamat malam', 'Selamat jalan', 'Selamat makan'], 'Enjing berarti pagi.'],
  ['basa', 1, 'Basa Jawa yang dipakai kepada teman akrab seumuran biasanya…', 'Ngoko', ['Krama inggil', 'Bahasa isyarat', 'Bahasa baku resmi'], 'Ngoko dipakai pada suasana akrab.'],
  ['basa', 1, 'Arti kata "Monggo" adalah…', 'Silakan', ['Pergi', 'Besok', 'Marah'], 'Monggo dipakai untuk mempersilakan dengan ramah.'],
  ['basa', 1, 'Angka "loro" dalam bahasa Jawa berarti…', 'Dua', ['Satu', 'Tiga', 'Empat'], 'Siji = 1, loro = 2, telu = 3, papat = 4.'],
  ['basa', 2, 'Untuk berbicara dengan sopan kepada orang yang lebih tua, kita memakai…', 'Basa krama', ['Ngoko kasar', 'Bahasa gaul', 'Bahasa sandi'], 'Krama menunjukkan rasa hormat.'],
  ['basa', 2, 'Kata "makan" yang paling hormat untuk Simbah adalah…', 'Dhahar', ['Mangan', 'Nyuap', 'Ngunyah'], 'Mangan (ngoko), nedha (krama untuk diri sendiri), dhahar (krama inggil untuk orang yang dihormati).'],
  ['basa', 2, 'Arti kata "Kula" adalah…', 'Saya', ['Kamu', 'Dia', 'Kami semua'], 'Kula adalah kata ganti orang pertama yang sopan.'],
  ['basa', 2, '"Nuwun sewu" dipakai ketika…', 'Meminta izin atau permisi dengan sopan', ['Marah', 'Tertawa keras', 'Menolak'], 'Nuwun sewu mirip "permisi" atau "mohon maaf".'],
  ['basa', 2, 'Kalimat paling santun untuk Simbah adalah…', 'Kula badhe tindak dhateng pasar, Mbah.', ['Aku arep lunga menyang pasar, Mbah.', 'Gue mau ke pasar.', 'Ayo ke pasar, Mbah!'], 'Kalimat berkrama memakai kula, badhe, tindak, dhateng.'],
  ['basa', 2, 'Aksara Jawa dasar disebut…', 'Hanacaraka', ['Abjad', 'Hangul', 'Kanji'], 'Hanacaraka adalah urutan aksara Jawa (ha na ca ra ka …).'],
  ['basa', 3, 'Jumlah aksara dasar (nglegena) dalam Hanacaraka adalah…', '20', ['10', '26', '33'], 'Terdapat 20 aksara nglegena.'],
  ['basa', 3, 'Tingkat tutur yang paling menghormati lawan bicara memakai kosakata…', 'Krama inggil', ['Ngoko lugu', 'Bahasa campuran', 'Singkatan'], 'Krama inggil meninggikan orang yang diajak bicara atau dibicarakan.'],
  ['basa', 3, 'Contoh tembang macapat adalah…', 'Mijil', ['Dangdut', 'Qasidah', 'Keroncong'], 'Macapat memiliki banyak jenis, misalnya Mijil, Kinanthi, dan Pocung.'],
  ['basa', 3, '"Nyuwun pamit" dipakai untuk…', 'Berpamitan', ['Memulai pelajaran', 'Menolak', 'Menawar'], 'Dipakai ketika pamit kepada orang yang dihormati.'],
  // ---------------- SOLO UMUM
  ['solo', 1, 'Sungai terkenal yang mengalir di Solo dan terkenal lewat lagu adalah…', 'Bengawan Solo', ['Citarum', 'Musi', 'Kapuas'], 'Lagu "Bengawan Solo" menjadi lagu yang dikenal luas.'],
  ['solo', 1, 'Nama lain Kota Solo adalah…', 'Surakarta', ['Yogyakarta', 'Semarang', 'Madiun'], 'Solo dikenal pula dengan nama Surakarta.'],
  ['solo', 1, 'Yang termasuk warisan budaya takbenda UNESCO dari Indonesia adalah…', 'Wayang, keris, dan batik', ['Mobil dan motor', 'Pizza dan burger', 'Komputer dan ponsel'], 'Wayang, keris, dan batik masing-masing diakui UNESCO.'],
  ['solo', 2, 'Pencipta lagu "Bengawan Solo" adalah…', 'Gesang', ['Ismail Marzuki', 'Ibu Sud', 'Koes Plus'], 'Gesang Martohartono berasal dari Solo.'],
  ['solo', 2, 'Salah satu pasar tradisional terkenal di Solo adalah…', 'Pasar Gede', ['Pasar Beringharjo', 'Pasar Senen', 'Pasar Baru'], 'Pasar Gede menjadi pusat jajanan dan belanja tradisional.'],
  ['solo', 2, 'Salah satu makanan khas Solo adalah…', 'Selat Solo', ['Pempek', 'Papeda', 'Rendang'], 'Selat Solo adalah hidangan bergaya perpaduan Jawa dan Eropa.'],
  ['solo', 3, 'Kirab Kebo Bule Kyai Slamet di Keraton Surakarta digelar pada…', 'Malam 1 Suro', ['Malam Tahun Baru Masehi', '17 Agustus', 'Hari Natal'], 'Kirab ini dikenal sebagai bagian peringatan 1 Suro.'],
  ['solo', 3, 'Keraton Surakarta Hadiningrat dikenal sebagai pewaris tradisi…', 'Kerajaan Mataram', ['Kerajaan Sriwijaya', 'Kerajaan Kutai', 'Kerajaan Tarumanegara'], 'Kasunanan Surakarta memiliki hubungan sejarah dengan Mataram.'],
  ['solo', 3, 'Selain di Solo, tradisi Sekaten juga dikenal di…', 'Yogyakarta', ['Bandung', 'Medan', 'Makassar'], 'Sekaten diselenggarakan oleh keraton di Surakarta dan Yogyakarta.'],
  ['solo', 3, 'Gamelan memperoleh pengakuan UNESCO pada tahun…', '2021', ['2003', '2009', '2015'], 'Gamelan diakui sebagai Warisan Budaya Takbenda pada 2021.'],
];

const shuffle = <T,>(a: T[]): T[] => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

export const BANK: Q[] = RAW.map(([topic, d, question, right, wrong, explain]) => ({ topic, d, question, options: [right, ...wrong], answer: 0, explain }));

const WEIGHT: Record<Jenjang, Record<1 | 2 | 3, number>> = {
  sd: { 1: 0.75, 2: 0.25, 3: 0 },
  smp: { 1: 0.25, 2: 0.55, 3: 0.2 },
  sma: { 1: 0.05, 2: 0.4, 3: 0.55 },
};

/** Acak urutan pilihan, SD mendapat 3 pilihan saja. */
export function prepare(q: Q, j: Jenjang): Q {
  const right = q.options[q.answer];
  let wrong = q.options.filter((_, i) => i !== q.answer);
  if (j === 'sd' && wrong.length > 2) wrong = shuffle(wrong).slice(0, 2);
  const opts = shuffle([right, ...wrong]);
  return { ...q, options: opts, answer: opts.indexOf(right) };
}

export function localQuestions(topic: Topic | 'mix', j: Jenjang, n: number, exclude: string[] = []): Q[] {
  let pool = BANK.filter((q) => (topic === 'mix' || q.topic === topic) && !exclude.includes(q.question));
  const w = WEIGHT[j];
  const picked: Q[] = [];
  while (picked.length < n && pool.length) {
    const total = pool.reduce((s, q) => s + w[q.d || 1] + 0.02, 0);
    let r = Math.random() * total, idx = 0;
    for (let i = 0; i < pool.length; i++) { r -= w[pool[i].d || 1] + 0.02; if (r <= 0) { idx = i; break; } }
    picked.push(pool[idx]); pool = pool.filter((_, i) => i !== idx);
  }
  if (picked.length < n) picked.push(...shuffle(BANK.filter((q) => !picked.includes(q))).slice(0, n - picked.length));
  return picked.map((q) => prepare(q, j));
}

/** Campuran soal lokal (terkunci kebenarannya) dan soal segar dari AI bila tersedia. */
export async function getQuestions(topic: Topic | 'mix', j: Jenjang, n: number, useAI = true): Promise<{ qs: Q[]; ai: boolean }> {
  if (useAI && aiAvailable()) {
    const nAi = Math.max(1, Math.floor(n / 2));
    try {
      const local = localQuestions(topic, j, n - nAi);
      const aiQs = (await genQuiz(topic, j, nAi, local.map((q) => q.question))).map((q) => prepare(q as Q, j));
      return { qs: shuffle([...local, ...aiQs]).slice(0, n), ai: true };
    } catch { /* jatuh ke soal lokal */ }
  }
  return { qs: localQuestions(topic, j, n), ai: false };
}
