import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    glass: {
      border: string;
      surface: string;
      highlight: string;
    };
  }
  interface PaletteOptions {
    glass?: {
      border?: string;
      surface?: string;
      highlight?: string;
    };
  }
}

export const siteTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5eead4",
      light: "#ccfbf1",
      dark: "#0d9488",
    },
    secondary: {
      main: "rgba(255,255,255,0.92)",
    },
    background: {
      default: "#050508",
      paper: "rgba(255,255,255,0.06)",
    },
    text: {
      primary: "#f4f4f5",
      secondary: "rgba(244,244,245,0.62)",
    },
    glass: {
      border: "rgba(255,255,255,0.14)",
      surface: "rgba(255,255,255,0.06)",
      highlight: "rgba(255,255,255,0.1)",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#050508",
        },
      },
    },
  },
});
