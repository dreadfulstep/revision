"use client";

import { useEffect, useRef, useState } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

type Mode = "timer" | "pomodoro";

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function TimerPage() {
  const [mode, setMode] = useState<Mode>("timer");

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const [time, setTime] = useState(1500);
  const [totalTime, setTotalTime] = useState(1500);
  const [running, setRunning] = useState(false);

  const interval = useRef<NodeJS.Timeout | null>(null);

  // pomodoro
  const [focus, setFocus] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!running) return;

    interval.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (mode === "pomodoro") {
            const next = isBreak ? focus * 60 : breakTime * 60;
            setIsBreak(!isBreak);
            setTotalTime(next);
            return next;
          }
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running, mode, isBreak, focus, breakTime]);

  function startOrResume() {
    if (!running) {
      if (time === 0) {
        // first start
        const t =
          mode === "timer"
            ? hours * 3600 + minutes * 60 + seconds
            : (isBreak ? breakTime : focus) * 60;
        setTime(t);
        setTotalTime(t);
      }
      setRunning(true);
    } else {
      // pause
      setRunning(false);
      if (interval.current) clearInterval(interval.current);
    }
  }

  function reset() {
    setRunning(false);
    if (interval.current) clearInterval(interval.current);
    const t =
      mode === "timer"
        ? hours * 3600 + minutes * 60 + seconds
        : (isBreak ? breakTime : focus) * 60;
    setTime(t);
    setTotalTime(t);
  }

  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (time / totalTime) * circumference;

  return (
    <div className="px-4 py-6 max-w-md mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <Timer size={16} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold">Timer</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() => setMode("timer")}
          className={`rounded-xl border px-3 py-2 text-sm ${
            mode === "timer" ? "bg-primary text-primary-foreground" : "bg-card"
          }`}
        >
          Regular
        </button>
        <button
          onClick={() => setMode("pomodoro")}
          className={`rounded-xl border px-3 py-2 text-sm ${
            mode === "pomodoro"
              ? "bg-primary text-primary-foreground"
              : "bg-card"
          }`}
        >
          Pomodoro
        </button>
      </div>

      <div className="relative flex justify-center items-center mb-6 w-85 h-85 mx-auto">
        <svg width={340} height={340} className="absolute">
          <circle
            cx={170}
            cy={170}
            r={150}
            stroke="#3d3e40"
            strokeWidth={10}
            fill="transparent"
          />
          <circle
            cx={170}
            cy={170}
            r={150}
            stroke="#3b82f6"
            strokeWidth={10}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 170 170)"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-5xl font-bold tracking-tight tabular-nums">
            {formatTime(time)}
          </p>
          {mode === "pomodoro" && (
            <p className="text-xs text-muted-foreground mt-2">
              {isBreak ? "Break" : "Focus"}
            </p>
          )}
        </div>
      </div>

      {mode === "timer" && (
        <div className="p-4 mb-6 grid grid-cols-3 gap-2">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-center"
            placeholder="Hours"
          />
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-center"
            placeholder="Min"
          />
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-center"
            placeholder="Sec"
          />
        </div>
      )}

      {mode === "pomodoro" && (
        <div className="p-4 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Focus</span>
            <input
              type="number"
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              className="w-16 border rounded-md px-2 py-1 text-center"
            />
          </div>

          <div className="flex justify-between text-sm">
            <span>Break</span>
            <input
              type="number"
              value={breakTime}
              onChange={(e) => setBreakTime(Number(e.target.value))}
              className="w-16 border rounded-md px-2 py-1 text-center"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={startOrResume}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 bg-primary text-primary-foreground"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : time === 0 ? "Start" : "Resume"}
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border px-4 py-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}
