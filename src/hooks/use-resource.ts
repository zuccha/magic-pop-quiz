import { useState, useLayoutEffect, useCallback } from "react";

export type Resource<T> =
  | { status: "initial" }
  | { status: "loading" }
  | { status: "failure" }
  | { status: "success"; data: T };

export default function useResource<T>(
  url: RequestInfo | URL,
  parse: (rawData: any) => T,
  fetch = window.fetch,
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

export function createResourceContext<T>(
  url: RequestInfo | URL,
  parse: (rawData: any) => T,
  fetch = window.fetch,
) {
  let resourceRef: { current: Resource<T> } = {
    current: { status: "initial" },
  };

  const callbacks: Set<(resource: Resource<T>) => void> = new Set();
  const notify = (resource: Resource<T>) => {
    resourceRef.current = resource;
    callbacks.forEach((callback) => callback(resource));
  };

  const fetchResource = () => {
    if (resourceRef.current.status !== "initial") return;

    notify({ status: "loading" });
    fetch(url)
      .then(async (response) => {
        const json = await response.json();
        const data = parse(json);
        notify({ status: "success", data });
      })
      .catch(() => notify({ status: "failure" }));
  };

  function useResource(): [Resource<T>, () => void] {
    const [resource, setResource] = useState<Resource<T>>(resourceRef.current);

    useLayoutEffect(() => {
      callbacks.add(setResource);
      return () => {
        callbacks.delete(setResource);
      };
    }, []);

    useLayoutEffect(fetchResource, []);

    return [resource, fetchResource];
  }

  return { resourceRef, fetchResource, useResource };
}
