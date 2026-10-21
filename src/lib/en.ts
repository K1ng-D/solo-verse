/** Kamus Indonesia -> Inggris untuk teks statis. Dimuat sekali (side-effect import di state.tsx). */
import { addPatterns, reg, tr } from "./i18n";

reg({
  // ---- umum / ui
  Tutup: "Close",
  "Mulai!": "Start!",
  "Hebat!": "Great!",
  "Belum berhasil": "Not yet",
  Ulangi: "Retry",
  Lanjut: "Next",
  Keluar: "Exit",
  "Lanjut ▸": "Next ▸",
  "Lanjut ▶": "Next ▶",
  Selesai: "Done",
  Ulang: "Reset",
  // token untuk teks yang disusun dari beberapa bagian (children array)
  Soal: "Question",
  Kartu: "Card",
  "Beruntun:": "Streak:",
  "Petunjuk:": "Hint:",
  "tahap selesai": "stage complete",
  "latihan ulang": "practice again",
  "Sekar Emas": "Golden Flower",

  // ---- batik: motif (batikLib)
  "Kreasi Bebas": "Free Creation",
  "Bulatan lonjong yang membentuk bunga empat kelopak.":
    "Oval circles that form a four-petal flower.",
  "Garis miring bergelombang yang bersambung seperti ombak.":
    "Wavy diagonal lines that connect like waves.",
  "Bintang-bintang kecil yang bertebar seperti taburan bintang.":
    "Little stars scattered like a sprinkle of stars.",
  "Gambar apa saja dengan canting, boleh pakai simetri!":
    "Draw anything with the canting, symmetry allowed!",

  // ---- batik: menggambar
  "Nyanting: Gambar Batikmu": "Nyanting: Draw Your Batik",
  "Jadi pembatik!": "Be a batik maker!",
  "Pilih motif, lalu gambar di kain memakai canting (jarimu).":
    "Pick a motif, then draw on the cloth with the canting (your finger).",
  "Ikuti garis putus-putus. Makin teliti, makin banyak bintang!":
    "Follow the dotted lines. The more precise, the more stars!",
  "Coba tombol Simetri supaya motifmu rapi seperti kain sungguhan.":
    "Try the Symmetry button to make your motif neat like real cloth.",
  "Pilih Motif": "Choose a Motif",
  "Karya Batikmu": "Your Batik Work",
  "Kreasi bebas yang indah!": "A lovely free creation!",
  "Mau dengar komentar Bu Sekar tentang karyamu?":
    "Want to hear Bu Sekar's comments on your work?",
  "Bu Sekar sedang melihat…": "Bu Sekar is looking…",
  "Minta komentar lagi": "Ask for feedback again",
  "Minta komentar Bu Sekar": "Ask Bu Sekar for feedback",
  "Gambar lagi": "Draw again",
  "Simpan karya": "Save work",
  "Gambar bebas": "Free drawing",
  "Ikuti garis putus-putus": "Follow the dotted lines",
  Garis: "Line",
  "Titik (isen)": "Dot (isen)",
  "Simetri: ON": "Symmetry: ON",
  "Simetri: OFF": "Symmetry: OFF",
  "Pola: tampil": "Guide: shown",
  "Pola: sembunyi": "Guide: hidden",
  Tipis: "Thin",
  Sedang: "Medium",
  Tebal: "Thick",
  Urung: "Undo",
  Hapus: "Clear",
  "Selesai!": "Done!",
  "Gambar sedikit lagi…": "Draw a little more…",

  // ---- batik: celup warna
  Merah: "Red",
  Kuning: "Yellow",
  Biru: "Blue",
  Putih: "White",
  Hitam: "Black",
  Jingga: "Orange",
  "Merah + kuning = jingga, warna hangat seperti matahari terbit.":
    "Red + yellow = orange, a warm colour like the sunrise.",
  "Hijau Daun": "Leaf Green",
  "Kuning + biru = hijau, warna daun.":
    "Yellow + blue = green, the colour of leaves.",
  Ungu: "Purple",
  "Merah + biru = ungu.": "Red + blue = purple.",
  "Merah + kuning = jingga.": "Red + yellow = orange.",
  "Lebih banyak kuning membuat hijau lebih cerah.":
    "More yellow makes the green brighter.",
  "Cokelat Sogan": "Sogan Brown",
  "Sogan adalah cokelat khas batik Solo, secara tradisional dari kulit pohon soga.":
    "Sogan is the brown typical of Solo batik, traditionally from soga tree bark.",
  "Indigo (Nila)": "Indigo (Nila)",
  "Indigo/nila secara tradisional dari tanaman Indigofera; biru tua khas kain batik.":
    "Indigo/nila traditionally comes from the Indigofera plant; the deep blue typical of batik.",
  "Merah Soga": "Soga Red",
  "Merah kecokelatan hangat yang sering dipakai pada batik klasik.":
    "A warm reddish brown often used in classic batik.",
  "Sogan: cokelat khas batik Solo-Yogya; secara tradisional dari kulit kayu soga.":
    "Sogan: the brown typical of Solo-Yogya batik; traditionally from soga bark.",
  "Celup Warna": "Dye Bath",
  "Campur pewarna": "Mix the dyes",
  "Tekan pigmen untuk meneteskan warna ke mangkuk.":
    "Tap a pigment to drip colour into the bowl.",
  "Buat warnamu semirip warna target. Batas 10 tetes.":
    "Make your colour as close to the target as you can. Limit of 10 drops.",
  "Setelah 3 warna jadi, pilih satu untuk mencelup kain batikmu.":
    "After 3 colours are done, pick one to dye your batik cloth.",
  "Buat warna:": "Make the colour:",
  Target: "Target",
  Campuranmu: "Your mix",
  Kemiripan: "Match",
  "Pas!": "Perfect!",
  "Pilih warna celup": "Choose the dye colour",
  "Warna berikutnya": "Next colour",
  "Warna pas!": "Perfect colour!",
  "Tetes habis. Tekan Ulang, lalu coba komposisi lain.":
    "Out of drops. Tap Reset, then try another mix.",
  "Pilih Warna Celup": "Choose the Dye Colour",
  "Mencelup Kain": "Dyeing the Cloth",
  "Pilih warna untuk mencelup kain batikmu:":
    "Choose a colour to dye your batik cloth:",
  "Celup kain!": "Dye the cloth!",
  "Mencelup…": "Dipping…",
  "Nglorod: lepas malam!": "Nglorod: remove the wax!",
  "Motif muncul! Malam menahan warna, jadi garis tetap terang.":
    "The motif appears! The wax held back the colour, so the lines stay light.",

  // ---- wayang: gamelan
  "Sempurna!": "Perfect!",
  Bagus: "Good",
  Meleset: "Miss",
  "Tabuh Gamelan": "Play the Gamelan",
  "Jadi penabuh gamelan": "Be a gamelan player",
  "Nada emas jatuh ke garis. Tekan jalur yang sama tepat saat nada menyentuh garis.":
    "Golden notes fall toward the line. Tap the same lane exactly when a note touches the line.",
  "Sentuh jalur di bagian bawah layar.":
    "Touch the lanes at the bottom of the screen.",
  "Gong besar menandai akhir satu putaran lagu. Jangan sampai terlewat!":
    "The big gong marks the end of one round of the piece. Do not miss it!",
  "Latihan sekali lagi, ikuti iramanya!":
    "Practise once more and follow the rhythm!",

  // ---- wayang: cerita dalang
  "Panggung Ceritaku": "My Story Stage",
  "Jadi dalang!": "Be the dalang!",
  "Pilih dua tokoh wayang dan satu pesan moral.":
    "Pick two wayang characters and one moral message.",
  "Boleh menambahkan kejutan cerita buatanmu sendiri.":
    "You may add a story twist of your own.",
  "Lakonnya ditulis bersama Ki Wira, lalu tokoh-tokoh tampil di kelir!":
    "The play is written together with Ki Wira, then the characters appear on the screen!",
  "Susun Lakon": "Arrange the Play",
  "2. Pilih pesan moral": "2. Choose a moral message",
  "3. Kejutan cerita (boleh dikosongi)": "3. Story twist (optional)",
  "contoh: tiba-tiba turun hujan": "example: suddenly it starts to rain",
  "Ki Wira menulis lakonmu…": "Ki Wira is writing your play…",
  "Menyiapkan lakon…": "Preparing the play…",
  "Mulai pentas!": "Start the show!",
  "Tepuk tangan!": "Applause!",
  "Lakon baru ini ditulis bersama Ki Wira.":
    "This new play was written together with Ki Wira.",
  "Lakon bawaan dipakai.": "A built-in play was used.",
  Dalang: "Dalang",
  "Tamat ▶": "The End ▶",
  "bijak & penyayang": "wise & caring",
  "teliti & jenaka": "careful & funny",
  "jangkung & lucu": "tall & funny",
  "polos & apa adanya": "innocent & genuine",
  "ksatria halus": "gentle knight",
  "kuat & jujur": "strong & honest",
  Jujur: "Honesty",
  "Gotong royong": "Mutual cooperation",
  "Berani menolong": "Brave to help",
  "Menjaga lingkungan": "Caring for the environment",

  // ---- keris
  "Anatomi Keris": "Anatomy of the Keris",
  "Kenali bagian-bagian keris": "Learn the parts of the keris",
  "Keris adalah pusaka dan karya seni Jawa. Di sini kita belajar nama bagiannya.":
    "The keris is a Javanese heirloom and work of art. Here we learn the names of its parts.",
  "Seret nama ke lingkaran bernomor yang tepat (atau ketuk nama lalu ketuk lingkarannya).":
    "Drag each name to the right numbered circle (or tap a name, then tap the circle).",
  "Setiap jawaban benar membuka penjelasan singkat.":
    "Every correct answer reveals a short explanation.",
  "Kamu sudah mengenal anatomi keris!":
    "You now know the anatomy of the keris!",
  "Seret nama bagian ke lingkaran bernomor di gambar.":
    "Drag the part name to the numbered circle on the picture.",
  "Pegangan keris yang sering diukir indah.":
    "The keris handle, often beautifully carved.",
  "Bagian logam utama keris.": "The main metal part of the keris.",
  "Sarung kayu yang melindungi bilah.":
    "The wooden sheath that protects the blade.",
  "Lekukan (gelombang) pada bilah.": "The curves (waves) on the blade.",
  "Selongsong logam pelapis warangka.":
    "The metal casing that covers the sheath.",
  "Motif guratan pada bilah dari lapisan logam.":
    "The grain pattern on the blade, from layered metal.",
  "Cincin penghubung antara hulu dan bilah.":
    "The ring connecting the handle and the blade.",

  // ---- kartu (memory)
  "Pasangkan Kartu": "Match the Cards",
  "Cocokkan pasangan": "Match the pairs",
  "Balik dua kartu setiap giliran.": "Flip two cards each turn.",
  "Cocokkan kata dengan artinya. Ingat letak kartunya!":
    "Match each word with its meaning. Remember where the cards are!",
  "Makin sedikit salah, makin banyak bintang.":
    "The fewer the mistakes, the more stars.",
  "Semua pasangan ketemu!": "All pairs found!",
  "Alat penorehan malam": "Tool that draws the wax",
  "Lilin penahan warna": "Wax that blocks the dye",
  "Bulatan geometris berulang": "Repeating geometric circles",
  "Garis diagonal bersambung": "Connected diagonal lines",
  "Bintang kecil bertebar": "Scattered little stars",
  "Cokelat khas batik Solo": "The brown typical of Solo batik",
  "Melepas malam dengan air panas": "Removing wax with hot water",
  "Kampung batik di Solo": "Batik village in Solo",
  "Pemain wayang": "Wayang performer",
  "Layar putih": "White screen",
  "Lampu minyak": "Oil lamp",
  "Pembuka & penutup lakon": "Opens & closes the play",
  "Penasihat bijak, tubuh bulat": "Wise adviser, round body",
  "Tinggi, hidung panjang": "Tall, long nose",
  "Ksatria pemanah": "Archer knight",
  "Musik pengiring": "Accompanying music",
  "Pegangan keris": "Keris handle",
  "Sarung kayu keris": "Wooden keris sheath",
  "Bagian logam utama": "Main metal part",
  "Lekukan pada bilah": "Curves on the blade",
  "Motif pada bilah": "Pattern on the blade",
  "Selongsong logam warangka": "Metal casing of the sheath",
  "Pembuat keris": "Keris maker",
  "Tradisi merawat pusaka": "Heirloom care tradition",
  "Kata dan maknanya": "Words and their meanings",
  "Istilah wayang dan artinya": "Wayang terms and meanings",
  "Bagian keris dan fungsinya": "Keris parts and functions",

  // ---- urutan (order)
  "Susun kalimat Jawa": "Build a Javanese sentence",
  "Susun urutan": "Put in order",
  "Ketuk kata satu per satu sesuai urutan kalimat yang benar.":
    "Tap the words one by one in the order of the correct sentence.",
  "Ketuk langkah satu per satu sesuai urutan yang benar, dari awal.":
    "Tap the steps one by one in the correct order, from the start.",
  "Salah ketuk = kehilangan satu hati. Ada 3 hati.":
    "A wrong tap = lose one heart. You have 3 hearts.",
  "Ada petunjuk arti kata di bawah soal.":
    "Word meanings are shown as hints below the question.",
  "Pikirkan apa yang dilakukan lebih dulu.": "Think about what is done first.",
  "Hatimu habis. Coba lagi, kamu pasti bisa!":
    "You ran out of hearts. Try again, you can do it!",
  "Benar!": "Correct!",
  "Susunanmu muncul di sini…": "Your arrangement appears here…",
  "Urutan Membatik": "Steps of Batik Making",
  "Susun langkah membatik tulis dari awal sampai akhir!":
    "Put the steps of hand-drawn batik in order, from start to finish!",
  "Siapkan kain mori": "Prepare the mori cloth",
  "Gambar pola (nyorek)": "Sketch the pattern (nyorek)",
  "Torehkan malam dengan canting": "Draw the wax with the canting",
  "Celup kain ke pewarna": "Dip the cloth in dye",
  "Lorod malam dengan air panas": "Remove the wax with hot water (nglorod)",
  "Jemur sampai kering": "Dry in the sun",
  "Malam menahan warna, nglorod melepas malam sehingga motif tampak.":
    "The wax holds back colour; nglorod removes the wax so the motif appears.",
  "Urutkan jalannya pertunjukan wayang kulit!":
    "Put the wayang kulit performance in order!",
  "Gunungan dibuka": "The gunungan is opened",
  "Adegan di kerajaan (jejer)": "Scene at the royal court (jejer)",
  "Perang kembang": "Perang kembang (opening battle)",
  "Goro-goro bersama punakawan": "Goro-goro with the punakawan",
  "Perang besar": "The great battle",
  "Gunungan ditancapkan, selesai": "The gunungan is planted, the end",
  "Urutan umum dapat berbeda antar dalang dan gaya, tetapi gunungan selalu membuka dan menutup.":
    "The usual order can differ between dalang and styles, but the gunungan always opens and closes.",
  "Susun Ukara Jawa": "Build a Javanese Sentence",
  "Saya akan pergi ke pasar.": "I am going to the market.",
  "Kula = saya, badhe = akan, tindak = pergi":
    "Kula = I, badhe = will, tindak = go",
  "Simbah sudah makan.": "Grandma has eaten.",
  "Dhahar = makan (untuk orang yang dihormati)":
    "Dhahar = eat (for someone honoured)",
  "Selamat pagi, Pak Guru.": "Good morning, Teacher.",
  "Sugeng enjing = selamat pagi": "Sugeng enjing = good morning",
  "Terima kasih, Bu Guru.": "Thank you, Teacher.",
  "Matur nuwun = terima kasih": "Matur nuwun = thank you",

  // ---- sortir
  "Tata Tertib Museum": "Museum Etiquette",
  "Apakah ini sikap yang BOLEH atau JANGAN di museum?":
    "Is this behaviour ALLOWED or NOT ALLOWED in a museum?",
  BOLEH: "ALLOWED",
  JANGAN: "NOT ALLOWED",
  "Melihat koleksi dari jarak aman":
    "Looking at the collection from a safe distance",
  "Jarak aman melindungi koleksi dan pengunjung.":
    "A safe distance protects the collection and visitors.",
  "Menyentuh koleksi di dalam vitrin": "Touching items inside the glass case",
  "Minyak dan debu dari tangan bisa merusak benda tua.":
    "Oil and dust from hands can damage old objects.",
  "Bertanya sopan kepada pemandu": "Politely asking the guide",
  "Bertanya adalah cara belajar yang baik.": "Asking is a good way to learn.",
  "Berlari di ruang pamer": "Running in the exhibition hall",
  "Bisa menabrak benda atau orang.": "You could bump into objects or people.",
  "Mengayun-ayunkan replika keris": "Swinging a replica keris",
  "Keris adalah artefak budaya, bukan mainan.":
    "A keris is a cultural artefact, not a toy.",
  "Menjaga suara tetap tenang": "Keeping your voice calm",
  "Suara tenang membuat semua nyaman.":
    "A calm voice makes everyone comfortable.",
  "Membaca label keterangan koleksi": "Reading the collection labels",
  "Label memuat nama, asal, dan makna.":
    "Labels carry the name, origin, and meaning.",
  "Bersandar di kaca pajangan": "Leaning on the display glass",
  "Kaca bisa retak dan bergeser.": "The glass can crack and shift.",
  "Mengikuti arahan petugas": "Following the staff's directions",
  "Petugas tahu cara menjaga koleksi.":
    "The staff know how to look after the collection.",
  "Memindahkan benda pamer": "Moving the exhibits",
  "Benda pamer tidak boleh dipindah.": "Exhibits must not be moved.",
  "Membuang sampah di dekat koleksi": "Dropping rubbish near the collection",
  "Sampah mengundang hama.": "Rubbish attracts pests.",
  "Memotret jika diizinkan, tanpa blitz":
    "Taking photos if allowed, without flash",
  "Cahaya blitz dapat memudarkan warna benda tertentu.":
    "Flash can fade the colours of certain objects.",
  "Unggah-ungguh Basa": "Speech Levels",
  "Kata ini termasuk tingkat tutur yang mana?":
    "Which speech level does this word belong to?",
  "Mangan = makan (akrab).": "Mangan = eat (casual).",
  "Nedha = makan (sopan, untuk diri sendiri).":
    "Nedha = eat (polite, for oneself).",
  "Dhahar = makan (menghormati orang lain).":
    "Dhahar = eat (honouring someone else).",
  "Turu = tidur.": "Turu = sleep.",
  "Tilem = tidur (sopan).": "Tilem = sleep (polite).",
  "Sare = tidur (untuk orang yang dihormati).":
    "Sare = sleep (for someone honoured).",
  "Omah = rumah.": "Omah = house.",
  "Griya = rumah (sopan).": "Griya = house (polite).",
  "Kondur = pulang (menghormati).": "Kondur = go home (honorific).",
  "Mulih = pulang (akrab).": "Mulih = go home (casual).",
  "Aku = saya (akrab).": "Aku = I (casual).",
  "Kula = saya (sopan).": "Kula = I (polite).",
  "Pilah cepat!": "Sort fast!",
  "Salah atau kehabisan waktu = kehilangan satu hati.":
    "A wrong answer or running out of time = lose one heart.",
  "Hatimu habis. Pelan-pelan, coba lagi!":
    "You ran out of hearts. Take it slow and try again!",
  "Tepat!": "Right on!",
  "Kurang tepat": "Not quite",
  "Waktu habis.": "Time is up.",

  // ---- FAQ (jawaban NPC tanpa internet)
  "Canting itu alat kecil bertangkai dengan wadah malam cair. Ujungnya berlubang untuk menggambar garis halus di kain.":
    "A canting is a small tool with a handle and a reservoir of liquid wax. Its tip has a tiny hole for drawing fine lines on the cloth.",
  "Malam adalah lilin khusus batik. Setelah membeku, ia menahan warna sehingga bagian itu tetap terang saat dicelup.":
    "Malam is special batik wax. Once hardened, it holds back the dye so that part stays light when dipped.",
  "Kawung berpola bulatan lonjong yang berulang rapi. Dari jauh seperti bunga empat kelopak.":
    "Kawung has neatly repeating oval circles. From afar it looks like a four-petal flower.",
  "Parang berpola garis miring bersambung seperti ombak atau bilah. Banyak orang memaknainya sebagai semangat yang tak putus.":
    "Parang has connected diagonal lines like waves or blades. Many people read it as a spirit that never gives up.",
  "Sogan adalah warna cokelat khas batik Solo. Warna ini berasal dari pewarna alami kulit pohon soga.":
    "Sogan is the brown typical of Solo batik. It comes from the natural dye of soga tree bark.",
  "Laweyan adalah kampung batik di Solo. Rumah-rumahnya punya tembok tinggi dan banyak yang menjadi galeri batik.":
    "Laweyan is a batik village in Solo. Its houses have high walls and many are now batik galleries.",
  "Dalang adalah pemimpin pertunjukan wayang. Ia memainkan wayang, mengisi suara, dan memberi aba-aba kepada penabuh gamelan.":
    "The dalang leads a wayang performance. He moves the puppets, voices them, and cues the gamelan players.",
  "Gamelan adalah seperangkat alat musik dari logam seperti saron, bonang, kenong, dan gong. Gong besar menandai akhir satu putaran lagu.":
    "A gamelan is a set of metal instruments such as the saron, bonang, kenong, and gong. The big gong marks the end of one round of a piece.",
  "Punakawan adalah Semar, Gareng, Petruk, dan Bagong. Mereka menemani ksatria sambil menghibur dan memberi nasihat.":
    "The punakawan are Semar, Gareng, Petruk, and Bagong. They accompany the knights, entertaining and giving advice.",
  "Gunungan atau kayon dipakai untuk membuka dan menutup pertunjukan, juga menandai pergantian adegan.":
    "The gunungan or kayon opens and closes the performance and also marks scene changes.",
  "Kelir adalah layar putih. Lampu blencong di belakang wayang membuat bayangannya tampak di kelir.":
    "The kelir is the white screen. The blencong lamp behind the puppets casts their shadows on it.",
  "Empu adalah ahli pembuat keris. Pekerjaan ini membutuhkan keterampilan dan tata cara yang panjang.":
    "An empu is an expert keris maker. The work needs great skill and many customs.",
  "Luk adalah lekukan pada bilah keris. Ada juga keris yang bilahnya lurus.":
    "Luk are the curves on a keris blade. Some keris have straight blades.",
  "Pamor adalah motif guratan pada bilah yang berasal dari lapisan logam. Polanya unik pada tiap bilah.":
    "Pamor is the grain pattern on the blade that comes from layered metal. Each blade has a unique pattern.",
  "Warangka adalah sarung kayu yang melindungi bilah dan sering dihias indah.":
    "The warangka is a wooden sheath that protects the blade and is often beautifully decorated.",
  "Hulu adalah bagian pegangan keris yang sering berukir tokoh atau hewan.":
    "The hulu is the handle of the keris, often carved with figures or animals.",
  "Jamasan adalah tradisi merawat pusaka, sering dikaitkan dengan bulan Suro. Dilakukan dengan penuh tata krama.":
    "Jamasan is the tradition of caring for heirlooms, often linked to the month of Suro. It is done with proper etiquette.",
  'Ngoko dipakai untuk bicara akrab, misalnya kepada teman sebaya. Contoh: "Aku arep mangan".':
    'Ngoko is used for casual talk, for example with friends of the same age. Example: "Aku arep mangan" (I want to eat).',
  'Krama dipakai untuk bicara sopan. Contoh: "Kula badhe nedha" artinya "Saya mau makan".':
    'Krama is used for polite speech. Example: "Kula badhe nedha" means "I would like to eat".',
  "Matur nuwun artinya terima kasih. Kalau kepada orang yang lebih tua, ucapkan dengan sopan dan sedikit membungkuk.":
    "Matur nuwun means thank you. To an elder, say it politely with a slight bow.",
  "Sugeng enjing = selamat pagi, sugeng siang = selamat siang, sugeng sonten = selamat sore.":
    "Sugeng enjing = good morning, sugeng siang = good afternoon, sugeng sonten = good evening.",
  "Aksara Jawa dimulai dari Hanacaraka. Ada 20 aksara dasar yang disebut nglegena.":
    "Javanese script starts with Hanacaraka. There are 20 basic characters called nglegena.",
});

