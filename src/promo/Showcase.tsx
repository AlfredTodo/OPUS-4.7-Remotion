import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fluent, fluentEnter, fluentExit } from "./easings";
import mainSvg from "./_svg/main";
import serverOverviewSvg from "./_svg/serverOverview";

const SVG_REGISTRY: Record<string, string> = {
  "assets/main.svg": mainSvg,
  "assets/server-overview.svg": serverOverviewSvg,
};

// Source SVG intrinsic size (both panels are 1914x855).
const SVG_W = 1914;
const SVG_H = 855;

// Layout: panel takes a wide block, captions live in the right rail.
const PANEL_TOP = 170;
const PANEL_LEFT = 56;
const PANEL_RIGHT_RESERVED = 540; // space reserved on the right for captions

// Camera animation tuning
const ZOOM_LEVEL = 1.55;
const PAN_EASE_FRAMES = 26;

export type Highlight = {
  // Coordinates in SVG viewBox space (1914 x 855).
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  caption: string;
  // 0..1 anchor on the panel — used to position the focus center inside the
  // viewport when zoomed; defaults to center of bbox.
};

type Stage =
  | { kind: "settle" }
  | { kind: "focus"; index: number; t: number }
  | { kind: "transition"; from: number; to: number; t: number }
  | { kind: "release" };

const lookupSvg = (src: string): string => {
  const found = SVG_REGISTRY[src];
  if (!found) {
    throw new Error(
      `No embedded SVG found for src="${src}". Add it to SVG_REGISTRY in Showcase.tsx and re-run scripts/embed-svgs.mjs.`,
    );
  }
  return found;
};

