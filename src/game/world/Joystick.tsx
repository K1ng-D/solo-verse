import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';

export function Joystick({ onChange, size = 132 }: { onChange: (x: number, y: number) => void; size?: number }) {
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const R = size / 2 - 16;
  const cb = useRef(onChange); cb.current = onChange;
  const pan = useMemo(() => {
    const handle = (e: any) => {
      const ne = e.nativeEvent;
      let dx = (ne.locationX ?? size / 2) - size / 2, dy = (ne.locationY ?? size / 2) - size / 2;
      const len = Math.hypot(dx, dy);
      if (len > R) { dx = (dx / len) * R; dy = (dy / len) * R; }
      setThumb({ x: dx, y: dy });
      const nx = dx / R, ny = dy / R, m = Math.hypot(nx, ny);
      cb.current(m < 0.2 ? 0 : nx, m < 0.2 ? 0 : ny);
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true, onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: handle, onPanResponderMove: handle,
      onPanResponderRelease: () => { setThumb({ x: 0, y: 0 }); cb.current(0, 0); },
      onPanResponderTerminate: () => { setThumb({ x: 0, y: 0 }); cb.current(0, 0); },
    });
  }, [size, R]);
  return (
    <View {...pan.panHandlers} testID="joystick" style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(20,12,6,0.45)', borderWidth: 3, borderColor: 'rgba(232,185,60,0.7)', alignItems: 'center', justifyContent: 'center' }}>
      <View pointerEvents="none" style={{ position: 'absolute', width: size - 40, height: size - 40, borderRadius: size, borderWidth: 1, borderColor: 'rgba(232,185,60,0.25)' }} />
      <View pointerEvents="none" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(232,185,60,0.85)', borderWidth: 3, borderColor: '#b98a1c', transform: [{ translateX: thumb.x }, { translateY: thumb.y }] }} />
    </View>
  );
}
