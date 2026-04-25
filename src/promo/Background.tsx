import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fluent } from "./easings";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const t = frame / 60;
  const cx = width * (0.5 + Math.sin(t * 0.4) * 0.08);
  const cy = height * (0.5 + Math.cos(t * 0.3) * 0.06);

  return (
    <AbsoluteFill
      style={{ background: fluent.bg, overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${cx}px ${cy}px, ${fluent.accent}33 0%, ${fluent.bg}00 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${width - cx}px ${height - cy}px, ${fluent.accentSoft}1f 0%, ${fluent.bg}00 50%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
