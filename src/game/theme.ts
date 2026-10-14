export const C = {
  bg: '#1b130e', bg2: '#251a13', panel: '#33261b', panel2: '#46341f', panelLight: '#5a4429',
  gold: '#e8b93c', goldDark: '#b98a1c', goldSoft: '#f6dc8a', cream: '#f6ecd2',
  text: '#fff5e1', muted: '#cdb994', line: '#7a5c34',
  green: '#5fbf74', greenDark: '#2f8a45', red: '#e2625a', redDark: '#a63a34', blue: '#5aa7e0', blueDark: '#2f6fa8',
  indigo: '#2b3a67', sogan: '#6b4423', purple: '#8a6ad0',
};
export const TILE = 48;
export const F = { heavy: '900' as const, bold: '800' as const };
export const px = { imageRendering: 'pixelated' } as any;
export const shadowBox = (c = '#000', o = 0.35, r = 6, y = 3) => ({ shadowColor: c, shadowOpacity: o, shadowRadius: r, shadowOffset: { width: 0, height: y }, elevation: 4 });