addPatterns([
  [
    /^\+(\d+) XP(?: · (.+))?$/,
    (m) => `+${m[1]} XP${m[2] ? " · " + tr(m[2]) : ""}`,
  ],
  [/^Naik ke Level (\d+)!$/, (m) => `Reached Level ${m[1]}!`],
  [
    /^Ketelitian mengikuti pola (.+): (\d+)%$/,
    (m) => `Accuracy following the ${m[1]} pattern: ${m[2]}%`,
  ],
  [/^Ketelitian: (\d+)%$/, (m) => `Accuracy: ${m[1]}%`],
  [/^Tinta: (\d+)%$/, (m) => `Ink: ${m[1]}%`],
  [/^Warna (\d+)\/(\d+)$/, (m) => `Colour ${m[1]}/${m[2]}`],
  [/^Salah taruh: (\d+)$/, (m) => `Misplaced: ${m[1]}`],
  [/^Pesan: (.*)$/, (m) => `Moral: ${tr(m[1])}`],
  [
    /^Sempurna (\d+) · Bagus (\d+) · Meleset (\d+)$/,
    (m) => `Perfect ${m[1]} · Good ${m[2]} · Miss ${m[3]}`,
  ],
  [/^Beruntun terbaik: (\d+)$/, (m) => `Best streak: ${m[1]}`],
  [/^Salah buka: (\d+)$/, (m) => `Wrong flips: ${m[1]}`],
  [/^Pasangan ketemu: (\d+)\/(\d+)$/, (m) => `Pairs found: ${m[1]}/${m[2]}`],
  [/^Salah: (\d+)$/, (m) => `Mistakes: ${m[1]}`],
  [/^Benar (\d+)\/(\d+)$/, (m) => `Correct ${m[1]}/${m[2]}`],
  [
    /^Setiap kartu hanya punya (\d+) detik\.$/,
    (m) => `Each card gives you only ${m[1]} seconds.`,
  ],
  [
    /^Bisa pakai tombol (.+) atau sentuh jalurnya\.$/,
    (m) => `You can use the keys ${m[1]} or touch the lanes.`,
  ],
  [
    /^Hmm, (.+) bukan di sini\. (.+)$/,
    (m) => `Hmm, ${m[1]} does not go here. ${tr(m[2])}`,
  ],
  [
    /^(.{2,24}): (.+)$/,
    (m) => {
      const t = tr(m[2]);
      return t !== m[2] ? `${tr(m[1])}: ${t}` : `${m[1]}: ${m[2]}`;
    },
  ],
  [/^Waktu habis\. (.+)$/, (m) => `Time is up. ${tr(m[1])}`],
]);
