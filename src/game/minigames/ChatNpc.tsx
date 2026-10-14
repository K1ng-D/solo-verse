import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import type { GameProps } from '../types';
import { askNpc, aiAvailable, aiMessage, ChatMsg, NpcKey, useAiStatus } from '../../lib/ai';
import { FAQ } from '../../data/content';
import { Btn, GameShell, Panel, Portrait, Txt } from '../ui';
import { SpriteSheet } from '../world/Sprite';
import { C } from '../theme';
import { sfx } from '../../lib/sound';

const META: Record<NpcKey, { name: string; portrait?: string; sheet: string; hello: string; chips: string[] }> = {
  kiwira: { name: 'Ki Wira', portrait: 'ki-wira', sheet: 'npc_kiwira', hello: 'Sampun rawuh! Tanyakan apa saja tentang wayang, gamelan, atau budaya Solo.', chips: ['Apa itu dalang?', 'Kenapa ada gunungan?', 'Siapa punakawan?'] },
  busekar: { name: 'Bu Sekar', portrait: 'bu-sekar', sheet: 'npc_busekar', hello: 'Wilujeng rawuh! Mau tanya soal batik? Canting, malam, motif, silakan.', chips: ['Apa bedanya batik tulis dan cap?', 'Kenapa warna sogan cokelat?', 'Apa arti motif kawung?'] },
  empujaya: { name: 'Empu Jaya', portrait: 'empu-jaya', sheet: 'npc_empujaya', hello: 'Selamat datang. Keris adalah karya seni dan pusaka. Apa yang ingin kamu ketahui?', chips: ['Apa itu pamor?', 'Mengapa keris punya luk?', 'Apa itu jamasan?'] },
  bularas: { name: 'Bu Laras', portrait: 'bu-laras', sheet: 'npc_bularas', hello: 'Sugeng rawuh! Ayo belajar basa Jawa. Mau tanya apa?', chips: ['Apa bedanya ngoko dan krama?', 'Bagaimana berterima kasih pada Simbah?', 'Apa itu aksara Jawa?'] },
  mbah: { name: 'Mbah Putri', sheet: 'npc_mbah', hello: 'Eh, Nak, sampun dugi? Ayo ngobrol sama Mbah. Pakai basa krama ya. (Eh, Nak, sudah datang? ...)', chips: [] },
};
const MBAH_CHIPS = [
  { t: 'Sugeng enjing, Mbah.', tr: 'Selamat pagi, Mbah.' },
  { t: 'Mbah, panjenengan sehat?', tr: 'Mbah, apakah Mbah sehat?' },
  { t: 'Kula badhe sowan, Mbah.', tr: 'Saya mau berkunjung, Mbah.' },
  { t: 'Matur nuwun, Mbah.', tr: 'Terima kasih, Mbah.' },
  { t: 'Nuwun sewu, Mbah.', tr: 'Permisi / mohon maaf, Mbah.' },
  { t: 'Nyuwun pamit, Mbah.', tr: 'Saya pamit, Mbah.' },
];
const GOALS = [
  { id: 'sapa', text: 'Sapa Mbah dengan sopan (mis. “Sugeng enjing”)', re: /sugeng|wilujeng/i },
  { id: 'nuwun', text: 'Ucapkan terima kasih (“Matur nuwun”)', re: /matur\s*nuwun/i },
  { id: 'pamit', text: 'Pamit dengan sopan (“Nyuwun pamit”)', re: /pamit/i },
];
const NGOKO = /\b(aku|kowe|piye|ora|wis|arep|lunga|mangan|turu)\b/i;

function mbahFallback(msg: string): string {
  if (NGOKO.test(msg) && !/kula|panjenengan|nuwun|sugeng/i.test(msg)) return 'Hehe, Nak, ngomong sama Mbah pakai krama ya. Contoh: "Kula badhe tindak" bukan "Aku arep lunga". (Bicara dengan Mbah pakai krama ya, Nak.)';
  if (/sugeng|wilujeng/i.test(msg)) return 'Nggih, sugeng enjing, Nak. Sampun dhahar dereng? (Ya, selamat pagi, Nak. Sudah makan belum?)';
  if (/matur\s*nuwun/i.test(msg)) return 'Sami-sami, Nak. Mbah bingah panjenengan sowan. (Sama-sama, Nak. Mbah senang kamu datang.)';
  if (/pamit/i.test(msg)) return 'Nggih, ngatos-atos ing dalan, Nak. (Ya, hati-hati di jalan, Nak.)';
  if (/nuwun sewu/i.test(msg)) return 'Mangga, Nak, mboten napa-napa. (Silakan, Nak, tidak apa-apa.)';
  if (/sehat|sae/i.test(msg)) return 'Alhamdulillah, Mbah sae, Nak. Panjenengan pripun? (Alhamdulillah, Mbah sehat. Kamu bagaimana?)';
  return 'Mbah kirang mangertos, Nak. Coba pakai "Sugeng enjing", "Matur nuwun", atau "Nyuwun pamit". (Mbah kurang paham, Nak.)';
}
function faqReply(npc: NpcKey, msg: string): string {
  const m = msg.toLowerCase();
  const hit = FAQ[npc].find((f) => f.k.some((k) => m.includes(k)));
  if (hit) return hit.a;
  const keys = FAQ[npc].slice(0, 4).map((f) => f.k[0]).join(', ');
  return `Aku belum bisa menjawab itu tanpa AI. Aktifkan AI di Pengaturan untuk bertanya apa saja, atau coba tanyakan tentang: ${keys}.`;
}