export const Showcase: React.FC<{
  src: string;
  title: string;
  subtitle: string;
  highlights: Highlight[];
  durationInFrames: number;
}> = ({ src, title, subtitle, highlights, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const svgContent = lookupSvg(src);

  // Panel layout (in screen pixels).
  const panelW = width - PANEL_LEFT - PANEL_RIGHT_RESERVED;
  const panelScale = panelW / SVG_W; // base scale to fit panel into card area
  const panelH = SVG_H * panelScale;
  const panelX = PANEL_LEFT;
  const panelY = PANEL_TOP;

  // Scene timing (frames are relative to this Sequence).
  // Build a timeline: settle (intro) -> focus 0 -> focus 1 -> focus 2 -> release.
  const total = highlights.length;
  const ENTER = 36;
  const SETTLE = 24;
  const FOCUS_HOLD = Math.floor(
    (durationInFrames - ENTER - SETTLE - 36 /* release */) / total - PAN_EASE_FRAMES
  );

  const stage = computeStage(frame, total, {
    enter: ENTER,
    settle: SETTLE,
    focusHold: FOCUS_HOLD,
    panEase: PAN_EASE_FRAMES,
    durationInFrames,
  });

  // Camera (scale + pan in panel pixel space).
  const camera = computeCamera(stage, highlights, {
    panelW,
    panelH,
    zoom: ZOOM_LEVEL,
  });

  // Entry / exit envelope on the whole scene.
  const enterOpacity = interpolate(frame, [0, ENTER], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: fluentExit,
    }
  );
  const enterBlur = interpolate(frame, [0, ENTER], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const enterY = interpolate(frame, [0, ENTER], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });

  return (
    <AbsoluteFill
      style={{
        opacity: enterOpacity * exitOpacity,
        fontFamily: fluent.fontFamily,
        color: fluent.text,
      }}
    >
      {/* Title block */}
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: 56,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <TitleReveal text={title} delay={6} />
        <SubtitleReveal text={subtitle} delay={18} />
      </div>

      {/* Panel viewport */}
      <div
        style={{
          position: "absolute",
          left: panelX,
          top: panelY + enterY,
          width: panelW,
          height: panelH,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: `0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px ${fluent.accent}33, 0 0 80px ${fluent.accent}22`,
          background: "#14171B",
          filter: `blur(${enterBlur}px)`,
        }}
      >
        {/* Camera transform — moves and scales the SVG behind the viewport */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: panelW,
            height: panelH,
            transform: `translate(${camera.tx}px, ${camera.ty}px) scale(${camera.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <div
            style={{ width: panelW, height: panelH }}
            dangerouslySetInnerHTML={{
              __html: prepareSvg(svgContent, panelW, panelH),
            }}
          />

          {/* Highlight overlays — rendered in panel coordinates so they
              transform with the camera. */}
          {highlights.map((h, i) => (
            <HighlightFrame
              key={`hl-${i}`}
              highlight={h}
              index={i}
              stage={stage}
              panelScale={panelScale}
            />
          ))}
        </div>

        {/* Vignette around the viewport for cinematic depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            boxShadow: "inset 0 0 140px rgba(0,0,0,0.55)",
            borderRadius: 24,
          }}
        />
      </div>

      {/* Caption rail (right column) */}
      <div
        style={{
          position: "absolute",
          left: panelX + panelW + 50,
          top: panelY,
          width: PANEL_RIGHT_RESERVED - 80,
          height: panelH,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        {highlights.map((h, i) => (
          <CaptionCard
            key={`cap-${i}`}
            highlight={h}
            index={i}
            total={total}
            stage={stage}
          />
        ))}

        {/* Stage indicator (dots) */}
        <StageIndicator stage={stage} total={total} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Stage / camera computation ----------------

const computeStage = (
  frame: number,
  total: number,
  cfg: {
    enter: number;
    settle: number;
    focusHold: number;
    panEase: number;
    durationInFrames: number;
  }
): Stage => {
  const { enter, settle, focusHold, panEase, durationInFrames } = cfg;
  const focusStart = enter + settle;
  const focusBlock = panEase + focusHold; // pan into + hold

  if (frame < focusStart) return { kind: "settle" };

  const focusEnd = focusStart + total * focusBlock;
  if (frame >= focusEnd) {
    // Release back to overview before the scene fades.
    if (frame >= durationInFrames - 24) return { kind: "release" };
    return { kind: "release" };
  }

  // Determine which focus index we're in / transitioning into.
  const local = frame - focusStart;
  const idx = Math.floor(local / focusBlock);
  const within = local - idx * focusBlock;
  if (within < panEase) {
    if (idx === 0) {
      // Pan from settle (centered overview) to first focus.
      return { kind: "transition", from: -1, to: 0, t: within / panEase };
    }
    return {
      kind: "transition",
      from: idx - 1,
      to: idx,
      t: within / panEase,
    };
  }
  return { kind: "focus", index: idx, t: (within - panEase) / focusHold };
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const computeCamera = (
  stage: Stage,
  highlights: Highlight[],
  cfg: { panelW: number; panelH: number; zoom: number }
) => {
  const { panelW, panelH, zoom } = cfg;
  const overview = { tx: 0, ty: 0, scale: 1 };

  const focusFor = (idx: number) => {
    const h = highlights[idx];
    if (!h) return overview;
    const scaleX = panelW / SVG_W;
    const cx = (h.x + h.w / 2) * scaleX;
    const cy = (h.y + h.h / 2) * scaleX;
    // We want the highlight center to land at viewport center, but clamp so
    // the panel always fills the viewport (no empty letterboxing).
    const minTx = panelW - panelW * zoom;
    const minTy = panelH - panelH * zoom;
    const tx = clamp(panelW / 2 - cx * zoom, minTx, 0);
    const ty = clamp(panelH / 2 - cy * zoom, minTy, 0);
    return { tx, ty, scale: zoom };
  };

  if (stage.kind === "settle") return overview;
  if (stage.kind === "release") return overview;
  if (stage.kind === "focus") return focusFor(stage.index);

  // transition: ease between two focus targets (or from overview to first).
  const from = stage.from === -1 ? overview : focusFor(stage.from);
  const to = focusFor(stage.to);
  const t = fluentEnter(stage.t);
  return {
    tx: from.tx + (to.tx - from.tx) * t,
    ty: from.ty + (to.ty - from.ty) * t,
    scale: from.scale + (to.scale - from.scale) * t,
  };
};

// ---------------- Highlight frame ----------------

const HighlightFrame: React.FC<{
  highlight: Highlight;
  index: number;
  stage: Stage;
  panelScale: number;
}> = ({ highlight, index, stage, panelScale }) => {
  const visibility = highlightVisibility(stage, index);
  if (visibility <= 0.001) return null;

  const x = highlight.x * panelScale;
  const y = highlight.y * panelScale;
  const w = highlight.w * panelScale;
  const h = highlight.h * panelScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x - 8,
        top: y - 8,
        width: w + 16,
        height: h + 16,
        borderRadius: 14,
        border: `2px solid ${fluent.accent}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 0 28px ${fluent.accent}aa, inset 0 0 0 1px rgba(255,255,255,0.06)`,
        opacity: visibility,
        pointerEvents: "none",
      }}
    />
  );
};

const highlightVisibility = (stage: Stage, index: number): number => {
  if (stage.kind === "focus" && stage.index === index) return 1;
  if (stage.kind === "transition") {
    if (stage.to === index) return stage.t;
    if (stage.from === index) return 1 - stage.t;
  }
  return 0;
};

// ---------------- Caption card ----------------

const CaptionCard: React.FC<{
  highlight: Highlight;
  index: number;
  total: number;
  stage: Stage;
}> = ({ highlight, index, stage }) => {
  const v = captionVisibility(stage, index);
  if (v <= 0.001) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "50%",
        transform: `translateY(calc(-50% + ${(1 - v) * 24}px))`,
        opacity: v,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "30px 34px",
          borderRadius: 22,
          background:
            "linear-gradient(160deg, rgba(40, 28, 78, 0.92), rgba(20, 18, 28, 0.96))",
          border: `1px solid ${fluent.accentSoft}55`,
          boxShadow: `0 32px 70px rgba(0,0,0,0.55), 0 0 0 1px ${fluent.accent}22, 0 0 40px ${fluent.accent}33`,
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
            marginBottom: 14,
          }}
        >
          {`0${index + 1}`}
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 14,
            letterSpacing: -0.6,
          }}
        >
          {highlight.label}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: fluent.textMuted,
            lineHeight: 1.5,
          }}
        >
          {highlight.caption}
        </div>
      </div>
    </div>
  );
};

const captionVisibility = (stage: Stage, index: number): number => {
  if (stage.kind === "focus" && stage.index === index) {
    // gentle fade-in/out within focus hold
    return 1;
  }
  if (stage.kind === "transition") {
    if (stage.to === index) return Math.min(1, stage.t * 1.1);
    if (stage.from === index) return Math.max(0, 1 - stage.t * 1.1);
  }
  return 0;
};

// ---------------- Stage indicator ----------------

const StageIndicator: React.FC<{ stage: Stage; total: number }> = ({
  stage,
  total,
}) => {
  const activeIndex = (() => {
    if (stage.kind === "focus") return stage.index;
    if (stage.kind === "transition") return stage.t > 0.5 ? stage.to : stage.from;
    return -1;
  })();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        gap: 12,
        justifyContent: "flex-start",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === activeIndex ? 36 : 14,
            height: 6,
            borderRadius: 999,
            background:
              i === activeIndex ? fluent.accent : "rgba(255,255,255,0.18)",
            transition: "all 0.2s",
          }}
        />
      ))}
    </div>
  );
};

// ---------------- Title / subtitle reveals ----------------

const TitleReveal: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const ty = interpolate(local, [0, 30], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fluentEnter,
  });
  const blur = interpolate(local, [0, 26], [10, 0], {
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
        letterSpacing: -1.4,
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

// ---------------- SVG preparation ----------------

// Replace the root <svg> width/height/preserveAspectRatio so it scales nicely
// inside the camera viewport.
const prepareSvg = (svg: string, w: number, h: number) => {
  return svg
    .replace(
      /<svg([^>]*?)\swidth="[^"]*"/,
      `<svg$1 width="${w}"`
    )
    .replace(/<svg([^>]*?)\sheight="[^"]*"/, `<svg$1 height="${h}"`)
    .replace(
      /<svg([^>]*?)>/,
      `<svg$1 preserveAspectRatio="xMidYMid meet" style="display:block">`
    );
};
