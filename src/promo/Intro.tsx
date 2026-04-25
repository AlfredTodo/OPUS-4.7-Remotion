import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { fluent, fluentEnter } from "./easings";

const FluentReveal: React.FC<{
  delay: number;
  duration?: number;
  translateY?: number;
  blur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  delay,
  duration = 28,
  translateY = 32,
  blur = 12,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const ty = interpolate(local, [0, duration], [translateY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const b = interpolate(local, [0, duration], [blur, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${ty}px)`,
        filter: `blur(${b}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const logoScale = interpolate(frame, [10, 60], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const logoBlur = interpolate(frame, [10, 50], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const logoY = interpolate(frame, [10, 60], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  // Outro: fade everything as the next sequence enters
  const outroFade = interpolate(frame, [180, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const outroScale = interpolate(frame, [180, 210], [1, 1.04], {
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
        opacity: outroFade,
        transform: `scale(${outroScale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px) scale(${logoScale})`,
            filter: `blur(${logoBlur}px) drop-shadow(0 24px 60px ${fluent.accent}55)`,
          }}
        >
          <Img
            src={staticFile("assets/logo.png")}
            style={{ width: 520, height: "auto", display: "block" }}
          />
        </div>

        <FluentReveal
          delay={70}
          duration={26}
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: fluent.text,
            letterSpacing: -1.5,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          Хостинг игровых серверов
        </FluentReveal>

        <FluentReveal
          delay={100}
          duration={26}
          translateY={20}
          blur={8}
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: fluent.textMuted,
            letterSpacing: 0.2,
            textAlign: "center",
            maxWidth: 1100,
            marginTop: -24,
          }}
        >
          Управляй сервером в один клик. Запускай. Настраивай. Играй.
        </FluentReveal>

        <FluentReveal
          delay={140}
          duration={24}
          translateY={14}
          blur={6}
          style={{
            marginTop: 8,
            padding: "12px 28px",
            borderRadius: 999,
            border: `1px solid ${fluent.accentSoft}66`,
            background: `${fluent.accent}1f`,
            color: fluent.accentSoft,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          NodePlay · 2026
        </FluentReveal>
      </div>
    </AbsoluteFill>
  );
};
