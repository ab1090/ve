export const brand = {
  colors: {
    bgA: '#0f172a',
    bgB: '#1e293b',
    stroke: '#f8fafc',
    accent: '#38bdf8',
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui',
    titleSize: 64,
  },
} as const;

export type Brand = typeof brand;
