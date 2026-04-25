import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { theme, easing } from "../theme";
import { driveIn } from "../util";
import { KineticText } from "../components/KineticText";
import { AccentBar } from "../components/AccentBar";

export const OUTRO_DUR = 110;

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = driveIn(frame, 0, 16, easing.snap);
  const logoScale = 0.86 + enter * 0.14;

  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(109,40,217,0.28) 0%, transparent 65%)",
          opacity: enter,
        }}
      />

      <AccentBar
        startFrame={4}
        enterDur={14}
        holdDur={OUTRO_DUR - 32}
        exitDur={14}
        height={28}
        top={"36%"}
        left={-200}
        width={"140%"}
        color={theme.accent}
        direction="ltr"
        z={1}
        style={{ filter: "drop-shadow(0 0 30px rgba(109,40,217,0.6))" }}
      />
      <AccentBar
        startFrame={14}
        enterDur={14}
        holdDur={OUTRO_DUR - 40}
        exitDur={14}
        height={20}
        top={"66%"}
        left={-200}
        width={"140%"}
        color={theme.accentBright}
        direction="rtl"
        z={1}
      />

      {/* Logo lockup centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          opacity: enter,
          zIndex: 5,
        }}
      >
        <Img
          src={staticFile("assets/logo.png")}
          style={{
            width: 1100,
            height: 360,
            filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.55))",
          }}
        />
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 220,
          textAlign: "center",
          zIndex: 6,
        }}
      >
        <KineticText
          startFrame={26}
          enterDur={14}
          holdDur={OUTRO_DUR - 50}
          exitDur={12}
          reveal="wipe-up"
          size={64}
          weight={800}
          letterSpacing={-1}
          color={theme.text}
          align="center"
          uppercase={false}
        >
          Старт за 30 секунд.
        </KineticText>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 130,
          textAlign: "center",
          zIndex: 6,
        }}
      >
        <KineticText
          startFrame={36}
          enterDur={12}
          holdDur={OUTRO_DUR - 60}
          exitDur={10}
          reveal="wipe-up"
          size={32}
          weight={600}
          letterSpacing={6}
          color={theme.accentSoft}
          align="center"
        >
          NODEPLAY.NET
        </KineticText>
      </div>

      {/* Closing wipe */}
      {frame > OUTRO_DUR - 20 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme.accent,
            transform: `translateX(${
              -100 + driveIn(frame, OUTRO_DUR - 20, 18, easing.snap) * 100
            }%)`,
            zIndex: 100,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
