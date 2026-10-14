import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import { sheets } from '../../data/assetMap';
import { px } from '../theme';

export const CW = 54, CH = 78; // 18x26 piksel × 3
export const DIR_ROW: Record<string, number> = { down: 0, left: 1, right: 2, up: 3 };

export const SpriteSheet = React.memo(function SpriteSheet({ sheet, row, col, style, scale = 1 }: { sheet: string; row: number; col: number; style?: StyleProp<ViewStyle>; scale?: number }) {
  const w = CW * scale, h = CH * scale;
  return (
    <View style={[{ width: w, height: h, overflow: 'hidden' }, style]}>
      <Image source={sheets[sheet]} resizeMode="stretch" style={[{ position: 'absolute', width: w * 3, height: h * 4, left: -col * w, top: -row * h }, px]} />
    </View>
  );
});
