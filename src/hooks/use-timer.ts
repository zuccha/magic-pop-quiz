import { useCallback, useLayoutEffect, useRef, useState } from "react";

export enum TimerStatus {
  Ready,
  Running,
  Paused,
  Stopped,
}

export type Timer = {
  elapsed: number;
  remaining: number;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  reset: () => void;
  resume: () => void;
  stop: () => void;
};

export default function useTimer(duration: number): Timer {
  const intervalRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(Date.now());
  const pauseTimeRef = useRef(-1);

  const [status, setStatus] = useState(TimerStatus.Ready);
  const [elapsed, setElapsed] = useState(0);
  const remaining = duration - elapsed;

  const reset = useCallback(() => {
    setElapsed(0);
    startTimeRef.current = Date.now();
    pauseTimeRef.current = -1;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    setStatus(TimerStatus.Ready);
  }, [duration]);

  const stop = useCallback(() => {
    pauseTimeRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    setStatus(TimerStatus.Stopped);
  }, [duration]);

  const pause = useCallback(() => {
    pauseTimeRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    setStatus(TimerStatus.Paused);
  }, []);

  const resume = useCallback(() => {
    if (pauseTimeRef.current > 0)
      startTimeRef.current += Date.now() - pauseTimeRef.current;
    pauseTimeRef.current = -1;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const nextElapsed = Date.now() - startTimeRef.current;
      if (nextElapsed >= duration) {
        setElapsed(duration);
        stop();
      } else {
        setElapsed(nextElapsed);
      }
    }, 1000);

    setStatus(TimerStatus.Running);
  }, [duration, stop]);

  const start = useCallback(() => {
    reset();
    resume();
  }, [reset, resume]);

  useLayoutEffect(() => reset(), [reset]);

  return { elapsed, remaining, status, start, stop, pause, reset, resume };
}
