import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, easing } from "../theme";
import { driveIn } from "../util";

// A full-screen color block that swipes across the viewport (left->right or
// right->left). Used between scenes for a Microsoft-style snap cut.
export const WipePanel: React.FC<{
  startFrame: number;
  duration?: number;
  color?: string;
  direction?: "ltr" | "rtl" | "ttb" | "btt";
  z?: number;
}> = ({
  startFrame,
  duration = 22,
  color = theme.accent,
  direction = "ltr",
  z = 200,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  // Block enters and exits. Bar fully covers the screen at midpoint.
  const halfDur = duration / 2;
  // Phase 1: 0..1 enters. Phase 2: 1..0 exits in same direction.
  const enter = driveIn(local, 0, halfDur, easing.snap);
  const exit = driveIn(local, halfDur, halfDur, easing.snap);

  let tx = "0%";
  let ty = "0%";
  if (direction === "ltr") {
    const pos = -100 + enter * 200 - exit * 100;
    tx = `${pos}%`;
  } else if (direction === "rtl") {
    const pos = 100 - enter * 200 + exit * 100;
    tx = `${pos}%`;
  } else if (direction === "ttb") {
    const pos = -100 + enter * 200 - exit * 100;
    ty = `${pos}%`;
  } else if (direction === "btt") {
    const pos = 100 - enter * 200 + exit * 100;
    ty = `${pos}%`;
  }

  if (local < 0 || local > duration + 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        transform: `translate(${tx}, ${ty})`,
        zIndex: z,
        boxShadow: "0 0 60px rgba(0,0,0,0.4)",
      }}
    />
  );
};
