import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageBackground, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { art } from '../../data/art';
import { useGame } from '../state';
import { Btn, Txt } from '../ui';
import { C } from '../theme';
import { useAiStatus } from '../../lib/ai';

export default function Title({ onPlay, onNew, onSettings, onHelp }: { onPlay: () => void; onNew: () => void; onSettings: () => void; onHelp: () => void }) {
  const { profile, progress } = useGame();
  const ai = useAiStatus();
  const ins = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(bob, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }), Animated.timing(bob, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true })])).start(); }, []);
  const has = !!profile;
  return (
    <ImageBackground source={art['heritage-map']} resizeMode="cover" imageStyle={{ width: "100%", height: "100%" }} style={{ flex: 1, width: "100%", height: "100%", backgroundColor: C.bg }}>
      <LinearGradient colors={['rgba(20,12,6,0.55)', 'rgba(20,12,6,0.25)', 'rgba(20,12,6,0.92)']} style={{ flex: 1, paddingTop: ins.top + 20, paddingBottom: ins.bottom + 20, paddingHorizontal: 22, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', marginTop: Math.max(10, height * 0.06) }}>
          <Animated.View style={{ transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }], alignItems: 'center' }}>
            <Image source={art['ki-wira']} style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: C.gold, marginBottom: 10 }} />
            <Txt size={46} bold color={C.gold} center style={{ textShadowColor: '#000', textShadowRadius: 8, textShadowOffset: { width: 0, height: 3 }, letterSpacing: 2 }}>SoloVerse</Txt>
            <Txt size={16} bold color={C.goldSoft} center style={{ letterSpacing: 4 }}>THE LOST HERITAGE</Txt>
          </Animated.View>
          <Txt size={13} color={C.cream} center style={{ marginTop: 10, maxWidth: 320 }}>Jelajahi kota Solo, kumpulkan lencana budaya, dan kalahkan Bayangan Lupa!</Txt>
        </View>
        <View style={{ gap: 10, alignSelf: 'center', width: '100%', maxWidth: 360 }}>
          {has ? <Btn testID="btn-continue" big label={`Lanjutkan · ${profile!.name}`} onPress={onPlay} /> : null}
          <Btn testID="btn-new" big kind={has ? 'dark' : 'gold'} label={has ? 'Mulai Baru' : 'Mulai Petualangan'} onPress={onNew} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Btn kind="dark" label="Cara Main" onPress={onHelp} style={{ flex: 1 }} />
            <Btn testID="btn-settings" kind="dark" label="Pengaturan AI" onPress={onSettings} style={{ flex: 1 }} />
          </View>
          <Txt size={11} center color={ai.available ? C.green : C.muted}>{ai.available ? '● Gemini AI aktif' : '○ AI belum aktif (game tetap bisa dimainkan penuh)'}</Txt>
          {has ? <Txt size={11} center color={C.muted}>Level {Math.floor(progress.xp / 100) + 1} · {progress.badges.length}/4 lencana</Txt> : null}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
