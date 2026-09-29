export const colors = {
  primary: '#176B52',
  darkSlate: '#24332F',
  background: '#F7F8F6',
  surface: '#FFFFFF',
  primaryText: '#17201D',
  secondaryText: '#66736E',
  border: '#DDE3DF',
  success: '#2E7D5B',
  warning: '#B7791F',
  error: '#C94A4A',
  info: '#3E6F8F',
};

export const typography = {
  fontFamily: 'System', // Fallback to system font if Inter is not loaded.
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const touchTargets = {
  minimum: 44,
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  touchTargets,
};
