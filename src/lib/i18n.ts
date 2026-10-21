/**
 * Bahasa tampilan: Indonesia (id) atau Inggris (en).
 * Isi game tetap bernuansa Jawa (istilah seperti canting, krama, dhahar tidak diterjemahkan);
 * Inggris dipakai sebagai terjemahan penjelasan dan antarmuka.
 *
 * Cara pakai:
 *  - L('teks indonesia', 'english text')  -> pilih sesuai bahasa aktif (untuk kode baru / teks dengan variabel)
 *  - T('teks indonesia', 'english text')  -> daftarkan terjemahan ke kamus lalu kembalikan teks Indonesia
 *    (dipakai di file data supaya terjemahan berdampingan dengan isinya)
 *  - tr('teks indonesia')                 -> terjemahkan lewat kamus; dipanggil otomatis oleh Txt, Btn, Typewriter
 */
export type Lang = "id" | "en";

let cur: Lang = "id";
export const getLang = (): Lang => cur;
export const setLangGlobal = (l: Lang) => {
  cur = l;
};
export const L = (id: string, en: string): string => (cur === "en" ? en : id);

/** Kamus Indonesia -> Inggris (diisi oleh en.ts dan file data). */
export const EN: Record<string, string> = {};
export const T = (id: string, en: string): string => {
  EN[id] = en;
  return id;
};
export const reg = (map: Record<string, string>) => {
  Object.assign(EN, map);
};

/** Pola untuk kalimat yang memuat angka/nama. Urutan penting: yang pertama cocok dipakai. */
export const PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [];
export const addPatterns = (p: [RegExp, (m: RegExpMatchArray) => string][]) => {
  PATTERNS.push(...p);
};

export function tr(s: string): string {
  if (cur !== "en" || !s) return s;
  const hit = EN[s];
  if (hit !== undefined) return hit;
  const t = s.trim();
  if (t !== s && EN[t] !== undefined) return s.replace(t, EN[t]);
  for (const [re, fn] of PATTERNS) {
    const m = s.match(re);
    if (m) return fn(m);
  }
  return s;
}

/** Terjemahkan children React (string atau array string). */
export function trNode<N>(children: N): N {
  if (cur !== "en") return children;
  if (typeof children === "string") return tr(children) as any;
  if (Array.isArray(children))
    return children.map((c) => (typeof c === "string" ? tr(c) : c)) as any;
  return children;
}
