import { TextStyle, ViewStyle, Platform } from "react-native";

export const theme = {
  colors: {
    // Primary Brand
    primary: "#B23A1D",
    primaryLight: "#D94D2B",
    primaryDark: "#8E2E17",
    onPrimary: "#FFFFFF",
    
    // Backgrounds
    page: "#FDFCF0",
    surface: "#FFFFFF",
    surfaceAlt: "#F7F3E9",
    surfaceDark: "#2A1B13",
    
    // Content
    text: "#1A1614",
    textSecondary: "#4A4541",
    muted: "#746E69",
    onSurface: "#1A1614",
    onSurfaceAlt: "#4A4541",
    onSurfaceDark: "#FFFFFF",
    
    // Status
    success: "#4A7C2C",
    onSuccess: "#FFFFFF",
    warning: "#FF6B00",
    error: "#D32F2F",
    onError: "#FFFFFF",
    
    // UI Elements
    border: "#E8E4D9",
    shadow: "rgba(26, 22, 20, 0.08)",
    divider: "#F0EDE4",
  },
  
  spacing: {
    base: 4,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  touchTargets: {
    min: 44,
    android: 48,
    ios: 44,
  },
  
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#1A1614",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    lg: {
      shadowColor: "#1A1614",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 10,
    },
  },

  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },

  // Specialized Components
  hero: {
    backgroundColor: "#2A1B13",
    borderRadius: 32,
    padding: 24,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  } satisfies ViewStyle,

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#1A1614",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  } satisfies ViewStyle,

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 14,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: "#E8E4D9",
    shadowColor: "#1A1614",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  } satisfies ViewStyle,

  mapCard: {
    backgroundColor: "#F7F3E9",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 8,
  } satisfies ViewStyle,

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  } satisfies ViewStyle,

  button: {
    primary: {
      minHeight: 56, // Passes 44/48
      paddingHorizontal: 24,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#B23A1D",
    } satisfies ViewStyle,
    secondary: {
      minHeight: 56,
      paddingHorizontal: 24,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F7F3E9",
    } satisfies ViewStyle,
    icon: {
      width: 48, // Production-ready 48px
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#B23A1D",
    } satisfies ViewStyle,
    small: {
      minHeight: 44, // Minimum iOS HIG
      minWidth: 44,
      paddingHorizontal: 12,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    } satisfies ViewStyle,
  },

  input: {
    minHeight: 56,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#E8E4D9",
    backgroundColor: "#FFFFFF",
    color: "#1A1614",
    fontSize: 16,
  } satisfies TextStyle,

  // Typography
  typography: {
    display: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "800",
      letterSpacing: -0.8,
      color: "#1A1614",
    } satisfies TextStyle,
    h1: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "800",
      letterSpacing: -0.4,
      color: "#1A1614",
    } satisfies TextStyle,
    h2: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: "700",
      color: "#1A1614",
    } satisfies TextStyle,
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "700",
      color: "#1A1614",
    } satisfies TextStyle,
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: "#1A1614",
    } satisfies TextStyle,
    bodySecondary: {
      fontSize: 15,
      lineHeight: 22,
      color: "#746E69",
    } satisfies TextStyle,
    caption: {
      fontSize: 13,
      lineHeight: 18,
      color: "#746E69",
      fontWeight: "500",
    } satisfies TextStyle,
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: "#1A1614",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    } satisfies TextStyle,
  },

  // Legacy Compatibility (Keep keys for now but map to new)
  screenTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: "#1A1614",
    letterSpacing: -0.8,
  } satisfies TextStyle,
  screenSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#746E69",
  } satisfies TextStyle,
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: "#1A1614",
  } satisfies TextStyle,
  sectionSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#746E69",
  } satisfies TextStyle,
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1614",
  } satisfies TextStyle,
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#746E69",
  } satisfies TextStyle,
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#B23A1D",
  } satisfies TextStyle,
  primaryButton: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: "#B23A1D",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  } satisfies TextStyle,
  secondaryButton: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: "#F7F3E9",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1614",
  } satisfies TextStyle,
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#B23A1D",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  badge: {
    backgroundColor: "#F7F3E9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  } satisfies ViewStyle,
  rowTitle: {
    color: "#1A1614",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
  } satisfies TextStyle,
  summaryLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } satisfies ViewStyle,
  kicker: {
    color: "#FFBD95",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "700",
    fontSize: 13,
  } satisfies TextStyle,
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
  } satisfies TextStyle,
  badgeText: {
    color: "#B23A1D",
    fontSize: 13,
    fontWeight: "700",
  } satisfies TextStyle,
};



