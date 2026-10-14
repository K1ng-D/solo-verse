import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '../src/game/state';
import { ToastLayer } from '../src/game/ui';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <View style={{ flex: 1, backgroundColor: '#1b130c' }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: '#1b130c' } }} />
          <ToastLayer />
        </View>
      </GameProvider>
    </SafeAreaProvider>
  );
}
