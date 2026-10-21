import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, shadowBox } from "./theme";
import { art } from "../data/art";
import { sfx } from "../lib/sound";
import { useGame } from "./state";
import { tr, trNode } from "../lib/i18n";

export function Txt({
  children,
  style,
  size = 15,
  color = C.text,
  bold,
  center,
  numberOfLines,
  testID,
}: {
  testID?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  color?: string;
  bold?: boolean;
  center?: boolean;
  numberOfLines?: number;
}) {
  return (
    <Text
      testID={testID}
      numberOfLines={numberOfLines}
      style={[
        {
          color,
          fontSize: size,
          fontWeight: bold ? "800" : "500",
          textAlign: center ? "center" : "left",
          lineHeight: Math.round(size * 1.35),
        },
        style,
      ]}
    >
      {trNode(children)}
    </Text>
  );
}

type Kind = "gold" | "dark" | "green" | "red" | "blue" | "ghost";
const KC: Record<Kind, { bg: string; edge: string; fg: string }> = {
  gold: { bg: C.gold, edge: C.goldDark, fg: "#2b1b0c" },
  dark: { bg: C.panel2, edge: "#2a1d12", fg: C.text },
  green: { bg: C.green, edge: C.greenDark, fg: "#0f2a16" },
  red: { bg: C.red, edge: C.redDark, fg: "#2e0d0b" },
  blue: { bg: C.blue, edge: C.blueDark, fg: "#08213a" },
  ghost: { bg: "transparent", edge: "transparent", fg: C.goldSoft },
};
export function Btn({
  label,
  onPress,
  kind = "gold",
  small,
  disabled,
  style,
  icon,
  big,
  testID,
}: {
  label: string;
  onPress?: () => void;
  kind?: Kind;
  small?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  big?: boolean;
  testID?: string;
}) {
  const k = KC[kind];
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        sfx("tap", 0.5);
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          backgroundColor: k.bg,
          borderRadius: 12,
          borderBottomWidth: kind === "ghost" ? 0 : pressed ? 1 : 4,
          borderColor: k.edge,
          paddingVertical: big ? 15 : small ? 7 : 11,
          paddingHorizontal: small ? 12 : 18,
          opacity: disabled ? 0.45 : 1,
          transform: [{ translateY: pressed && kind !== "ghost" ? 3 : 0 }],
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
        },
        style,
      ]}
    >
      {icon ? (
        <Text style={{ color: k.fg, fontSize: big ? 20 : 16 }}>{icon}</Text>
      ) : null}
      <Text
        style={{
          color: k.fg,
          fontWeight: "900",
          fontSize: big ? 18 : small ? 13 : 15,
          letterSpacing: 0.3,
        }}
      >
        {tr(label)}
      </Text>
    </Pressable>
  );
}

