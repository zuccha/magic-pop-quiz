export function msToTime(ms: number): string {
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${minutesStr}:${secondsStr}`;
}

export function timeToMs(time: string): number {
  const [minutes, seconds] = time.split(":").map((v) => parseInt(v, 10));
  return (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;
}
