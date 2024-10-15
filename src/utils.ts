export function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

export function delayAsyncFn<T>(
  asyncFn: () => Promise<T>,
  delay: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => asyncFn().then(resolve).catch(reject), delay);
  });
}

export function isListWithAtLeastOneItem<T>(items: T[]): items is [T, ...T[]] {
  return items.length > 0;
}

export function validateListWithAtLeastOneItem<T>(
  items: T[],
  defaultItem: T,
): [T, ...T[]] {
  return isListWithAtLeastOneItem(items) ? items : [defaultItem];
}

export function padL(text: string, size: number, fill = " "): string {
  return `${fill.repeat(Math.max(size - text.length, 0))}${text}`;
}

export function padR(text: string, size: number, fill = " "): string {
  return `${text}${fill.repeat(Math.max(size - text.length, 0))}`;
}

export function sanitize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .trim();
}
