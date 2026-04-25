import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, easing } from "../theme";
import { driveIn, driveOut } from "../util";

// A highlight rectangle (in SVG-viewBox coords) that draws itself with a
// stroke-around animation, holds with a pulsing glow, then dissolves.
export const FocusSpot: React.FC<{
  // SVG-space coords
  x: number;
  y: number;
  w: number;
  h: number;
  // Pixel scale: panel screen-width / SVG_VIEWBOX.w
  scale: number;
  startFrame: number;
  enterDur?: number;
  holdDur: number;
  exitDur?: number;
  panelOffsetX?: number;
  panelOffsetY?: number;
}> = ({
  x,
  y,
  w,
  h,
  scale,
  startFrame,
  enterDur = 18,
  holdDur,
  exitDur = 12,
  panelOffsetX = 0,
  panelOffsetY = 0,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const enter = driveIn(local, 0, enterDur, easing.emphasize);
  const exit = driveOut(local, enterDur + holdDur, exitDur, easing.snap);
  const v = Math.min(enter, exit);
  if (v <= 0.001) return null;

  const isFocused = local >= enterDur && local < enterDur + holdDur;
  const pulse = isFocused ? 0.7 + 0.3 * Math.sin((local - enterDur) / 7) : 0.5;

  const px = x * scale + panelOffsetX;
  const py = y * scale + panelOffsetY;
  const pw = w * scale;
  const ph = h * scale;

  const expand = 1 + (1 - enter) * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        left: px - 6,
        top: py - 6,
        width: pw + 12,
        height: ph + 12,
        borderRadius: 12,
        border: `4px solid ${theme.accentSoft}`,
        boxShadow: `
          inset 0 0 0 1px rgba(255,255,255,0.4),
          0 0 ${10 + 12 * pulse}px ${theme.accent}cc,
          0 0 ${28 + 22 * pulse}px ${theme.accent}66
        `,
        opacity: v,
        transform: `scale(${expand})`,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    />
  );
};