export default function ChatNpc({ jenjang, name, cfg, onDone, onExit }: GameProps) {
  const npc: NpcKey = cfg?.npc || 'kiwira';
  const mbah = npc === 'mbah' && !!cfg?.goals;
  const meta = META[npc];
  const ai = useAiStatus();
  const [msgs, setMsgs] = useState<{ from: 'me' | 'npc'; text: string; note?: string }[]>([{ from: 'npc', text: meta.hello }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);
  const [showChips, setShowChips] = useState(jenjang === 'sd');
  const scroll = useRef<ScrollView>(null);
  const hist = useRef<ChatMsg[]>([]);
  useEffect(() => { setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 60); }, [msgs, busy]);

  const send = async (raw: string) => {
    const t = raw.trim(); if (!t || busy) return;
    setText(''); setTurns((n) => n + 1); sfx('tap', 0.4);
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    if (mbah) { const nd = GOALS.filter((g) => g.re.test(t) && !done.includes(g.id)).map((g) => g.id); if (nd.length) { setDone((d) => [...d, ...nd]); sfx('collect'); } }
    setBusy(true);
    let reply = ''; let note: string | undefined;
    if (aiAvailable()) {
      try { reply = await askNpc(npc, jenjang, name, hist.current, t, mbah ? 'Latihan basa krama dengan Mbah' : ''); hist.current.push({ role: 'user', text: t }, { role: 'model', text: reply }); }
      catch (e) { reply = mbah ? mbahFallback(t) : faqReply(npc, t); note = aiMessage(e); }
    } else { reply = mbah ? mbahFallback(t) : faqReply(npc, t); note = 'Mode offline (AI belum aktif)'; }
    setMsgs((m) => [...m, { from: 'npc', text: reply, note }]); setBusy(false);
  };

  const allDone = mbah && GOALS.every((g) => done.includes(g.id));
  const finish = () => { const stars = turns <= 7 ? 3 : turns <= 11 ? 2 : 1; onDone({ stars, score: 100, data: { turns } }); };
  const leave = () => { if (!mbah) onDone({ stars: 0, score: 0, data: { asked: turns } }); else onExit(); };

  return (
    <GameShell title={mbah ? 'Ngobrol karo Mbah' : `Tanya ${meta.name}`} onClose={leave}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 12, gap: 8, flex: 1 }}>
          {mbah ? (
            <Panel style={{ gap: 4, paddingVertical: 8 }}>
              <Txt size={12} bold color={C.gold}>Misi percakapan</Txt>
              {GOALS.map((g) => <Txt key={g.id} size={12} color={done.includes(g.id) ? C.green : C.muted}>{done.includes(g.id) ? '✓ ' : '○ '}{g.text}</Txt>)}
            </Panel>
          ) : <Txt size={11} color={ai.available ? C.green : C.muted} center>{ai.available ? '● AI aktif — tanya apa saja tentang budaya Solo' : '○ Mode offline — aktifkan AI di Pengaturan agar bisa tanya bebas'}</Txt>}
          <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
            {msgs.map((m, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start', gap: 8 }}>
                {m.from === 'npc' ? (meta.portrait ? <Portrait name={meta.portrait} size={40} round /> : <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: C.panel2, borderWidth: 2, borderColor: C.gold }}><View style={{ position: 'absolute', left: -7, top: -2 }}><SpriteSheet sheet={meta.sheet} row={0} col={0} scale={0.85} /></View></View>) : null}
                <View style={{ maxWidth: '78%', backgroundColor: m.from === 'me' ? C.gold : C.panel, borderRadius: 14, borderWidth: 2, borderColor: m.from === 'me' ? C.goldDark : C.line, padding: 10 }}>
                  <Txt color={m.from === 'me' ? '#2b1b0c' : C.text} bold={m.from === 'me'}>{m.text}</Txt>
                  {m.note ? <Txt size={11} color={C.muted} style={{ marginTop: 4 }}>{m.note}</Txt> : null}
                </View>
              </View>
            ))}
            {busy ? <Txt color={C.muted} size={13}>{meta.name} sedang mengetik…</Txt> : null}
          </ScrollView>
          {allDone ? <Btn testID="chat-finish" kind="green" label="Percakapan selesai! Ambil hadiah" onPress={finish} /> : null}
          {mbah ? (
            <View>
              <Pressable onPress={() => setShowChips(!showChips)}><Txt size={12} color={C.goldSoft} bold>{showChips ? '▼ Sembunyikan bantuan kalimat' : '▶ Perlu bantuan kalimat?'}</Txt></Pressable>
              {showChips ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{MBAH_CHIPS.map((c) => <Pressable key={c.t} testID={`chip-${c.t.split(',')[0].replace(/\s/g, '')}`} onPress={() => send(c.t)} style={{ backgroundColor: C.panel2, borderColor: C.line, borderWidth: 2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}><Txt size={13} bold>{c.t}</Txt><Txt size={10} color={C.muted}>{c.tr}</Txt></Pressable>)}</View> : null}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{meta.chips.map((c) => <Pressable key={c} onPress={() => send(c)} style={{ backgroundColor: C.panel2, borderColor: C.line, borderWidth: 2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}><Txt size={12} bold>{c}</Txt></Pressable>)}</View>
          )}
          <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 6 }}>
            <TextInput testID="chat-input" value={text} onChangeText={setText} onSubmitEditing={() => send(text)} placeholder={mbah ? 'Tulis dalam basa Jawa…' : 'Tulis pertanyaanmu…'} placeholderTextColor="#9a8a70" maxLength={200} style={{ flex: 1, backgroundColor: C.panel, borderColor: C.line, borderWidth: 2, borderRadius: 12, color: C.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 }} />
            <Btn testID="chat-send" label="Kirim" onPress={() => send(text)} disabled={busy || !text.trim()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GameShell>
  );
}
