import { useState, useLayoutEffect } from "react";

export type Resource<T> =
  | { status: "initial" }
  | { status: "loading" }
  | { status: "failure" }
  | { status: "success"; data: T };

export default function createUseResource<T>(
  url: string,
  parse: (rawData: any) => T,
) {
  let memoizedResource: Resource<T> = { status: "initial" };

  const callbacks: Set<(resource: Resource<T>) => void> = new Set();
  const notify = (resource: Resource<T>) => {
    memoizedResource = resource;
    callbacks.forEach((callback) => callback(resource));
  };

  return function useResource(): Resource<T> {
    const [resource, setResource] = useState<Resource<T>>(memoizedResource);

    useLayoutEffect(() => {
      callbacks.add(setResource);
      return () => {
        callbacks.delete(setResource);
      };
    }, []);

    useLayoutEffect(() => {
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

    return resource;
  };
}
