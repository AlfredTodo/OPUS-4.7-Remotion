import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fluent, fluentEnter } from "./easings";

// Source screenshot intrinsic size (both screenshots are 1921x1080).
const SCRN_W = 1921;
const SCRN_H = 1080;

// Stage layout: panel laid in 3D, leaving room on the right for callouts.
const CARD_TOP = 200;
const CARD_LEFT_RATIO = 0.025;
const CARD_WIDTH_RATIO = 0.62;

// 3D stage tilt (subtle — readability first; 2D displacement + shadow does the
// heavy lifting for the "exploded" feel).
const TILT_X = 6; // deg
const TILT_Y = -4; // deg

// How far each element rises off the panel (screen pixels of upward shift).
const DEFAULT_LIFT = 60;

type Highlight = {
  // Coordinates in the original screenshot's pixel space (1921x1080).
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  caption: string;
  appearAt: number; // when this element starts lifting
  hideAt: number; // when this element starts settling/exiting
  // Optional: how high the element lifts off the panel
  liftZ?: number;
  // Optional small 2D nudge so floating elements don't overlap each other in screen space
  nudgeX?: number;
  nudgeY?: number;
};

export const Showcase: React.FC<{
  src: string;
  title: string;
  subtitle: string;
  highlights: Highlight[];
  durationInFrames: number;
}> = ({ src, title, subtitle, highlights, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cardW = width * CARD_WIDTH_RATIO;
  const cardScale = cardW / SCRN_W;
  const cardH = SCRN_H * cardScale;
  const cardX = width * CARD_LEFT_RATIO;
  const cardY = CARD_TOP;

  const enterScale = interpolate(frame, [0, 36], [1.05, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterOpacity = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterBlur = interpolate(frame, [0, 28], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterY = interpolate(frame, [0, 36], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 28, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: fluentEnter,
    }
  );
  const outroScale = interpolate(
    frame,
    [durationInFrames - 28, durationInFrames],
    [1, 1.04],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: fluentEnter,
    }
  );

  // Subtle Ken Burns drift (in video pixels)
  const driftX = Math.sin(frame / 110) * 5;
  const driftY = Math.cos(frame / 130) * 4;

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * outroOpacity,
        fontFamily: fluent.fontFamily,
        perspective: "2600px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* Title block (top-left of video) */}
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: 60,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <TitleReveal text={title} delay={20} />
        <SubtitleReveal text={subtitle} delay={30} />
      </div>

      {/* 3D stage */}
      <div
        style={{
          position: "absolute",
          left: cardX + driftX,
          top: cardY + driftY + enterY,
          width: cardW,
          height: cardH,
          transformStyle: "preserve-3d",
          transform: `scale(${enterScale * outroScale}) rotateX(${TILT_X}deg) rotateY(${TILT_Y}deg)`,
          transformOrigin: "center center",
          filter: `blur(${enterBlur}px)`,
        }}
      >
        {/* Base panel (the screenshot lying flat at z=0) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: `0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px ${fluent.accent}33`,
            transform: "translateZ(0)",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: cardW,
              height: cardH,
              display: "block",
            }}
          />
          {/* Subtle desaturation on the base panel so lifted clones pop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 8, 18, 0.18)",
              pointerEvents: "none",
            }}
          />
          {/* "Holes" on the base where lifted elements came from */}
          {highlights.map((h, i) => (
            <BaseHole
              key={`hole-${i}`}
              highlight={h}
              cardScale={cardScale}
            />
          ))}
        </div>

        {/* Floating element clones (cropped from screenshot, lifted up & out) */}
        {highlights.map((h, i) => (
          <FloatingElement
            key={`fl-${i}`}
            highlight={h}
            src={src}
            cardScale={cardScale}
            cardW={cardW}
            cardH={cardH}
          />
        ))}
      </div>

      {/* Callouts (2D screen space, right of stage; distributed into vertical slots) */}
      {highlights.map((h, i) => (
        <CalloutCard
          key={`cl-${i}`}
          highlight={h}
          index={i}
          total={highlights.length}
          cardX={cardX}
          cardW={cardW}
          videoH={height}
        />
      ))}
    </AbsoluteFill>
  );
};

const BaseHole: React.FC<{
  highlight: Highlight;
  cardScale: number;
}> = ({ highlight, cardScale }) => {
  const frame = useCurrentFrame();
  const local = frame - highlight.appearAt;
  const exitLocal = frame - highlight.hideAt;

  const fadeIn = interpolate(local, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const fadeOut = interpolate(exitLocal, [0, 24], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const opacity = fadeIn * fadeOut;

  const x = highlight.x * cardScale;
  const y = highlight.y * cardScale;
  const w = highlight.w * cardScale;
  const h = highlight.h * cardScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 14,
        background:
          "linear-gradient(160deg, rgba(8,6,14,0.97), rgba(14,10,20,0.99))",
        boxShadow: `inset 0 12px 28px rgba(0,0,0,0.85), inset 0 0 0 1px ${fluent.accent}66, inset 0 -4px 16px ${fluent.accent}22`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const FloatingElement: React.FC<{
  highlight: Highlight;
  src: string;
  cardScale: number;
  cardW: number;
  cardH: number;
}> = ({ highlight, src, cardScale, cardW, cardH }) => {
  const frame = useCurrentFrame();
  const local = frame - highlight.appearAt;
  const exitLocal = frame - highlight.hideAt;

  const lift = interpolate(local, [0, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const fadeIn = interpolate(local, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const fadeOut = interpolate(exitLocal, [0, 24], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const opacity = fadeIn * fadeOut;

  const liftZ = highlight.liftZ ?? 140;
  const tz = lift * liftZ;
  // Visible upward displacement in screen space — this is what makes the
  // floating element clearly "lifted off" the base.
  const liftY = lift * DEFAULT_LIFT;
  const scale = 1 + lift * 0.05;

  // Offsets in screenshot pixel space, converted to card pixel space.
  const x = highlight.x * cardScale;
  const y = highlight.y * cardScale;
  const w = highlight.w * cardScale;
  const h = highlight.h * cardScale;

  // Per-element 2D nudge so floating elements don't visually collide with each other
  const nudgeX = (highlight.nudgeX ?? 0) * lift;
  const nudgeY = (highlight.nudgeY ?? 0) * lift;

  // Shadow grows with lift to simulate distance from the surface
  const shadowSize = 40 + lift * 80;
  const shadowOpacity = 0.45 + lift * 0.25;

  return (
    <div
      style={{
        position: "absolute",
        left: x + nudgeX,
        top: y + nudgeY,
        width: w,
        height: h,
        opacity,
        transform: `translate3d(0, ${-liftY}px, ${tz}px) scale(${scale})`,
        transformOrigin: "center center",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: `
          0 ${shadowSize * 0.55}px ${shadowSize}px rgba(0,0,0,${shadowOpacity}),
          0 0 0 1px ${fluent.accentSoft}88,
          0 0 ${shadowSize * 0.7}px ${fluent.accent}66
        `,
      }}
    >
      {/* Cropped clone of the screenshot showing only this region */}
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: -x,
          top: -y,
          width: cardW,
          height: cardH,
          display: "block",
          filter: "saturate(1.1) brightness(1.06)",
        }}
      />
      {/* Subtle inner border highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          border: `1px solid ${fluent.accentSoft}aa`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const CalloutCard: React.FC<{
  highlight: Highlight;
  index: number;
  total: number;
  cardX: number;
  cardW: number;
  videoH: number;
}> = ({ highlight, index, total, cardX, cardW, videoH }) => {
  const frame = useCurrentFrame();
  const local = frame - highlight.appearAt;
  const exitLocal = frame - highlight.hideAt;

  const inOpacity = interpolate(local, [10, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const outOpacity = interpolate(exitLocal, [0, 24], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const opacity = Math.min(inOpacity, outOpacity);

  const ty = interpolate(local, [10, 40], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  const calloutW = 460;
  const calloutH = 220;
  const gap = 28;
  const stackTop = 200;
  const stackHeight = total * calloutH + (total - 1) * gap;
  const stackOffsetY = Math.max(stackTop, (videoH - stackHeight) / 2);

  const calloutX = cardX + cardW + 70;
  const calloutY = stackOffsetY + index * (calloutH + gap);

  return (
    <div
      style={{
        position: "absolute",
        left: calloutX,
        top: calloutY,
        width: calloutW,
        opacity,
        transform: `translateY(${ty}px)`,
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "26px 30px",
          borderRadius: 20,
          background:
            "linear-gradient(160deg, rgba(40, 28, 70, 0.92), rgba(20, 18, 28, 0.96))",
          border: `1px solid ${fluent.accentSoft}55`,
          boxShadow: `0 22px 48px rgba(0,0,0,0.55), 0 0 0 1px ${fluent.accent}22`,
          color: fluent.text,
          fontFamily: fluent.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: fluent.accentSoft,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {`0${index + 1}`}
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 12,
            letterSpacing: -0.6,
          }}
        >
          {highlight.label}
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 400,
            color: fluent.textMuted,
            lineHeight: 1.45,
          }}
        >
          {highlight.caption}
        </div>
      </div>
    </div>
  );
};

const TitleReveal: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const ty = interpolate(local, [0, 28], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const blur = interpolate(local, [0, 24], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${ty}px)`,
        filter: `blur(${blur}px)`,
        fontSize: 64,
        fontWeight: 800,
        color: fluent.text,
        letterSpacing: -1.2,
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
};

const SubtitleReveal: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const ty = interpolate(local, [0, 28], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${ty}px)`,
        fontSize: 22,
        fontWeight: 500,
        color: fluent.textMuted,
        letterSpacing: 4,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};
