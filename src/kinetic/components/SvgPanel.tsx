import React from "react";

import mainSvg from "../_svg/main";
import serverOverviewSvg from "../_svg/serverOverview";

const REGISTRY: Record<string, string> = {
  main: mainSvg,
  serverOverview: serverOverviewSvg,
};

export const SVG_VIEWBOX = { w: 1914, h: 855 };

// Renders an embedded SVG into a positioned div with a transform pivot.
// The container is the natural SVG aspect ratio, scaled to fit `width`.
export const SvgPanel: React.FC<{
  which: keyof typeof REGISTRY;
  width: number;
  transform?: string;
  transformOrigin?: string;
  filter?: string;
  borderRadius?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({
  which,
  width,
  transform,
  transformOrigin = "center center",
  filter,
  borderRadius = 18,
  shadow = true,
  style,
}) => {
  const aspect = SVG_VIEWBOX.w / SVG_VIEWBOX.h;
  const height = width / aspect;
  const svg = REGISTRY[which];

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        overflow: "hidden",
        boxShadow: shadow
          ? "0 60px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
          : undefined,
        background: "#0F0F12",
        transform,
        transformOrigin,
        filter,
        ...style,
      }}
      // The SVG is huge (~1.5MB). dangerouslySetInnerHTML avoids React parsing/diffing.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export const REGISTRY_KEYS = Object.keys(REGISTRY) as (keyof typeof REGISTRY)[];
