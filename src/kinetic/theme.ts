import { Easing } from "remotion";

export const theme = {
  bg: "#0B0B0F",
  bgPanel: "#19191B",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.62)",
  accent: "#6D28D9",
  accentBright: "#8B5CF6",
  accentSoft: "#B594FF",
  accentDeep: "#3F1A8A",
  ink: "#0A0A0E",
  fontFamily: "Montserrat, sans-serif",
};

// Fluent / Microsoft-style snappy curves
export const easing = {
  // Soft snap-in (decel) — text/objects entering
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  // Anticipation accel-out — text leaving
  exit: Easing.bezier(0.7, 0, 0.84, 0),
  // Smooth in-out for camera / overall motion
  smooth: Easing.bezier(0.65, 0, 0.35, 1),
  // Heavy snap (Microsoft-style power-of-three)
  snap: Easing.bezier(0.85, 0, 0.15, 1),
  // Slight overshoot (Fluent emphasis)
  emphasize: Easing.bezier(0.12, 0.7, 0, 1.05),
};

// Frames helper: fps-aware time -> frames
export const seconds = (s: number, fps = 30) => Math.round(s * fps);
