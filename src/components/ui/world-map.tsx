"use client";

import { useRef, useMemo, memo } from "react";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";

// Pre-generate maps for both themes
const lightMap = new DottedMap({ height: 100, grid: "diagonal" }).getSVG({
  radius: 0.22,
  color: "#00000040",
  shape: "circle",
  backgroundColor: "white",
});

const darkMap = new DottedMap({ height: 100, grid: "diagonal" }).getSVG({
  radius: 0.22,
  color: "#FFFFFF40",
  shape: "circle",
  backgroundColor: "black",
});

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

// Memoized helper functions
const projectPoint = (lat: number, lng: number) => {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
};

const createCurvedPath = (
  start: { x: number; y: number },
  end: { x: number; y: number }
) => {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
};

// Optimize Point component with CSS animation
const Point = memo(({ x, y, lineColor }: { x: number; y: number; lineColor: string }) => (
  <g key={`points-group-${x}-${y}`}>
    <g key={`start-${x}-${y}`}>
      <circle
        cx={x}
        cy={y}
        r="2"
        fill={lineColor}
      />
      <circle
        cx={x}
        cy={y}
        r="2"
        fill={lineColor}
        opacity="0.5"
      >
        <animate
          attributeName="r"
          from="2"
          to="8"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.5"
          to="0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
    <g key={`end-${x}-${y}`}>
      <circle
        cx={x}
        cy={y}
        r="2"
        fill={lineColor}
      />
      <circle
        cx={x}
        cy={y}
        r="2"
        fill={lineColor}
        opacity="0.5"
      >
        <animate
          attributeName="r"
          from="2"
          to="8"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.5"
          to="0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </g>
));
Point.displayName = 'Point';


function WorldMap({ dots = [], lineColor = "#0ea5e9" }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();

  // Use pre-generated maps
  const svgMap = useMemo(() =>
    theme === "dark" ? darkMap : lightMap
    , [theme]);

  // Memoize paths and points calculations with stable reference
  const pathsAndPoints = useMemo(() =>
    dots.map((dot) => ({
      start: projectPoint(dot.start.lat, dot.start.lng),
      end: projectPoint(dot.end.lat, dot.end.lng),
      path: createCurvedPath(
        projectPoint(dot.start.lat, dot.start.lng),
        projectPoint(dot.end.lat, dot.end.lng)
      )
    })), [dots]
  );

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
        loading="eager"
        priority
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0"
      >
        <defs>
          <linearGradient id="path-gradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="5%" stopColor={lineColor} />
            <stop offset="95%" stopColor={lineColor} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {pathsAndPoints.map((item, i) => (
          <g key={`path-${i}`}>
            <Point x={item.start.x} y={item.start.y} lineColor={lineColor} />
            <Point x={item.end.x} y={item.end.y} lineColor={lineColor} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default memo(WorldMap);
