import { aiAvailable, genQuiz, Jenjang, AiQuestion } from "../lib/ai";
import { EN } from "../lib/i18n";

export type Topic = "batik" | "wayang" | "keris" | "basa" | "solo";
export type Q = AiQuestion & { topic?: Topic; lv?: Jenjang };

/** Teks Indonesia, atau [Indonesia, Inggris]. Istilah yang sama di kedua bahasa cukup ditulis sekali. */
type X = string | [string, string];
const x = (v: X): string => {
  if (typeof v === "string") return v;
  EN[v[0]] = v[1];
  return v[0];
};

type Row = [Topic, Jenjang, X, X, X[], X];
// [topik, jenjang, soal, jawaban benar, pengecoh[], penjelasan]
// SD   : pengenalan konkret, 3 pilihan.
// SMP  : istilah dan pemahaman, 4 pilihan.
// SMA  : analisis, konteks, dan makna, 4 pilihan.
const RAW: Row[] = [
  // =============================================================== BATIK - SD
  [
    "batik",
    "sd",
    [
      "Alat kecil untuk menorehkan malam (lilin) saat membatik tulis disebut…",
      "The small tool for drawing hot wax when making hand-drawn (tulis) batik is called…",
    ],
    "Canting",
    [
      ["Palu", "Hammer"],
      ["Gunting", "Scissors"],
      ["Sendok", "Spoon"],
    ],
    [
      "Canting punya wadah kecil untuk malam cair dan ujung berlubang untuk menggambar garis.",
      "A canting has a small reservoir for liquid wax and a tiny spout for drawing lines.",
    ],
  ],
  [
    "batik",
    "sd",
    [
      "Bahan yang dipakai untuk menahan warna agar tidak meresap ke kain batik adalah…",
      "The material used to stop dye from soaking into batik cloth is…",
    ],
    ["Malam (lilin batik)", "Malam (batik wax)"],
    [
      ["Tepung", "Flour"],
      ["Garam", "Salt"],
      ["Pasir", "Sand"],
    ],
    [
      "Malam yang membeku menutup serat kain sehingga bagian itu tidak terkena warna.",
      "Hardened wax seals the cloth fibres so that part does not take the dye.",
    ],
  ],
  [
    "batik",
    "sd",
    [
      "Salah satu kampung batik terkenal di Kota Solo adalah…",
      "A famous batik village in the city of Solo is…",
    ],
    "Laweyan",
    ["Malioboro", "Kasongan", "Trowulan"],
    [
      "Kampung Batik Laweyan dikenal sebagai sentra batik di Solo.",
      "Laweyan Batik Village is known as a batik centre in Solo.",
    ],
  ],
  [
    "batik",
    "sd",
    [
      "Hari Batik Nasional diperingati setiap tanggal…",
      "National Batik Day is celebrated every year on…",
    ],
    ["2 Oktober", "2 October"],
    [
      ["17 Agustus", "17 August"],
      ["28 Oktober", "28 October"],
      ["21 April", "21 April"],
    ],
    [
      "Tanggal 2 Oktober dipilih karena UNESCO menetapkan batik Indonesia sebagai warisan budaya pada 2 Oktober 2009.",
      "UNESCO recognised Indonesian batik as cultural heritage on 2 October 2009.",
    ],
  ],
  [
    "batik",
    "sd",
    [
      "Batik cap dibuat dengan bantuan…",
      "Stamped batik (batik cap) is made with the help of…",
    ],
    ["Cap tembaga (stempel)", "A copper stamp"],
    [
      ["Pensil warna", "Coloured pencils"],
      ["Kuas cat air", "A watercolour brush"],
      ["Mesin foto", "A camera"],
    ],
    [
      "Cap tembaga dicelup ke malam lalu ditekan ke kain sehingga motif cepat berulang.",
      "The copper stamp is dipped in wax and pressed on the cloth, so the motif repeats quickly.",
    ],
  ],
  [
    "batik",
    "sd",
    [
      "Batik adalah seni menghias kain dengan bantuan…",
      "Batik is the art of decorating cloth with the help of…",
    ],
    ["Malam dan pewarna", "Wax and dye"],
    [
      ["Paku dan palu", "Nails and a hammer"],
      ["Listrik dan magnet", "Electricity and magnets"],
      ["Kertas dan lem", "Paper and glue"],
    ],
    [
      "Malam menahan warna di bagian tertentu, lalu kain dicelup pewarna.",
      "Wax blocks the colour in some areas, then the cloth is dipped in dye.",
    ],
  ],
  [
    "batik",
    "sd",
    [
      "Setelah dicanting, kain batik dicelup ke dalam…",
      "After it is drawn with the canting, batik cloth is dipped into…",
    ],
    ["Larutan pewarna", "Dye solution"],
    [
      ["Air gula", "Sugar water"],
      ["Minyak goreng", "Cooking oil"],
      ["Susu", "Milk"],
    ],
    [
      "Pencelupan memberi warna pada bagian kain yang tidak tertutup malam.",
      "Dipping colours the parts of the cloth that are not covered by wax.",
    ],
  ],

  // =============================================================== BATIK - SMP
  [
    "batik",
    "smp",
    [
      "Motif kawung memiliki bentuk dasar…",
      "The basic shape of the kawung motif is…",
    ],
    [
      "Bulatan/elips geometris yang berulang",
      "Repeating geometric circles/ellipses",
    ],
    [
      ["Gambar hewan laut", "Sea animals"],
      ["Huruf-huruf", "Letters"],
      ["Gambar gunung", "Mountains"],
    ],
    [
      "Kawung tersusun dari bentuk bulat lonjong yang tersusun rapi dan berulang.",
      "Kawung is made of oval shapes arranged neatly and repeated.",
    ],
  ],
  [
    "batik",
    "smp",
    [
      "Tahap melepas malam dari kain dengan air panas disebut…",
      "The step of removing wax from the cloth with hot water is called…",
    ],
    "Nglorod",
    ["Nyanting", "Njemur", "Nyorek"],
    [
      "Nglorod (pelorodan) dilakukan setelah pewarnaan agar malam larut dan motif tampak.",
      "Nglorod is done after dyeing so the wax melts away and the motif appears.",
    ],
  ],
  [
    "batik",
    "smp",
    [
      "Warna khas batik Solo yang cokelat kekuningan hingga cokelat tua disebut…",
      "The yellowish to dark brown colour typical of Solo batik is called…",
    ],
    "Sogan",
    [
      ["Neon", "Neon"],
      ["Pastel", "Pastel"],
      ["Metalik", "Metallic"],
    ],
    [
      "Sogan berasal dari pewarna alami kulit pohon soga dan menjadi ciri batik Solo-Yogya.",
      "Sogan comes from the natural dye of soga tree bark and marks Solo-Yogya batik.",
    ],
  ],
  [
    "batik",
    "smp",
    [
      "Urutan yang benar pada pembuatan batik tulis adalah…",
      "The correct order for making hand-drawn batik is…",
    ],
    [
      "Nyorek (pola) → nyanting → mencelup → nglorod",
      "Nyorek (pattern) → nyanting → dyeing → nglorod",
    ],
    [
      [
        "Nglorod → nyanting → mencelup → nyorek",
        "Nglorod → nyanting → dyeing → nyorek",
      ],
      [
        "Mencelup → nyorek → nglorod → nyanting",
        "Dyeing → nyorek → nglorod → nyanting",
      ],
      [
        "Nyanting → nglorod → nyorek → mencelup",
        "Nyanting → nglorod → nyorek → dyeing",
      ],
    ],
    [
      "Pola digambar dulu, ditulis dengan malam, dicelup, lalu malamnya dilepas.",
      "The pattern is sketched first, drawn in wax, dyed, and then the wax is removed.",
    ],
  ],
  [
    "batik",
    "smp",
    ["Motif parang ditandai dengan…", "The parang motif is recognised by…"],
    ["Garis miring diagonal yang bersambung", "Connected diagonal lines"],
    [
      ["Lingkaran kecil bertebar", "Scattered small circles"],
      ["Kotak seperti papan catur", "Chessboard squares"],
      ["Gambar bunga teratai", "Lotus flowers"],
    ],
    [
      "Parang berupa pola diagonal bersambung seperti ombak atau bilah.",
      "Parang is a connected diagonal pattern like waves or blades.",
    ],
  ],
  [
    "batik",
    "smp",
    [
      "Apa perbedaan utama batik tulis dan batik cap?",
      "What is the main difference between hand-drawn batik and stamped batik?",
    ],
    [
      "Tulis digambar tangan dengan canting, cap memakai stempel tembaga",
      "Tulis is drawn by hand with a canting; cap uses a copper stamp",
    ],
    [
      [
        "Tulis memakai mesin, cap memakai tangan",
        "Tulis uses a machine; cap is made by hand",
      ],
      [
        "Tulis tanpa malam, cap memakai malam",
        "Tulis uses no wax; cap uses wax",
      ],
      ["Tidak ada bedanya sama sekali", "There is no difference"],
    ],
    [
      "Batik tulis lebih lama dikerjakan; batik cap lebih cepat karena motif distempel.",
      "Hand-drawn batik takes longer; stamped batik is faster because the motif is stamped.",
    ],
  ],
  [
    "batik",
    "smp",
    [
      "Pewarna alami biru pada batik tradisional berasal dari tanaman…",
      "The natural blue dye in traditional batik comes from the plant…",
    ],
    ["Nila (indigo)", "Indigo (nila)"],
    [
      ["Kunyit", "Turmeric"],
      ["Cabai", "Chilli"],
      ["Kelapa", "Coconut"],
    ],
    [
      "Daun nila diolah menjadi pewarna biru yang sudah lama dipakai pembatik.",
      "Indigo leaves are processed into a blue dye long used by batik makers.",
    ],
  ],

  // =============================================================== BATIK - SMA
  [
    "batik",
    "sma",
    [
      "Batik Indonesia ditetapkan UNESCO sebagai Warisan Budaya Takbenda pada tahun…",
      "UNESCO inscribed Indonesian batik as Intangible Cultural Heritage in…",
    ],
    "2009",
    ["1999", "2015", "1985"],
    [
      "Penetapan UNESCO pada 2 Oktober 2009 menjadi dasar Hari Batik Nasional.",
      "The 2 October 2009 inscription is the basis of National Batik Day.",
    ],
  ],
  [
    "batik",
    "sma",
    [
      "Mana yang paling tepat disebut batik secara tradisional?",
      "Which is the most accurate traditional definition of batik?",
    ],
    [
      "Kain bermotif yang dibuat dengan perintang warna malam",
      "Patterned cloth made with wax as a dye-resist",
    ],
    [
      [
        "Kain bermotif hasil cetak mesin tanpa malam",
        "Machine-printed patterned cloth without wax",
      ],
      ["Semua kain bergambar bunga", "Any cloth with flowers on it"],
      ["Kain polos berwarna cokelat", "Plain brown cloth"],
    ],
    [
      "Ciri batik adalah teknik perintang warna (wax-resist) memakai malam; kain bermotif batik hasil cetak biasa disebut tekstil motif batik.",
      "Batik is defined by the wax-resist technique; printed cloth with batik-like motifs is called batik-motif textile.",
    ],
  ],
  [
    "batik",
    "sma",
    [
      "Motif truntum sering dimaknai sebagai lambang…",
      "The truntum motif is often interpreted as a symbol of…",
    ],
    [
      "Cinta yang tumbuh kembali dan tulus",
      "Love that blooms again, sincerely",
    ],
    [
      ["Kemenangan perang", "Victory in war"],
      ["Kekayaan harta", "Material wealth"],
      ["Kekuatan sungai", "The power of rivers"],
    ],
    [
      'Truntum berarti "bersemi lagi"; banyak diceritakan sebagai simbol cinta yang tumbuh kembali.',
      'Truntum means "to bloom again"; it is often told as a symbol of love that blossoms anew.',
    ],
  ],
  [
    "batik",
    "sma",
    [
      "Mengapa pola parang tertentu dahulu hanya boleh dipakai kalangan keraton?",
      "Why were certain parang patterns once reserved for the royal court?",
    ],
    [
      'Dianggap lambang wibawa raja sehingga menjadi "batik larangan"',
      'They were seen as a symbol of royal authority, a "forbidden batik"',
    ],
    [
      [
        "Karena bahannya sangat langka di desa",
        "Because the materials were rare in villages",
      ],
      ["Karena warnanya mudah luntur", "Because the colours faded easily"],
      [
        "Karena tidak ada yang bisa menggambarnya",
        "Because no one else could draw it",
      ],
    ],
    [
      "Beberapa motif diatur sebagai batik larangan yang menunjukkan kedudukan pemakainya di keraton.",
      "Some motifs were regulated as forbidden batik, showing the wearer's rank at court.",
    ],
  ],
  [
    "batik",
    "sma",
    [
      "Pola pengisi berupa titik dan garis halus di sela motif utama batik disebut…",
      "The fine dots and lines that fill the spaces around a main batik motif are called…",
    ],
    "Isen-isen",
    ["Nglorod", "Pamor", "Tumpal"],
    [
      "Isen-isen (misalnya cecek) memperkaya motif dan menunjukkan ketelitian pembatik.",
      "Isen-isen (such as cecek dots) enrich the motif and show the maker's precision.",
    ],
  ],
  [
    "batik",
    "sma",
    [
      'Tahap "nembok" dalam proses membatik adalah…',
      'The "nembok" step in making batik is…',
    ],
    [
      "Menutup bagian yang luas dengan malam agar tidak terkena warna",
      "Covering large areas with wax so they do not take the dye",
    ],
    [
      ["Melepas malam dengan air panas", "Removing wax with hot water"],
      ["Membuat pola awal dengan pensil", "Sketching the pattern in pencil"],
      ["Menjemur kain di bawah matahari", "Drying the cloth in the sun"],
    ],
    [
      "Nembok melindungi bidang tertentu sebelum kain dicelup warna berikutnya.",
      "Nembok protects certain areas before the cloth goes into the next dye bath.",
    ],
  ],
  [
    "batik",
    "sma",
    [
      "Batik Solo-Yogya klasik dibandingkan batik pesisir umumnya…",
      "Compared with coastal batik, classic Solo-Yogya batik is generally…",
    ],
    [
      "Bernuansa sogan/indigo dengan motif berfilosofi, sedangkan pesisir lebih cerah dan bebas",
      "In sogan/indigo tones with philosophical motifs, while coastal batik is brighter and freer",
    ],
    [
      ["Selalu memakai warna neon", "Always in neon colours"],
      ["Dibuat tanpa malam", "Made without wax"],
      ["Hanya dipakai untuk hiasan dinding", "Used only as wall decoration"],
    ],
    [
      "Batik pedalaman erat dengan tradisi keraton; batik pesisir dipengaruhi perdagangan dan budaya luar.",
      "Inland batik is tied to court tradition; coastal batik was shaped by trade and outside cultures.",
    ],
  ],
  [
    "batik",
    "sma",
    [
      "Motif sidomukti sering dipakai pada upacara pernikahan karena maknanya…",
      "The sidomukti motif is often used at weddings because it signifies…",
    ],
    [
      "Harapan hidup mulia dan sejahtera",
      "The hope for a noble and prosperous life",
    ],
    [
      ["Kemenangan perang", "Victory in war"],
      ["Perjalanan jauh", "A long journey"],
      ["Panen yang melimpah", "An abundant harvest"],
    ],
    [
      '"Sido" berarti jadi/terus; sidomukti dimaknai sebagai harapan hidup mulia dan makmur.',
      '"Sido" means to become/continue; sidomukti is read as a wish for a noble, prosperous life.',
    ],
  ],

  // =============================================================== WAYANG - SD
  [
    "wayang",
    "sd",
    [
      "Orang yang memainkan wayang kulit disebut…",
      "The person who performs wayang kulit is called…",
    ],
    "Dalang",
    [
      ["Penari", "Dancer"],
      ["Pemahat", "Sculptor"],
      ["Pelukis", "Painter"],
    ],
    [
      "Dalang menggerakkan wayang, mengisi suara, dan memimpin pertunjukan.",
      "The dalang moves the puppets, voices them, and leads the performance.",
    ],
  ],
  [
    "wayang",
    "sd",
    [
      "Musik pengiring pertunjukan wayang kulit adalah…",
      "The music that accompanies a wayang kulit show is…",
    ],
    "Gamelan",
    [
      ["Piano", "Piano"],
      ["Gitar listrik", "Electric guitar"],
      ["Biola", "Violin"],
    ],
    [
      "Gamelan terdiri dari saron, bonang, kendang, gong, dan alat lain.",
      "A gamelan includes the saron, bonang, kendang, gong, and other instruments.",
    ],
  ],
  [
    "wayang",
    "sd",
    ["Wayang kulit dibuat dari…", "Wayang kulit puppets are made from…"],
    [
      "Kulit hewan yang ditatah dan disungging",
      "Animal hide that is carved and painted",
    ],
    [
      ["Plastik", "Plastic"],
      ["Kertas koran", "Newspaper"],
      ["Kaca", "Glass"],
    ],
    [
      "Kulit (misalnya kerbau atau sapi) ditatah lalu diwarnai.",
      "Hide (for example buffalo or cow) is carved and then coloured.",
    ],
  ],
  [
    "wayang",
    "sd",
    [
      "Layar putih tempat bayangan wayang tampil disebut…",
      "The white screen where the puppet shadows appear is called…",
    ],
    "Kelir",
    ["Gunungan", "Blencong", "Gender"],
    [
      "Kelir adalah layar; lampu di belakangnya membuat bayangan wayang terlihat.",
      "The kelir is the screen; the lamp behind it makes the shadows visible.",
    ],
  ],
  [
    "wayang",
    "sd",
    [
      "Tokoh punakawan yang bertubuh bulat dan bijak adalah…",
      "The round and wise punakawan character is…",
    ],
    "Semar",
    ["Arjuna", "Bima", "Yudhistira"],
    [
      "Semar dikenal sebagai pengasuh dan penasihat bijak.",
      "Semar is known as a wise caretaker and adviser.",
    ],
  ],
  [
    "wayang",
    "sd",
    [
      "Tokoh punakawan yang tubuhnya jangkung dan hidungnya panjang adalah…",
      "The tall punakawan with the long nose is…",
    ],
    "Petruk",
    ["Semar", "Gareng", "Hanoman"],
    [
      "Petruk digambarkan jangkung, hidung panjang, dan jenaka.",
      "Petruk is drawn tall, long-nosed, and funny.",
    ],
  ],
  [
    "wayang",
    "sd",
    [
      "Kera putih yang setia membantu Rama dalam kisah Ramayana adalah…",
      "The loyal white monkey who helps Rama in the Ramayana is…",
    ],
    "Hanoman",
    ["Petruk", "Rahwana", "Bagong"],
    [
      "Hanoman dikenal gagah berani dan setia kepada Rama.",
      "Hanoman is known for his bravery and loyalty to Rama.",
    ],
  ],

  // =============================================================== WAYANG - SMP
  [
    "wayang",
    "smp",
    ["Empat punakawan adalah…", "The four punakawan are…"],
    "Semar, Gareng, Petruk, Bagong",
    [
      "Arjuna, Bima, Nakula, Sadewa",
      "Rama, Sinta, Laksmana, Hanoman",
      "Semar, Arjuna, Bima, Gatotkaca",
    ],
    [
      "Punakawan menemani dan menasihati para ksatria.",
      "The punakawan accompany and advise the knights.",
    ],
  ],
  [
    "wayang",
    "smp",
    [
      "Gunungan (kayon) dipakai antara lain untuk…",
      "The gunungan (kayon) is used, among other things, to…",
    ],
    [
      "Membuka dan menutup pertunjukan serta pergantian adegan",
      "Open and close the show and mark scene changes",
    ],
    [
      ["Menyimpan wayang", "Store the puppets"],
      ["Mematikan lampu", "Switch off the lamp"],
      ["Menghitung penonton", "Count the audience"],
    ],
    [
      "Gunungan menjadi tanda awal, akhir, dan perubahan suasana.",
      "The gunungan signals the beginning, the end, and changes of mood.",
    ],
  ],
  [
    "wayang",
    "smp",
    [
      "Lampu minyak tradisional yang menerangi kelir bernama…",
      "The traditional oil lamp that lights the screen is called…",
    ],
    "Blencong",
    [
      ["Lentera kertas", "Paper lantern"],
      ["Obor sungai", "River torch"],
      ["Senter", "Flashlight"],
    ],
    [
      "Cahaya blencong yang bergoyang membuat bayangan wayang tampak hidup.",
      "The flickering blencong light makes the shadows look alive.",
    ],
  ],
  [
    "wayang",
    "smp",
    [
      "Pandawa yang terkenal ahli memanah adalah…",
      "The Pandawa brother famous for archery is…",
    ],
    "Arjuna",
    ["Bima", "Semar", "Petruk"],
    [
      "Arjuna digambarkan sebagai ksatria halus dan pemanah ulung.",
      "Arjuna is portrayed as a gentle knight and a master archer.",
    ],
  ],
  [
    "wayang",
    "smp",
    [
      "Dua epos besar yang menjadi sumber banyak lakon wayang adalah…",
      "The two great epics that supply many wayang stories are…",
    ],
    "Ramayana dan Mahabharata",
    [
      "Malin Kundang dan Sangkuriang",
      "Iliad dan Odyssey",
      "Timun Mas dan Bawang Merah",
    ],
    [
      "Banyak lakon wayang berasal dari dua epos ini lalu diadaptasi budaya Jawa.",
      "Many stories come from these epics and were adapted into Javanese culture.",
    ],
  ],
  [
    "wayang",
    "smp",
    [
      "Hari Wayang Nasional diperingati pada tanggal…",
      "National Wayang Day is observed on…",
    ],
    ["7 November", "7 November"],
    [
      ["2 Oktober", "2 October"],
      ["21 April", "21 April"],
      ["1 Juni", "1 June"],
    ],
    [
      "Tanggal 7 November dipilih mengingat pengakuan UNESCO atas wayang pada 7 November 2003.",
      "7 November marks UNESCO's recognition of wayang on 7 November 2003.",
    ],
  ],
  [
    "wayang",
    "smp",
    ["Berapa saudara Pandawa?", "How many Pandawa brothers are there?"],
    ["Lima", "Five"],
    [
      ["Tiga", "Three"],
      ["Tujuh", "Seven"],
      ["Seratus", "One hundred"],
    ],
    [
      "Pandawa lima: Yudhistira, Bima, Arjuna, Nakula, Sadewa.",
      "The five Pandawa: Yudhistira, Bima, Arjuna, Nakula, Sadewa.",
    ],
  ],

  // =============================================================== WAYANG - SMA
  [
    "wayang",
    "sma",
    [
      "Punakawan dikenal sebagai tokoh khas wayang Jawa. Peran mereka adalah…",
      "The punakawan are typical Javanese wayang characters. Their role is…",
    ],
    [
      "Pengasuh, penghibur, dan penasihat ksatria",
      "Caretakers, entertainers, and advisers to the knights",
    ],
    [
      ["Raja penakluk", "Conquering kings"],
      ["Dewa penguasa langit", "Gods ruling the sky"],
      ["Musuh utama Pandawa", "The main enemies of the Pandawa"],
    ],
    [
      "Punakawan menyampaikan nasihat dan kritik lewat humor.",
      "The punakawan deliver advice and criticism through humour.",
    ],
  ],
  [
    "wayang",
    "sma",
    [
      'Adegan "goro-goro" dalam pertunjukan wayang biasanya…',
      'The "goro-goro" scene in a wayang show is usually…',
    ],
    ["Penuh humor dengan punakawan", "Full of humour with the punakawan"],
    [
      ["Adegan penutup", "The closing scene"],
      ["Adegan upacara raja", "A royal ceremony scene"],
      ["Adegan tanpa dialog", "A scene with no dialogue"],
    ],
    [
      "Goro-goro menjadi selingan segar sekaligus tempat nasihat.",
      "Goro-goro is a light interlude and also a place for advice.",
    ],
  ],
  [
    "wayang",
    "sma",
    [
      "Pertunjukan wayang orang di Solo terkenal di…",
      "The wayang orang (human dance-drama) of Solo is famous at…",
    ],
    "Sriwedari",
    ["Pasar Gede", "Alun-alun Kidul", "Laweyan"],
    [
      "Wayang Orang Sriwedari menjadi ikon seni pertunjukan Solo.",
      "Wayang Orang Sriwedari is an icon of Solo's performing arts.",
    ],
  ],
  [
    "wayang",
    "sma",
    [
      "Dua sistem tangga nada (laras) pada gamelan Jawa adalah…",
      "The two tuning systems (laras) of Javanese gamelan are…",
    ],
    "Slendro dan pelog",
    ["Mayor dan minor", "Diatonis dan kromatis", "Pentatonik dan oktaf"],
    [
      "Slendro berlima nada, pelog berisi tujuh nada; keduanya dipakai bergantian sesuai gending.",
      "Slendro has five notes and pelog has seven; they are used according to the piece.",
    ],
  ],
  [
    "wayang",
    "sma",
    [
      "Dalang memberi isyarat kepada penabuh gamelan antara lain dengan…",
      "The dalang signals the gamelan players by, among other things…",
    ],
    [
      "Cempala (palu kecil) dan keprak",
      "The cempala (small mallet) and keprak",
    ],
    [
      ["Peluit", "A whistle"],
      ["Bendera", "A flag"],
      ["Lonceng sekolah", "A school bell"],
    ],
    [
      "Cempala diketukkan ke kotak wayang untuk memberi aba-aba pada musik.",
      "The cempala is tapped on the puppet chest to cue the music.",
    ],
  ],
  [
    "wayang",
    "sma",
    [
      'Wayang sering disebut sebagai "tontonan dan tuntunan" karena…',
      'Wayang is often called "spectacle and guidance" because…',
    ],
    [
      "Selain menghibur, ceritanya memuat nilai moral dan nasihat hidup",
      "Besides entertaining, its stories carry moral values and life advice",
    ],
    [
      ["Hanya dimainkan untuk anak-anak", "It is only played for children"],
      ["Dilarang ditonton orang dewasa", "Adults are forbidden to watch"],
      ["Tidak punya cerita", "It has no story"],
    ],
    [
      "Lakon wayang memuat pesan tentang kebaikan, tanggung jawab, dan keseimbangan hidup.",
      "Wayang stories carry messages about goodness, responsibility, and balance in life.",
    ],
  ],
  [
    "wayang",
    "sma",
    [
      "Pembagian malam pertunjukan wayang kulit semalam suntuk dalam tiga bagian suasana disebut…",
      "The three mood sections of an all-night wayang kulit performance are called…",
    ],
    "Pathet",
    ["Gending", "Kenong", "Sinden"],
    [
      "Pathet nem, sanga, dan manyura mengatur suasana dan musik dari awal hingga fajar.",
      "Pathet nem, sanga, and manyura shape the mood and music from dusk until dawn.",
    ],
  ],

  // =============================================================== KERIS - SD
  [
    "keris",
    "sd",
    ["Di museum, keris dipandang sebagai…", "In a museum, a keris is seen as…"],
    ["Karya seni dan warisan budaya", "A work of art and cultural heritage"],
    [
      ["Mainan", "A toy"],
      ["Alat dapur", "A kitchen tool"],
      ["Alat tulis", "A stationery item"],
    ],
    [
      "Keris adalah pusaka budaya yang dihargai karena seni, sejarah, dan maknanya.",
      "The keris is a cultural heirloom valued for its art, history, and meaning.",
    ],
  ],
  [
    "keris",
    "sd",
    ["Ahli pembuat keris disebut…", "An expert keris maker is called…"],
    "Empu",
    ["Dalang", "Pembatik", "Penari"],
    [
      "Empu membuat keris dengan keahlian khusus dan penuh tata cara.",
      "An empu makes a keris with special skill and many customs.",
    ],
  ],
  [
    "keris",
    "sd",
    [
      "Bagian keris yang menjadi pegangan disebut…",
      "The part of a keris used as the handle is called…",
    ],
    "Hulu",
    ["Warangka", "Pamor", "Luk"],
    [
      "Hulu sering diukir dengan bentuk indah.",
      "The hulu is often carved in beautiful shapes.",
    ],
  ],
  [
    "keris",
    "sd",
    [
      "Sarung keris yang terbuat dari kayu disebut…",
      "The wooden sheath of a keris is called…",
    ],
    "Warangka",
    ["Bilah", "Hulu", "Pamor"],
    [
      "Warangka melindungi bilah dan sering dihias indah.",
      "The warangka protects the blade and is often beautifully decorated.",
    ],
  ],
  [
    "keris",
    "sd",
    [
      "Saat melihat koleksi di museum, sikap yang benar adalah…",
      "When looking at museum collections, the right attitude is…",
    ],
    [
      "Tidak menyentuh dan mengikuti arahan petugas",
      "Do not touch and follow the staff's directions",
    ],
    [
      ["Menyentuh semua koleksi", "Touch every item"],
      ["Berlari-lari", "Run around"],
      ["Memindahkan benda pamer", "Move the displays"],
    ],
    [
      "Tangan kita membawa minyak dan debu yang bisa merusak benda tua.",
      "Our hands carry oil and dust that can damage old objects.",
    ],
  ],
  [
    "keris",
    "sd",
    [
      "Bagian keris yang terbuat dari logam dan berujung runcing disebut…",
      "The metal part of a keris that ends in a point is called…",
    ],
    "Bilah",
    ["Hulu", "Warangka", "Pendok"],
    [
      "Bilah adalah bagian utama keris dari logam.",
      "The bilah is the main metal part of the keris.",
    ],
  ],
  [
    "keris",
    "sd",
    [
      "Mengapa koleksi keris disimpan dalam vitrin kaca?",
      "Why are keris collections kept in glass cases?",
    ],
    [
      "Melindungi dari sentuhan, debu, dan kelembapan",
      "To protect them from touch, dust, and humidity",
    ],
    [
      ["Agar tampak mahal", "To look expensive"],
      ["Agar bisa dijual", "So they can be sold"],
      ["Agar tidak diberi nama", "So they are not given names"],
    ],
    [
      "Perawatan koleksi (konservasi) menjaga benda tetap awet.",
      "Caring for collections (conservation) keeps objects lasting.",
    ],
  ],

  // =============================================================== KERIS - SMP
  [
    "keris",
    "smp",
    [
      "Lekukan pada bilah keris disebut…",
      "The curves on a keris blade are called…",
    ],
    "Luk",
    ["Pamor", "Pendok", "Mendak"],
    [
      "Luk adalah gelombang pada bilah; ada juga bilah yang lurus.",
      "Luk are the waves on the blade; some blades are straight.",
    ],
  ],
  [
    "keris",
    "smp",
    [
      "Motif guratan pada bilah keris yang berasal dari lapisan logam disebut…",
      "The grain pattern on a keris blade that comes from layered metal is called…",
    ],
    "Pamor",
    ["Warangka", "Mendak", "Hulu"],
    [
      "Pamor tampak sebagai pola unik pada bilah.",
      "Pamor appears as a unique pattern on the blade.",
    ],
  ],
  [
    "keris",
    "smp",
    [
      "Selongsong logam yang melapisi warangka disebut…",
      "The metal casing that covers the warangka is called…",
    ],
    "Pendok",
    ["Hulu", "Luk", "Empu"],
    [
      "Pendok memperindah dan melindungi bagian warangka.",
      "The pendok decorates and protects part of the warangka.",
    ],
  ],
  [
    "keris",
    "smp",
    [
      "Tradisi membersihkan dan merawat pusaka yang sering dikaitkan dengan bulan Suro disebut…",
      "The tradition of cleaning and caring for heirlooms, often linked to the month of Suro, is called…",
    ],
    "Jamasan",
    ["Sekaten", "Kirab", "Grebeg"],
    [
      "Jamasan pusaka adalah tradisi perawatan yang dilakukan dengan penuh tata krama.",
      "Jamasan is a tradition of caring for heirlooms, done with proper etiquette.",
    ],
  ],
  [
    "keris",
    "smp",
    [
      "Cincin penghubung antara hulu dan bilah keris disebut…",
      "The ring connecting the handle and the blade of a keris is called…",
    ],
    "Mendak",
    ["Pendok", "Luk", "Pamor"],
    [
      "Mendak menjadi penghubung sekaligus hiasan pada pangkal hulu.",
      "The mendak links the parts and decorates the base of the handle.",
    ],
  ],
  [
    "keris",
    "smp",
    [
      "Dua bentuk warangka yang dikenal pada keris Jawa adalah…",
      "Two well-known shapes of warangka on Javanese keris are…",
    ],
    "Ladrang dan gayaman",
    ["Ladrang dan lurus", "Gayaman dan pamor", "Luk dan pendok"],
    [
      "Warangka ladrang biasa untuk busana resmi, gayaman lebih sederhana.",
      "The ladrang sheath suits formal dress; the gayaman is simpler.",
    ],
  ],
  [
    "keris",
    "smp",
    [
      "UNESCO mengakui keris Indonesia sebagai Karya Agung Warisan Budaya Takbenda pada tahun…",
      "UNESCO proclaimed the Indonesian keris a Masterpiece of Intangible Heritage in…",
    ],
    "2005",
    ["1985", "1995", "2020"],
    [
      "Pengakuan ini menegaskan keris sebagai warisan dunia yang perlu dilestarikan.",
      "This recognition affirms the keris as world heritage worth preserving.",
    ],
  ],

  // =============================================================== KERIS - SMA
  [
    "keris",
    "sma",
    [
      "Jumlah luk pada keris yang berlekuk umumnya…",
      "The number of luk on a curved keris is usually…",
    ],
    ["Ganjil (misalnya 3, 5, 7)", "Odd (for example 3, 5, 7)"],
    [
      ["Selalu genap", "Always even"],
      ["Selalu sepuluh", "Always ten"],
      ["Tidak pernah ada", "Never any"],
    ],
    [
      "Pada keris berlekuk, jumlah luk lazimnya ganjil; ada pula keris berbilah lurus.",
      "On curved keris the number of luk is usually odd; some keris have straight blades.",
    ],
  ],
  [
    "keris",
    "sma",
    [
      "Keris sering dipandang sebagai ageman atau pusaka karena…",
      "A keris is often seen as an ageman or heirloom because…",
    ],
    [
      "Memuat nilai, status, dan harapan pemiliknya",
      "It carries the values, status, and hopes of its owner",
    ],
    [
      ["Hanya murah dan mudah dibeli", "It is only cheap and easy to buy"],
      ["Tidak punya makna", "It has no meaning"],
      ["Hanya dipakai untuk memasak", "It is only used for cooking"],
    ],
    [
      "Selain bentuk, keris menyimpan nilai simbolik dalam budaya Jawa.",
      "Beyond its form, the keris holds symbolic value in Javanese culture.",
    ],
  ],
  [
    "keris",
    "sma",
    [
      "Bagian logam di pangkal bilah keris yang menjadi dudukan bilah pada hulu disebut…",
      "The metal part at the base of the blade that sits against the handle is called…",
    ],
    "Ganja",
    ["Pendok", "Mendak", "Warangka"],
    [
      "Ganja adalah bagian pangkal bilah yang dibuat terpisah dan menyatu dengan bilah.",
      "The ganja is the base of the blade, made separately and joined to the blade.",
    ],
  ],
  [
    "keris",
    "sma",
    [
      "Perajin yang khusus membuat warangka dan hulu kayu keris disebut…",
      "The craftsman who specialises in making keris wooden sheaths and handles is called…",
    ],
    "Mranggi",
    ["Empu", "Dalang", "Pande"],
    [
      "Mranggi menggarap bagian kayu, sedangkan empu menggarap logamnya.",
      "The mranggi works the wooden parts, while the empu works the metal.",
    ],
  ],
  [
    "keris",
    "sma",
    [
      "Perkiraan zaman dan gaya pembuatan sebuah keris dalam tradisi keris disebut…",
      "The estimate of a keris's era and style of making is called…",
    ],
    "Tangguh",
    ["Jamasan", "Dhapur", "Isen"],
    [
      "Tangguh dinilai dari ciri bilah, bahan, dan pola pamor.",
      "Tangguh is judged from the blade's features, material, and pamor pattern.",
    ],
  ],
  [
    "keris",
    "sma",
    [
      "Pamor pada bilah keris terbentuk dari…",
      "The pamor on a keris blade is formed from…",
    ],
    [
      "Lapisan logam berbeda yang ditempa dan dilipat",
      "Layers of different metals forged and folded",
    ],
    [
      ["Cat yang dilukis di permukaan", "Paint applied to the surface"],
      ["Ukiran mesin laser", "Laser engraving"],
      ["Tempelan stiker logam", "Metal stickers"],
    ],
    [
      "Pola pamor muncul setelah bilah dibersihkan karena lapisan logam bereaksi berbeda.",
      "The pattern appears when the blade is cleaned because the metal layers react differently.",
    ],
  ],
  [
    "keris",
    "sma",
    [
      "Keris disebut warisan budaya takbenda karena yang diakui adalah…",
      "The keris counts as intangible heritage because what is recognised includes…",
    ],
    [
      "Pengetahuan, keterampilan, dan tradisi pembuatan serta perawatannya",
      "The knowledge, skills, and traditions of making and caring for it",
    ],
    [
      ["Hanya bendanya", "Only the object"],
      ["Hanya harga jualnya", "Only its resale price"],
      ["Hanya ukurannya", "Only its size"],
    ],
    [
      "Warisan takbenda mencakup praktik dan pengetahuan, bukan hanya benda fisik.",
      "Intangible heritage covers practices and knowledge, not just physical objects.",
    ],
  ],

  // =============================================================== BASA JAWA - SD
  [
    "basa",
    "sd",
    ['Arti "Matur nuwun" adalah…', 'The meaning of "Matur nuwun" is…'],
    ["Terima kasih", "Thank you"],
    [
      ["Selamat tidur", "Good night"],
      ["Permisi", "Excuse me"],
      ["Sampai jumpa", "See you"],
    ],
    [
      "Matur nuwun dipakai untuk berterima kasih dengan sopan.",
      "Matur nuwun is used to say thank you politely.",
    ],
  ],
  [
    "basa",
    "sd",
    ['Arti "Sugeng enjing" adalah…', 'The meaning of "Sugeng enjing" is…'],
    ["Selamat pagi", "Good morning"],
    [
      ["Selamat malam", "Good evening"],
      ["Selamat jalan", "Goodbye"],
      ["Selamat makan", "Enjoy your meal"],
    ],
    ["Enjing berarti pagi.", "Enjing means morning."],
  ],
  [
    "basa",
    "sd",
    [
      "Basa Jawa yang dipakai kepada teman akrab seumuran biasanya…",
      "The Javanese style used with close friends of the same age is usually…",
    ],
    "Ngoko",
    [
      "Krama inggil",
      ["Bahasa isyarat", "Sign language"],
      ["Bahasa baku resmi", "Formal standard language"],
    ],
    [
      "Ngoko dipakai pada suasana akrab.",
      "Ngoko is used in casual, close settings.",
    ],
  ],
  [
    "basa",
    "sd",
    ['Arti kata "Monggo" adalah…', 'The meaning of "Monggo" is…'],
    ["Silakan", "Please (go ahead)"],
    [
      ["Pergi", "Go away"],
      ["Besok", "Tomorrow"],
      ["Marah", "Angry"],
    ],
    [
      "Monggo dipakai untuk mempersilakan dengan ramah.",
      "Monggo is used to invite someone kindly.",
    ],
  ],
  [
    "basa",
    "sd",
    [
      'Angka "loro" dalam bahasa Jawa berarti…',
      'The number "loro" in Javanese means…',
    ],
    ["Dua", "Two"],
    [
      ["Satu", "One"],
      ["Tiga", "Three"],
      ["Empat", "Four"],
    ],
    [
      "Siji = 1, loro = 2, telu = 3, papat = 4.",
      "Siji = 1, loro = 2, telu = 3, papat = 4.",
    ],
  ],
  [
    "basa",
    "sd",
    ['Arti kata "banyu" adalah…', 'The meaning of "banyu" is…'],
    ["Air", "Water"],
    [
      ["Api", "Fire"],
      ["Angin", "Wind"],
      ["Tanah", "Soil"],
    ],
    [
      "Banyu = air, geni = api, angin = angin, lemah = tanah.",
      "Banyu = water, geni = fire, angin = wind, lemah = soil.",
    ],
  ],
  [
    "basa",
    "sd",
    ['Arti kata "pitik" adalah…', 'The meaning of "pitik" is…'],
    ["Ayam", "Chicken"],
    [
      ["Bebek", "Duck"],
      ["Kucing", "Cat"],
      ["Ikan", "Fish"],
    ],
    [
      "Pitik = ayam, bebek = bebek, kucing = kucing.",
      "Pitik = chicken, bebek = duck, kucing = cat.",
    ],
  ],

  // =============================================================== BASA JAWA - SMP
  [
    "basa",
    "smp",
    [
      "Untuk berbicara dengan sopan kepada orang yang lebih tua, kita memakai…",
      "To speak politely to someone older, we use…",
    ],
    "Basa krama",
    [
      ["Ngoko kasar", "Rough ngoko"],
      ["Bahasa gaul", "Slang"],
      ["Bahasa sandi", "Code language"],
    ],
    ["Krama menunjukkan rasa hormat.", "Krama shows respect."],
  ],
  [
    "basa",
    "smp",
    [
      'Kata "makan" yang paling hormat untuk Simbah adalah…',
      'The most respectful word for "eat" when speaking about Simbah is…',
    ],
    "Dhahar",
    ["Mangan", "Nyuap", "Ngunyah"],
    [
      "Mangan (ngoko), nedha (krama untuk diri sendiri), dhahar (krama inggil untuk orang yang dihormati).",
      "Mangan (ngoko), nedha (krama for oneself), dhahar (krama inggil for someone honoured).",
    ],
  ],
  [
    "basa",
    "smp",
    ['Arti kata "Kula" adalah…', 'The meaning of "Kula" is…'],
    ["Saya", "I / me"],
    [
      ["Kamu", "You"],
      ["Dia", "He / she"],
      ["Kami semua", "All of us"],
    ],
    [
      "Kula adalah kata ganti orang pertama yang sopan.",
      "Kula is a polite first-person pronoun.",
    ],
  ],
  [
    "basa",
    "smp",
    ['"Nuwun sewu" dipakai ketika…', '"Nuwun sewu" is used when…'],
    [
      "Meminta izin atau permisi dengan sopan",
      "Politely asking permission or excusing oneself",
    ],
    [
      ["Marah", "Angry"],
      ["Tertawa keras", "Laughing loudly"],
      ["Menolak", "Refusing"],
    ],
    [
      'Nuwun sewu mirip "permisi" atau "mohon maaf".',
      'Nuwun sewu is like "excuse me" or "pardon me".',
    ],
  ],
  [
    "basa",
    "smp",
    [
      "Kalimat paling santun untuk Simbah adalah…",
      "The most polite sentence to say to Simbah is…",
    ],
    "Kula badhe tindak dhateng pasar, Mbah.",
    [
      "Aku arep lunga menyang pasar, Mbah.",
      ["Gue mau ke pasar.", "I want to go to the market (slang)."],
      ["Ayo ke pasar, Mbah!", "Let's go to the market, Mbah!"],
    ],
    [
      "Kalimat berkrama memakai kula, badhe, tindak, dhateng.",
      "The krama sentence uses kula, badhe, tindak, dhateng.",
    ],
  ],
  [
    "basa",
    "smp",
    ["Aksara Jawa dasar disebut…", "The basic Javanese script is called…"],
    "Hanacaraka",
    [["Abjad", "Alphabet"], "Hangul", "Kanji"],
    [
      "Hanacaraka adalah urutan aksara Jawa (ha na ca ra ka …).",
      "Hanacaraka is the sequence of Javanese script (ha na ca ra ka …).",
    ],
  ],
  [
    "basa",
    "smp",
    ['Arti "Sugeng tindak" adalah…', 'The meaning of "Sugeng tindak" is…'],
    ["Selamat jalan", "Have a safe trip"],
    [
      ["Selamat datang", "Welcome"],
      ["Selamat makan", "Enjoy your meal"],
      ["Selamat tidur", "Sleep well"],
    ],
    [
      "Tindak = pergi (krama), sugeng = selamat.",
      "Tindak = go (krama), sugeng = safe/well.",
    ],
  ],

  // =============================================================== BASA JAWA - SMA
  [
    "basa",
    "sma",
    [
      "Jumlah aksara dasar (nglegena) dalam Hanacaraka adalah…",
      "The number of basic characters (nglegena) in Hanacaraka is…",
    ],
    "20",
    ["10", "26", "33"],
    ["Terdapat 20 aksara nglegena.", "There are 20 nglegena characters."],
  ],
  [
    "basa",
    "sma",
    [
      "Tingkat tutur yang paling menghormati lawan bicara memakai kosakata…",
      "The speech level that most respects the listener uses vocabulary of…",
    ],
    "Krama inggil",
    [
      ["Ngoko lugu", "Plain ngoko"],
      ["Bahasa campuran", "Mixed language"],
      ["Singkatan", "Abbreviations"],
    ],
    [
      "Krama inggil meninggikan orang yang diajak bicara atau dibicarakan.",
      "Krama inggil elevates the person spoken to or about.",
    ],
  ],
  [
    "basa",
    "sma",
    ["Contoh tembang macapat adalah…", "An example of a macapat song form is…"],
    "Mijil",
    ["Dangdut", "Qasidah", "Keroncong"],
    [
      "Macapat memiliki banyak jenis, misalnya Mijil, Kinanthi, dan Pocung.",
      "Macapat has many forms, such as Mijil, Kinanthi, and Pocung.",
    ],
  ],
  [
    "basa",
    "sma",
    [
      'Kata "berkata" yang dipakai merendahkan diri kepada orang yang dihormati adalah…',
      'The word for "to say" used to humble oneself before someone honoured is…',
    ],
    "Matur",
    ["Ngomong", "Ngandika", "Mirsani"],
    [
      "Matur dipakai untuk diri sendiri, sedangkan ngandika untuk orang yang dihormati.",
      "Matur is used for oneself, while ngandika is for the person being honoured.",
    ],
  ],
  [
    "basa",
    "sma",
    [
      "Jumlah jenis tembang macapat baku adalah…",
      "The number of standard macapat song forms is…",
    ],
    "11",
    ["5", "7", "15"],
    [
      "Ada 11, antara lain Maskumambang, Mijil, Sinom, Kinanthi, Pangkur, dan Pocung.",
      "There are 11, including Maskumambang, Mijil, Sinom, Kinanthi, Pangkur, and Pocung.",
    ],
  ],
  [
    "basa",
    "sma",
    [
      "Fungsi pasangan dalam aksara Jawa adalah…",
      "The function of a pasangan in Javanese script is…",
    ],
    [
      "Menyambung konsonan tanpa vokal setelah aksara sebelumnya",
      "To join a consonant without a vowel after the previous character",
    ],
    [
      ["Menandai angka", "To mark numbers"],
      ["Menandai tanda baca", "To mark punctuation"],
      ["Menghias pinggir naskah", "To decorate manuscript borders"],
    ],
    [
      "Pasangan menghilangkan vokal aksara di depannya dan menyambungkan konsonan berikutnya.",
      "A pasangan cancels the vowel of the preceding character and attaches the next consonant.",
    ],
  ],
  [
    "basa",
    "sma",
    [
      "Lima hari pasaran dalam penanggalan Jawa adalah…",
      "The five market days (pasaran) of the Javanese calendar are…",
    ],
    "Legi, Pahing, Pon, Wage, Kliwon",
    [
      "Senen, Selasa, Rebo, Kemis, Jumuah",
      "Wage, Legi, Pon, Minggu, Kamis",
      "Pon, Kliwon, Sabtu, Legi, Rebo",
    ],
    [
      "Pasaran berputar lima hari dan dipadukan dengan tujuh hari biasa.",
      "The five-day pasaran cycle is combined with the ordinary seven-day week.",
    ],
  ],

  // =============================================================== SOLO UMUM
  [
    "solo",
    "sd",
    [
      "Sungai terkenal yang mengalir di Solo dan terkenal lewat lagu adalah…",
      "The famous river flowing through Solo, known from a song, is…",
    ],
    "Bengawan Solo",
    ["Citarum", "Musi", "Kapuas"],
    [
      'Lagu "Bengawan Solo" menjadi lagu yang dikenal luas.',
      'The song "Bengawan Solo" is widely known.',
    ],
  ],
  [
    "solo",
    "sd",
    ["Nama lain Kota Solo adalah…", "Another name for the city of Solo is…"],
    "Surakarta",
    ["Yogyakarta", "Semarang", "Madiun"],
    [
      "Solo dikenal pula dengan nama Surakarta.",
      "Solo is also known as Surakarta.",
    ],
  ],
  [
    "solo",
    "sd",
    [
      "Yang termasuk warisan budaya takbenda UNESCO dari Indonesia adalah…",
      "Which of these are UNESCO intangible heritage from Indonesia?",
    ],
    ["Wayang, keris, dan batik", "Wayang, keris, and batik"],
    [
      ["Mobil dan motor", "Cars and motorbikes"],
      ["Pizza dan burger", "Pizza and burgers"],
      ["Komputer dan ponsel", "Computers and phones"],
    ],
    [
      "Wayang, keris, dan batik masing-masing diakui UNESCO.",
      "Wayang, keris, and batik have each been recognised by UNESCO.",
    ],
  ],
  [
    "solo",
    "sd",
    [
      "Pasar di Solo yang terkenal sebagai pusat penjualan batik adalah…",
      "The market in Solo famous as a batik trading centre is…",
    ],
    "Pasar Klewer",
    ["Pasar Senen", "Pasar Baru", "Pasar Ikan"],
    [
      "Pasar Klewer terkenal sebagai pusat kain dan batik.",
      "Pasar Klewer is famous for cloth and batik.",
    ],
  ],
  [
    "solo",
    "smp",
    [
      'Pencipta lagu "Bengawan Solo" adalah…',
      'The composer of the song "Bengawan Solo" is…',
    ],
    "Gesang",
    ["Ismail Marzuki", "Ibu Sud", "Koes Plus"],
    [
      "Gesang Martohartono berasal dari Solo.",
      "Gesang Martohartono came from Solo.",
    ],
  ],
  [
    "solo",
    "smp",
    [
      "Salah satu pasar tradisional terkenal di Solo adalah…",
      "A famous traditional market in Solo is…",
    ],
    "Pasar Gede",
    ["Pasar Beringharjo", "Pasar Senen", "Pasar Baru"],
    [
      "Pasar Gede menjadi pusat jajanan dan belanja tradisional.",
      "Pasar Gede is a hub for snacks and traditional shopping.",
    ],
  ],
  [
    "solo",
    "smp",
    ["Salah satu makanan khas Solo adalah…", "A typical dish from Solo is…"],
    "Selat Solo",
    ["Pempek", "Papeda", "Rendang"],
    [
      "Selat Solo adalah hidangan bergaya perpaduan Jawa dan Eropa.",
      "Selat Solo is a dish that blends Javanese and European styles.",
    ],
  ],
  [
    "solo",
    "smp",
    [
      "Selain Keraton Kasunanan, Solo memiliki istana lain bernama…",
      "Besides the Kasunanan Palace, Solo has another palace called…",
    ],
    "Mangkunegaran",
    ["Kraton Kidul", "Taman Sari", "Vastenburg"],
    [
      "Pura Mangkunegaran adalah istana Kadipaten Mangkunegaran di Solo.",
      "Pura Mangkunegaran is the palace of the Mangkunegaran house in Solo.",
    ],
  ],
  [
    "solo",
    "sma",
    [
      "Kirab Kebo Bule Kyai Slamet di Keraton Surakarta digelar pada…",
      "The Kebo Bule Kyai Slamet parade at the Surakarta Palace is held on…",
    ],
    "Malam 1 Suro",
    [
      ["Malam Tahun Baru Masehi", "New Year's Eve"],
      ["17 Agustus", "17 August"],
      ["Hari Natal", "Christmas Day"],
    ],
    [
      "Kirab ini dikenal sebagai bagian peringatan 1 Suro.",
      "This parade is part of the 1 Suro commemoration.",
    ],
  ],
  [
    "solo",
    "sma",
    [
      "Keraton Surakarta Hadiningrat dikenal sebagai pewaris tradisi…",
      "The Surakarta Hadiningrat Palace is known as heir to the tradition of…",
    ],
    "Kerajaan Mataram",
    ["Kerajaan Sriwijaya", "Kerajaan Kutai", "Kerajaan Tarumanegara"],
    [
      "Kasunanan Surakarta memiliki hubungan sejarah dengan Mataram.",
      "The Kasunanan of Surakarta is historically linked to Mataram.",
    ],
  ],
  [
    "solo",
    "sma",
    [
      "Perjanjian Giyanti (1755) membagi Kerajaan Mataram menjadi…",
      "The Treaty of Giyanti (1755) divided the Mataram Kingdom into…",
    ],
    "Surakarta dan Yogyakarta",
    ["Banten dan Cirebon", "Demak dan Pajang", "Majapahit dan Singasari"],
    [
      "Giyanti melahirkan Kasunanan Surakarta dan Kesultanan Yogyakarta.",
      "Giyanti gave rise to the Surakarta Sunanate and the Yogyakarta Sultanate.",
    ],
  ],
  [
    "solo",
    "sma",
    [
      "Gamelan memperoleh pengakuan UNESCO pada tahun…",
      "Gamelan received UNESCO recognition in…",
    ],
    "2021",
    ["2003", "2009", "2015"],
    [
      "Gamelan diakui sebagai Warisan Budaya Takbenda pada 2021.",
      "Gamelan was recognised as Intangible Cultural Heritage in 2021.",
    ],
  ],
];

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

