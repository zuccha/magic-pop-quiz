import { delayAsyncFn } from "../utils";
import useResource, { createUseResource } from "./use-resource";

export const scryfallUrl = (pathname: string) =>
  new URL(pathname, "https://api.scryfall.com");

let nextAvailableTime = 0;
const cooldown = 100;

export function fetchScryfall(url: RequestInfo | URL) {
  const now = Date.now();
  const delay = Math.max(nextAvailableTime - now, 0);
  nextAvailableTime = now + delay + cooldown;
  return delayAsyncFn(() => fetch(url), delay);
}

export default function useResourceScryfall<T>(
  url: RequestInfo | URL,
  parse: (rawData: any) => T,
) {
  return useResource(url, parse, fetchScryfall);
}

export function createUseResourceScryfall<T>(
  url: RequestInfo | URL,
  parse: (rawData: any) => T,
) {
  return createUseResource(url, parse, fetchScryfall);
}
