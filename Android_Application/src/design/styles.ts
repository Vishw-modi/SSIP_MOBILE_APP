import { Platform, Appearance } from "react-native";

// Base color palette
const colors = {
  // Primary Green (your signature color)
  primary: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#34C759", // Your main primary
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
    950: "#022C1A", // Added 950 shade for primary
  },

  // Accent Orange
  accent: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#FF8A34", // Your main accent
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
    950: "#331506", // Added 950 shade for accent
  },

  // Neutrals (Gray scale)
  neutral: {
    0: "#FFFFFF",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },

  // Semantic colors
  semantic: {
    success: {
      light: "#22C55E",
      main: "#16A34A",
      dark: "#15803D",
      bg: "#DCFCE7",
      text: "#166534",
    },
    warning: {
      light: "#FCD34D",
      main: "#F59E0B",
      dark: "#D97706",
      bg: "#FEF3C7",
      text: "#92400E",
    },
    danger: {
      light: "#F87171",
      main: "#EF4444",
      dark: "#DC2626",
      bg: "#FEE2E2",
      text: "#991B1B",
    },
    info: {
      light: "#60A5FA",
      main: "#3B82F6",
      dark: "#2563EB",
      bg: "#DBEAFE",
      text: "#1D4ED8",
    },
  },

  // Interactive states
  interactive: {
    hover: "rgba(52, 199, 89, 0.08)",
    pressed: "rgba(52, 199, 89, 0.12)",
    focus: "rgba(52, 199, 89, 0.16)",
    disabled: "rgba(148, 163, 184, 0.5)",
  },

  // Glass/Blur effects
  glass: {
    light: "rgba(255, 255, 255, 0.8)",
    medium: "rgba(255, 255, 255, 0.6)",
    dark: "rgba(0, 0, 0, 0.2)",
  },
};

// Light theme palette
const lightPalette = {
  primary: colors.primary[500],
  primaryLight: colors.primary[400],
  primaryDark: colors.primary[600],
  primaryBg: colors.primary[50],
  primaryBorder: colors.primary[200],

  accent: colors.accent[500],
  accentLight: colors.accent[400],
  accentDark: colors.accent[600],
  accentBg: colors.accent[50],

  // Backgrounds
  bg: colors.neutral[50],
  bgSecondary: colors.neutral[100],
  bgTertiary: colors.neutral[0],

  // Cards and surfaces
  card: colors.neutral[0],
  cardSecondary: colors.neutral[50],
  cardElevated: colors.neutral[0],
  actionBar: colors.neutral[50],

  // Text
  text: colors.neutral[900],
  textSecondary: colors.neutral[700],
  textMuted: colors.neutral[500],
  textDisabled: colors.neutral[400],
  textInverse: colors.neutral[0],

  // Borders and dividers
  border: colors.neutral[200],
  borderLight: colors.neutral[100],
  borderStrong: colors.neutral[300],
  divider: colors.neutral[200],

  // Interactive
  hover: colors.interactive.hover,
  pressed: colors.interactive.pressed,
  focus: colors.interactive.focus,
  disabled: colors.interactive.disabled,

  // Semantic colors
  success: colors.semantic.success.main,
  successBg: colors.semantic.success.bg,
  successText: colors.semantic.success.text,

  warning: colors.semantic.warning.main,
  warningBg: colors.semantic.warning.bg,
  warningText: colors.semantic.warning.text,

  danger: colors.semantic.danger.main,
  dangerBg: colors.semantic.danger.bg,
  dangerText: colors.semantic.danger.text,

  info: colors.semantic.info.main,
  infoBg: colors.semantic.info.bg,
  infoText: colors.semantic.info.text,
};

