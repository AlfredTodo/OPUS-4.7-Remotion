import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, easing } from "../theme";
import { driveIn, driveOut } from "../util";

// A bar that enters from one side (snap), holds, then exits to the same side.
export const AccentBar: React.FC<{
  startFrame?: number;
  enterDur?: number;
  holdDur?: number;
  exitDur?: number;
  height?: number;
  width?: number | string;
  top?: number | string;
  left?: number | string;
  color?: string;
  direction?: "ltr" | "rtl";
  z?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}> = ({
  startFrame = 0,
  enterDur = 12,
  holdDur = 30,
  exitDur = 12,
  height = 26,
  width = "120%",
  top = "50%",
  left = "-10%",
  color = theme.accent,
  direction = "ltr",
  z = 0,
  borderRadius = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const enter = driveIn(local, 0, enterDur, easing.snap);
  const exit = driveOut(local, enterDur + holdDur, exitDur, easing.snap);

  // Bar enters from off-screen on `direction`'s opposite side, settles in
  // place, then exits in the same direction.
  let tx: string;
  if (direction === "ltr") {
    // From left: enter goes -100% -> 0%, exit goes 0% -> 100%
    const enterPart = -100 + enter * 100;
    const exitPart = (1 - exit) * 100;
    tx = `${enterPart + exitPart}%`;
  } else {
    const enterPart = 100 - enter * 100;
    const exitPart = -(1 - exit) * 100;
    tx = `${enterPart + exitPart}%`;
  }

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        height,
        width,
        background: color,
        borderRadius,
        zIndex: z,
        transform: `translateX(${tx})`,
        ...style,
      }}
    />
  );
};

// A single-pass sweep bar that traverses the full viewport width once.
// Useful for inter-shot transitions inside a scene.
export const SweepBar: React.FC<{
  startFrame: number;
  duration?: number;
  width?: number;
  height?: number | string;
  top?: number | string;
  color?: string;
  direction?: "ltr" | "rtl";
  z?: number;
}> = ({
  startFrame,
  duration = 22,
  width = 140,
  height = "100%",
  top = 0,
  color = theme.accent,
  direction = "ltr",
  z = 50,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > duration) return null;
  const t = driveIn(local, 0, duration, easing.snap);
  const x =
    direction === "ltr"
      ? -width + t * (1920 + width * 2)
      : 1920 + width - t * (1920 + width * 2);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: x,
        width,
        height,
        background: color,
        zIndex: z,
        boxShadow: `0 0 60px ${color}aa, 0 0 30px ${color}`,
      }}
    />
  );
};