export function Panel({
  children,
  style,
  tone = "dark",
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: "dark" | "light";
}) {
  return (
    <View
      style={[
        {
          backgroundColor: tone === "light" ? C.panelLight : C.panel,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: C.line,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Stars({
  n,
  max = 3,
  size = 22,
}: {
  n: number;
  max?: number;
  size?: number;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Text
          key={i}
          style={{
            fontSize: size,
            color: i < n ? C.gold : "#5a4a38",
            textShadowColor: "#000",
            textShadowRadius: 2,
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}
export function Hearts({
  n,
  max = 3,
  size = 20,
}: {
  n: number;
  max?: number;
  size?: number;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Text
          key={i}
          style={{ fontSize: size, color: i < n ? "#e2625a" : "#5a3a38" }}
        >
          ♥
        </Text>
      ))}
    </View>
  );
}
export function Bar({
  value,
  max = 1,
  color = C.gold,
  h = 10,
  style,
}: {
  value: number;
  max?: number;
  color?: string;
  h?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View
      style={[
        {
          height: h,
          backgroundColor: "#0006",
          borderRadius: h,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0008",
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: h,
        }}
      />
    </View>
  );
}

export function Overlay({
  children,
  dim = 0.6,
  z = 50,
  style,
}: {
  children: React.ReactNode;
  dim?: number;
  z?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(10,6,3,${dim})`,
          zIndex: z,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Portrait({
  name,
  size = 84,
  round,
}: {
  name?: string;
  size?: number;
  round?: boolean;
}) {
  if (!name || !art[name])
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: C.panel2,
          borderWidth: 2,
          borderColor: C.line,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: size * 0.5 }}>🧑</Text>
      </View>
    );
  return (
    <Image
      source={art[name]}
      style={{
        width: size,
        height: size,
        borderRadius: round ? size : 12,
        borderWidth: 2,
        borderColor: C.gold,
        backgroundColor: "#000",
      }}
    />
  );
}

/** Teks mengetik; ketuk untuk langsung selesai. */
export function Typewriter({
  text: rawText,
  onDone,
  speed = 18,
  style,
  size = 16,
}: {
  text: string;
  onDone?: () => void;
  speed?: number;
  style?: StyleProp<TextStyle>;
  size?: number;
}) {
  const text = tr(rawText);
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    setN(0);
    done.current = false;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) {
        clearInterval(t);
        if (!done.current) {
          done.current = true;
          onDone?.();
        }
      }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return (
    <Pressable
      onPress={() => {
        setN(text.length);
        if (!done.current) {
          done.current = true;
          onDone?.();
        }
      }}
    >
      <Text
        style={[
          {
            color: C.text,
            fontSize: size,
            lineHeight: size * 1.45,
            fontWeight: "600",
          },
          style,
        ]}
      >
        {text.slice(0, n)}
        <Text style={{ opacity: 0 }}>{text.slice(n)}</Text>
      </Text>
    </Pressable>
  );
}

export function ToastLayer() {
  const { toasts } = useGame();
  const ins = useSafeAreaInsets();
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: ins.top + 62,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 200,
      }}
    >
      {toasts.map((t) => (
        <View
          key={t.id}
          style={[
            {
              backgroundColor:
                t.kind === "good"
                  ? C.greenDark
                  : t.kind === "bad"
                    ? C.redDark
                    : t.kind === "xp"
                      ? "#3a2b10"
                      : "#2a1d12",
              borderColor: t.kind === "xp" ? C.gold : C.line,
              borderWidth: 2,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
              marginBottom: 6,
            },
            shadowBox(),
          ]}
        >
          <Text
            style={{
              color: t.kind === "xp" ? C.goldSoft : C.text,
              fontWeight: "900",
              fontSize: 14,
            }}
          >
            {tr(t.text)}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Kerangka layar penuh untuk mini-game. */
export function GameShell({
  title,
  onClose,
  right,
  children,
  bg = C.bg,
}: {
  title: string;
  onClose: () => void;
  right?: React.ReactNode;
  children: React.ReactNode;
  bg?: string;
}) {
  const ins = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: bg,
        zIndex: 80,
        paddingTop: ins.top + 6,
        paddingBottom: Math.max(ins.bottom, 8),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingBottom: 8,
          gap: 10,
        }}
      >
        <Pressable
          onPress={() => {
            sfx("tap", 0.5);
            onClose();
          }}
          accessibilityLabel="Tutup"
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: C.panel2,
            borderWidth: 2,
            borderColor: C.line,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: C.gold, fontWeight: "900", fontSize: 16 }}>
            ✕
          </Text>
        </Pressable>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: C.gold,
            fontSize: 18,
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          {tr(title)}
        </Text>
        <View style={{ minWidth: 38, alignItems: "flex-end" }}>{right}</View>
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

export function Intro({
  title,
  lines,
  onStart,
  emoji,
  button = "Mulai!",
}: {
  title: string;
  lines: string[];
  onStart: () => void;
  emoji?: string;
  button?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <Panel
        style={{ maxWidth: 460, width: "100%", alignItems: "center", gap: 10 }}
      >
        {emoji ? <Text style={{ fontSize: 44 }}>{emoji}</Text> : null}
        <Txt size={22} bold color={C.gold} center>
          {title}
        </Txt>
        <View style={{ gap: 6, alignSelf: "stretch" }}>
          {lines.map((l, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8 }}>
              <Txt color={C.gold} bold>
                {i + 1}.
              </Txt>
              <Txt style={{ flex: 1 }}>{l}</Txt>
            </View>
          ))}
        </View>
        <Btn
          label={button}
          onPress={onStart}
          big
          style={{ alignSelf: "stretch", marginTop: 6 }}
        />
      </Panel>
    </View>
  );
}

export function ResultCard({
  win,
  stars,
  score,
  xp,
  title,
  lines,
  onRetry,
  onDone,
  children,
  doneLabel,
}: {
  doneLabel?: string;
  win: boolean;
  stars: number;
  score?: string;
  xp?: number;
  title?: string;
  lines?: string[];
  onRetry?: () => void;
  onDone: () => void;
  children?: React.ReactNode;
}) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    sfx(win ? "win" : "wrong");
    Animated.spring(pop, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <Animated.View
        style={{
          width: "100%",
          maxWidth: 460,
          transform: [
            {
              scale: pop.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1],
              }),
            },
          ],
          opacity: pop,
        }}
      >
        <Panel tone="light" style={{ alignItems: "center", gap: 10 }}>
          <Txt size={26} bold color={win ? C.gold : C.red} center>
            {title || (win ? "Hebat!" : "Belum berhasil")}
          </Txt>
          {win ? <Stars n={stars} size={40} /> : null}
          {score ? (
            <Txt size={16} bold center>
              {score}
            </Txt>
          ) : null}
          {xp ? (
            <Txt color={C.goldSoft} bold>
              +{xp} XP
            </Txt>
          ) : null}
          {(lines || []).map((l, i) => (
            <Txt key={i} center color={C.muted}>
              {l}
            </Txt>
          ))}
          {children}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignSelf: "stretch",
              marginTop: 6,
            }}
          >
            {onRetry ? (
              <Btn
                label="Ulangi"
                kind="dark"
                onPress={onRetry}
                style={{ flex: 1 }}
              />
            ) : null}
            <Btn
              label={doneLabel || (win ? "Lanjut" : "Keluar")}
              onPress={onDone}
              style={{ flex: 1 }}
              kind={win ? "gold" : "dark"}
            />
          </View>
        </Panel>
      </Animated.View>
    </View>
  );
}

export function useShake() {
  const v = useRef(new Animated.Value(0)).current;
  const shake = () => {
    v.setValue(0);
    Animated.timing(v, {
      toValue: 1,
      duration: 320,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  const style = {
    transform: [
      {
        translateX: v.interpolate({
          inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
          outputRange: [0, -8, 8, -6, 6, 0],
        }),
      },
    ],
  };
  return { shake, style };
}

export function useLayoutBox() {
  const { width, height } = useWindowDimensions();
  return { width, height, compact: width < 420 };
}

export const isWeb = Platform.OS === "web";
