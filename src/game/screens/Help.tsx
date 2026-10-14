import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Panel, Txt } from '../ui';
import { C } from '../theme';

const ITEMS = [
  ['🕹️', 'Bergerak', 'Geser joystick di kiri bawah, atau pakai panah / WASD di keyboard.'],
  ['🅐', 'Berinteraksi', 'Dekati orang atau benda yang berkilau, lalu tekan tombol A (atau Spasi / Enter).'],
  ['🏠', 'Masuk bangunan', 'Jalan ke pintu rumah untuk masuk. Keluar lewat pintu di bagian bawah ruangan.'],
  ['🎨', 'Mini-game', 'Menggambar batik, campur warna, tabuh gamelan, susun keris, dan masih banyak lagi.'],
  ['👾', 'Bayangan Lupa', 'Jangan sentuh bayangan di jalan, kecuali kamu siap menjawab pertanyaan untuk mengusirnya.'],
  ['🏅', 'Lencana', 'Selesaikan semua tahap bab, lalu ikuti ujian dari pembimbing untuk meraih lencana.'],
  ['🌼', 'Sekar Emas', 'Kumpulkan bunga berkilau untuk bonus XP.'],
  ['✨', 'Gemini AI', 'Tanya NPC, minta penjelasan jawaban, minta penilaian batik, dan buat cerita wayang. Butuh kunci di Pengaturan.'],
];
export default function Help({ onBack }: { onBack: () => void }) {
  const ins = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: ins.top + 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 8 }}>
        <Btn small kind="dark" label="← Kembali" onPress={onBack} testID="help-back" />
        <Txt size={20} bold color={C.gold} center style={{ flex: 1 }}>Cara Main</Txt>
        <View style={{ width: 90 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: ins.bottom + 30, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        {ITEMS.map(([e, t, d]) => <Panel key={t} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}><Txt size={28}>{e}</Txt><View style={{ flex: 1 }}><Txt bold color={C.gold}>{t}</Txt><Txt size={13}>{d}</Txt></View></Panel>)}
      </ScrollView>
    </View>
  );
}
