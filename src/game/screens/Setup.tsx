import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AvatarId, Jenjang, Profile } from '../types';
import { SpriteSheet } from '../world/Sprite';
import { Btn, Panel, Txt } from '../ui';
import { C } from '../theme';

const AVATARS: { id: AvatarId; name: string }[] = [{ id: 'raka', name: 'Raka' }, { id: 'sekar', name: 'Sekar' }, { id: 'bayu', name: 'Bayu' }, { id: 'aisyah', name: 'Aisyah' }];
const LEVELS: { id: Jenjang; label: string; desc: string }[] = [
  { id: 'sd', label: 'SD', desc: 'Soal lebih mudah, pilihan lebih sedikit, waktu lebih lega.' },
  { id: 'smp', label: 'SMP', desc: 'Tantangan seimbang, mulai ada penalaran.' },
  { id: 'sma', label: 'SMA', desc: 'Soal lebih sulit, waktu lebih ketat, penjelasan lebih dalam.' },
];

export default function Setup({ onStart, onBack }: { onStart: (p: Profile) => void; onBack: () => void }) {
  const ins = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('raka');
  const [jenjang, setJenjang] = useState<Jenjang>('smp');
  const ok = name.trim().length >= 2;
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: ins.top + 14, paddingBottom: ins.bottom + 24, alignItems: 'center', gap: 14 }}>
        <Txt size={26} bold color={C.gold} center>Siapa kamu, Penjaga Muda?</Txt>
        <Panel style={{ width: '100%', maxWidth: 440, gap: 8 }}>
          <Txt bold>Namamu</Txt>
          <TextInput testID="name-input" value={name} onChangeText={setName} maxLength={14} placeholder="Tulis namamu" placeholderTextColor="#9a8a70" style={{ backgroundColor: C.bg2, borderColor: C.line, borderWidth: 2, borderRadius: 12, color: C.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 17 }} />
        </Panel>
        <Panel style={{ width: '100%', maxWidth: 440, gap: 10 }}>
          <Txt bold>Pilih karaktermu</Txt>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {AVATARS.map((a) => (
              <Pressable key={a.id} testID={`avatar-${a.id}`} onPress={() => setAvatar(a.id)} style={{ alignItems: 'center', padding: 6, borderRadius: 14, borderWidth: 3, borderColor: avatar === a.id ? C.gold : 'transparent', backgroundColor: avatar === a.id ? '#5a4429' : 'transparent' }}>
                <SpriteSheet sheet={`player_${a.id}_${jenjang}`} row={0} col={0} />
                <Txt size={12} bold>{a.name}</Txt>
              </Pressable>
            ))}
          </View>
        </Panel>
        <Panel style={{ width: '100%', maxWidth: 440, gap: 8 }}>
          <Txt bold>Jenjang sekolahmu</Txt>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LEVELS.map((l) => <Btn key={l.id} testID={`lvl-${l.id}`} label={l.label} kind={jenjang === l.id ? 'gold' : 'dark'} onPress={() => setJenjang(l.id)} style={{ flex: 1 }} />)}
          </View>
          <Txt size={13} color={C.muted}>{LEVELS.find((l) => l.id === jenjang)!.desc}</Txt>
        </Panel>
        <View style={{ flexDirection: 'row', gap: 10, width: '100%', maxWidth: 440 }}>
          <Btn kind="dark" label="Kembali" onPress={onBack} />
          <Btn testID="btn-start" big label="Mulai!" disabled={!ok} onPress={() => onStart({ name: name.trim(), avatar, jenjang })} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
