# SoloVerse – The Lost Heritage (v3, versi game)

Game petualangan RPG top-down tentang budaya Solo (batik, wayang, keris, basa Jawa) untuk SD / SMP / SMA.
Jelajahi kota dengan joystick atau keyboard, masuk bangunan, main mini-game, lawan Bayangan Lupa, raih 4 lencana, kalahkan Raksasa di Gerbang Keraton.

## Menjalankan
```bash
npm install
cp .env.example .env      # opsional: isi EXPO_PUBLIC_GEMINI_API_KEY
npx expo start            # tekan w (web) / a (Android) / i (iOS)
npm run check             # typecheck
npx expo export --platform web
```
Kontrol di web: WASD / panah = jalan, Spasi / Enter / E = interaksi (tombol A), Esc = menu.

## Gemini AI (tanpa server)
Tidak ada lagi server/localhost. Aplikasi memanggil `generativelanguage.googleapis.com` langsung.
Kunci diisi lewat `.env` (`EXPO_PUBLIC_GEMINI_API_KEY`) atau di dalam game: Menu Utama → Pengaturan AI → Uji Koneksi.
Model dipilih otomatis (flash-lite → flash), bisa diganti di Pengaturan.

Fitur AI: ngobrol dengan NPC (persona per tokoh), roleplay basa krama dengan Mbah (misi percakapan), soal kuis tambahan (bertanda ✨, divalidasi), penjelasan "kenapa?" setelah salah menjawab, penilaian batik buatan pemain, dan Panggung Ceritaku (pemain jadi dalang). Tanpa kunci, semua tetap bisa dimainkan dengan konten lokal.

**Keamanan:** kunci di aplikasi klien bisa dibaca orang lain. Batasi kunci di Google AI Studio / Cloud Console (kuota harian, pembatasan referrer/aplikasi). Untuk rilis publik, sebaiknya pakai kunci berkuota kecil.

## Alur game
Kota Solo (peta 32×24) → temui Ki Wira → masuk Rumah Batik / Panggung Wayang / Museum Pusaka / Sekolah Basa → selesaikan wahana di dalam → ujian pembimbing → lencana → Gerbang Keraton (bos kuis).
Mini-game: menggambar batik manual (canting, titik, simetri, pola panduan), campur pewarna, memory, urutan, sortir cepat, gamelan ritme, rakit keris (seret), kuis pertempuran, chat AI, cerita dalang.
Tingkat kesulitan menyesuaikan jenjang (jumlah pilihan, waktu, pola panduan, ambang ketelitian).

## Aset
Semua aset baru dibuat prosedural dengan Python: `python3 tools/gen_assets.py` (butuh numpy & pillow) menghasilkan sprite karakter/NPC/musuh, tile, peta, dan efek suara ke `assets/` serta `src/data/mapsData.ts` & `assetMap.ts`. Lihat `ASSET_MANIFEST.md`.

## Batasan
Diuji di browser (Chromium) dan typecheck. Audio native (Android/iOS) dan perangkat sentuh nyata belum diuji; panggilan Gemini butuh kunci asli dan internet.
