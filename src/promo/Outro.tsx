import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { fluent, fluentEnter } from "./easings";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const logoScale = interpolate(frame, [0, 40], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const logoBlur = interpolate(frame, [0, 28], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  const captionOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const captionY = interpolate(frame, [20, 50], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  const ctaOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const ctaY = interpolate(frame, [50, 80], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: fluent.fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            filter: `blur(${logoBlur}px) drop-shadow(0 22px 50px ${fluent.accent}55)`,
          }}
        >
          <Img
            src={staticFile("assets/logo.png")}
            style={{ width: 380, height: "auto", display: "block" }}
          />
        </div>
        <div
          style={{
            opacity: captionOpacity,
            transform: `translateY(${captionY}px)`,
            fontSize: 28,
            fontWeight: 500,
            color: fluent.textMuted,
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          Игровые серверы. Просто.
        </div>
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            marginTop: 12,
            padding: "16px 38px",
            borderRadius: 999,
            background: `linear-gradient(120deg, ${fluent.accent}, ${fluent.accentSoft})`,
            color: fluent.text,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 1.6,
            boxShadow: `0 18px 40px ${fluent.accent}66`,
          }}
        >
          nodeplay.net
        </div>
      </div>
    </AbsoluteFill>
  );
};
