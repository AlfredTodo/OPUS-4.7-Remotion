import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { KineticText } from "../components/KineticText";
import { AccentBar } from "../components/AccentBar";

export const COLD_OPEN_DUR = 90;

// Confetti-style accent dots on the periphery — adds Microsoft-y energy.
const Dots: React.FC<{ frame: number }> = ({ frame }) => {
  const dots = [
    { x: 120, y: 140, size: 14, color: theme.accentBright, delay: 4 },
    { x: 1780, y: 110, size: 10, color: "#fff", delay: 12 },
    { x: 1820, y: 920, size: 18, color: theme.accentBright, delay: 22 },
    { x: 90, y: 920, size: 8, color: "#fff", delay: 32 },
    { x: 960, y: 60, size: 6, color: theme.accentSoft, delay: 8 },
    { x: 1740, y: 540, size: 6, color: "#fff", delay: 18 },
  ];
  return (
    <>
      {dots.map((d, i) => {
        const v = Math.max(0, Math.min(1, (frame - d.delay) / 10));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.size,
              height: d.size,
              borderRadius: d.size,
              background: d.color,
              opacity: v,
              transform: `scale(${v})`,
              boxShadow: `0 0 ${d.size * 2}px ${d.color}aa`,
            }}
          />
        );
      })}
    </>
  );
};

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <Dots frame={frame} />

      {/* Sliding accent bar behind the words */}
      <AccentBar
        startFrame={6}
        enterDur={14}
        holdDur={50}
        exitDur={14}
        height={42}
        top={"32%"}
        left={-200}
        width={"140%"}
        color={theme.accent}
        direction="ltr"
        z={1}
        style={{ filter: "drop-shadow(0 0 30px rgba(109,40,217,0.6))" }}
      />

      {/* Word 1 */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 140,
          zIndex: 2,
        }}
      >
        <KineticText
          startFrame={0}
          enterDur={12}
          holdDur={20}
          exitDur={10}
          reveal="wipe-up"
          size={220}
          letterSpacing={-8}
        >
          ХОСТИНГ
        </KineticText>
      </div>

      {/* Word 2 — center */}
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 410,
          zIndex: 3,
        }}
      >
        <KineticText
          startFrame={26}
          enterDur={12}
          holdDur={22}
          exitDur={10}
          reveal="wipe-up"
          size={220}
          letterSpacing={-8}
          color={theme.text}
        >
          ИГРОВЫХ
        </KineticText>
      </div>

      {/* Bar 2 sliding the other way */}
      <AccentBar
        startFrame={40}
        enterDur={14}
        holdDur={32}
        exitDur={14}
        height={28}
        top={"82%"}
        left={-200}
        width={"140%"}
        color={theme.accentBright}
        direction="rtl"
        z={1}
        style={{ filter: "drop-shadow(0 0 24px rgba(139,92,246,0.6))" }}
      />

      {/* Word 3 — bottom-right */}
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 130,
          zIndex: 2,
        }}
      >
        <KineticText
          startFrame={50}
          enterDur={12}
          holdDur={28}
          exitDur={10}
          reveal="wipe-up"
          size={220}
          letterSpacing={-8}
          align="right"
        >
          СЕРВЕРОВ
        </KineticText>
      </div>

      {/* Subtle small hint text */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 380,
          zIndex: 4,
        }}
      >
        <KineticText
          startFrame={20}
          enterDur={10}
          holdDur={50}
          exitDur={10}
          reveal="wipe-left"
          size={26}
          weight={500}
          letterSpacing={6}
          color={theme.accentSoft}
        >
          NODEPLAY • PRESENTS
        </KineticText>
      </div>
    </AbsoluteFill>
  );
};
