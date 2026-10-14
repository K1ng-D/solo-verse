import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try { const s = await AsyncStorage.getItem(key); return s ? ({ ...(fallback as any), ...JSON.parse(s) } as T) : fallback; } catch { return fallback; }
}
export async function saveJSON(key: string, value: unknown) {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch { /* abaikan */ }
}
export async function removeKey(key: string) { try { await AsyncStorage.removeItem(key); } catch { /* abaikan */ } }
