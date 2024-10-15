import { useState, useLayoutEffect, useCallback } from "react";

export type Resource<T> =
  | { status: "initial" }
  | { status: "loading" }
  | { status: "failure" }
  | { status: "success"; data: T };

export default function useResource<T>(
  url: string,
  parse: (rawData: any) => T,
): [Resource<T>, () => void] {
  const [resource, setResource] = useState<Resource<T>>({ status: "initial" });

  const fetchResource = useCallback(() => {
    setResource({ status: "loading" });
    fetch(url)
      .then(async (response) => {
        const json = await response.json();
        const data = parse(json);
        setResource({ status: "success", data });
      })
      .catch(() => setResource({ status: "failure" }));
  }, [url, parse]);

  useLayoutEffect(fetchResource, []);

  return [resource, fetchResource];
}

export function createUseResource<T>(url: string, parse: (rawData: any) => T) {
  let memoizedResource: Resource<T> = { status: "initial" };

  const callbacks: Set<(resource: Resource<T>) => void> = new Set();
  const notify = (resource: Resource<T>) => {
    memoizedResource = resource;
    callbacks.forEach((callback) => callback(resource));
  };

  return function useResource(): [Resource<T>, () => void] {
    const [resource, setResource] = useState<Resource<T>>(memoizedResource);

    const fetchResource = useCallback(() => {
      if (memoizedResource.status !== "initial") return;

      notify({ status: "loading" });
      fetch(url)
        .then(async (response) => {
          const json = await response.json();
          const data = parse(json);
          notify({ status: "success", data });
        })
        .catch(() => notify({ status: "failure" }));
    }, []);

    useLayoutEffect(() => {
      callbacks.add(setResource);
      return () => {
        callbacks.delete(setResource);
      };
    }, []);

    useLayoutEffect(fetchResource, [fetchResource]);

    return [resource, fetchResource];
  };
}
