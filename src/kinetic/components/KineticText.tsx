import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { driveIn, driveOut } from "../util";

type Reveal = "wipe-left" | "wipe-right" | "wipe-up" | "wipe-down" | "scale" | "letters";

export const KineticText: React.FC<{
  children: string;
  startFrame?: number;
  enterDur?: number;
  holdDur?: number;
  exitDur?: number;
  reveal?: Reveal;
  size?: number;
  weight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  color?: string;
  align?: "left" | "center" | "right";
  italic?: boolean;
  uppercase?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  startFrame = 0,
  enterDur = 14,
  holdDur = 30,
  exitDur = 12,
  reveal = "wipe-up",
  size = 120,
  weight = 800,
  letterSpacing = -3,
  lineHeight = 1,
  color = theme.text,
  align = "left",
  italic = false,
  uppercase = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const enter = driveIn(local, 0, enterDur);
  const exit = driveOut(local, enterDur + holdDur, exitDur);
  const v = Math.min(enter, exit);

  // Static container styles that always exist (so layout sizes are stable)
  const containerStyle: React.CSSProperties = {
    fontFamily: theme.fontFamily,
    fontWeight: weight,
    fontSize: size,
    letterSpacing,
    lineHeight,
    color,
    fontStyle: italic ? "italic" : "normal",
    textTransform: uppercase ? "uppercase" : "none",
    textAlign: align,
    whiteSpace: "pre",
    ...style,
  };

  if (reveal === "letters") {
    const chars = children.split("");
    return (
      <div style={containerStyle}>
        {chars.map((c, i) => {
          const stagger = i * 1.4;
          const e = driveIn(local, stagger, enterDur);
          const x = driveOut(local, enterDur + holdDur + stagger, exitDur);
          const cv = Math.min(e, x);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: cv,
                transform: `translateY(${(1 - cv) * 0.4}em)`,
                whiteSpace: "pre",
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
    );
  }

  let mask = "";
  let translate = "translate(0,0)";
  if (reveal === "wipe-up") {
    const pct = (1 - enter) * 100;
    mask = `inset(${pct}% 0 0 0)`;
    translate = `translate(0, ${(1 - enter) * 0.18}em)`;
  } else if (reveal === "wipe-down") {
    const pct = (1 - enter) * 100;
    mask = `inset(0 0 ${pct}% 0)`;
    translate = `translate(0, ${(1 - enter) * -0.18}em)`;
  } else if (reveal === "wipe-left") {
    const pct = (1 - enter) * 100;
    mask = `inset(0 ${pct}% 0 0)`;
    translate = `translate(${(1 - enter) * -0.05}em, 0)`;
  } else if (reveal === "wipe-right") {
    const pct = (1 - enter) * 100;
    mask = `inset(0 0 0 ${pct}%)`;
    translate = `translate(${(1 - enter) * 0.05}em, 0)`;
  } else if (reveal === "scale") {
    mask = "inset(0)";
    translate = `scale(${0.85 + 0.15 * enter})`;
  }

  // Bake out transform: when exiting, lift up
  const outShift = (1 - exit) * 0.3;
  const finalTransform =
    reveal === "scale"
      ? `${translate}`
      : `${translate} translateY(${-outShift * 0.6}em)`;

  return (
    <div
      style={{
        ...containerStyle,
        clipPath: mask,
        WebkitClipPath: mask,
        opacity: v,
        transform: finalTransform,
        transformOrigin: align === "center" ? "center" : "left",
      }}
    >
      {children}
    </div>
  );
};
