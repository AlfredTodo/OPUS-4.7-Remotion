import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { theme, easing } from "../theme";
import { driveIn } from "../util";
import { KineticText } from "../components/KineticText";

export const LOGO_REVEAL_DUR = 75;

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Square block grows from center, then logo emerges, then full lockup
  const blockGrow = driveIn(frame, 0, 18, easing.emphasize);
  const logoFade = driveIn(frame, 16, 14, easing.enter);
  const logoScale = 0.92 + driveIn(frame, 16, 22, easing.enter) * 0.08;

  // Subtle exit lift
  const exit = driveIn(frame, LOGO_REVEAL_DUR - 12, 12, easing.exit);
  const exitLift = exit * -40;
  const exitFade = 1 - exit;

  const blockSize = 320 * blockGrow;
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      {/* Background "PLAY" mega text — set behind logo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "30%",
          textAlign: "center",
          zIndex: 0,
        }}
      >
        <KineticText
          startFrame={28}
          enterDur={16}
          holdDur={30}
          exitDur={12}
          reveal="wipe-up"
          size={420}
          weight={900}
          letterSpacing={-18}
          color={"rgba(109,40,217,0.18)"}
          align="center"
        >
          NODEPLAY
        </KineticText>
      </div>

      {/* Center logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          transform: `translate(-50%, -50%) translateY(${exitLift}px)`,
          zIndex: 2,
          opacity: exitFade,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 320,
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Purple block */}
          <div
            style={{
              position: "absolute",
              width: blockSize,
              height: blockSize,
              left: 160 - blockSize / 2,
              top: 160 - blockSize / 2,
              background: theme.accent,
              borderRadius: 20,
              boxShadow:
                "0 30px 80px rgba(109,40,217,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          />
          {/* Logo image (the source contains the purple square + NODE — we
              clip to render only the logo art on top of our scaling block) */}
          <Img
            src={staticFile("assets/logo.png")}
            style={{
              position: "absolute",
              width: 1100,
              height: 360,
              left: -390,
              top: -20,
              opacity: logoFade,
              transform: `scale(${logoScale})`,
              filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))",
              imageRendering: "auto",
            }}
          />
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 180,
          textAlign: "center",
          zIndex: 3,
          opacity: exitFade,
        }}
      >
        <KineticText
          startFrame={42}
          enterDur={14}
          holdDur={22}
          exitDur={10}
          reveal="wipe-up"
          size={36}
          weight={600}
          letterSpacing={8}
          color={theme.accentSoft}
          align="center"
        >
          ИГРОВЫЕ СЕРВЕРЫ • НОВОГО ПОКОЛЕНИЯ
        </KineticText>
      </div>

      {/* Quick exit wipe — accent bar zooming across */}
      {frame >= LOGO_REVEAL_DUR - 14 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme.accent,
            transform: `translateX(${-100 + driveIn(frame, LOGO_REVEAL_DUR - 14, 14, easing.snap) * 200}%)`,
            zIndex: 100,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
