import { interpolate } from "remotion";
import { easing } from "./theme";

export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

// Drive a 0->1 progress with custom ease. Stays at 1 after the duration.
export const driveIn = (
  frame: number,
  start: number,
  duration: number,
  ease = easing.enter,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// Flat plateau then exit out 1->0
export const driveOut = (
  frame: number,
  start: number,
  duration: number,
  ease = easing.exit,
) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// Trapezoid: enter -> hold -> exit
export const trapezoid = (
  frame: number,
  enterStart: number,
  enterDur: number,
  holdDur: number,
  exitDur: number,
) => {
  const enter = driveIn(frame, enterStart, enterDur, easing.enter);
  const exit = driveOut(frame, enterStart + enterDur + holdDur, exitDur, easing.exit);
  return Math.min(enter, exit);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
