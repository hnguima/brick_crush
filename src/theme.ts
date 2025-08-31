import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

function getCssVar(name: string, fallback: string = ""): string {
  if (typeof window === "undefined") return fallback;
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return value || fallback;
  } catch (error) {
    console.warn(`Failed to get CSS variable ${name}:`, error);
    return fallback;
  }
}

export const getLightTheme = (): Theme =>
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: getCssVar("--color-primary-light", "#6750A4"),
        light: "#7C4DFF",
        dark: "#5A47A0",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: getCssVar("--color-secondary-light", "#03DAC6"),
        light: "#1DE9B6",
        dark: "#00695C",
        contrastText: "#000000",
      },
      background: {
        default: getCssVar("--color-bg-light", "#ECEEF3"),
        paper: getCssVar("--color-bg-light-paper", "#FFFFFF"),
      },
      text: {
        primary: getCssVar("--color-text-light", "#0F172A"),
        secondary: "#475569",
        disabled: "#94A3B8",
      },
      divider: getCssVar("--color-outline-light", "#CBD5E1"),
      success: {
        main: "#10B981",
        light: "rgba(99, 102, 241, 0.35)",
      },
      error: {
        main: "#EF4444",
        light: "rgba(239, 68, 68, 0.35)",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily:
        "'Bungee', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      h1: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 1px 3px rgba(16, 24, 40, 0.12), 0 1px 2px rgba(16, 24, 40, 0.06)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  });

export const getDarkTheme = (): Theme =>
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: getCssVar("--color-primary-dark", "#7C4DFF"),
        light: "#9575FF",
        dark: "#6750A4",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: getCssVar("--color-secondary-dark", "#1DE9B6"),
        light: "#4FFFB2",
        dark: "#00BFA5",
        contrastText: "#000000",
      },
      background: {
        default: getCssVar("--color-bg-dark", "#0B1020"),
        paper: getCssVar("--color-bg-dark-paper", "#111827"),
      },
      text: {
        primary: getCssVar("--color-text-dark", "#E5E7EB"),
        secondary: "#9CA3AF",
        disabled: "#6B7280",
      },
      divider: getCssVar("--color-outline-dark", "#374151"),
      success: {
        main: "#10B981",
        light: "rgba(99, 102, 241, 0.35)",
      },
      error: {
        main: "#EF4444",
        light: "rgba(239, 68, 68, 0.35)",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily:
        "'Bungee', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      h1: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  });
