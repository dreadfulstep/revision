"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type Pair = { left: string; right: string };
type Props = {
  pairs: Pair[];
  onChange: (v: string) => void;
  disabled?: boolean;
  matchingResults?: Record<string, boolean> | null;
  correctAnswer?: Record<string, string>;
};

const COLORS = [
  "oklch(0.72 0.18 250)",
  "oklch(0.72 0.18 145)",
  "oklch(0.72 0.18 30)",
  "oklch(0.72 0.18 320)",
  "oklch(0.72 0.18 75)",
  "oklch(0.72 0.18 190)",
];

type Connection = { left: string; right: string; color: string };
type PathData = { d: string; color: string; key: string };
type Point = { x: number; y: number };

export default function Matching({
  pairs,
  onChange,
  disabled,
  matchingResults,
  correctAnswer,
}: Props) {
  const [rights, setRights] = useState<string[]>(() =>
    pairs.map((p) => p.right),
  );
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<PathData[]>([]);
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [dragPoint, setDragPoint] = useState<Point | null>(null);
  const [hoveredRight, setHoveredRight] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const getRightEdge = useCallback((el: HTMLElement): Point => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: er.right - cr.left,
      y: er.top - cr.top + er.height / 2,
    };
  }, []);

  const getLeftEdge = useCallback((el: HTMLElement): Point => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: er.left - cr.left,
      y: er.top - cr.top + er.height / 2,
    };
  }, []);

  const makePath = useCallback((from: Point, to: Point) => {
    const cp = Math.abs(to.x - from.x) * 0.5;
    return `M ${from.x} ${from.y} C ${from.x + cp} ${from.y}, ${to.x - cp} ${to.y}, ${to.x} ${to.y}`;
  }, []);

  useEffect(() => {
    const next = connections
      .map((conn) => {
        const leftEl = leftRefs.current[conn.left];
        const rightEl = rightRefs.current[conn.right];
        if (!leftEl || !rightEl) return null;
        const from = getRightEdge(leftEl);
        const to = getLeftEdge(rightEl);
        return { d: makePath(from, to), color: conn.color, key: conn.left };
      })
      .filter((p): p is PathData => p !== null);
    setPaths(next);
  }, [connections, svgSize, getRightEdge, getLeftEdge, makePath]);

  useEffect(() => {
    setRights([...pairs.map((p) => p.right)].sort(() => Math.random() - 0.5));
  }, [pairs]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setSvgSize({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!dragFrom) return;

    function onMove(e: MouseEvent | TouchEvent) {
      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
      setDragPoint({ x: clientX - cr.left, y: clientY - cr.top });

      let found: string | null = null;
      for (const [key, el] of Object.entries(rightRefs.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom
        ) {
          found = key;
          break;
        }
      }
      setHoveredRight(found);
    }

    function onUp() {
      if (hoveredRight && dragFrom) {
        commitConnection(dragFrom, hoveredRight);
      }
      setDragFrom(null);
      setDragPoint(null);
      setHoveredRight(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragFrom, hoveredRight]);

  function getConnectionColor(left: string) {
    const idx = pairs.findIndex((p) => p.left === left);
    return COLORS[idx % COLORS.length]!;
  }

  function commitConnection(leftKey: string, rightKey: string) {
    if (disabled) return;
    const filtered = connections.filter(
      (c) => c.left !== leftKey && c.right !== rightKey,
    );
    const newConn: Connection = {
      left: leftKey,
      right: rightKey,
      color: getConnectionColor(leftKey),
    };
    const next = [...filtered, newConn];
    setConnections(next);
    setSelected(null);
    const matched: Record<string, string> = {};
    next.forEach((c) => {
      matched[c.left] = c.right;
    });
    onChange(JSON.stringify(matched));
  }

  function handleLeftClick(left: string) {
    if (disabled || dragFrom) return;
    if (selected === left) {
      setSelected(null);
    } else {
      setSelected(left);
    }
  }

  function handleRightClick(right: string) {
    if (disabled || dragFrom) return;
    if (selected) {
      commitConnection(selected, right);
    }
  }

  function handleLeftMouseDown(
    left: string,
    e: React.MouseEvent | React.TouchEvent,
  ) {
    if (disabled) return;
    e.preventDefault();
    setConnections((prev) => prev.filter((c) => c.left !== left));
    setDragFrom(left);
    setSelected(null);
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    setDragPoint({ x: clientX - cr.left, y: clientY - cr.top });
  }

  function removeConnection(left: string) {
    if (disabled) return;
    const next = connections.filter((c) => c.left !== left);
    setConnections(next);
    const matched: Record<string, string> = {};
    next.forEach((c) => {
      matched[c.left] = c.right;
    });
    onChange(JSON.stringify(matched));
  }

  const matched = Object.fromEntries(connections.map((c) => [c.left, c.right]));
  const usedRights = new Set(connections.map((c) => c.right));

  const dragPath = (() => {
    if (!dragFrom || !dragPoint) return null;
    const leftEl = leftRefs.current[dragFrom];
    if (!leftEl) return null;
    const from = getRightEdge(leftEl);
    return makePath(from, dragPoint);
  })();

  const dragColor = dragFrom ? getConnectionColor(dragFrom) : null;

  return (
    <div ref={containerRef} className="relative select-none">
      <svg
        className="absolute inset-0 pointer-events-none z-10"
        width={svgSize.w}
        height={svgSize.h}
        style={{ overflow: "visible" }}
      >
        {paths.map((p) => (
          <g key={p.key}>
            <path
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth="8"
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
            <path
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ))}

        {dragPath && dragColor && (
          <g>
            <path
              d={dragPath}
              fill="none"
              stroke={dragColor}
              strokeWidth="8"
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
            <path
              d={dragPath}
              fill="none"
              stroke={dragColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6 3"
            />
          </g>
        )}
      </svg>

      <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 items-start w-full relative">
        <div className="flex flex-col space-y-4">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] mb-1 px-1">
            Terms
          </p>
          {pairs.map((p) => {
            const isSelected = selected === p.left;
            const isMatched = !!matched[p.left];
            const isDraggingThis = dragFrom === p.left;
            const color = getConnectionColor(p.left);

            const isMatchCorrect =
              matchingResults != null && matchingResults[p.left] === true;
            const isMatchWrong =
              matchingResults != null && matchingResults[p.left] === false;
            const showCorrectVal = isMatchWrong && correctAnswer?.[p.left];

            return (
              <button
                key={p.left}
                ref={(el) => {
                  leftRefs.current[p.left] = el;
                }}
                onClick={() => handleLeftClick(p.left)}
                onMouseDown={(e) => handleLeftMouseDown(p.left, e)}
                onTouchStart={(e) => handleLeftMouseDown(p.left, e)}
                onDoubleClick={() => removeConnection(p.left)}
                disabled={disabled}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border-2 text-left text-xs font-semibold transition-all duration-200",
                  "wrap-break-word cursor-grab active:cursor-grabbing touch-none",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isDraggingThis && "scale-[1.04] shadow-xl z-20",
                  isSelected &&
                    !isMatched &&
                    "border-foreground bg-foreground/5 ring-4 ring-foreground/5",
                  !isSelected &&
                    !isMatched &&
                    !isDraggingThis &&
                    "border-border bg-card hover:border-muted-foreground/30 shadow-sm",
                  isMatchCorrect && "border-score-high bg-score-high/10",
                  isMatchWrong && "border-score-low bg-score-low/10",
                )}
                style={
                  isMatched || isDraggingThis
                    ? {
                        borderColor: color,
                        backgroundColor: `${color}12`,
                        color: color,
                      }
                    : undefined
                }
              >
                {p.left}
                {showCorrectVal && (
                  <span className="block text-[10px] text-score-high mt-0.5 font-normal">
                    → {correctAnswer![p.left]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col space-y-4">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] mb-1 px-1 text-right sm:text-left">
            Match
          </p>
          {rights.map((r) => {
            const isUsed = usedRights.has(r);
            const connectedLeft = connections.find((c) => c.right === r)?.left;
            const color = connectedLeft
              ? getConnectionColor(connectedLeft)
              : undefined;
            const isHovered = hoveredRight === r;
            const isClickTarget = !!selected && !isUsed;
            const isDragTarget = !!dragFrom && !isUsed;

            return (
              <button
                key={r}
                ref={(el) => {
                  rightRefs.current[r] = el;
                }}
                onClick={() => handleRightClick(r)}
                disabled={disabled}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border-2 text-left text-xs font-semibold transition-all duration-200",
                  "wrap-break-word disabled:cursor-not-allowed",
                  (isClickTarget || isDragTarget) &&
                    !isUsed &&
                    "border-primary/40 bg-primary/5 hover:border-primary",
                  isHovered &&
                    "scale-[1.04] shadow-lg ring-4 ring-primary/10 border-primary",
                  !isClickTarget &&
                    !isDragTarget &&
                    !isUsed &&
                    "border-border bg-card opacity-60 hover:opacity-100 shadow-sm",
                  isUsed && "border-transparent",
                )}
                style={
                  isHovered && dragFrom
                    ? {
                        borderColor: getConnectionColor(dragFrom),
                        backgroundColor: `${getConnectionColor(dragFrom)}12`,
                      }
                    : isUsed && color
                      ? {
                          borderColor: color,
                          backgroundColor: `${color}12`,
                          color: color,
                        }
                      : undefined
                }
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {selected && !dragFrom && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Now click a match on the right →
        </p>
      )}
    </div>
  );
}
