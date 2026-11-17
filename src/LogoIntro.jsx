
import { useEffect, useMemo, useState } from "react";

const D = "M52 22 H175 A51 51 0 0 1 175 124 H135 L205 194";
const N = 40;
const SLOT = 3.8;
const DROP = 2.2;
const START = 1.2;
const STAGGER = 0.085;

const TOTAL_MS = (START + N * STAGGER + 1.3) * 1000;

export default function LogoIntro({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  const drops = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const pos = 100 - 0.6 - DROP - i * SLOT;

        return {
          pos,
          begin: `${(START + i * STAGGER).toFixed(3)}s`,
          dur: `${(0.35 + 0.9 * Math.sqrt(pos / 100)).toFixed(3)}s`,
        };
      }),
    []
  );

  useEffect(() => {
    const t1 = setTimeout(
      () => setLeaving(true),
      TOTAL_MS + 600
    );

    const t2 = setTimeout(
      () => onDone?.(),
      TOTAL_MS + 1400
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 30% 20%, #1b1b20 0%, #0a0a0c 55%, #000 100%)",
        opacity: leaving ? 0 : 1,
        transition: "opacity .8s ease",
      }}
    >
      <svg
        viewBox="-20 -5 260 240"
        style={{
          width: "min(70vmin, 520px)",
          height: "auto",
          overflow: "visible",
        }}
      >
        <defs>
          <filter
            id="glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="2.2"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="softwhite"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur
              stdDeviation="2"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* White diagonal strokes: original drawing animation */}
        <g
          fill="none"
          stroke="#ffffff"
          strokeWidth="9"
          strokeLinecap="butt"
          filter="url(#softwhite)"
        >
          <path
            d="M5 58 L140 193"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="100"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur=".8s"
              begin=".2s"
              fill="freeze"
            />
          </path>

          <path
            d="M62 82 L192 212"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="100"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur=".8s"
              begin=".5s"
              fill="freeze"
            />
          </path>
        </g>

        {/* Red waterfall droplets only — no visible tube */}
        <g filter="url(#glow)">
          {drops.map((d, i) => (
            <path
              key={i}
              d={D}
              pathLength="100"
              fill="none"
              stroke="#FF2A3A"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${DROP} 200`}
              strokeDashoffset={DROP}
            >
              <animate
                attributeName="stroke-dashoffset"
                from={DROP}
                to={-d.pos}
                dur={d.dur}
                begin={d.begin}
                calcMode="spline"
                keyTimes="0;1"
                keySplines=".55 0 1 .45"
                fill="freeze"
              />

              <animate
                attributeName="stroke"
                values="#fafafc;#ffd6d9;#ff2a3a"
                keyTimes="0;.8;1"
                dur={d.dur}
                begin={d.begin}
                fill="freeze"
              />
            </path>
          ))}
        </g>
      </svg>
    </div>
  );
}
