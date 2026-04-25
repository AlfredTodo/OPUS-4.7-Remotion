import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { KineticText } from "../components/KineticText";
import { AccentBar } from "../components/AccentBar";
import { driveIn } from "../util";

export const MANIFESTO_DUR = 105;

const Verb: React.FC<{
  word: string;
  startFrame: number;
  y: number;
  align: "left" | "right";
  color?: string;
}> = ({ word, startFrame, y, align, color = theme.text }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: align === "left" ? 110 : undefined,
        right: align === "right" ? 110 : undefined,
        zIndex: 5,
      }}
    >
      <KineticText
        startFrame={startFrame}
        enterDur={12}
        holdDur={MANIFESTO_DUR - startFrame - 24}
        exitDur={12}
        reveal={align === "left" ? "wipe-left" : "wipe-right"}
        size={200}
        letterSpacing={-6}
        align={align}
        color={color}
      >
        {word}
      </KineticText>
    </div>
  );
};

export const Manifesto: React.FC = () => {
  const frame = useCurrentFrame();
  // Background fade-in
  const bg = driveIn(frame, 0, 14);
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      {/* Background diagonal accent bands */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: bg * 0.12,
          background: `linear-gradient(135deg, ${theme.accent} 0%, transparent 40%, transparent 60%, ${theme.accent} 100%)`,
        }}
      />

      <AccentBar
        startFrame={4}
        enterDur={12}
        holdDur={MANIFESTO_DUR - 30}
        exitDur={12}
        height={20}
        top={195}
        left={-200}
        width={"140%"}
        color={theme.accent}
        direction="ltr"
        z={2}
      />
      <Verb word="ЗАПУСТИ" startFrame={2} y={140} align="left" />

      <AccentBar
        startFrame={26}
        enterDur={12}
        holdDur={MANIFESTO_DUR - 50}
        exitDur={12}
        height={20}
        top={520}
        left={-200}
        width={"140%"}
        color={theme.accentBright}
        direction="rtl"
        z={2}
      />
      <Verb word="УПРАВЛЯЙ" startFrame={24} y={460} align="right" />

      <AccentBar
        startFrame={50}
        enterDur={12}
        holdDur={MANIFESTO_DUR - 75}
        exitDur={12}
        height={20}
        top={840}
        left={-200}
        width={"140%"}
        color={theme.accent}
        direction="ltr"
        z={2}
      />
      <Verb word="ИГРАЙ" startFrame={48} y={780} align="left" />

      {/* Side index numbers */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 140,
          opacity: 0.55,
        }}
      >
        <KineticText
          startFrame={2}
          enterDur={10}
          holdDur={MANIFESTO_DUR - 24}
          exitDur={10}
          reveal="wipe-up"
          size={36}
          weight={700}
          letterSpacing={4}
          color={theme.accentSoft}
        >
          01
        </KineticText>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 460,
          opacity: 0.55,
        }}
      >
        <KineticText
          startFrame={24}
          enterDur={10}
          holdDur={MANIFESTO_DUR - 46}
          exitDur={10}
          reveal="wipe-up"
          size={36}
          weight={700}
          letterSpacing={4}
          color={theme.accentSoft}
        >
          02
        </KineticText>
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 780,
          opacity: 0.55,
        }}
      >
        <KineticText
          startFrame={48}
          enterDur={10}
          holdDur={MANIFESTO_DUR - 70}
          exitDur={10}
          reveal="wipe-up"
          size={36}
          weight={700}
          letterSpacing={4}
          color={theme.accentSoft}
        >
          03
        </KineticText>
      </div>
    </AbsoluteFill>
  );
};
