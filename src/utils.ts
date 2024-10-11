export function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

export function padL(text: string, size: number, fill = " "): string {
  return `${fill.repeat(Math.max(size - text.length, 0))}${text}`;
}

export function padR(text: string, size: number, fill = " "): string {
  return `${text}${fill.repeat(Math.max(size - text.length, 0))}`;
}
