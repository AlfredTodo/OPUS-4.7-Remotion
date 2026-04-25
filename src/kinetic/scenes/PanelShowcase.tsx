import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme, easing } from "../theme";
import { driveIn, driveOut, lerp, clamp } from "../util";
import { KineticText } from "../components/KineticText";
import { SweepBar } from "../components/AccentBar";
import { SvgPanel, SVG_VIEWBOX } from "../components/SvgPanel";
import { FocusSpot } from "../components/FocusSpot";

export type Focus = {
  // SVG-space coords (1914x855)
  x: number;
  y: number;
  w: number;
  h: number;
  word: string; // Big bold per-shot phrase (multi-line)
  caption: string; // Subtext explaining
  index: string; // e.g. "01"
};

const FOCUS_DUR = 64; // frames per focus shot
const INTRO_DUR = 30;
const OUTRO_DUR = 24;

export const panelShowcaseDuration = (focusCount: number) =>
  INTRO_DUR + FOCUS_DUR * focusCount + OUTRO_DUR;

export const PanelShowcase: React.FC<{
  which: "main" | "serverOverview";
  sectionLabel: string;
  focuses: Focus[];
  introDir?: "ltr" | "rtl";
}> = ({ which, sectionLabel, focuses, introDir = "ltr" }) => {
  const frame = useCurrentFrame();

  // ---- Panel geometry ----
  const PANEL_W = 1080;
  const PANEL_H = PANEL_W / (SVG_VIEWBOX.w / SVG_VIEWBOX.h); // ~482
  const PANEL_LEFT = 1920 - PANEL_W - 80; // = 760
  const PANEL_TOP = 110;
  const SCALE = PANEL_W / SVG_VIEWBOX.w;

  // ---- Segments ----
  const segs: Array<{ start: number; dur: number; kind: string; idx?: number }> = [
    { start: 0, dur: INTRO_DUR, kind: "intro" },
    ...focuses.map((_, i) => ({
      start: INTRO_DUR + i * FOCUS_DUR,
      dur: FOCUS_DUR,
      kind: "focus",
      idx: i,
    })),
    {
      start: INTRO_DUR + focuses.length * FOCUS_DUR,
      dur: OUTRO_DUR,
      kind: "outro",
    },
  ];
  const seg =
    segs.find((s) => frame >= s.start && frame < s.start + s.dur) ||
    segs[segs.length - 1];

  // ---- Camera ----
  const focusCamera = (idx: number) => {
    const f = focuses[idx];
    const zoom = 1.55;
    const cx = (f.x + f.w / 2) * SCALE;
    const cy = (f.y + f.h / 2) * SCALE;
    const tx = clamp(PANEL_W / 2 - cx * zoom, PANEL_W - PANEL_W * zoom, 0);
    const ty = clamp(PANEL_H / 2 - cy * zoom, PANEL_H - PANEL_H * zoom, 0);
    return { tx, ty, zoom };
  };
  const overviewCamera = () => ({ tx: 0, ty: 0, zoom: 1.06 });

  let cam = overviewCamera();

  if (seg.kind === "intro") {
    cam = overviewCamera();
  } else if (seg.kind === "outro") {
    cam = overviewCamera();
  } else if (seg.kind === "focus" && seg.idx !== undefined) {
    const localF = frame - seg.start;
    const transitionDur = 18;
    const prevCam = seg.idx === 0 ? overviewCamera() : focusCamera(seg.idx - 1);
    const target = focusCamera(seg.idx);
    const t = clamp(localF / transitionDur, 0, 1);
    const eased = easing.smooth(t);
    cam = {
      tx: lerp(prevCam.tx, target.tx, eased),
      ty: lerp(prevCam.ty, target.ty, eased),
      zoom: lerp(prevCam.zoom, target.zoom, eased),
    };
  }

  // Subtle Ken-Burns drift
  const driftX = Math.sin(frame / 50) * 6;
  const driftY = Math.cos(frame / 60) * 4;
  cam.tx += driftX;
  cam.ty += driftY;

  // ---- Panel intro/outro ----
  const panelIntro = driveIn(frame, 0, INTRO_DUR, easing.snap);
  const panelOutroLocal = frame - (INTRO_DUR + focuses.length * FOCUS_DUR);
  const panelOutro = driveOut(panelOutroLocal, 0, OUTRO_DUR, easing.snap);
  const panelV = Math.min(panelIntro, panelOutro);
  const panelShift = (1 - panelIntro) * 220 - (1 - panelOutro) * 220;

  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      {/* Subtle ambient gradient for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 50% at 70% 35%, rgba(109,40,217,0.16) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top-left: section label */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          zIndex: 1,
        }}
      >
        <KineticText
          startFrame={4}
          enterDur={12}
          holdDur={INTRO_DUR + focuses.length * FOCUS_DUR + 4}
          exitDur={10}
          reveal="wipe-up"
          size={22}
          weight={600}
          letterSpacing={6}
          color={theme.accentSoft}
        >
          {sectionLabel}
        </KineticText>
      </div>

      {/* Top-right: tour brand */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          zIndex: 5,
        }}
      >
        <KineticText
          startFrame={4}
          enterDur={10}
          holdDur={INTRO_DUR + focuses.length * FOCUS_DUR}
          exitDur={10}
          reveal="wipe-down"
          size={20}
          weight={600}
          letterSpacing={4}
          color={theme.textMuted}
          align="right"
        >
          NODEPLAY • PANEL TOUR
        </KineticText>
      </div>

      {/* Panel container */}
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: PANEL_TOP,
          width: PANEL_W,
          height: PANEL_H,
          opacity: panelV,
          transform: `translateX(${panelShift}px) translateY(${(1 - panelV) * 30}px)`,
          zIndex: 2,
        }}
      >
        {/* Drop shadow plate */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 22,
            boxShadow:
              "0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        />
        {/* Camera viewport */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 18,
            overflow: "hidden",
            background: "#0F0F12",
          }}
        >
          {/* SVG layer with camera transform */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PANEL_W,
              height: PANEL_H,
              transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.zoom})`,
              transformOrigin: "0 0",
            }}
          >
            <SvgPanel
              which={which}
              width={PANEL_W}
              shadow={false}
              borderRadius={0}
            />
          </div>

          {/* Focus rectangles in same camera space */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PANEL_W,
              height: PANEL_H,
              transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.zoom})`,
              transformOrigin: "0 0",
              pointerEvents: "none",
            }}
          >
            {focuses.map((f, i) => (
              <FocusSpot
                key={i}
                x={f.x}
                y={f.y}
                w={f.w}
                h={f.h}
                scale={SCALE}
                startFrame={INTRO_DUR + i * FOCUS_DUR + 16}
                enterDur={14}
                holdDur={FOCUS_DUR - 22}
                exitDur={10}
              />
            ))}
          </div>

          {/* Vignette gradient on edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 80px rgba(0,0,0,0.45)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Outer glow */}
        <div
          style={{
            position: "absolute",
            inset: -28,
            borderRadius: 28,
            boxShadow: `0 0 80px ${theme.accent}26`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Bottom-left: per-focus content area */}
      {focuses.map((f, i) => {
        const start = INTRO_DUR + i * FOCUS_DUR;
        return (
          <React.Fragment key={i}>
            {/* Index */}
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 640,
                zIndex: 4,
              }}
            >
              <KineticText
                startFrame={start + 6}
                enterDur={12}
                holdDur={FOCUS_DUR - 30}
                exitDur={10}
                reveal="wipe-up"
                size={28}
                weight={700}
                letterSpacing={6}
                color={theme.accentSoft}
              >
                {`${f.index} / ${String(focuses.length).padStart(2, "0")}`}
              </KineticText>
            </div>
            {/* Big word — fills bottom-left region */}
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 690,
                width: 1100,
                zIndex: 4,
              }}
            >
              <KineticText
                startFrame={start + 8}
                enterDur={14}
                holdDur={FOCUS_DUR - 32}
                exitDur={10}
                reveal="wipe-up"
                size={86}
                weight={800}
                letterSpacing={-2}
                lineHeight={1.0}
                color={theme.text}
                uppercase={false}
              >
                {f.word}
              </KineticText>
            </div>
            {/* Caption */}
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 920,
                width: 1100,
                zIndex: 4,
              }}
            >
              <KineticText
                startFrame={start + 16}
                enterDur={12}
                holdDur={FOCUS_DUR - 38}
                exitDur={10}
                reveal="wipe-up"
                size={22}
                weight={500}
                letterSpacing={0.5}
                lineHeight={1.45}
                color={theme.textMuted}
                uppercase={false}
              >
                {f.caption}
              </KineticText>
            </div>
          </React.Fragment>
        );
      })}

      {/* Sweep bars between shots */}
      {focuses.slice(1).map((_, i) => {
        const start = INTRO_DUR + (i + 1) * FOCUS_DUR - 10;
        return (
          <SweepBar
            key={i}
            startFrame={start}
            duration={20}
            width={160}
            color={i % 2 === 0 ? theme.accent : theme.accentBright}
            direction={i % 2 === 0 ? "ltr" : "rtl"}
            z={45}
          />
        );
      })}

      {/* Intro full-screen wipe */}
      {frame < 16 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: theme.accent,
            transform: `translateX(${
              introDir === "ltr"
                ? driveIn(frame, 0, 16, easing.snap) * 100
                : -driveIn(frame, 0, 16, easing.snap) * 100
            }%)`,
            zIndex: 100,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
