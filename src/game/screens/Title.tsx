import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { art } from "../../data/art";
import { useGame } from "../state";
import { Btn, Txt } from "../ui";
import { C } from "../theme";
import { L } from "../../lib/i18n";

export default function Title({
  onPlay,
  onNew,
  onSettings,
  onHelp,
}: {
  onPlay: () => void;
  onNew: () => void;
  onSettings: () => void;
  onHelp: () => void;
}) {
  const { profile, progress, lang, setLang } = useGame();
  const ins = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const land = width > height; // mode landscape: dua kolom (judul di kiri, tombol di kanan)
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  const has = !!profile;
  return (
    <ImageBackground
      source={art["heritage-map"]}
      resizeMode="cover"
      imageStyle={{ width: "100%", height: "100%" }}
      style={{ flex: 1, width: "100%", height: "100%", backgroundColor: C.bg }}
    >
      <LinearGradient
        colors={[
          "rgba(20,12,6,0.55)",
          "rgba(20,12,6,0.25)",
          "rgba(20,12,6,0.92)",
        ]}
        style={
          land
            ? {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 36,
                paddingTop: ins.top + 12,
                paddingBottom: ins.bottom + 12,
                paddingLeft: Math.max(ins.left, 0) + 28,
                paddingRight: Math.max(ins.right, 0) + 28,
              }
            : {
                flex: 1,
                paddingTop: ins.top + 20,
                paddingBottom: ins.bottom + 20,
                paddingHorizontal: 22,
                justifyContent: "space-between",
              }
        }
      >
        <View
          style={{
            position: "absolute",
            right: Math.max(ins.right, 0) + 16,
            top: ins.top + 10,
            flexDirection: "row",
            gap: 6,
            zIndex: 5,
          }}
        >
          {(["id", "en"] as const).map((l) => (
            <Pressable
              key={l}
              testID={`lang-${l}`}
              onPress={() => setLang(l)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: lang === l ? C.gold : C.line,
                backgroundColor: lang === l ? C.gold : "rgba(27,19,14,0.8)",
              }}
            >
              <Txt size={12} bold color={lang === l ? "#2b1b0c" : C.text}>
                {l === "id" ? "ID" : "EN"}
              </Txt>
            </Pressable>
          ))}
        </View>
        <View
          style={
            land
              ? {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: 360,
                }
              : { alignItems: "center", marginTop: Math.max(10, height * 0.06) }
          }
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: bob.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  }),
                },
              ],
              alignItems: "center",
            }}
          >
            <Image
              source={art["logo"]}
              style={{
                width: land ? 72 : 96,
                height: land ? 72 : 96,
                borderRadius: land ? 36 : 48,
                borderWidth: 4,
                borderColor: C.gold,
                marginBottom: land ? 6 : 10,
              }}
            />
            <Txt
              size={land ? 40 : 46}
              bold
              color={C.gold}
              center
              style={{
                textShadowColor: "#000",
                textShadowRadius: 8,
                textShadowOffset: { width: 0, height: 3 },
                letterSpacing: 2,
              }}
            >
              SoloVerse
            </Txt>
            <Txt
              size={land ? 14 : 16}
              bold
              color={C.goldSoft}
              center
              style={{ letterSpacing: 4 }}
            >
              THE LOST HERITAGE
            </Txt>
          </Animated.View>
          <Txt
            size={13}
            color={C.cream}
            center
            style={{ marginTop: land ? 8 : 10, maxWidth: 320 }}
          >
            {L(
              "Jelajahi kota Solo, kumpulkan lencana budaya, dan kalahkan Bayangan Lupa!",
              "Explore the city of Solo, collect culture badges, and defeat the Shadows of Forgetting!",
            )}
          </Txt>
        </View>
        <View
          style={
            land
              ? { flex: 1, gap: 8, maxWidth: 340, justifyContent: "center" }
              : { gap: 10, alignSelf: "center", width: "100%", maxWidth: 360 }
          }
        >
          {has ? (
            <Btn
              testID="btn-continue"
              big
              label={`${L("Lanjutkan", "Continue")} · ${profile!.name}`}
              onPress={onPlay}
            />
          ) : null}
          <Btn
            testID="btn-new"
            big
            kind={has ? "dark" : "gold"}
            label={
              has
                ? L("Mulai Baru", "New Game")
                : L("Mulai Petualangan", "Start Adventure")
            }
            onPress={onNew}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn
              kind="dark"
              label={L("Cara Main", "How to Play")}
              onPress={onHelp}
              style={{ flex: 1 }}
            />
            <Btn
              testID="btn-settings"
              kind="dark"
              label={L("Pengaturan", "Settings")}
              onPress={onSettings}
              style={{ flex: 1 }}
            />
          </View>
          {has ? (
            <Txt
              size={11}
              center
              color={C.muted}
            >{`Level ${Math.floor(progress.xp / 100) + 1} · ${progress.badges.length}/4 ${L("lencana", "badges")}`}</Txt>
          ) : null}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