// Dark theme palette
const darkPalette = {
  primary: colors.primary[400],
  primaryLight: colors.primary[300],
  primaryDark: colors.primary[500],
  primaryBg: colors.primary[950],
  primaryBorder: colors.primary[800],

  accent: colors.accent[400],
  accentLight: colors.accent[300],
  accentDark: colors.accent[500],
  accentBg: colors.accent[950],

  // Backgrounds
  bg: colors.neutral[950],
  bgSecondary: colors.neutral[900],
  bgTertiary: colors.neutral[800],

  // Cards and surfaces
  card: colors.neutral[900],
  cardSecondary: colors.neutral[800],
  cardElevated: colors.neutral[800],
  actionBar: colors.neutral[800],

  // Text
  text: colors.neutral[100],
  textSecondary: colors.neutral[300],
  textMuted: colors.neutral[500],
  textDisabled: colors.neutral[600],
  textInverse: colors.neutral[900],

  // Borders and dividers
  border: colors.neutral[800],
  borderLight: colors.neutral[700],
  borderStrong: colors.neutral[600],
  divider: colors.neutral[800],

  // Interactive (adjusted for dark mode)
  hover: "rgba(52, 199, 89, 0.12)",
  pressed: "rgba(52, 199, 89, 0.16)",
  focus: "rgba(52, 199, 89, 0.20)",
  disabled: "rgba(148, 163, 184, 0.3)",

  // Semantic colors (adjusted for dark mode)
  success: colors.semantic.success.light,
  successBg: "rgba(34, 197, 94, 0.1)",
  successText: colors.semantic.success.light,

  warning: colors.semantic.warning.light,
  warningBg: "rgba(245, 158, 11, 0.1)",
  warningText: colors.semantic.warning.light,

  danger: colors.semantic.danger.light,
  dangerBg: "rgba(239, 68, 68, 0.1)",
  dangerText: colors.semantic.danger.light,

  info: colors.semantic.info.light,
  infoBg: "rgba(59, 130, 246, 0.1)",
  infoText: colors.semantic.info.light,
};

// Get system theme preference
const getSystemTheme = () => {
  return Appearance.getColorScheme() || "light";
};

// Export the appropriate palette based on theme
export const palette = getSystemTheme() === "dark" ? darkPalette : lightPalette;

// Export both palettes for manual theme switching
export const themes = {
  light: lightPalette,
  dark: darkPalette,
};

export const lightTheme = lightPalette;
export const darkTheme = darkPalette;

// Enhanced spacing scale
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,

  // Semantic spacing
  component: 16,
  section: 24,
  screen: 20,

  // Layout spacing
  gutter: 16,
  containerPadding: 20,
  cardPadding: 16,
  listItemPadding: 12,
};

// Enhanced border radius
export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
  circle: 9999,

  // Semantic radii
  button: 12,
  card: 16,
  input: 8,
  badge: 8,
  modal: 20,
};

// Enhanced shadows with multiple levels
export const shadows = {
  none: Platform.select({
    ios: { shadowOpacity: 0 },
    default: { elevation: 0 },
  }),

  xs: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    default: { elevation: 1 },
  }),

  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    default: { elevation: 2 },
  }),

  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    default: { elevation: 4 },
  }),

  lg: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    default: { elevation: 8 },
  }),

  xl: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    default: { elevation: 12 },
  }),

  xxl: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
    default: { elevation: 16 },
  }),
};

// Comprehensive typography scale
export const typography = {
  // Display text (largest)
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "800" as const,
    color: palette.text,
  },

  // Headings
  h1: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "700" as const,
    color: palette.text,
  },

  h2: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700" as const,
    color: palette.text,
  },

  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    color: palette.text,
  },

  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    color: palette.text,
  },

  h5: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
    color: palette.text,
  },

  h6: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: palette.text,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400" as const,
    color: palette.text,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
    color: palette.text,
  },

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
    color: palette.textSecondary,
  },

  // Labels and UI text
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    color: palette.text,
  },

  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    color: palette.textSecondary,
  },

  // Caption and helper text
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    color: palette.textMuted,
  },

  captionSmall: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
    color: palette.textMuted,
  },

  // Button text
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600" as const,
    color: palette.text,
  },

  buttonSmall: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "600" as const,
    color: palette.text,
  },

  // Monospace for code
  code: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    color: palette.text,
  },
};

// Animation durations and easings
export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  easing: {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    spring: "spring",
  },
};

// Opacity levels
export const opacity = {
  disabled: 0.4,
  hover: 0.8,
  pressed: 0.6,
  overlay: 0.5,
  ghost: 0.05,
  subtle: 0.1,
  muted: 0.6,
};

// Z-index layers
export const zIndex = {
  hide: -1,
  base: 0,
  elevated: 10,
  sticky: 100,
  overlay: 1000,
  dropdown: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
  max: 9999,
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};
