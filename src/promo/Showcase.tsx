import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fluent, fluentEnter } from "./easings";

// Source screenshot intrinsic size (both screenshots are 1921x1080).
const SCRN_W = 1921;
const SCRN_H = 1080;

// Layout: screenshot is scaled to fit a "card" inside the video, leaving
// margin for title (top) and callouts (right side).
const CARD_TOP = 180;
const CARD_LEFT_RATIO = 0.04; // 4% from left
const CARD_WIDTH_RATIO = 0.62; // 62% of video width — leaves right side for callouts

type Highlight = {
  // Coordinates in the original screenshot's pixel space (1921x1080).
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  caption: string;
  appearAt: number;
  hideAt: number;
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

  const enterScale = interpolate(frame, [0, 30], [1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterBlur = interpolate(frame, [0, 24], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterY = interpolate(frame, [0, 30], [42, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: fluentEnter,
    }
  );
  const outroScale = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames],
    [1, 1.04],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: fluentEnter,
    }
  );

  // Subtle Ken Burns parallax (in video pixels)
  const driftX = Math.sin(frame / 90) * 6;
  const driftY = Math.cos(frame / 110) * 4;

  const totalScale = enterScale * outroScale;

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * outroOpacity,
        fontFamily: fluent.fontFamily,
      }}
    >
      {/* Title block (top-left of video) */}
      <Sequence from={20} durationInFrames={durationInFrames}>
        <div
          style={{
            position: "absolute",
            left: cardX,
            top: 60,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <TitleReveal text={title} delay={0} />
          <SubtitleReveal text={subtitle} delay={10} />
        </div>
      </Sequence>

      {/* Screenshot card */}
      <div
        style={{
          position: "absolute",
          left: cardX + driftX,
          top: cardY + driftY + enterY,
          width: cardW,
          height: cardH,
          borderRadius: 22,
          transform: `scale(${totalScale})`,
          transformOrigin: "center center",
          filter: `blur(${enterBlur}px)`,
          boxShadow: `0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px ${fluent.accent}33`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </div>

        {/* Highlight rectangles (drawn in screenshot pixel space, scaled with card) */}
        {highlights.map((h, i) => (
          <HighlightBox
            key={`box-${i}`}
            highlight={h}
            cardScale={cardScale}
          />
        ))}
      </div>

      {/* Callouts in video space (right of card) */}
      {highlights.map((h, i) => (
        <CalloutCard
          key={`callout-${i}`}
          highlight={h}
          index={i}
          cardX={cardX}
          cardY={cardY}
          cardScale={cardScale}
          cardW={cardW}
          videoW={width}
          videoH={height}
        />
      ))}
    </AbsoluteFill>
  );
};

const HighlightBox: React.FC<{ highlight: Highlight; cardScale: number }> = ({
  highlight,
  cardScale,
}) => {
  const frame = useCurrentFrame();
  const local = frame - highlight.appearAt;
  const exitLocal = frame - highlight.hideAt;

  const inOpacity = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const outOpacity = interpolate(exitLocal, [0, 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const opacity = Math.min(inOpacity, outOpacity);

  const drawProgress = interpolate(local, [4, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  // Convert screenshot coords to card pixel coords
  const x = highlight.x * cardScale;
  const y = highlight.y * cardScale;
  const w = highlight.w * cardScale;
  const h = highlight.h * cardScale;
  const perimeter = (w + h) * 2;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {/* Soft fill */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        ry={14}
        fill={`${fluent.accent}1f`}
      />
      {/* Stroke draw-in */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        ry={14}
        fill="none"
        stroke={fluent.accentSoft}
        strokeWidth={3}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - drawProgress)}
        style={{
          filter: `drop-shadow(0 0 16px ${fluent.accent}cc)`,
        }}
      />
    </svg>
  );
};

const CalloutCard: React.FC<{
  highlight: Highlight;
  index: number;
  cardX: number;
  cardY: number;
  cardScale: number;
  cardW: number;
  videoW: number;
  videoH: number;
}> = ({ highlight, index, cardX, cardY, cardScale, cardW, videoW, videoH }) => {
  const frame = useCurrentFrame();
  const local = frame - highlight.appearAt;
  const exitLocal = frame - highlight.hideAt;

  const inOpacity = interpolate(local, [4, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const outOpacity = interpolate(exitLocal, [0, 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const opacity = Math.min(inOpacity, outOpacity);

  const ty = interpolate(local, [4, 32], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const tx = interpolate(local, [4, 32], [-18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  const calloutW = 460;

  // Place callout to the right of the card, vertically aligned with highlight box center
  const boxCenterY =
    cardY + (highlight.y + highlight.h / 2) * cardScale;
  const calloutX = cardX + cardW + 60;
  // Vertically center callout on highlight, but clamp to screen
  let calloutY = boxCenterY - 90;
  calloutY = Math.max(180, Math.min(calloutY, videoH - 240));

  // Connector line: from highlight box right edge (in video coords) to callout left edge
  const connectStartX = cardX + (highlight.x + highlight.w) * cardScale;
  const connectStartY = boxCenterY;
  const connectEndX = calloutX;
  const connectEndY = calloutY + 90;

  const connectProgress = interpolate(local, [10, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Connector */}
      <svg
        width={videoW}
        height={videoH}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id={`connector-${index}`}
            x1={connectStartX}
            y1={connectStartY}
            x2={connectEndX}
            y2={connectEndY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={fluent.accentSoft} stopOpacity={0.9} />
            <stop offset="100%" stopColor={fluent.accentSoft} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <line
          x1={connectStartX}
          y1={connectStartY}
          x2={
            connectStartX + (connectEndX - connectStartX) * connectProgress
          }
          y2={
            connectStartY + (connectEndY - connectStartY) * connectProgress
          }
          stroke={`url(#connector-${index})`}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle
          cx={connectStartX}
          cy={connectStartY}
          r={5}
          fill={fluent.accentSoft}
          opacity={connectProgress}
        />
      </svg>

      {/* Callout card */}
      <div
        style={{
          position: "absolute",
          left: calloutX,
          top: calloutY,
          width: calloutW,
          padding: "26px 30px",
          borderRadius: 18,
          background:
            "linear-gradient(160deg, rgba(40, 28, 70, 0.92), rgba(20, 18, 28, 0.96))",
          border: `1px solid ${fluent.accentSoft}55`,
          backdropFilter: "blur(14px)",
          boxShadow: `0 22px 48px rgba(0,0,0,0.55), 0 0 0 1px ${fluent.accent}22`,
          transform: `translate(${tx}px, ${ty}px)`,
          color: fluent.text,
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
