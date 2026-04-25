import { Easing } from "remotion";

export const fluent = {
  bg: "#19191B",
  accent: "#6D28D9",
  accentSoft: "#8B5CF6",
  text: "#FFFFFF",
  textMuted: "rgba(255, 255, 255, 0.7)",
  textDim: "rgba(255, 255, 255, 0.5)",
  fontFamily:
    "'Montserrat', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

export const fluentEnter = Easing.bezier(0.1, 0.9, 0.2, 1.0);
export const fluentExit = Easing.bezier(0.7, 0.0, 1.0, 0.5);
export const fluentStandard = Easing.bezier(0.8, 0.0, 0.2, 1.0);
