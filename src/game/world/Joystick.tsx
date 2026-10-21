import React, { useMemo, useRef, useState } from "react";
import { PanResponder, Platform, View } from "react-native";

/**
 * Joystick virtual.
 * - Android/iOS: memakai event sentuh mentah dan MELACAK identifier jari yang menyentuh joystick.
 *   Sebelumnya dipakai PanResponder + locationX; saat jari kedua menekan tombol A, koordinat jadi
 *   milik jari lain sehingga arah karakter melenceng. Sekarang jari lain diabaikan.
 * - Web: PanResponder (mouse/keyboard tetap jalan).
 */
export function Joystick({
  onChange,
  size = 132,
}: {
  onChange: (x: number, y: number) => void;
  size?: number;
}) {
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const R = size / 2 - 16;
  const cb = useRef(onChange);
  cb.current = onChange;

  const emit = (dx: number, dy: number) => {
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    setThumb({ x: dx, y: dy });
    const nx = dx / R,
      ny = dy / R,
      m = Math.hypot(nx, ny);
    cb.current(m < 0.2 ? 0 : nx, m < 0.2 ? 0 : ny);
  };
  const reset = () => {
    setThumb({ x: 0, y: 0 });
    cb.current(0, 0);
  };

  // ---------- native: lacak jari lewat identifier
  const touchId = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const find = (list: any, id: number | null) => {
    if (!list || id === null) return null;
    for (let i = 0; i < list.length; i++)
      if (list[i].identifier === id) return list[i];
    return null;
  };
  const nativeHandlers = {
    onStartShouldSetResponder: () => false,
    onTouchStart: (e: any) => {
      if (touchId.current !== null) return;
      const t = e.nativeEvent.changedTouches?.[0] ?? e.nativeEvent;
      touchId.current = t.identifier ?? 0;
      let ox = (t.locationX ?? size / 2) - size / 2,
        oy = (t.locationY ?? size / 2) - size / 2;
      const l = Math.hypot(ox, oy);
      if (!isFinite(l)) {
        ox = 0;
        oy = 0;
      } else if (l > R) {
        ox = (ox / l) * R;
        oy = (oy / l) * R;
      }
      origin.current = { x: t.pageX, y: t.pageY, ox, oy };
      emit(ox, oy);
    },
    onTouchMove: (e: any) => {
      if (touchId.current === null) return;
      const t =
        find(e.nativeEvent.touches, touchId.current) ||
        find(e.nativeEvent.changedTouches, touchId.current);
      if (!t) return;
      emit(
        origin.current.ox + (t.pageX - origin.current.x),
        origin.current.oy + (t.pageY - origin.current.y),
      );
    },
    onTouchEnd: (e: any) => {
      if (touchId.current === null) return;
      if (find(e.nativeEvent.changedTouches, touchId.current)) {
        touchId.current = null;
        reset();
      }
    },
    onTouchCancel: () => {
      touchId.current = null;
      reset();
    },
  };

  // ---------- web: PanResponder
  const pan = useMemo(() => {
    const handle = (e: any) => {
      const ne = e.nativeEvent;
      emit(
        (ne.locationX ?? size / 2) - size / 2,
        (ne.locationY ?? size / 2) - size / 2,
      );
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: handle,
      onPanResponderMove: handle,
      onPanResponderRelease: reset,
      onPanResponderTerminate: reset,
    });
  }, [size, R]);

  const handlers = Platform.OS === "web" ? pan.panHandlers : nativeHandlers;
  return (
    <View
      {...(handlers as any)}
      testID="joystick"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(20,12,6,0.45)",
        borderWidth: 3,
        borderColor: "rgba(232,185,60,0.7)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: size - 40,
          height: size - 40,
          borderRadius: size,
          borderWidth: 1,
          borderColor: "rgba(232,185,60,0.25)",
        }}
      />
      <View
        pointerEvents="none"
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "rgba(232,185,60,0.85)",
          borderWidth: 3,
          borderColor: "#b98a1c",
          transform: [{ translateX: thumb.x }, { translateY: thumb.y }],
        }}
      />
    </View>
  );
}