export const BANK: Q[] = RAW.map(
  ([topic, lv, question, right, wrong, explain]) => ({
    topic,
    lv,
    question: x(question),
    options: [x(right), ...wrong.map(x)],
    answer: 0,
    explain: x(explain),
  }),
);

/** Acak urutan pilihan; SD mendapat 3 pilihan, SMP/SMA 4 pilihan. */
export function prepare(q: Q, j: Jenjang): Q {
  const right = q.options[q.answer];
  let wrong = q.options.filter((_, i) => i !== q.answer);
  wrong = shuffle(wrong).slice(0, j === "sd" ? 2 : 3);
  const opts = shuffle([right, ...wrong]);
  return { ...q, options: opts, answer: opts.indexOf(right) };
}

const NEXT: Record<Jenjang, Jenjang[]> = {
  sd: ["smp"],
  smp: ["sd", "sma"],
  sma: ["smp"],
};

/** Soal lokal sesuai jenjang. Bila stok jenjang itu kurang, dilengkapi dari jenjang terdekat. */
export function localQuestions(
  topic: Topic | "mix",
  j: Jenjang,
  n: number,
  exclude: string[] = [],
): Q[] {
  const inTopic = (q: Q) =>
    (topic === "mix" || q.topic === topic) && !exclude.includes(q.question);
  const out: Q[] = shuffle(BANK.filter((q) => inTopic(q) && q.lv === j)).slice(
    0,
    n,
  );
  for (const alt of NEXT[j]) {
    if (out.length >= n) break;
    out.push(
      ...shuffle(
        BANK.filter((q) => inTopic(q) && q.lv === alt && !out.includes(q)),
      ).slice(0, n - out.length),
    );
  }
  if (out.length < n)
    out.push(
      ...shuffle(BANK.filter((q) => !out.includes(q))).slice(0, n - out.length),
    );
  return out.map((q) => prepare(q, j));
}

/** Campuran soal bank (kebenarannya terkunci) dan sedikit soal segar bila layanan cerita pintar aktif. */
export async function getQuestions(
  topic: Topic | "mix",
  j: Jenjang,
  n: number,
  useAI = true,
): Promise<{ qs: Q[]; ai: boolean }> {
  if (useAI && aiAvailable()) {
    const nAi = Math.max(1, Math.floor(n / 3));
    try {
      const local = localQuestions(topic, j, n - nAi);
      const aiQs = (
        await genQuiz(
          topic,
          j,
          nAi,
          local.map((q) => q.question),
        )
      ).map((q) => prepare(q as Q, j));
      return { qs: shuffle([...local, ...aiQs]).slice(0, n), ai: true };
    } catch {
      /* jatuh ke soal bank */
    }
  }
  return { qs: localQuestions(topic, j, n), ai: false };
}
